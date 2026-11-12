import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const source = readFileSync(new URL('./check-node-version.js', import.meta.url), 'utf8');
const packageJson = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8')
);

test('package engine excludes unsupported Node 23', () => {
  assert.equal(packageJson.engines.node, '^22.13.0 || >=24');
});

for (const [version, expected] of [
  ['20.19.0', 1],
  ['22.12.0', 1],
  ['22.13.0', 0],
  ['22.99.0', 0],
  ['23.5.0', 1],
  ['24.0.0', 0],
]) {
  test(`runtime guard returns ${expected} for Node ${version}`, () => {
    let exitCode;
    assert.throws(
      () =>
        runInNewContext(source, {
          process: {
            versions: { node: version },
            exit(code) {
              exitCode = code;
              throw new Error('exit');
            },
          },
          console: { error() {} },
        }),
      /exit/
    );
    assert.equal(exitCode, expected);
  });
}
