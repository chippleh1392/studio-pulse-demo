# Studio Pulse Demo

Public portfolio demo extracted from a larger private YouTube analytics product.

## Current Status

Phase 1 is in progress.

What exists now:

- standalone public repo
- standalone local workspace alongside the private source repo
- static shell with trimmed route map
- Vercel-ready SPA scaffold
- public-doc placeholders for data schema and sanitization policy

What does not exist yet:

- synthetic demo dataset
- static data loaders
- final portfolio copy
- publish-safe first commit

## Public Repo Rules

- no private data exports
- no secrets or auth artifacts
- no local-ops tooling
- no backend required for the intended public demo

## Planned Route Scope

- Overview
- Videos
- Growth
- Technical Analysis
- About

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Target host: Vercel static deployment.

The public app will remain a static SPA unless the demo data contract proves too awkward to support without a thin read-only API.
