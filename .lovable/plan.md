# Newsletter Module — UX & Structure Plan

A planning document only. No code changes will be made until this is approved.

## 0. Visual Design Directive (HARD OVERRIDE)

For the Newsletter module ONLY, the attached reference images are the single source of truth for visual design. The existing Resolven UI is explicitly disregarded for this module.

Do NOT reuse or be influenced by the existing Resolven product's: layouts, card designs, spacing, padding, margins, border radius, shadows, widget designs, navigation styling, typography hierarchy, component styling, page composition, visual patterns, section layouts, or overall aesthetic.

The ONLY things that carry over from Resolven:
- Brand color palette (`--brand-purple`, `--brand-green`, neutrals).
- Montserrat font family.
- Resolven logo.
- Functional integration: routing, navigation wiring, auth, data, app shell mounting points.

Implementation rules:
- Replicate the references — do not reinterpret or "modernize" them. Match layout, spacing, proportions, alignment, component hierarchy, white space, visual rhythm, interaction patterns, and overall UX as faithfully as possible.
- Build new components for the Newsletter module from scratch (cards, widgets, reader chrome, archive grid, etc.). Do not reach for existing Resolven `module-card`, shadows, radii, button styles, chip styles, or section layouts.
- If anything in sections §1–§13 below conflicts with the reference images, the reference images win.
- The finished module should be instantly recognizable as the reference design, with only colors (Resolven brand), logo, and typography (Montserrat) visibly different.

---


---

## 1. Information Architecture

The Newsletter module is two pages inside the existing Resolven app shell.

```
Newsletter (Business Module)
├── /newsletter            → Home (Latest Edition + engagement rail)
└── /newsletter/archive    → Archive of all past editions
    └── /newsletter/:id    → (Opens a past edition inside the Home layout, latest-style)
```

Entry points:
- Business Modules grid card → `/newsletter`
- Left sidebar "Newsletter" item → `/newsletter`
- Inside Home, an "View Archive" affordance in the latest-newsletter header → `/newsletter/archive`

Sidebar (global, unchanged across pages):
`Home · Newsletter · Events · Ideas Box · Creator's Canvas`
Sustainability Hub is **removed** from the sidebar — it lives only as a content card on the Newsletter Home page.

---

## 2. Page 1 — Newsletter Home (Latest Edition)

Three-column desktop layout, matching reference image 1 + 5.

```
┌─ Sidebar ─┬─────────── Main column (center) ──────────┬─ Right rail ─┐
│           │  1. Latest Newsletter (carousel post)     │ Employee     │
│  Home     │  2. Reaction bar                          │ Shoutout     │
│  News.    │  3. Comments                              │ Quick Poll   │
│  Events   │  4. Leadership Quote banner               │ Mini Quiz    │
│  Ideas    │  5. Sustainability Hub card               │ What's       │
│  Creator  │                                           │ Happening    │
│           │                                           │ Ideas Box    │
│           │                                           │ Creator's    │
│           │                                           │ Canvas       │
│           │                                           │ Today at     │
│           │                                           │ Resolven     │
└───────────┴───────────────────────────────────────────┴──────────────┘
```

### 2.1 Latest Newsletter card (single post, Instagram-style carousel)

Only one newsletter is shown — the latest edition. The card behaves like a single social post with a multi-page carousel inside.

Header row:
- Title: "Resolven Newsletter"
- Subtitle: "{Month Year} Edition" in brand purple
- Right-aligned: Bookmark icon, More (kebab) menu

Body — Carousel:
- Each page fills the full content area (≈ 16:9 hero) with image + overlaid title + subtitle.
- Page counter chip top-left ("1 / 6").
- Prev / Next circular arrow buttons on left/right edges (desktop).
- Dot pagination centered beneath the carousel.
- Supports: mouse drag, touch swipe, arrow keys, click arrows, click dots.
- Each carousel page may contain image, text, infographic, or chart — content is page-defined.
- Carousel does NOT auto-advance.

