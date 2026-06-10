# Fix Tasks page tab strip

Two issues in the horizontally-laid-out tab bar (`.tasks-tabs` in `src/styles.css`, used by `src/routes/tasks.tsx`):

1. The active tab overlaps the strip with `margin-bottom: -1px` (plus curved `::before`/`::after` shoulders that sit on the baseline) — user wants this removed.
2. With 5 tabs forced to equal width via `flex: 1 1 0` and `white-space: nowrap`, long labels ("Legal Hub", "Expense Claims") overflow past the active tab's rounded border on a 390 px viewport.

## Changes (CSS only, `src/styles.css` lines 1112–1176)

### 1. Remove the strip overlap
- Delete `margin-bottom: -1px` on `.tasks-tab.is-active`.
- Delete the `border-bottom-color: var(--tab-active-bg)` trick (no longer needed once the tab isn't sitting on the strip line).
- Delete the two curved-shoulder pseudo-elements (`.tasks-tab.is-active::before` / `::after`) — they only exist to mask the strip joint.
- Keep the bottom border on `.tasks-tabs` so the strip line still reads as a divider under inactive tabs.

### 2. Keep label text inside each tab's border
Switch the strip from equal-width flex children to an intrinsically sized, horizontally scrollable row so each tab is exactly as wide as its label + padding:

- `.tasks-tabs`: add `overflow-x: auto`, `scrollbar-width: none` (+ `::-webkit-scrollbar { display: none }`), `flex-wrap: nowrap`, and a small `gap: 0.25rem` so active tab rounded corners breathe.
- `.tasks-tab`: replace `flex: 1 1 0` with `flex: 0 0 auto`, add horizontal `padding: 0 0.75rem`, drop `min-width: 0`. Text stays `nowrap` but now lives inside its own border because the tab grows to fit.
- Active tab keeps `border: 1px solid var(--tab-line)` and `border-radius: 0.7rem 0.7rem 0 0`; with the overlap removed it sits cleanly above the strip line.

No changes to `src/routes/tasks.tsx` — same markup, same tab keys/labels.

## Out of scope
- No changes to colors, font sizes, weights, or active-tab color token.
- No changes to tab labels or count.
- Desktop layout (`md:hidden` strip) unaffected.
