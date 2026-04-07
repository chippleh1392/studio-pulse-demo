# Demo Data Schema

Status: active public demo contract.

## Purpose

The demo uses static route-level JSON files instead of a live backend. Each payload is shaped for a specific screen or shared shell context so the app can be hosted as a static SPA.

## Files

### `app-shell.json`

Shared shell metadata used by the sidebar and top app chrome.

Contains:

- app name
- dataset date
- channel branding text
- feature flags for enabled routes

### `dashboard.json`

Overview route payload.

Contains:

- headline KPIs
- timeseries summaries
- highlight cards
- quick diagnosis blocks

### `videos.json`

Videos index and detail support payload.

Contains:

- video list rows
- package-level metrics
- classification/status fields
- detail route fixture data for selected videos

### `growth.json`

Growth monitoring route payload.

Contains:

- longitudinal performance series
- release cadence views
- momentum windows
- anomaly and acceleration summaries

### `metadata.json`

Metadata analysis route payload.

Contains:

- title performance slices
- packaging diagnostics
- metadata quality summaries
- optimization opportunities

### `breakout.json`

Breakout scoring route payload.

Contains:

- breakout candidate rows
- score components
- confidence and action labels
- shortlist summaries

### `creative.json`

Creative analysis route payload.

Contains:

- theme groups
- thumbnail groups
- title/thumbnail combination patterns
- creative-level video fixtures

### `insights.json`

Cross-surface insight route payload.

Contains:

- traffic source mix
- device mix
- subscriber vs non-subscriber behavior
- geographic reach
- audience timing
- title analysis summaries

### `technical-analysis.json`

TA workspace payload.

Contains:

- scenario blocks
- scorecards
- support/resistance-style synthetic metrics
- watchlist or signal summaries

## Contract Rules

- The schema is UI-driven, not API-first.
- Payloads should stay route-scoped where possible.
- Shared shell context belongs in `app-shell.json`, not duplicated in every file.
- New routes should add new payloads rather than overloading unrelated ones.
- Synthetic data should preserve visual and analytical patterns, not private business truth.

## Release Rules

- Every new payload must be reviewed for public safety before commit.
- Route payloads should remain small enough for static delivery.
- Any new field should be added to the TypeScript contract in `src/lib/demo-client/types.ts`.
- Client loaders in `src/lib/demo-client/client.ts` must stay in sync with payload changes.
