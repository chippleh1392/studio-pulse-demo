# Sanitization Policy

Status: required for every public release.

## Non-Negotiable Rules

- No real channel names.
- No real video IDs.
- No copied private descriptions, tags, or transcript text.
- No copied comments text.
- No copied competitor identities or benchmark entities.
- No outbound support, donation, or streaming links from the private product.
- No secrets, auth tokens, cookies, `.env` values, or local machine artifacts.
- No operational docs, runbooks, or prompt libraries from the private repo.

## Allowed Patterns

- Synthetic channel branding
- Rewritten titles and packaging concepts
- Synthetic metrics that preserve relative behavior patterns
- Fictional category labels and benchmark names
- Hand-authored demo copy that explains product intent

## Review Standard

Every public-facing change should be reviewed with this question:

`Could this item plausibly be traced back to a real private channel, workflow, or operator?`

If the answer is anything other than `no`, rewrite or remove it.

## Data Handling Rules

- Never copy raw exports into this repo.
- Never publish source SQLite files or generated internal exports.
- Build synthetic payloads directly for the public app instead of transforming private data in place.
- Prefer small, route-specific fixtures over large “master export” files.

## UI And Copy Rules

- Avoid language that references hidden internal tools or staff workflows.
- Avoid placeholder copy that reads like an unfinished extraction task.
- Public text should describe the demo as a standalone product artifact.

## Release Gate

Before pushing:

- inspect `public/demo-data/`
- inspect `README.md` and `docs/`
- inspect any new route labels or nav text
- confirm there are no personal or operational artifacts in the diff
