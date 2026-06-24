# job-search-skill

Reusable job search workflow skill scaffold for turning role targets, company
research, outreach notes, and application follow-up into a repeatable process.

## Usage

Use this repo as the public source for a job-search assistant skill. A typical
consumer should be able to copy the workflow into an agent skill directory,
customize the target-role inputs, and run the release check before sharing
changes:

```sh
npm install
npm run release:check
```

Suggested skill inputs:

- Target role title, level, and location constraints.
- Company or role links to research.
- Resume, portfolio, and outreach constraints supplied by the user.
- Follow-up cadence and any explicit do-not-contact boundaries.

## Workflow

1. Clarify the target role, location, and non-negotiable constraints.
2. Research each company or posting from source material supplied by the user.
3. Draft tailored application notes, outreach, or interview prep artifacts.
4. Record follow-up dates and unresolved assumptions for the user to review.

## Limitations

- The workflow is advisory and must not invent employment history, credentials,
  references, salary claims, or application status.
- User-supplied resumes, contact details, and application materials are
  sensitive and should not be committed to this repository.
- Job listings and company details change frequently; refresh source material
  before preparing final outreach or application copy.
- This repository does not include a runnable job-board scraper, resume
  rewriter, or application-submission agent.

## Release check

```sh
npm run release:check
```

The check verifies that the README keeps usage, limitations, and release-check
sections visible, and that package metadata points to this public repository.

## Release Checklist

- Keep examples based on synthetic job posts and candidate notes.
- Document every external action as a human-approved step.
- Run `npm run release:check` before opening a release-readiness PR.
- Review `npm pack --dry-run` output before publishing any npm package.

## Safety Notes

Do not store private resumes, recruiter messages, job-board credentials, or live
candidate contact details in this repository. Any workflow built here should
produce reviewable drafts and require human approval before sending messages,
submitting applications, or saving data to third-party services.
