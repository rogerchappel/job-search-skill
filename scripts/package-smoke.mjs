import { spawnSync } from 'node:child_process';

import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
if (packageJson.private !== true) {
  throw new Error('package.json must declare private: true');
}

const result = spawnSync('npm', ['pack', '--dry-run', '--json'], { encoding: 'utf8' });
const output = `${result.stdout || ''}\n${result.stderr || ''}`;

if (result.status !== 0) {
  process.stdout.write(output);
  process.exit(result.status || 1);
}

const packOutput = JSON.parse(result.stdout);
if (!Array.isArray(packOutput) || packOutput.length !== 1 || !Array.isArray(packOutput[0].files)) {
  throw new Error('npm pack dry-run did not return a single package file manifest');
}
const packedFiles = new Set(packOutput[0].files.map(({ path }) => path));

const required = [
  'SKILL.md',
  'README.md',
  'LICENSE',
  'SECURITY.md',
  'CHANGELOG.md',
  'scripts/validate.mjs',
  'scripts/package-smoke.mjs',
  'fixtures/sample-resume.md',
  'fixtures/sample-job-posting.md',
  'docs/role-fit-brief-template.md'
];

for (const path of required) {
  if (!packedFiles.has(path)) {
    throw new Error(`missing package entry: ${path}`);
  }
}

console.log(`Verified ${packedFiles.size} generated package entries via npm pack --dry-run.`);
console.log('job-search-skill package smoke ok (private package; dry-run only, no archive or publication)');