Meta strip (bottom of carousel):
- Publish date (calendar icon)
- Reading time (clock icon)
- "By Brand Team" (person icon)

### 2.2 Reaction bar
Five horizontal pill buttons + counts:
`Like · Celebrate · Inspired · Insightful · Share`
- Click toggles the reaction (one active at a time per user).
- Counts update optimistically.
- Share opens a small popover (Copy link / Email / Teams).

### 2.3 Comments
LinkedIn-style threaded comments:
- Comment input with avatar, emoji picker, send button.
- Each comment: avatar, name, timestamp, body, `Like · Reply · ❤ count`.
- Replies are nested one level, indented.
- Sort dropdown: "Most recent / Top".
- "View all comments" expander when > 3.

### 2.4 Leadership Quote (full-width banner)
Brand-purple gradient banner with:
- Large quotation mark
- Quote body (italic display font)
- Leader image (right side, circular crop on desktop, top on mobile)
- Name + designation
Purely presentational — no actions.

### 2.5 Sustainability Hub card
A regular content card living on the Home page (not a separate route, not a sidebar item).
- Header: leaf icon + "Sustainability Hub" + timestamp + kebab
- Title + intro line
- Body slot supports any of: stat tiles (e.g. 12.8M kWh / 8,452 tCO₂ / 2.3M Liters / 1,200+ Communities), infographic image, chart, embedded report link.
- Footer: Like · Comment · Bookmark · Share — same pattern as the newsletter card.

### 2.6 Right rail widgets (top → bottom)

| Widget | Content | Interactions |
|---|---|---|
| Employee Shoutout | Photo, name, role, appreciation text | "Give Shoutout" button → modal; "View all" → list |
| Quick Poll | Question + 4 radio options | Select + Vote Now; after vote → results bar chart + "245 votes"; one vote per user |
| Mini Quiz | Single question, 4 options, correct answer highlights on submit | "Play Quiz" → multi-question modal; shows participants count |
| What's Happening | 3 upcoming events with date chip | "View calendar" → /events |
| Ideas Box | Latest idea title + upvotes + comments | "View & Discuss" → /ideas/:id |
| Creator's Canvas | 4-icon strip (Photos · Writing · Sketches · Videos · Poetry · Articles) | "View all" → /creator |
| Today at Resolven | Daily snapshot (e.g. "18 new updates · 5 polls · 3 quizzes · 4 new ideas · 2 events today") | Read-only |

---

## 3. Page 2 — Newsletter Archive (`/newsletter/archive`)

Matches reference image 6 almost exactly.

```
┌─ Sidebar ─┬───────── Main column ────────────────┬─ Right rail ─┐
│           │ Title + subtitle                     │ Filter       │
│           │ Tabs: All Editions | My Saved        │ Editions     │
│           │ Search · Filter btn · Grid/List      │ Popular      │
│           │ "Showing 12 of 18 editions"          │ Topics       │
│           │ ┌── Edition grid (4 col desktop) ──┐ │ Newsletter   │
│           │ │  card  card  card  card          │ │ Stats        │
│           │ │  card  card  card  card          │ │ Never Miss   │
│           │ └──────────────────────────────────┘ │ an Update    │
│           │ Load More                            │ (subscribe)  │
└───────────┴──────────────────────────────────────┴──────────────┘
```

### 3.1 Edition card
- Cover image (full bleed, rounded top corners) with "Newsletter" chip top-left and overlaid edition title + "{MONTH YEAR} EDITION" footer.
- Below the image (white area):
  - Edition label · kebab menu
  - Date · reading time
  - Short description (2 lines max, truncated)
  - Footer row: ❤ count · 💬 count · 🔖 save toggle
- Click anywhere on the card → opens that edition in the Home layout (read-only past edition view).

