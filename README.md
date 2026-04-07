# Studio Pulse Demo

Public portfolio demo extracted from a larger private YouTube analytics product.

## Current Status

Phase 2 static data wiring is in place.

What exists now:

- standalone public repo
- standalone local workspace alongside the private source repo
- static shell with trimmed route map
- route-level synthetic JSON payloads under `public/demo-data/`
- typed demo-data loader layer
- Vercel-ready SPA scaffold
- public docs for data schema and sanitization policy

What does not exist yet:

- route-level detail pages
- richer synthetic fixture coverage
- final portfolio copy and case-study framing

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
