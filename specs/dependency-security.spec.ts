import { expect, test } from 'bun:test';
import { fileURLToPath } from 'node:url';

test('dependency backports preserve matching and stop cancelled traversal', () => {
  const script = fileURLToPath(
    new URL('./dependency-security.mjs', import.meta.url),
  );
  const result = Bun.spawnSync({
    cmd: ['node', script],
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 20000,
  });
  if (result.exitCode !== 0) {
    throw new Error(new TextDecoder().decode(result.stderr));
  }
  expect(result.exitCode).toBe(0);
}, 30000);
