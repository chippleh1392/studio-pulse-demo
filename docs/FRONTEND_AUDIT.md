# Frontend Audit — studio-pulse-demo

Scope: all pages under `src/pages`, layout under `src/components/layout`, feature sections under `src/features`, shared UI primitives. Findings are ordered by severity within each category.

---

## 1. Confirmed issues

### Responsiveness

**1. No mobile sidebar trigger exists in the layout — mobile navigation is unreachable**
`SidebarTrigger` is defined in [src/components/ui/sidebar.tsx:258](../src/components/ui/sidebar.tsx#L258) but never rendered anywhere. On screens <768px the sidebar is replaced by a Sheet controlled by `openMobile`, but nothing toggles it ([AppLayout.tsx:203-247](../src/components/layout/AppLayout.tsx#L203-L247)). Mobile users have no way to reach Videos, Growth, Creative, etc. — the only discoverable control is the search button. Similarly there is no visible desktop trigger to collapse the sidebar (only the Ctrl/Cmd+B shortcut, which is undiscoverable).

**2. Notifications and Settings are hidden entirely on mobile**
Both buttons are in a `hidden ... md:flex` cluster ([AppLayout.tsx:269-290](../src/components/layout/AppLayout.tsx#L269-L290)). Combined with #1, the whole right side of the top bar is missing below md.

**3. Breakout and Resurgence cards do not reflow on tablet/mobile**
[src/features/breakout/sections.tsx:222](../src/features/breakout/sections.tsx#L222) and [:284](../src/features/breakout/sections.tsx#L284) use a fixed `flex` row with a `w-40` thumbnail + flexible middle + `w-48` signal column and no `flex-wrap`/`md:` variants. Around ~600px and below the content gets crushed; the cards are not in an overflow container so they drive page-level horizontal scroll on mobile.

**4. Top header and main use always-on `px-8`**
[AppLayout.tsx:292](../src/components/layout/AppLayout.tsx#L292), [:353](../src/components/layout/AppLayout.tsx#L353). No `md:` step-down (only the thin bar above uses `px-4 md:px-8`). On small viewports this leaves very little body width, which compounds with tables that have `min-w-[900px]` or `min-w-[1180px]`.

**5. DateRangeSelector doesn't wrap tidily on narrow widths**
6 pill buttons in a single flex row ([DateRangeSelector.tsx:26](../src/components/charts/DateRangeSelector.tsx#L26)). When paired with the "Global Timeframe (…)" label in the page top bar, it overflows on tablet viewports because the surrounding container uses `flex-wrap items-center justify-end` but the selector itself is un-wrappable.

**6. OverviewPage shows four DateRangeSelectors simultaneously**
Global top bar + [OverviewPage.tsx:53, 149, 173, 196](../src/pages/OverviewPage.tsx#L53). On narrow screens these compete for space and look cluttered; they also share a single piece of state, so three of them are redundant UI.

**7. InsightsPage "Title Structure Types" uses fixed-width label + progress bar**
[InsightsPage.tsx:339-343](../src/pages/InsightsPage.tsx#L339-L343) — `w-32` label + `ProgressBar` + `w-20` number. With longer labels or at narrow widths this overlaps / wraps awkwardly.

### Accessibility / semantic HTML

**8. `CardTitle` renders as a `<div>`, not a heading**
[src/components/ui/card.tsx:31](../src/components/ui/card.tsx#L31). Every section on every page uses `CardTitle`, so most pages have exactly one real heading (the `<h1>` inside PageHeader). AT users have no way to jump between sections.

**9. Heading levels skip on InsightsPage**
[InsightsPage.tsx:325, 336, 349](../src/pages/InsightsPage.tsx#L325) jump from the PageHeader's `h1` straight to `h4`, with no `h2`/`h3` in between. Breakout uses `h2` ([sections.tsx:82, 122](../src/features/breakout/sections.tsx#L82)); most other pages have none at all. Heading structure is inconsistent across the app.

**10. MetadataPage renders a fake table with divs**
[MetadataPage.tsx:168-205](../src/pages/MetadataPage.tsx#L168-L205) uses `grid grid-cols-[1.7fr_120px_...]` inside nested divs. No `<table>`/`<th>`/`<td>`, no column→cell semantics for screen readers, no `scope`.

**11. Table `<th>` elements missing `scope="col"` in several places**
- [src/features/growth/sections.tsx:219-226](../src/features/growth/sections.tsx#L219-L226) (Weekly Performance)
- [src/features/creative/sections.tsx:238-250](../src/features/creative/sections.tsx#L238-L250) (All Creative Videos)
- [src/features/creative/sections.tsx:306-312](../src/features/creative/sections.tsx#L306-L312) (Group Detail Sheet)

VideosPage ([:278-316](../src/pages/VideosPage.tsx#L278-L316)) does it correctly; the others should match.

**12. Custom `<button>` elements throughout the app have no focus-visible styling**
Focus outlines only exist on the shared shadcn primitives (Button/Input/Dialog/Sheet/Sidebar). Native buttons built inline inherit no visible focus state:
- Top-bar search/notifications/settings — [AppLayout.tsx:255, 270, 281](../src/components/layout/AppLayout.tsx#L255)
- Sort buttons in Videos table — [VideosPage.tsx:286-312](../src/pages/VideosPage.tsx#L286-L312)
- Segmented All/Videos/Live filter — [VideosPage.tsx:192-203](../src/pages/VideosPage.tsx#L192-L203)
- Active-filter chip X buttons — [VideosPage.tsx:227, 239](../src/pages/VideosPage.tsx#L227)
- Growth WoW timeframe pills — [features/growth/sections.tsx:156-169](../src/features/growth/sections.tsx#L156-L169)
- TA `TogglePill` — [features/technical-analysis/sections.tsx:259-270](../src/features/technical-analysis/sections.tsx#L259-L270)
- Creative `GroupRow` — [features/creative/sections.tsx:432-446](../src/features/creative/sections.tsx#L432-L446)

This is the single most visible a11y gap.

**13. Search inputs have placeholder-only labels**
- [VideosPage.tsx:183](../src/pages/VideosPage.tsx#L183) — "Search titles, themes, formats…"
- [features/creative/sections.tsx:213](../src/features/creative/sections.tsx#L213) — "Search title, id, theme, thumbnail"
- [features/creative/sections.tsx:396](../src/features/creative/sections.tsx#L396) — theme/thumb search

None have an `aria-label` or a real `<label>`. Only the global search command input has `aria-label` ([GlobalSearchModal.tsx:99](../src/components/layout/GlobalSearchModal.tsx#L99)).

**14. Misused form state in the Settings sheet**
[AppLayout.tsx:188](../src/components/layout/AppLayout.tsx#L188): `<input type="checkbox" disabled aria-disabled>` — `aria-disabled` is passed with no value.
[AppLayout.tsx:192](../src/components/layout/AppLayout.tsx#L192): `<input type="checkbox" defaultChecked readOnly>` — checkboxes don't honor `readOnly`; users can still toggle it but the state won't "stick". Either wire them up or render them as `disabled`. Showing disabled/broken toggles in a public demo reads as placeholder work.

**15. DateRangeSelector toggles missing `aria-pressed`**
[DateRangeSelector.tsx:28-41](../src/components/charts/DateRangeSelector.tsx#L28-L41). The visual "active" state is a color — not announced to AT. Either set `aria-pressed` on each Button or wrap in `role="radiogroup"` with `role="radio"`/`aria-checked` on each.

**16. `ProgressBar` has no ARIA**
[InsightsPage.tsx:38-45](../src/pages/InsightsPage.tsx#L38-L45). Used 4 times on that page. Needs `role="progressbar"` + `aria-valuenow`/`aria-valuemin`/`aria-valuemax` (or an accessible text twin, which it mostly has already — the screen reader just won't know it's a bar).

**17. CreativeGroupCard `GroupRow` lacks column headers**
[features/creative/sections.tsx:430-446](../src/features/creative/sections.tsx#L430-L446) renders a grid of key/views/ctr/avd/score with no visual labels. Both visually and for AT it's four columns of unlabeled numbers. Compare with the well-labeled table in the same file ([:238-250](../src/features/creative/sections.tsx#L238-L250)).

**18. Charts carry no accessible description**
`TimeSeriesChart` renders a `<canvas>` with no `role="img" aria-label` or offscreen summary ([TimeSeriesChart.tsx:228-238](../src/components/charts/TimeSeriesChart.tsx#L228)). Same for ECharts scatters in Creative. Not unusual, but for a "public demo" worth at least an `aria-label` per chart stating the metric and date range.

**19. Sort buttons have no spoken affordance**
[VideosPage.tsx:286-312](../src/pages/VideosPage.tsx#L286-L312). `aria-sort` is correctly on the `<th>`, but the button inside is just the column name — AT reads "button, Views" with no hint that activating it will sort. Adding `aria-label={\`Sort by X, currently ${dir}\`}` would fix it.

### UI quality / polish

**20. Disabled/no-op settings are visible in the demo**
[AppLayout.tsx:186-198](../src/components/layout/AppLayout.tsx#L186-L198). "Compact density" is disabled and "Show demo banners" is a toggle that doesn't toggle. For a portfolio demo these read as placeholder UI. Either remove them or wire to a real preference (even if session-scoped).

**21. Four DateRangeSelectors on Overview**
See #6. The three per-chart selectors point at the same state the global selector already controls. At minimum, drop the duplicates or relabel them.

**22. Growth "What Changed" list is rendered as prose with manual hyphens**
[features/growth/sections.tsx:36-38](../src/features/growth/sections.tsx#L36-L38): `<div>- {line}</div>` inside a `<CardContent>`. Should be a `<ul>` — both semantic and visual polish (bullet alignment, wrapping indent).

**23. Dead runtime import in AboutPage**
[AboutPage.tsx:1](../src/pages/AboutPage.tsx#L1) imports `BookOpen` as a runtime value but only uses it via `typeof BookOpen` in a prop type. Harmless but sloppy.

**24. Micro typography (`text-[10px]`) widespread**
Found on keyboard kbd hint, "Demo" chip, workspace badge, uppercase section eyebrows. Stacked with condensed weight, some are hard to read at standard zoom on Retina. Consider `text-[11px]` as a floor for meaningful text.

---

## 2. Likely issues / follow-up checks

**L1. Contrast of tinted banners**
- "Public demo mode" banner — `text-emerald-900/80` on `bg-emerald-50/65` with 14px body text ([AppLayout.tsx:333-342](../src/components/layout/AppLayout.tsx#L333)). Worth running through a contrast checker.
- The top strip gradient (`#bedce9 → #c9b8e4`) with `text-slate-700` 12px badges ([AppLayout.tsx:250-268](../src/components/layout/AppLayout.tsx#L250)) — likely passes for normal text but borderline for the `text-[10px]` `Ctrl/Cmd+K` kbd.
- `text-muted-foreground` is `oklch(0.5 0.008 270)` — check 4.5:1 against the off-white card variants used in hero cards (the `linear-gradient(..., rgba(222,242,255,0.95) ...)` surfaces).

**L2. Compact input widths inside flex headers**
- [features/creative/sections.tsx:217, 400](../src/features/creative/sections.tsx#L217) — hardcoded `w-72` and `w-48` inputs inside card headers with `flex items-center justify-between` and no `min-w-0` on siblings. Likely to collide with titles at tablet widths. Worth spot-checking ~900-1100px.

**L3. Creative videos table `min-w-[1180px]`**
That's wider than most laptop screens after the 13rem sidebar. Horizontal scroll will appear even on desktop. Consider tightening columns or abbreviating headers.

**L4. Video table `<th scope="row">` wrapping a `<Link>` with `truncate`**
[VideosPage.tsx:358-361](../src/pages/VideosPage.tsx#L358-L361). The link has `truncate` but its parent `th` doesn't define a max-width or `min-w-0`. Long titles might not actually truncate. Quick verification recommended.

**L5. Custom gradient backgrounds have no dark-mode counterparts**
The `.dark` CSS variables are defined in [index.css:86-118](../src/index.css#L86-L118), but page-level gradients (e.g. [OverviewPage.tsx:57](../src/pages/OverviewPage.tsx#L57), Creative/About, header stripes) hardcode light hex values. If dark-mode is ever toggled, these will look broken. Not a problem *today* because there is no toggle, but flag before shipping a theme switcher.

**L6. Sheets may collide with their own close button**
Notifications/Settings sheets render content with `pt-14` to avoid the top-4/right-4 close button ([AppLayout.tsx:149](../src/components/layout/AppLayout.tsx#L149)). The Creative Group Detail sheet ([features/creative/sections.tsx:295-301](../src/features/creative/sections.tsx#L295)) uses default padding, so the `SheetTitle` sits at `top-0` next to the close button — inspect visually to confirm no overlap, especially with long theme names.

**L7. Focus return after Dialog/Sheet close**
Radix handles this by default, but the Global Search dialog uses custom content and `showClose={false}` ([GlobalSearchModal.tsx:79](../src/components/layout/GlobalSearchModal.tsx#L79)). Verify focus returns to the triggering search button in the top bar when closed.

---

## 3. Polish opportunities (lower priority)

- **P1.** Tabular alignment: numeric columns in tables lack `font-variant-numeric: tabular-nums`. Views/CTR/score won't vertically align across rows. Easy `tabular-nums` addition to the relevant `<td>` classes.
- **P2.** Active filter chip "X" buttons ([VideosPage.tsx:227, 239](../src/pages/VideosPage.tsx#L227)) use a `h-3 w-3` icon with no padded hit area — small tap target on touch.
- **P3.** VideoThumbnail / ThumbLabel ([VideosPage.tsx:75-83](../src/pages/VideosPage.tsx#L75-L83), [features/breakout/sections.tsx:201-209](../src/features/breakout/sections.tsx#L201)) — purely decorative gradient boxes marked up as plain divs. Fine, but since they're inside clickable `<Link>` elements that already have text siblings, consider `aria-hidden` for consistency.
- **P4.** Loading skeletons in Growth/Creative don't mirror final table header rows — [features/growth/sections.tsx:209-214](../src/features/growth/sections.tsx#L209) is just 5 blank bars. Causes a layout jump when data arrives.
- **P5.** Empty-state for "No videos match the current filters" in VideosPage ([:388-393](../src/pages/VideosPage.tsx#L388)) is a single muted line inside the table. Could match the richer `EmptyCard` pattern used in Breakout.
- **P6.** "Global Timeframe (…)" label in the top bar ([AppLayout.tsx:322-324](../src/components/layout/AppLayout.tsx#L322)) is a plain `<span>`. Consider exposing as a proper `<label>` linking to the selector, or using `aria-labelledby` on the button group.
- **P7.** `SectionHeading` in GlobalSearchModal is marked `aria-hidden` ([GlobalSearchModal.tsx:38](../src/components/layout/GlobalSearchModal.tsx#L38)) — fine, but the underlying `cmdk` list loses any group semantics. A `role="group" aria-label="Pages"` on each `<div>` following the heading would help AT users understand the result buckets.
- **P8.** Creative scatter chart tooltips are ECharts-native; test keyboard focus on the chart (should at minimum not become a focus trap).
- **P9.** Most page headers (`PageHeader`) share the same gradient background — consistent, good. The TA workspace's custom header chips ([features/technical-analysis/sections.tsx:232-245](../src/features/technical-analysis/sections.tsx#L232)) break this pattern slightly; minor visual inconsistency vs. other pages.

---

## 4. Suggested next-pass order

Ranked by "most visible to an external reviewer opening the demo":

1. **Wire up the mobile hamburger + show-on-mobile trigger for notifications/settings.** Single biggest demo-quality gap. Render `<SidebarTrigger>` in the top bar (visible always or `md:hidden`), and drop `hidden md:flex` on the right-side cluster.
2. **Fix Breakout/Resurgence card wrapping** so the site stops horizontal-scrolling on tablet/mobile.
3. **Reduce header/main padding on small viewports** (`px-4 md:px-8`, `py-4 md:py-6`) to recover horizontal real estate.
4. **Add focus-visible rings to the custom buttons** listed in #12 — one shared utility class + a find-and-replace pass. Cheap, universally visible win.
5. **Decide on the Settings sheet.** Either wire the two checkboxes to real state or remove the card. Leaving broken toggles in a public demo is the worst option.
6. **Deduplicate DateRangeSelectors on Overview.** Drop the three per-card copies or convert them to chart-scoped timeframes that are visibly distinct from the global one.
7. **Promote `CardTitle` to a heading (at least inside pages).** Either add an `as` prop to `CardTitle` and set `h2`/`h3` on each page, or wrap with an explicit heading. Fixes the AT navigation gap in one change.
8. **Add `aria-label`s to the three unlabeled search inputs** and `aria-pressed` to `DateRangeSelector` buttons.
9. **Convert the Metadata fake-table** to real `<table>` markup, or at least add `role="table"`/`role="row"`/`role="cell"` + `aria-labelledby`.
10. **Audit contrast** on the emerald demo banner and the tinted top strip — likely quick tweaks.

---

Categories explicitly covered: responsiveness, semantic HTML, ARIA, focus states, dialog/sheet/search a11y, button/input misuse, table/list semantics, loading/empty-state polish, overall finish. No significant contrast failures were confirmed (flagged as follow-up in L1), nor keyboard traps in modals — those would need runtime verification in a browser.
