import assert from 'node:assert/strict';
import { chmodSync, cpSync, mkdtempSync, mkdirSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
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
  for (const entry of ['README.md', 'SKILL.md', 'LICENSE', 'SECURITY.md', 'CHANGELOG.md', 'package.json', '.gitignore', 'fixtures', 'docs', 'scripts']) {
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

test('documented fresh-checkout setup passes the release check', { skip: process.env.JOB_SEARCH_SETUP_CHILD === '1' }, (t) => {
  const directory = fixture();
  t.after(() => rmSync(directory, { recursive: true, force: true }));

  const install = spawnSync('npm', ['install', '--package-lock=false'], { cwd: directory, encoding: 'utf8' });
  assert.equal(install.status, 0, install.stderr);
  const release = spawnSync('npm', ['run', 'release:check'], {
    cwd: directory,
    encoding: 'utf8',
    env: { ...process.env, JOB_SEARCH_SETUP_CHILD: '1' }
  });
  assert.equal(release.status, 0, release.stderr);
});

for (const requiredFile of ['README.md', 'package.json']) {
  test(`reports a missing ${requiredFile} without a stack trace`, (t) => {
    const directory = fixture();
    t.after(() => rmSync(directory, { recursive: true, force: true }));
    unlinkSync(path.join(directory, requiredFile));

    const result = spawnSync(process.execPath, [validator], { cwd: directory, encoding: 'utf8' });
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stderr, new RegExp(`^- ${requiredFile.replace('.', '\\.') } is missing or unreadable$`, 'm'));
    assert.doesNotMatch(result.stderr, /(?:Error: ENOENT|node:fs|validate\.mjs:\d+)/);
  });
}

test('reports an unreadable required input without a stack trace', { skip: process.getuid?.() === 0 }, (t) => {
  const directory = fixture();
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  chmodSync(path.join(directory, 'README.md'), 0o000);

  const result = spawnSync(process.execPath, [validator], { cwd: directory, encoding: 'utf8' });
  assert.equal(result.status, 1, result.stdout);
  assert.match(result.stderr, /^- README\.md is missing or unreadable$/m);
  assert.doesNotMatch(result.stderr, /(?:Error: EACCES|node:fs|validate\.mjs:\d+)/);
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

for (const state of ['tracked', 'staged']) {
  test(`rejects a prohibited ${state} artifact`, (t) => {
    const directory = fixture();
    t.after(() => rmSync(directory, { recursive: true, force: true }));
    writeFileSync(path.join(directory, 'debug.log'), 'probe\n');

    const git = spawnSync('git', ['add', '--force', 'debug.log'], { cwd: directory, encoding: 'utf8' });
    assert.equal(git.status, 0, git.stderr);
    if (state === 'tracked') {
      const commit = spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '--quiet', '-m', 'fixture'], {
        cwd: directory,
        encoding: 'utf8'
      });
      assert.equal(commit.status, 0, commit.stderr);
    }

    const result = spawnSync(process.execPath, [validator], { cwd: directory, encoding: 'utf8' });
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stderr, /prohibited local artifacts are present: debug\.log/);
  });
}