### 3.2 Toolbar
- Tabs: **All Editions** (default), **My Saved** (only bookmarked).
- Search input — searches title + description.
- Filter button — opens a sheet on mobile, inline panel on desktop (the right rail already exposes filters on desktop).
- Grid / List toggle — Grid is default; List shows wider rows with the cover thumbnail left, meta right.

### 3.3 Right rail
- **Filter Editions**: Year (select), Topic (select), Sort by (Newest / Oldest / Most liked). "Apply Filters" + "Clear all".
- **Popular Topics**: clickable chips with counts (Sustainability · Innovation · People & Culture · Operations · Community …). Clicking applies a topic filter.
- **Newsletter Stats**: Total Editions · Total Reactions · Total Comments · Saved by You.
- **Never Miss an Update**: subscribe CTA card.

---

## 4. User Flows

### Flow A — Read the latest edition
1. User lands on `/` → clicks Newsletter module card (or sidebar Newsletter).
2. `/newsletter` shows the latest edition carousel at page 1.
3. User swipes/clicks through pages 1 → N.
4. User reacts, comments, optionally bookmarks.
5. Scrolls down → reads Leadership Quote → Sustainability Hub.
6. Optionally engages with right-rail widgets.

### Flow B — Browse past editions
1. From `/newsletter` clicks "View Archive" (or sidebar item again when already on Home).
2. `/newsletter/archive` loads, defaults to All Editions, Grid, Newest first.
3. User filters by Year / Topic, or searches.
4. Clicks a card → opens that edition in the Home reader layout.
5. Back button returns to the archive with filters preserved.

### Flow C — Save & revisit
1. User bookmarks an edition (Home or Archive).
2. Switches to Archive → "My Saved" tab → sees only saved editions.

### Flow D — Engagement side-quests
- Quick Poll: select option → Vote → results.
- Mini Quiz: Play Quiz → modal of N questions → score screen.
- Give Shoutout: opens modal → pick employee + message → submit.

---

## 5. Interaction Specifications

| Component | Interaction |
|---|---|
| Carousel | drag / swipe / arrow buttons / dot click / ←→ keys; momentum-snap to each page; no autoplay |
| Reaction pill | toggle on click, single-active per user, count +1/-1 optimistic |
| Comment input | Enter to submit, Shift+Enter for newline, emoji popover, @-mentions (phase 2 OK) |
| Bookmark | toggle filled / outline icon, syncs to "My Saved" tab |
| Share | popover with Copy link / Email / Teams; toast on success |
| Quick Poll | radio select, Vote Now button enables only after selection; post-vote view shows %-bars |
| Mini Quiz | Play Quiz opens modal; correct = green ring, wrong = red ring, then Next |
| Filter sheet (mobile) | bottom sheet; Apply closes & filters; Clear all resets |
| Grid/List toggle | persists in localStorage |
| Search | debounced 200ms, client-side filter against title + description + tags |

---

## 6. Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| ≥1280 (desktop) | Three columns (sidebar + main + right rail). Carousel full main width. Archive grid = 4 columns. |
| 1024–1279 | Right rail collapses to a single column below main; sidebar stays. Archive grid = 3 columns. |
| 768–1023 | Sidebar becomes the existing mobile drawer; main is full width; right-rail widgets move into a 2-column grid below the newsletter. Archive grid = 2 columns. |
| <768 | Single column. Carousel becomes full-bleed swipe. Reaction pills become a horizontal scroll row. Comments collapse to first 2 + "View all". Archive grid = 1 column; Filter button opens bottom sheet. |

The mobile shell continues to use the existing Resolven branded header + bottom nav; no new chrome.

---

## 7. Component Hierarchy

