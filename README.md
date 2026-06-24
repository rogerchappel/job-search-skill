# job-search-skill

Agent skill scaffold for job-search planning workflows.

## Quickstart

```bash
npm install
npm run release:check
```

## Usage

Use this repository as the public home for a job-search agent skill. It should
contain durable instructions, examples, and verification assets for workflows
that turn job posts and candidate notes into reviewable application planning
materials.

When adding the actual skill content, keep the first public workflow local-first:

```bash
npm run check
```

The current check confirms that the README and package metadata expose the
minimum public release surface expected by downstream automation.

## Release Checklist

- Keep examples based on synthetic job posts and candidate notes.
- Document every external action as a human-approved step.
- Run `npm run release:check` before opening a release-readiness PR.
- Review `npm pack --dry-run` output before publishing any npm package.

## Limitations

This repository currently contains the public scaffold and release-readiness
checks for the skill. It does not include a runnable job-board scraper, a resume
rewriter, or an application-submission agent.

## Safety Notes

Do not store private resumes, recruiter messages, job-board credentials, or live
candidate contact details in this repository. Any workflow built here should
produce reviewable drafts and require human approval before sending messages,
submitting applications, or saving data to third-party services.
