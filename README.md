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

## Workflow

1. Confirm the search target and constraints.
2. Extract evidence from user-provided materials before drafting.
3. Separate verified facts from assumptions and open questions.
4. Produce a role-fit summary, application checklist, and follow-up plan.
5. Keep sensitive personal data out of public artifacts unless the user asks for
   a specific shareable version.

## Limitations

- The skill does not apply to jobs, contact recruiters, or submit personal data
  on its own.
- Job listings change quickly; verify current posting details before making a
  recommendation or drafting a final application.
- It should not invent employment history, credentials, salary claims, work
  authorization, or referrals.

## Release check

```sh
npm run release:check
```

The check verifies that the README keeps usage, limitations, and release-check
sections visible, and that package metadata points to this public repository.

## Repository Status

Early public skill package. The first workflow lives in [SKILL.md](SKILL.md).
The next useful improvement is to add fixtures that demonstrate a safe role-fit
review against a sample resume and job posting.
