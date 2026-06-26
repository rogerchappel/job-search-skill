# job-search-skill

Reusable agent instructions for running a focused, evidence-backed job search.

This repository is a lightweight skill package, not an application. Its value is
the workflow text an agent can load when helping a job seeker research roles,
adapt application materials, and track follow-up without inventing facts.

## Usage

Use this repo as the public source for a job-search assistant skill. A typical
consumer should be able to copy the workflow into an agent skill directory,
customize the target-role inputs, and run the release check before sharing
changes:

```sh
npm install
npm run release:check
```

Example requests:

```text
Use the job-search skill to compare these three roles against my resume.
Use the job-search skill to draft a recruiter follow-up based only on my notes.
Use the job-search skill to build a weekly application tracker from these links.
```

When using the skill, provide the target role, resume or profile source, location
constraints, seniority, salary constraints when relevant, and any companies or
industries to avoid.

## Fixture-backed role fit

Run a safe role-fit exercise against the synthetic fixtures:

```sh
cat fixtures/sample-resume.md
cat fixtures/sample-job-posting.md
```

Use `docs/role-fit-brief-template.md` to keep requirement matches, gaps,
tailoring notes, and open questions separate.

## Workflow

1. Confirm the search target and constraints.
2. Extract evidence from user-provided materials before drafting.
3. Separate verified facts from assumptions and open questions.
4. Produce a role-fit summary, application checklist, and follow-up plan.
5. Keep sensitive personal data out of public artifacts unless the user asks for
   a specific shareable version.

## Limitations

- The workflow is advisory and must not invent employment history, credentials,
  references, salary claims, work authorization, referrals, or application status.
- User-supplied resumes, contact details, and application materials are
  sensitive and should not be committed to this repository.
- Job listings and company details change frequently; refresh source material
  before preparing final outreach or application copy.
- The skill does not apply to jobs, contact recruiters, or submit personal data
  on its own.
- This repository does not include a runnable job-board scraper, resume
  rewriter, or application-submission agent.

## Release check

```sh
npm run release:check
```

The check verifies that the README keeps usage, limitations, and release-check
sections visible, package metadata points to this public repository, synthetic
fixtures are present, and `npm pack --dry-run` includes the expected skill,
fixture, docs, and support files.

## Release Checklist

- Keep examples based on synthetic job posts and candidate notes.
- Document every external action as a human-approved step.
- Run `npm run release:check` before opening a release-readiness PR.
- Review `npm run package:smoke` output before publishing any npm package.

## Safety Notes

Do not store private resumes, recruiter messages, job-board credentials, or live
candidate contact details in this repository. Any workflow built here should
produce reviewable drafts and require human approval before sending messages,
submitting applications, or saving data to third-party services.

## Repository Status

Early public skill package. The first workflow lives in [SKILL.md](SKILL.md),
with synthetic role-fit fixtures under `fixtures/`.
