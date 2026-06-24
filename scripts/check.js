import { readFile } from "node:fs/promises";

const requiredSections = [
  "# job-search-skill",
  "## Quickstart",
  "## Usage",
  "## Limitations",
  "## Safety Notes"
];

const packageFields = [
  "name",
  "version",
  "description",
  "license",
  "repository",
  "scripts"
];

async function main() {
  const readme = await readFile("README.md", "utf8");
  const manifest = JSON.parse(await readFile("package.json", "utf8"));

  const missingSections = requiredSections.filter((section) => !readme.includes(section));
  if (missingSections.length > 0) {
    throw new Error(`README.md is missing: ${missingSections.join(", ")}`);
  }

  const missingFields = packageFields.filter((field) => manifest[field] === undefined);
  if (missingFields.length > 0) {
    throw new Error(`package.json is missing: ${missingFields.join(", ")}`);
  }

  if (manifest.repository?.url !== "git+https://github.com/rogerchappel/job-search-skill.git") {
    throw new Error("package.json repository URL does not match this repo");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
