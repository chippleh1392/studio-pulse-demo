# Sanitization Policy

Status: active release rule.

Non-negotiable rules:

- no real channel names
- no real video IDs
- no real descriptions or tags copied from source exports
- no outbound support or streaming links
- no competitor identifiers
- no comments text
- no secrets or auth artifacts

Release rule:

- every public JSON payload must be manually reviewed before first push.

Current implementation note:

- the repo now uses synthetic payloads under `public/demo-data/` and should continue expanding that dataset instead of importing or mirroring private exports.
