# Studio Pulse Demo

Studio Pulse Demo is a public, static portfolio version of a larger internal YouTube analytics application. It preserves the product shape of the original tool, but runs entirely from synthetic JSON payloads so it can be shared publicly without exposing private channel data, workflows, or operational tooling.

The app is designed to feel like a real analytics workspace rather than a generic dashboard mock. It includes dashboard monitoring, video-level diagnosis, metadata review, breakout candidate scoring, creative pattern analysis, cross-channel insights, and a technical analysis workspace.

## What This Demo Includes

- dashboard overview
- videos table and video detail route
- growth analysis
- metadata review
- breakout scoring
- creative pattern explorer
- channel insights
- TA workspace
- public-safe app shell and about page

## What This Demo Excludes

- real channel data
- live APIs
- auth
- background sync
- prompt tooling
- Notion integrations
- local media/file workflows
- competitor intelligence from real entities

## Public Data Model

All app screens read from static route-level payloads in [`public/demo-data/`](./public/demo-data):

- `app-shell.json`
- `dashboard.json`
- `videos.json`
- `growth.json`
- `metadata.json`
- `breakout.json`
- `creative.json`
- `insights.json`
- `technical-analysis.json`

These files are synthetic by design. They mirror the structure needed by the UI, not a production backend contract.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- ECharts

## Local Development

```bash
npm install
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

If you need a production-like preview:

```bash
npm run build
npm run preview
```

## Deployment

This repo is meant to deploy as a static SPA.

- Vercel is the primary target
- `vercel.json` rewrites all routes to `index.html`
- no server runtime is required
- no database is required
- no environment variables are required for the current demo

## Repo Goals

This repo is optimized for public review:

- clear product framing
- clean frontend architecture
- no personal artifacts
- no secrets
- no private exports
- easy local setup

## Documentation

- [Docs Index](./docs/README.md)
- [Demo Data Schema](./docs/DEMO_DATA_SCHEMA.md)
- [Sanitization Policy](./docs/SANITIZATION_POLICY.md)
- [Architecture Notes](./docs/ARCHITECTURE.md)

## Privacy Note

This repository does not contain copied private analytics exports. Any identifiers, metrics, titles, thumbnails, tags, descriptions, and audience-facing content used here are synthetic or manually rewritten for public release.
