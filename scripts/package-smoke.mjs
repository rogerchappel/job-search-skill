import { spawnSync } from 'node:child_process';

const result = spawnSync('npm', ['pack', '--dry-run'], { encoding: 'utf8' });
const output = `${result.stdout || ''}\n${result.stderr || ''}`;

if (result.status !== 0) {
  process.stdout.write(output);
  process.exit(result.status || 1);
}

const required = [
  'SKILL.md',
  'README.md',
  'LICENSE',
  'scripts/validate.mjs',
  'scripts/package-smoke.mjs',
  'fixtures/sample-resume.md',
  'fixtures/sample-job-posting.md',
  'docs/role-fit-brief-template.md'
];

for (const path of required) {
  if (!output.includes(path)) {
    throw new Error(`missing package entry: ${path}`);
  }
}

console.log(output.trim());
console.log('job-search-skill package smoke ok');
