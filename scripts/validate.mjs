import fs from 'node:fs';

const requiredReadmePhrases = [
  '# job-search-skill',
  '## Usage',
  '## Limitations',
  '## Release check'
];

const readme = fs.readFileSync('README.md', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const errors = [];

for (const phrase of requiredReadmePhrases) {
  if (!readme.includes(phrase)) errors.push(`README.md missing ${phrase}`);
}

if (pkg.private !== true) errors.push('package.json must stay private until publish intent is explicit');
if (pkg.repository?.url !== 'git+https://github.com/rogerchappel/job-search-skill.git') {
  errors.push('package.json repository URL is incorrect');
}
if (!pkg.scripts?.['release:check']) errors.push('package.json missing release:check script');

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('job-search-skill release checks passed');
