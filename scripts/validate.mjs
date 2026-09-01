import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const requiredFiles = [
  'README.md',
  'package.json',
  'SKILL.md',
  'LICENSE',
  'SECURITY.md',
  'CHANGELOG.md',
  'fixtures/sample-resume.md',
  'fixtures/sample-job-posting.md',
  'docs/role-fit-brief-template.md'
];

const requiredReadmePhrases = [
  '# job-search-skill',
  '## Usage',
  '## Limitations',
  '## Release check'
];

// Local artifacts that must never be committed; matches .gitignore exactly.
const untrackedArtifactPatterns = [
  /(^|\/)node_modules(\/|$)/,
  /(^|\/)package-lock\.json$/,
  /(^|\/)coverage(\/|$)/,
  /(^|\/)dist(\/|$)/,
  /\.log$/,
  /(^|\/)\.DS_Store$/
];

const errors = [];

function readRequiredFile(path) {
  try {
    const content = fs.readFileSync(path, 'utf8');
    if (content.length === 0) {
      errors.push(`${path} is missing or empty`);
      return null;
    }
    return content;
  } catch {
    errors.push(`${path} is missing or unreadable`);
    return null;
  }
}

const contentInputs = new Set([
  'README.md',
  'package.json',
  'fixtures/sample-resume.md',
  'fixtures/sample-job-posting.md'
]);
const contents = new Map();

for (const path of requiredFiles) {
  if (contentInputs.has(path)) {
    contents.set(path, readRequiredFile(path));
    continue;
  }
  try {
    if (fs.statSync(path).size === 0) errors.push(`${path} is missing or empty`);
  } catch {
    errors.push(`${path} is missing or unreadable`);
  }
}

const readme = contents.get('README.md');
if (readme !== null) {
  for (const phrase of requiredReadmePhrases) {
    if (!readme.includes(phrase)) errors.push(`README.md missing ${phrase}`);
  }
}

const fixtureParts = [contents.get('fixtures/sample-resume.md'), contents.get('fixtures/sample-job-posting.md')];
const fixtureText = fixtureParts.every((content) => content !== null) ? fixtureParts.join('\n') : null;

if (fixtureText !== null && !fixtureText.includes('synthetic') && !fixtureText.includes('Synthetic')) {
  errors.push('fixtures must be clearly marked synthetic');
}
let pkg = null;
const packageText = contents.get('package.json');
if (packageText !== null) {
  try {
    pkg = JSON.parse(packageText);
  } catch {
    errors.push('package.json contains invalid JSON');
  }
}
if (pkg !== null) {
  if (pkg.private !== true) errors.push('package.json must stay private until publish intent is explicit');
  if (pkg.repository?.url !== 'git+https://github.com/rogerchappel/job-search-skill.git') {
    errors.push('package.json repository URL is incorrect');
  }
  if (!pkg.scripts?.['release:check']) errors.push('package.json missing release:check script');
  if (!pkg.scripts?.['package:smoke']) errors.push('package.json missing package:smoke script');
}

const inWorkTree = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { encoding: 'utf8' });
if (inWorkTree.status === 0 && String(inWorkTree.stdout || '').trim() === 'true') {
  const status = spawnSync('git', ['status', '--porcelain', '--ignored', '--untracked-files=all'], { encoding: 'utf8' });
  if (status.status !== 0) {
    errors.push('git status --porcelain failed; install-artifact hygiene cannot be verified');
  } else {
    const untrackedArtifacts = String(status.stdout || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => line.startsWith('?? ') || line.startsWith('!! '))
      .map((line) => line.slice(3))
      .filter((path) => untrackedArtifactPatterns.some((pattern) => pattern.test(path)));
    if (untrackedArtifacts.length) {
      errors.push(`prohibited local artifacts are present: ${untrackedArtifacts.join(', ')}`);
    }
  }
} else {
  console.log('Not inside a git work tree; skipping untracked-artifact hygiene check.');
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('job-search-skill release checks passed');