```
NewsletterHomePage
├── AppShell (existing sidebar + topbar)
├── MainColumn
│   ├── LatestEditionCard
│   │   ├── EditionHeader (title, edition, bookmark, kebab)
│   │   ├── EditionCarousel
│   │   │   ├── CarouselSlide (×N: image/text/infographic)
│   │   │   ├── CarouselArrows
│   │   │   └── CarouselDots
│   │   ├── EditionMetaStrip (date · read · author)
│   │   ├── ReactionBar
│   │   └── CommentsSection
│   │       ├── CommentInput
│   │       └── CommentThread (Comment + Replies)
│   ├── LeadershipQuoteBanner
│   └── SustainabilityHubCard
│       ├── HubHeader
│       ├── HubBody (stats / image / chart slot)
│       └── EngagementFooter
└── RightRail
    ├── EmployeeShoutoutWidget
    ├── QuickPollWidget
    ├── MiniQuizWidget
    ├── WhatsHappeningWidget
    ├── IdeasBoxWidget
    ├── CreatorsCanvasWidget
    └── TodayAtResolvenWidget

NewsletterArchivePage
├── AppShell
├── MainColumn
│   ├── ArchiveHeader (title + subtitle)
│   ├── ArchiveToolbar (tabs · search · filter · grid/list)
│   ├── ResultMeta ("Showing X of Y")
│   ├── EditionGrid | EditionList
│   │   └── EditionCard
│   └── LoadMoreButton
└── RightRail
    ├── FilterEditionsPanel
    ├── PopularTopicsList
    ├── NewsletterStatsCard
    └── SubscribeCard

Shared
├── EditionCarousel
├── ReactionBar
├── CommentsSection
├── EngagementFooter (like · comment · bookmark · share)
└── EditionCard (archive)
```

State containers (data shape only, no implementation):
- `editions[]` — id, title, edition (month/year), date, readMin, cover, pages[], tags, reactions, comments, savedByMe
- `pollState`, `quizState`, `shoutoutState`, `eventsToday[]`, `ideasLatest[]`, `creatorLatest[]`
- `archiveFilters` — tab, search, year, topic, sort, view

---

## 8. Visual System Mapping

| Reference | Resolven equivalent |
|---|---|
| Bright purple primary | `--brand-purple` |
| Green accents | `--brand-green` |
| Card radius | existing `module-card` radius |
| Card shadow | existing `shadow-soft` |
| Body font | Montserrat |
| Display/italic (quotes, edition covers) | existing display italic style |
| Pill buttons | existing tab/pill component |
| Chips | existing badge component |

No new tokens are introduced. Cover gradients reuse the existing `COVER_BG` palette from `newsletter-data.ts`.

---

## 9. Usability Improvements (additive, do not alter layout)

1. **Persistent reading progress** on the carousel — a thin progress line above the dots so users see how far they are.
2. **Resume where you left off** — if a user reopens an edition, restart on the last page they viewed (per-edition, localStorage).
3. **Reaction counts as a single segmented bar** when total > 500 to reduce visual noise on heavy editions.
4. **Sticky reaction + comment bar** on mobile only, so engagement stays reachable without scrolling back to the top.
5. **Filter chips summary** on the archive — show active filters as removable chips above the grid so users always see why results are scoped.
6. **Keyboard shortcuts** on the carousel: ← →, B to bookmark, L to like, C to focus comment input.
7. **Empty states** — "My Saved" with zero items shows a friendly illustration + "Browse editions" CTA.
8. **Dark mode parity** — every card, reaction, and quote banner is verified in both themes before sign-off.

---

## 10. Out of Scope (explicitly)

- No new sidebar items beyond the five listed.
- No "Sustainability Hub" route — it is a card on the Home page only.
- No feed of multiple newsletters on the Home page — only the latest edition.
- No code generation in this stage. Implementation begins only after this plan is approved.

---

## Ready for review

Please confirm or request changes to:
1. The two-page structure (Home + Archive only).
2. The exact order of right-rail widgets.
3. The reaction set (Like · Celebrate · Inspired · Insightful · Share).
4. The "Resume where you left off" and other usability additions in §9 — keep, drop, or defer.

Once approved I'll move to implementation in a follow-up turn.
