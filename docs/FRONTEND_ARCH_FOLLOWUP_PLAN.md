# Frontend Architecture Follow-Up Plan

Status: active working guide for the public demo repo.

## Purpose

This document adapts the larger product audit from:

`C:\Users\chipp\OneDrive\Documents\projects\youtube\youtube-analytics\docs\current\DASHBOARD_FRONTEND_ARCH_AUDIT_2026-04-18.md`

The demo repo shares a lot of frontend DNA with the larger app, but it is not a one-to-one match:

- it is a static SPA
- it loads synthetic JSON from `public/demo-data/`
- it has no live auth, sync, or operational backend
- its main public risk is frontend maintainability and shipped bundle cost

This guide keeps the findings that still matter for the demo, discards the ones that were mostly backend-driven, and turns the result into an implementation sequence.

## Current repo reality

Observed in the demo as of 2026-04-19 after the follow-up work:

- route-level lazy loading is in place
- the oversized startup bundle problem is resolved
- route-specific feature folders now exist for `creative`, `growth`, `breakout`, and `technical-analysis`
- demo data reads are memoized in the client, and shell/search use dedicated hooks
- the old ECharts `console.error` suppression is gone
- the repo has a lightweight frontend test harness

## Audit Findings: Demo Applicability

### 1. Monolithic API client and type surface

Status: mostly not applicable.

Why:

- The private app audit referred to a huge server/API module.
- The demo uses a small static loader layer in `src/lib/demo-client/client.ts`.
- `src/lib/demo-client/types.ts` is a single file, but it is still understandable and route-scoped.

What still applies:

- If the demo keeps expanding, split `types.ts` by domain before it turns into the same kind of catch-all file the private app has.

Action:

- No immediate migration needed.
- Revisit only if more routes or payloads are added.

### 2. Manual repeated server-data fetching

Status: addressed for the demo's current scope.

Why:

- The original audit was correct for the larger app.
- In this demo, the recent `useAsyncResource` hook has already removed most of the repeated page-level loading boilerplate.
- Remaining fetches are still local and ad hoc in the shell/search area, but the scale is much smaller than the private app.

What was implemented:

- `useAsyncResource` remains the demo default
- the demo client now memoizes repeated reads
- shell and search access were moved behind dedicated hooks

Remaining note:

- the demo still does not justify a full query/cache library

### 3. Oversized page components that mix concerns

Status: addressed for the heaviest routes.

Why:

- The demo page files are smaller than the private app's largest pages, but several are still in the 300-450 line range.
- Those files combine data reading, transformation logic, filter/sort state, and rendering.
- This is already enough to slow edits and make public-facing polish/refactors riskier than necessary.

What was implemented:

- `CreativePage`
- `GrowthPage`
- `BreakoutPage`
- `TechnicalAnalysisPage`

Remaining likely candidate:

- `VideosPage`

### 4. Route architecture lacks code-splitting boundaries

Status: addressed.

Why:

- This is directly true in the demo today.
- `src/App.tsx` eagerly imports every route.
- The production bundle warning confirms this is not theoretical.
- The demo is public-facing, so first-load weight matters more here than it did in the internal app.

What was implemented:

- added route-level lazy loading with `React.lazy` and `Suspense`
- kept the overview route eager
- moved overview charting behind its own lazy boundary
- split shared charting dependencies out of the startup path
- added targeted vendor chunking for React, ECharts, and zrender

Result:

- the original oversized single app chunk is gone
- the build no longer emits the chunk-size warning
- see `docs/ROUTE_CODE_SPLITTING_GUIDE.md` for measured output

### 5. Framework-level escape hatches / ECharts suppression

Status: addressed.

Why:

- The demo still overrides `console.error` in development to hide disconnect warnings.
- Even if the warning is harmless, global console interception is a blunt workaround.

What was implemented:

- removed the global `console.error` override from `src/main.tsx`
- removed the surrounding `StrictMode` wrapper that was triggering the development disconnect noise in this demo setup

### 6. Thin testing strategy

Status: addressed as a baseline.

Why:

- The repo still has no unit/component/e2e setup.
- The demo is static, but it still has enough interaction to justify a small safety net:
  - routing
  - global timeframe behavior
  - filtering/sorting
  - search modal navigation

What was implemented:

- route smoke test
- timeframe behavior test
- videos interaction test
- global search modal interaction test

### 7. Accessibility and semantics in custom controls

Status: partially valid.

Why:

- The demo uses many custom filter and segmented button patterns.
- Some controls are visually clear but still deserve a semantics pass.
- The problem is smaller than in the private app because the control surface is smaller, but it is still real for a public demo.

What was implemented:

- added `aria-pressed` to toggle-style button groups
- improved dialog trigger semantics in the shell
- added a direct label for the global search input

Remaining work:

- deeper semantic polish on sortable tables and a few custom shell controls could still be improved later

## Recommended implementation order

### Phase 1: Fix the public bundle problem

Goal:

- Reduce initial bundle cost without changing product behavior.

Work:

1. Add route-level lazy loading in `src/App.tsx`.
2. Wrap route content in sensible suspense fallbacks.
3. Rebuild and compare output chunking.
4. If needed, isolate the heaviest chart-driven routes further.

Why first:

- This is the clearest public-facing technical issue right now.
- The repo already surfaced the warning in a clean production build.

### Phase 2: Create real feature boundaries inside heavy routes

Goal:

- Lower change risk and make later polish/testing easier.

Work:

1. Refactor the heaviest route files into feature modules.
2. Move route-specific transforms/selectors out of the page component body.
3. Keep each route file focused on composition and high-level state wiring.

Why second:

- Route-level splitting helps shipping cost.
- Feature extraction helps maintenance cost.
- They reinforce each other if done in that order.

### Phase 3: Tighten shared data-loading patterns

Goal:

- Keep the demo simple without importing a heavier data stack too early.

Work:

1. Standardize shell data and search data access behind small hooks.
2. Decide whether repeated reads of the same static payload need memoized sharing.
3. Avoid jumping to TanStack Query unless requirements actually justify it.

Why third:

- The current static data model does not yet justify a full server-state library.
- This repo should not import private-app complexity just because the larger app needs it.

### Phase 4: Testing and accessibility pass

Goal:

- Add a minimum durable quality bar for public maintenance.

Work:

1. Introduce a lightweight test runner and React testing setup.
2. Cover high-value interactions only.
3. Run a semantics/keyboard pass on custom controls.

## What not to cargo-cult from the larger app

These recommendations from the private app should not be copied blindly into the demo:

- Do not add a large query/cache abstraction just because the private app needed one.
- Do not split the demo client into many modules yet just to mirror backend domains that do not exist here.
- Do not optimize for auth, sync, or real server invalidation workflows that the demo intentionally does not have.

The demo should stay intentionally smaller than the source product.

## Proposed companion docs after implementation

Once the actual work lands, add short learning-oriented docs that explain the final decisions instead of only preserving the plan.

Recommended follow-ups:

- `docs/ROUTE_CODE_SPLITTING_GUIDE.md`
  - what changed
  - what bundle impact we observed
  - why we chose route-level lazy loading over deeper manual chunking first
- `docs/FEATURE_MODULE_REFACTOR_GUIDE.md`
  - before/after route structure
  - what moved out of the page files
  - what patterns we want repeated on future routes

## Recommended next task

The next concrete task should be:

1. use the current structure and test baseline during actual product-facing improvements
2. extend coverage only when changes affect routing, persistent state, or complex interactions
3. avoid adding framework complexity unless the demo requirements materially change

That is the right next posture because the major applicable audit items have now been handled for this demo.
