import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const validator = path.join(root, 'scripts', 'validate.mjs');
const artifacts = [
  ['node_modules/probe.txt', 'node_modules/probe.txt'],
  ['package-lock.json', 'package-lock.json'],
  ['coverage/probe.txt', 'coverage/probe.txt'],
  ['dist/probe.txt', 'dist/probe.txt'],
  ['debug.log', 'debug.log'],
  ['.DS_Store', '.DS_Store']
];

function fixture() {
  const directory = mkdtempSync(path.join(tmpdir(), 'job-search-validate-'));
  for (const entry of ['README.md', 'SKILL.md', 'LICENSE', 'SECURITY.md', 'CHANGELOG.md', 'package.json', '.gitignore', 'fixtures', 'docs']) {
    cpSync(path.join(root, entry), path.join(directory, entry), { recursive: true });
  }
  const git = (args) => spawnSync('git', args, { cwd: directory, encoding: 'utf8' });
  assert.equal(git(['init', '--quiet']).status, 0);
  assert.equal(git(['add', '.']).status, 0);
  return directory;
}

test('accepts a clean isolated checkout', (t) => {
  const directory = fixture();
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const result = spawnSync(process.execPath, [validator], { cwd: directory, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
});

for (const [artifact, expected] of artifacts) {
  test(`rejects ignored artifact ${artifact}`, (t) => {
    const directory = fixture();
    t.after(() => rmSync(directory, { recursive: true, force: true }));
    const target = path.join(directory, artifact);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, 'probe\n');

    const result = spawnSync(process.execPath, [validator], { cwd: directory, encoding: 'utf8' });
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stderr, /prohibited local artifacts are present/);
    assert.match(result.stderr, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });
}
