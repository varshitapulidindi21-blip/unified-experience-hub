## Goal
On the mobile HomePage header, ensure the "SS" profile avatar is a proper circle and restyle the notification (bell) button to share the same circular gradient avatar look.

## Observations
- `.mobile-avatar` in `src/styles.css` is already 2.15rem × 2.15rem with `border-radius: 9999px` and a purple gradient — it is already a proper circle, no change needed there (visual confirms).
- `.mobile-icon-btn` is circular too, but uses a light card background with a border, so it doesn't read as an "avatar".

## Changes
Edit `src/styles.css` only (presentation-only):

1. **`.mobile-icon-btn` (home header bell)** — replace the card/border styling with the same gradient + inner highlight + soft purple shadow used by `.mobile-avatar`, and switch icon color to white. Keep the 2.15rem circle size.
2. **`.mobile-icon-dot`** — update the green dot ring (`box-shadow`) so it still reads against the new purple background (use a subtle white ring instead of background-colored).
3. Leave `.mobile-avatar` as-is (already a proper circle).
4. Leave the page-variant header's bell untouched only if it shares the class — since it uses the same `.mobile-icon-btn`, it will inherit the new style across all mobile pages (Travel, Claims, Stats, Modules). This is consistent and desirable.

No component/JSX changes required.
