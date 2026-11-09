# Development dependency backports

Bun applies these patches through `patchedDependencies` in `package.json`.
They backport the upstream [glob cancellation fix][glob-fix] and
[minimatch preprocessing limits][minimatch-fix] without changing dependency
major versions. Both CommonJS and ESM implementations are covered.

The npm patch also fixes its bundled glob and minimatch copies. Patching
only the standalone packages would leave these embedded files unchanged.

Install and run the focused regression checks with:

```shell
bun install

node specs/dependency-security.mjs . --full
```

The checks exercise cancellation, bounded pattern expansion, normal matching
and stream backpressure. Existing CI runs the focused checks before using
these tools. The default run omits the larger default-limit stress case.

`bun audit` checks package versions, so it can still report the original
advisories after these code fixes. npm installs do not apply Bun patches.
Remove a patch only after the resolved upstream version contains the fix
and the regression checks still pass; keep the checks when updating versions.

Upstream copyright and ISC license notices are retained in [LICENSE](LICENSE).

[glob-fix]: https://github.com/isaacs/node-glob/commit/4682e8c9babee1b385202ede36389634e12076d7
[minimatch-fix]: https://github.com/isaacs/minimatch/commit/77a0f5c4b80bdc641c3c930a1d9edf5ad2db57f8
