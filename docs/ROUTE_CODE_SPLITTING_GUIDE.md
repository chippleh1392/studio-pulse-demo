# Route Code Splitting Guide

Status: implemented on 2026-04-19 and completed with a charting follow-up pass.

## Goal

Reduce the public demo's initial JavaScript cost by introducing route-level lazy loading first, then tightening charting imports where shared ECharts code was still dominating the build.

## What changed

Files touched:

- `src/App.tsx`
- `src/pages/OverviewPage.tsx`
- `src/components/charts/TimeSeriesChart.tsx`
- `src/pages/CreativePage.tsx`
- `src/lib/echarts/core.ts`
- `vite.config.ts`

Implementation, pass 1:

- kept the overview route eager
- converted all other page imports to `React.lazy`
- wrapped each lazy route in `Suspense`
- added a lightweight route fallback so navigation still feels intentional while the chunk loads

Routes moved behind lazy boundaries:

- `/videos`
- `/videos/:videoId`
- `/growth`
- `/metadata`
- `/breakout`
- `/creative`
- `/insights`
- `/ta`
- `/about`

Implementation, pass 2:

- moved overview chart rendering behind a lazy chart boundary so the eager dashboard route no longer forces ECharts into startup
- replaced the full `echarts-for-react` entry with the modular `ReactEChartsCore` pattern
- registered only the chart types used in this repo:
  - line
  - scatter
  - grid
  - legend
  - tooltip
  - title
  - markLine
  - canvas renderer
- added targeted manual chunking in Vite for:
  - React runtime
  - ECharts
  - zrender

## Why start here

This was the correct first pass because:

- the router eagerly imported every route before
- the repo already had a production bundle-size warning
- route-level splitting is low-risk and does not require product behavior changes
- it creates cleaner boundaries for later refactors

This is the least invasive way to learn whether the bundle problem is mostly route-loading or mostly shared-dependency weight.

## Measured result

### Before

Production build output before this change included:

- `assets/index-C9A4mIX_.js`: `1,609.66 kB` minified, `521.66 kB` gzip

### After pass 1

Production build output after this change includes:

- `assets/index-CAYnAAMF.js`: `1,532.28 kB` minified, `505.32 kB` gzip

New route chunks now exist, for example:

- `CreativePage`: `13.85 kB`
- `BreakoutPage`: `13.53 kB`
- `GrowthPage`: `11.57 kB`
- `InsightsPage`: `11.34 kB`
- `VideosPage`: `9.00 kB`
- `TechnicalAnalysisPage`: `8.66 kB`
- `MetadataPage`: `7.30 kB`
- `VideoDetailPage`: `3.68 kB`
- `AboutPage`: `1.31 kB`

### Delta

- main bundle reduced by `77.38 kB` minified
- main bundle reduced by `16.34 kB` gzip

### Final result after charting follow-up

Production build output now includes:

- `assets/index-4C_4Jc2L.js`: `168.79 kB` minified, `55.06 kB` gzip
- `assets/react-vendor-Ds2wWLcr.js`: `228.70 kB` minified, `73.22 kB` gzip
- `assets/echarts-Bj3b93QQ.js`: `371.55 kB` minified, `125.55 kB` gzip
- `assets/zrender-yE8JOkY-.js`: `177.98 kB` minified, `59.11 kB` gzip

No Vite chunk-size warning remains.

### Final delta from the original single-bundle state

Original main app chunk:

- `1,609.66 kB` minified
- `521.66 kB` gzip

Current main app chunk:

- `168.79 kB` minified
- `55.06 kB` gzip

Main app chunk reduction:

- `1,440.87 kB` minified
- `466.60 kB` gzip

## Interpretation

The final result is materially better than the first route-only pass.

What this tells us:

- route code was part of the issue
- the bigger issue was shared charting code entering the startup path
- modular ECharts imports plus explicit vendor splitting were worth doing here
- the right sequence was:
  - route boundaries first
  - shared charting diagnosis second
  - bundler chunk shaping third

## Why we did not start with manual chunks

Manual chunking was the right third step, not the first one.

Starting with route-level lazy loading was better because:

- it matches the product boundaries users already understand
- it is easier to reason about and maintain
- it reveals whether deeper chunk tuning is actually needed
- it avoids premature Vite/Rollup-specific configuration while simple boundaries are still missing

By the time manual chunking was added, the repo already had:

- clear lazy route boundaries
- a lazy boundary around overview charting
- modular ECharts registration

That made the bundler config narrow and defensible instead of speculative.

## What I would do next

The next architecture task should no longer be bundle triage.

Recommended order:

1. refactor the heaviest route files into feature modules
2. keep charting on the shared modular ECharts path for any new visualizations
3. add a small frontend test baseline for routing, timeframe behavior, and search/filter flows

## Pattern to repeat

For future routes:

- keep route files as the natural code-splitting boundary
- keep heavy shared visual dependencies off the eager path unless they are truly needed at startup
- prefer lazy loading for non-home or lower-frequency screens
- pair lazy boundaries with a route-shaped fallback, not a generic spinner
- measure after each structural change instead of assuming the bundle win
