# Architecture Notes

## Overview

Studio Pulse Demo is a static React SPA. The app intentionally keeps the feel of a production analytics product while removing all backend dependencies.

## Runtime Model

- Vite serves the frontend locally
- React Router handles route transitions
- route rewrites in `vercel.json` support direct navigation on static hosting
- `src/lib/demo-client/client.ts` loads JSON payloads from `public/demo-data/`
- `src/lib/demo-client/types.ts` defines the public data contract

## Design Approach

The app uses a shared shell and route-specific data loaders instead of a monolithic global store.

This keeps the public demo:

- easy to reason about
- easy to deploy
- easy to sanitize
- independent from the private backend architecture

## Why Static Instead Of Full-Stack

For the public portfolio version, static hosting is the right tradeoff:

- no server costs
- no cloud database
- no auth concerns
- lower risk of leaking private logic or data
- easier public review of the frontend implementation

## Key Tradeoffs

Advantages:

- simple deployment
- deterministic demo state
- clean public artifact

Limitations:

- no live refresh
- no user persistence
- no real sync workflows
- some pages use synthesized drilldowns instead of true underlying systems

## Main Frontend Areas

- `src/components/layout/` for app shell and shared page framing
- `src/components/ui/` for reusable primitives
- `src/components/charts/` for reusable chart controls and chart wrappers
- `src/pages/` for route-level screens
- `src/lib/demo-client/` for payload loading and typing
- `src/lib/timeframe/` for global timeframe state across routes

## Future Direction

If the demo ever outgrows static JSON, the next step should be a thin read-only API rather than a full rebuild. That would preserve the current frontend shape while keeping the public surface small and controlled.
