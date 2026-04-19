# Feature Module Refactor Guide

Status: active implementation guide based on the `Creative`, `Growth`, `Breakout`, and `TechnicalAnalysis` route refactors completed on 2026-04-19.

## Purpose

This guide captures the route structure pattern now used in the demo for heavier screens.

The goal is simple:

- keep route files thin
- move route-specific logic into a feature folder
- make future edits safer without introducing a large framework abstraction

## The pattern

For a heavier route, use this structure:

- `src/pages/<RouteName>Page.tsx`
- `src/features/<feature>/utils.ts`
- `src/features/<feature>/sections.tsx`

### Route file responsibility

The route file should own:

- async data loading
- local UI state
- memoized derived values
- high-level page composition

It should not hold:

- large formatting helper collections
- export helpers
- selector/filter logic that is specific to the feature
- many inline presentational subcomponents

### `utils.ts` responsibility

Put feature-specific logic here:

- formatting helpers when they are specific to the feature
- selectors and filters
- chart option builders
- export helpers
- lightweight derived-data helpers

### `sections.tsx` responsibility

Put feature-specific view composition here:

- page sections
- cards
- tables
- sheets
- small local presentation helpers that only matter to that feature

## Implemented examples

### Creative

Files:

- [CreativePage.tsx](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/pages/CreativePage.tsx)
- [sections.tsx](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/features/creative/sections.tsx)
- [utils.ts](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/features/creative/utils.ts)

What moved out of the route:

- formatting helpers
- CSV export logic
- scatter chart option creation
- theme/thumbnail/video filtering
- selected group video matching
- summary, scatter, group table, combos, video table, and sheet sections

Result:

- route file is now page composition plus state wiring
- creative-specific behavior is isolated in one feature directory

### Growth

Files:

- [GrowthPage.tsx](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/pages/GrowthPage.tsx)
- [sections.tsx](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/features/growth/sections.tsx)
- [utils.ts](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/features/growth/utils.ts)

What moved out of the route:

- timeframe option constants
- formatting helpers
- anomaly and summary derivation
- chart data selectors
- KPI grid, charts, weekly table, anomaly cards, and focus area sections

Result:

- route file is now readable at a glance
- the same structure works for a different analytics surface, which makes it a real repo pattern rather than a one-off cleanup

### Breakout

Files:

- [BreakoutPage.tsx](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/pages/BreakoutPage.tsx)
- [sections.tsx](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/features/breakout/sections.tsx)
- [utils.ts](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/features/breakout/utils.ts)

What moved out of the route:

- scoring and signal helpers
- candidate and resurgence cards
- action queue, method, threshold, and list sections

### Technical Analysis

Files:

- [TechnicalAnalysisPage.tsx](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/pages/TechnicalAnalysisPage.tsx)
- [sections.tsx](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/features/technical-analysis/sections.tsx)
- [utils.ts](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/features/technical-analysis/utils.ts)

What moved out of the route:

- overlay/panel constants
- chart series builders
- sidebar, chart, indicator, and header-chip sections

## What this repo is intentionally not doing

This is not a push toward a complicated architecture system.

The repo is intentionally avoiding:

- a feature framework with many wrapper layers
- domain stores for static demo data
- generic abstraction for every section pattern
- central “selectors” infrastructure across unrelated routes

Each feature folder should stay local, obvious, and boring.

## When to use this pattern

Use the feature-module split when a route starts to show at least two of these signs:

- file size is getting large enough to slow review
- route mixes filtering/derivation logic with rendering
- a route contains multiple distinct sections or cards
- chart configuration is making the route noisy
- exports or utility actions are embedded in the page component

For very small routes, keep the route inline and simple.

## Suggested next candidates

If more cleanup is needed later, the next routes that fit this pattern are:

1. `VideosPage.tsx`
2. `InsightsPage.tsx`

## Rule of thumb

If a route reads like a screen controller, keep it in the route file.

If it reads like reusable feature logic or a block of feature-specific UI, move it into the feature folder.
