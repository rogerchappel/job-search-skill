import fs from 'node:fs';

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

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('job-search-skill release checks passed');
