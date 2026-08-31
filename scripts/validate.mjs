import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const requiredFiles = [
  'README.md',
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

const readme = fs.readFileSync('README.md', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const errors = [];

for (const path of requiredFiles) {
  if (!fs.existsSync(path) || fs.statSync(path).size === 0) {
    errors.push(`${path} is missing or empty`);
  }
}

for (const phrase of requiredReadmePhrases) {
  if (!readme.includes(phrase)) errors.push(`README.md missing ${phrase}`);
}

const fixtureText = [
  fs.readFileSync('fixtures/sample-resume.md', 'utf8'),
  fs.readFileSync('fixtures/sample-job-posting.md', 'utf8')
].join('\n');

if (!fixtureText.includes('synthetic') && !fixtureText.includes('Synthetic')) {
  errors.push('fixtures must be clearly marked synthetic');
}
if (pkg.private !== true) errors.push('package.json must stay private until publish intent is explicit');
if (pkg.repository?.url !== 'git+https://github.com/rogerchappel/job-search-skill.git') {
  errors.push('package.json repository URL is incorrect');
}
if (!pkg.scripts?.['release:check']) errors.push('package.json missing release:check script');
if (!pkg.scripts?.['package:smoke']) errors.push('package.json missing package:smoke script');

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
