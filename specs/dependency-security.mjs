import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL, fileURLToPath } from "node:url";
const root = process.argv[2]
  ? path.resolve(process.argv[2])
  : fileURLToPath(new URL("../", import.meta.url));
const baseline = process.argv.includes("--baseline");
const packages = [];
function walk(dir) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!d.isDirectory() || [".bin", ".cache"].includes(d.name)) continue;
    const p = path.join(dir, d.name);
    if (
      ["glob", "minimatch"].includes(d.name) &&
      fs.existsSync(path.join(p, "package.json"))
    ) {
      const j = JSON.parse(fs.readFileSync(path.join(p, "package.json")));
      if (
        j.version &&
        ((j.name === "glob" && Number(j.version.split(".")[0]) >= 9) ||
          (j.name === "minimatch" && Number(j.version.split(".")[0]) >= 7))
      )
        packages.push({ dir: p, name: j.name, version: j.version });
    }
    walk(p);
  }
}
walk(path.join(root, "node_modules"));
const cwd = fs.mkdtempSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "tree-"),
);
function tree(p, n) {
  fs.mkdirSync(p, { recursive: true });
  fs.writeFileSync(path.join(p, "f"), "");
  if (n) {
    tree(path.join(p, "a"), n - 1);
    tree(path.join(p, "b"), n - 1);
  }
}
tree(cwd, 5);
const results = [];
try {
  for (const pkg of packages) {
    for (const kind of ["commonjs", "esm"]) {
      const filename = path.join(pkg.dir, "dist", kind, "index.js");
      const mod =
        kind === "esm"
          ? await import(pathToFileURL(filename).href)
          : createRequire(import.meta.url)(filename);
      const row = { path: path.relative(root, pkg.dir), version: pkg.version, kind };
      if (pkg.name === "minimatch") {
        const { Minimatch } = mod;
        const mm = new Minimatch(Array(8).fill("**/../a/b").join("/"), {
          optimizationLevel: 2,
          braceExpandMax: 64,
        });
        row.expansion = mm.set.length;
        row.bounded = row.expansion === 64;
        const small = new Minimatch("**/../a/b/**/../c/d", { optimizationLevel: 2 });
        assert.equal(small.set.length, 4);
        assert(small.match("../a/b/../c/d"));
        assert(small.match("x/a/b/y/c/d"));
        const large = new Minimatch("{x,*}/{0..999}", { optimizationLevel: 2 });
        row.largeSet = large.set.length;
        row.quadraticGuard = row.largeSet === 2000;
        assert(large.match("x/5"));
        assert(large.match("y/999"));
        assert(!large.match(".y/5"));
        if (!baseline) {
          if (process.argv.includes("--full")) {
            const pre = new Minimatch("", { optimizationLevel: 2 });
            assert.equal(
              pre.firstPhasePreProcess([
                Array(18).fill(["**", "..", "a", "b"]).flat(),
              ]).length,
              100000,
            );
          }
          assert(row.bounded && row.quadraticGuard);
        }
        row.ordinaryMatching = true;
      } else {
        const ac = new AbortController();
        let calls = 0;
        const reason = new Error("cancelled");
        const count = () => {
          if (++calls === 1) ac.abort(reason);
        };
        const counted = {
          ...fs,
          readdir: (...args) => {
            count();
            return fs.readdir(...args);
          },
          readdirSync: (...args) => {
            count();
            return fs.readdirSync(...args);
          },
        };
        await assert.rejects(
          mod.glob("**", { cwd, signal: ac.signal, fs: counted }),
          (e) => e === reason,
        );
        const atReject = calls;
        await new Promise((r) => setTimeout(r, 100));
        row.asyncReads = { atReject, afterWait: calls };
        row.stopsAfterAbort = atReject === calls;
        const sc = new AbortController();
        let syncCalls = 0;
        const syncFs = {
          ...fs,
          readdirSync: (...args) => {
            if (++syncCalls === 1) sc.abort(reason);
            return fs.readdirSync(...args);
          },
        };
        const stream = mod.globStreamSync("**", {
          cwd,
          signal: sc.signal,
          fs: syncFs,
        });
        await new Promise((resolve, reject) => {
          let timer = setTimeout(
            () => reject(new Error("sync stream did not drain")),
            2000,
          );
          stream.on("error", (e) => {
            clearTimeout(timer);
            e === reason ? resolve() : reject(e);
          });
          stream.resume();
        });
        row.syncReads = syncCalls;
        row.syncStops = syncCalls === 1;
        const expected = new Set(mod.globSync("**", { cwd }));
        const s = mod.globStream("**", { cwd });
        await new Promise((r) => setTimeout(r, 50));
        const got = [];
        for await (const p of s) got.push(p);
        assert.deepEqual(new Set(got), expected);
        row.backpressureControl = true;
        if (!baseline) assert(row.stopsAfterAbort && row.syncStops);
      }
      results.push(row);
    }
  }
  if (baseline)
    assert(
      results.some(
        (x) =>
          x.bounded === false ||
          x.stopsAfterAbort === false ||
          x.syncStops === false,
      ),
    );
  console.log(
    JSON.stringify({ baseline, packageCopies: packages.length, results }, null, 2),
  );
} finally {
  fs.rmSync(cwd, { recursive: true, force: true });
}
