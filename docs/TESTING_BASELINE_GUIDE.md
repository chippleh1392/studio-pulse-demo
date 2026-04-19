# Testing Baseline Guide

Status: active baseline for the public demo repo.

## Purpose

This repo now has a minimal frontend test setup intended to protect the highest-value interactions without creating heavy maintenance overhead.

The baseline is intentionally small:

- route rendering
- timeframe behavior
- one realistic filter/search flow
- one global search modal interaction

## Stack

Configured in:

- [package.json](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/package.json)
- [vite.config.ts](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/vite.config.ts)
- [setup.ts](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/test/setup.ts)

Tools:

- Vitest
- jsdom
- Testing Library
- `@testing-library/jest-dom`
- `@testing-library/user-event`

## Current tests

### Route smoke test

File:

- [App.test.tsx](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/App.test.tsx)

Purpose:

- verifies a lazy route renders through the router tree
- protects against accidental route wiring regressions

### Global timeframe behavior test

File:

- [globalTimeframe.test.tsx](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/lib/timeframe/globalTimeframe.test.tsx)

Purpose:

- verifies timeframe label updates
- verifies built paths include the timeframe query param
- verifies timeframe selection persists to local storage

### Videos interaction test

File:

- [VideosPage.test.tsx](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/pages/VideosPage.test.tsx)

Purpose:

- verifies demo data loads into the page
- verifies search filters the visible rows
- verifies reset restores the list
- verifies type filtering isolates the live item

### Global search modal interaction test

File:

- [GlobalSearchModal.test.tsx](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/components/layout/GlobalSearchModal.test.tsx)

Purpose:

- verifies matching video results appear
- verifies selecting a result closes the modal

## Test data strategy

Shared test fixtures live in:

- [data.ts](C:/Users/chipp/OneDrive/Documents/projects/youtube/studio-pulse-demo/src/test/data.ts)

Guidance:

- keep fixture data small
- prefer realistic values and titles so tests read clearly
- share only stable test fixtures, not giant dumps

## What this baseline is for

This setup is meant to catch:

- route breakage
- state/persistence regressions
- common interaction regressions in filterable screens

It is not trying to fully snapshot the product.

## What to add next

If coverage expands, add only a few high-value tests first:

1. one chart-heavy route smoke test
2. one feature-module route interaction test for either `Creative` or `Growth`
3. one shell accessibility-focused interaction test

## What to avoid

Avoid turning this into a slow, brittle suite by default.

Specifically:

- do not snapshot large route trees
- do not mock everything in every test
- do not add coverage only because a file changed
- do not test ECharts internals

Focus on observable product behavior.

## Commands

- `npm test`
- `npm run test:watch`

## Rule of thumb

If a change affects routing, persistent UI state, or list filtering, it should usually come with a test.

If a change is mostly visual markup reshuffling with no behavior change, it usually does not need one.
