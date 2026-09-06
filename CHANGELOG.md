# Changelog

## Unreleased

- Reject prohibited release artifacts whether tracked, staged, untracked, or
  ignored.
- Make the documented fresh-checkout setup compatible with artifact hygiene.
- Report missing or unreadable validation inputs without Node.js stack traces.
- Fail `release:check` when install artifacts are left untracked.
- Add `.gitignore` for `node_modules/`, `package-lock.json`, `coverage/`,
  `dist/`, log files, and `.DS_Store`.

## 0.1.0

- Initial public skill package with local job-search workflow guidance,
  synthetic role-fit fixtures, release validation, and package smoke checks.
