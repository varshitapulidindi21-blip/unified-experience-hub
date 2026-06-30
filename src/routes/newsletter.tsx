import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, Bookmark, Calendar, ChevronRight, Clock, Flame,
  Heart, Home, Lightbulb, MessageCircle, MoreHorizontal, Moon, PartyPopper,
  Quote as QuoteIcon, Send, Share2, Smile, Sparkles, Sun, Trophy, User as UserIcon,
  Leaf, ArrowUpRight, Plus, Megaphone, FileText,
} from "lucide-react";
import { MobileAppHeader } from "@/components/MobileAppHeader";
import { SparkleFab } from "@/components/SparkleFab";
import { cn } from "@/lib/utils";
import {
  EDITIONS, COVER_BG, LEADERSHIP_QUOTE, IMPACT_STATS,
  EMPLOYEE_SHOUTOUT, QUICK_POLL, MINI_QUIZ, EVENTS, LATEST_IDEA, TODAY_AT_RESOLVEN,
  CREATOR_PREVIEWS,
  type Edition, type EditionPage, type EventStatus, type CreatorKind,
} from "@/lib/newsletter-data";
import { Camera, PenLine, Video, Brush, BookOpen, FileText as FileText2 } from "lucide-react";

export const Route = createFileRoute("/newsletter")({
  validateSearch: (s: Record<string, unknown>) => ({
    edition: typeof s.edition === "string" ? s.edition : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Newsletter — Resolven" },
      { name: "description", content: "The latest edition of the Resolven newsletter — stories, leadership voices and sustainability updates." },
    ],
  }),
  component: NewsletterLayout,
});

/* Layout wrapper: index renders Home; child routes (/archive, /$id) use Outlet */
function NewsletterLayout() {
  const matches = useMatches();
  const isLeaf = matches[matches.length - 1]?.routeId === "/newsletter";
  return isLeaf ? <NewsletterHome /> : <Outlet />;
}


/* ============================================================
   Branded hero (shared with archive + detail via re-export)
   ============================================================ */
function HeroThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.classList.contains("dark")); }, []);
  const toggle = () => {
    const next = !dark; setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("resolven-theme", next ? "dark" : "light"); } catch { /* noop */ }
  };
  return (
    <button onClick={toggle} aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center text-white/85 hover:text-white transition">
      {dark ? <Sun className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.9} /> : <Moon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.9} />}
    </button>
  );
}

export function NewsletterHero({ title = "Newsletter", backTo = "/modules" }: { title?: string; backTo?: string }) {
  return (
    <header className="travel-hero relative w-full overflow-hidden border-b border-white/10 shadow-soft">
      <div className="travel-hero-atmosphere pointer-events-none absolute inset-0 mix-blend-screen" />
      <div className="relative mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <Link to={backTo} aria-label="Back"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/85 hover:text-white hover:bg-white/10 transition">
            <ArrowLeft className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
          </Link>
          <h1 className="font-display italic font-bold tracking-tight text-white text-[1.1rem] sm:text-[1.35rem] md:text-[1.5rem] leading-none truncate">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <HeroThemeToggle />
          <Link to="/" aria-label="Home"
            className="inline-flex h-9 w-9 items-center justify-center text-white/85 hover:text-white transition">
            <Home className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.9} />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   HOME — single latest edition (Instagram-style carousel post)
   + reactions, comments, leadership quote, sustainability hub
   + right rail of engagement widgets
   ============================================================ */
function NewsletterHome() {
  const latest = EDITIONS.find((e) => e.featured) ?? EDITIONS[0];

  return (
    <div className="min-h-screen">
      <div className="hidden md:block"><NewsletterHero /></div>
      <main className="mx-auto w-full max-w-[1400px] space-y-5 px-4 py-4 sm:space-y-7 sm:px-6 sm:py-8">
        <MobileAppHeader pageLabel="Newsletter" />

        {/* Top utility row: archive entry */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Latest edition
            </div>
            <div className="mt-0.5 text-[12.5px] text-muted-foreground">
              {latest.month} {latest.year} · {latest.readMin} min read
            </div>
          </div>
          <Link to="/newsletter/archive"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-card px-4 h-9 text-[12px] font-medium text-foreground/80 hover:border-primary/40 hover:text-foreground transition">
            View archive <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-[1fr_340px]">
          {/* MAIN COLUMN */}
          <div className="space-y-5 sm:space-y-6">
            <LatestEditionCard edition={latest} />
            <LeadershipQuoteBanner />
            <SustainabilityHubCard />
          </div>

          {/* RIGHT RAIL */}
          <aside className="space-y-4">
            <EmployeeShoutoutWidget />
            <QuickPollWidget />
            <MiniQuizWidget />
            <WhatsHappeningWidget />
            <IdeasBoxWidget />
            <CreatorsCanvasWidget />
            <TodayAtResolvenWidget />
          </aside>
        </div>
      </main>
      <SparkleFab />
    </div>
  );
}

/* ============================================================
   Latest edition card — header, carousel, meta, reactions, comments
   ============================================================ */
function LatestEditionCard({ edition }: { edition: Edition }) {
  const [saved, setSaved] = useState(false);
  const pages: EditionPage[] = edition.pages ?? [
    { kicker: `${edition.month} ${edition.year} EDITION`, title: edition.title, subtitle: edition.excerpt },
  ];

  return (
    <article className="surface overflow-hidden rounded-2xl sm:rounded-3xl animate-rise">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <div className="text-[15px] sm:text-base font-semibold tracking-tight text-foreground">
            Resolven Newsletter
          </div>
          <div className="mt-0.5 text-[12px] font-medium text-primary">
            {edition.month.charAt(0) + edition.month.slice(1).toLowerCase()} {edition.year} Edition
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setSaved((s) => !s)} aria-label="Bookmark edition"
            className={cn("inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition",
              saved && "text-primary")}>
            <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
          </button>
          <button aria-label="More options"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <EditionCarousel edition={edition} pages={pages} />

      {/* Meta strip */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-4 sm:px-5 pt-3 text-[11.5px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {edition.date}</span>
        <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {edition.readMin} min read</span>
        <span className="inline-flex items-center gap-1.5"><UserIcon className="h-3.5 w-3.5" /> By {edition.author ?? "Brand Team"}</span>
      </div>

      {/* Reaction bar */}
      <ReactionBar baseLikes={edition.likes} />

      {/* Comments */}
      <CommentsSection commentCount={edition.comments} />
    </article>
  );
}

/* ---------- Edition carousel (drag / swipe / arrows / dots / keys) ---------- */
function EditionCarousel({ edition, pages }: { edition: Edition; pages: EditionPage[] }) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Resume where you left off (per-edition)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`resolven:nl:${edition.id}:page`);
      if (raw) {
        const n = parseInt(raw, 10);
        if (!Number.isNaN(n) && n >= 0 && n < pages.length) setIndex(n);
      }
    } catch { /* noop */ }
  }, [edition.id, pages.length]);

  useEffect(() => {
    try { localStorage.setItem(`resolven:nl:${edition.id}:page`, String(index)); } catch { /* noop */ }
  }, [edition.id, index]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) return;
      }
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIndex((i) => Math.min(pages.length - 1, i + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pages.length]);

  const go = (n: number) => setIndex(Math.max(0, Math.min(pages.length - 1, n)));

  // Pointer drag
  const drag = useRef<{ startX: number; active: boolean }>({ startX: 0, active: false });
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { startX: e.clientX, active: true };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.active = false;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="px-4 sm:px-5">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { drag.current.active = false; }}
        ref={trackRef}>
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {pages.map((p, i) => (
            <CarouselSlide key={i} cover={edition.cover} page={p} pageIndex={i} total={pages.length} />
          ))}
        </div>

        {/* Arrows (desktop) */}
        <button onClick={() => go(index - 1)} aria-label="Previous page"
          disabled={index === 0}
          className="hidden sm:inline-flex absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-soft hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed">
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        </button>
        <button onClick={() => go(index + 1)} aria-label="Next page"
          disabled={index === pages.length - 1}
          className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-soft hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed">
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      {/* Progress + dots */}
      <div className="mt-3 flex items-center justify-center gap-3">
        <div className="hidden sm:block h-[3px] w-24 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((index + 1) / pages.length) * 100}%` }} />
        </div>
        <div className="flex items-center gap-1.5">
          {pages.map((_, i) => (
            <button key={i} aria-label={`Go to page ${i + 1}`} onClick={() => go(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-primary" : "w-1.5 bg-muted hover:bg-muted-foreground/40",
              )} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CarouselSlide({
  cover, page, pageIndex, total,
}: { cover: Edition["cover"]; page: EditionPage; pageIndex: number; total: number }) {
  return (
    <div className="w-full shrink-0 select-none">
      <div className={cn(
        "relative aspect-[16/9] sm:aspect-[16/8] bg-gradient-to-br p-5 sm:p-8 md:p-10 text-white",
        COVER_BG[cover],
      )}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.20),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Page counter */}
        <div className="relative inline-flex items-center rounded-full bg-black/45 backdrop-blur px-2.5 py-0.5 text-[10.5px] font-medium">
          {pageIndex + 1} / {total}
        </div>

        {/* Slide content */}
        <div className="relative mt-auto flex h-full flex-col justify-end max-w-2xl">
          {page.kicker && (
            <div className="text-[10.5px] sm:text-[11px] font-medium uppercase tracking-[0.22em] text-white/80">
              {page.kicker}
            </div>
          )}
          <h3 className="mt-1.5 font-display italic font-bold leading-[1.05] tracking-tight text-[1.4rem] sm:text-[2rem] md:text-[2.5rem] whitespace-pre-line">
            {page.title}
          </h3>
          {page.subtitle && (
            <p className="mt-2 max-w-xl text-[12.5px] sm:text-base text-white/85 font-light">
              {page.subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Reaction bar ---------- */
type ReactionKey = "like" | "celebrate" | "inspired" | "insightful";
const REACTIONS: { key: ReactionKey; label: string; icon: React.ComponentType<{ className?: string }>; tint: string }[] = [
  { key: "like",       label: "Like",       icon: Heart,       tint: "text-rose-500" },
  { key: "celebrate",  label: "Celebrate",  icon: PartyPopper, tint: "text-amber-500" },
  { key: "inspired",   label: "Inspired",   icon: Flame,       tint: "text-orange-500" },
  { key: "insightful", label: "Insightful", icon: Lightbulb,   tint: "text-yellow-500" },
];

function ReactionBar({ baseLikes }: { baseLikes: number }) {
  const [active, setActive] = useState<ReactionKey | null>(null);
  const baseCounts: Record<ReactionKey, number> = {
    like: baseLikes, celebrate: 84, inspired: 64, insightful: 42,
  };
  return (
    <div className="border-t border-border/60 px-4 sm:px-5 pt-3">
      <div className="mb-2 text-[11.5px] font-medium text-foreground/80">
        How do you feel about this newsletter?
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {REACTIONS.map((r) => {
          const isActive = active === r.key;
          const count = baseCounts[r.key] + (isActive ? 1 : 0);
          return (
            <button key={r.key} onClick={() => setActive(isActive ? null : r.key)}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-medium transition",
                isActive
                  ? "border-primary/40 bg-primary/8 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30",
              )}>
              <r.icon className={cn("h-4 w-4", isActive ? r.tint : "")} />
              <span>{r.label}</span>
              <span className="ml-1 text-foreground/60">{count}</span>
            </button>
          );
        })}
        <button className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition">
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>
    </div>
  );
}

/* ---------- Comments ---------- */
type Comment = { name: string; initials: string; ago: string; body: string; likes: number };
const SEED_COMMENTS: Comment[] = [
  { name: "Rohit Sharma", initials: "RS", ago: "2h ago", body: "Amazing progress! Proud to be part of this journey.", likes: 12 },
  { name: "Neha Verma",   initials: "NV", ago: "3h ago", body: "The sustainability initiatives are truly inspiring!",  likes: 8 },
];

function CommentsSection({ commentCount }: { commentCount: number }) {
  const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS);
  const [draft, setDraft] = useState("");
  const [likedC, setLikedC] = useState<Record<number, boolean>>({});
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? comments : comments.slice(0, 2);

  const submit = () => {
    const body = draft.trim();
    if (!body) return;
    setComments((cs) => [{ name: "You", initials: "YO", ago: "now", body, likes: 0 }, ...cs]);
    setDraft("");
  };

  return (
    <div className="border-t border-border/60 mt-3 px-4 sm:px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-semibold text-foreground">Comments ({commentCount})</div>
        <button className="text-[11.5px] text-muted-foreground hover:text-foreground">Most recent</button>
      </div>

      {/* Composer */}
      <div className="mt-3 flex items-start gap-2.5">
        <Avatar initials="YO" />
        <div className="flex-1 flex items-center gap-1 rounded-full border border-border bg-card pl-3 pr-1 py-1">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder="Write a comment…"
            className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
          />
          <button aria-label="Emoji" className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground">
            <Smile className="h-4 w-4" />
          </button>
          <button onClick={submit} aria-label="Send"
            disabled={!draft.trim()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40">
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Thread */}
      <ul className="mt-4 space-y-3.5">
        {visible.map((c, i) => {
          const liked = !!likedC[i];
          const likes = c.likes + (liked ? 1 : 0);
          return (
            <li key={i} className="flex items-start gap-2.5">
              <Avatar initials={c.initials} />
              <div className="min-w-0 flex-1">
                <div className="rounded-2xl bg-muted/50 px-3 py-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[12.5px] font-semibold text-foreground">{c.name}</span>
                    <span className="text-[10.5px] text-muted-foreground">{c.ago}</span>
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-foreground/90">{c.body}</p>
                </div>
                <div className="mt-1 flex items-center gap-3 pl-3 text-[11px] text-muted-foreground">
                  <button onClick={() => setLikedC((s) => ({ ...s, [i]: !s[i] }))}
                    className={cn("hover:text-foreground", liked && "text-accent font-medium")}>
                    Like
                  </button>
                  <button className="hover:text-foreground">Reply</button>
                  <span className="inline-flex items-center gap-1">
                    <Heart className={cn("h-3 w-3", liked && "fill-current text-accent")} /> {likes}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {comments.length > 2 && (
        <button onClick={() => setShowAll((s) => !s)}
          className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline">
          {showAll ? "Show fewer" : `View all comments`}
          <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", showAll && "rotate-90")} />
        </button>
      )}
    </div>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-primary to-[oklch(0.32_0.16_295)] text-white flex items-center justify-center text-[10.5px] font-semibold">
      {initials}
    </div>
  );
}

/* ============================================================
   Leadership quote banner (full-width)
   ============================================================ */
function LeadershipQuoteBanner() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 animate-rise"
      style={{ background: "linear-gradient(135deg, oklch(0.42 0.18 295) 0%, oklch(0.26 0.14 295) 100%)" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.14),transparent_55%)]" />
      <div className="relative grid grid-cols-[1fr_auto] gap-5 sm:gap-7 items-center text-white">
        <div className="min-w-0">
          <QuoteIcon className="h-6 w-6 text-white/55" />
          <p className="mt-2 font-display italic text-base sm:text-xl md:text-2xl leading-snug font-medium">
            "{LEADERSHIP_QUOTE.text}"
          </p>
          <div className="mt-3 text-[12px] sm:text-sm font-medium">— {LEADERSHIP_QUOTE.author}</div>
          <div className="text-[11px] sm:text-xs text-white/75">{LEADERSHIP_QUOTE.role}</div>
        </div>
        <div className="hidden sm:flex h-20 w-20 md:h-28 md:w-28 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur ring-1 ring-white/20 font-display italic font-bold text-2xl md:text-3xl">
          {LEADERSHIP_QUOTE.initials}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Sustainability Hub card (content card on home, not a route)
   ============================================================ */
function SustainabilityHubCard() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <article className="surface overflow-hidden rounded-2xl sm:rounded-3xl animate-rise">
      <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="tile tile-green h-10 w-10 rounded-xl">
            <Leaf className="h-4 w-4" strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <div className="text-[14px] font-semibold tracking-tight text-foreground">Sustainability Hub</div>
            <div className="text-[11px] text-muted-foreground">Yesterday</div>
          </div>
        </div>
        <button aria-label="More options"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 sm:px-5 pb-4">
        <h3 className="font-display italic text-[1.15rem] sm:text-[1.4rem] font-bold tracking-tight leading-tight">
          Our Impact <span className="text-accent">in Numbers</span>
        </h3>
        <p className="mt-1 text-[12.5px] text-muted-foreground">A look at the difference we're making together.</p>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {IMPACT_STATS.map((s, i) => (
            <div key={s.l} className={cn(
              "rounded-xl border border-border/60 p-3 sm:p-4 text-center",
              i === 0 && "bg-[oklch(0.92_0.10_148_/_0.45)]",
              i === 1 && "bg-[oklch(0.92_0.05_240_/_0.45)]",
              i === 2 && "bg-[oklch(0.94_0.08_70_/_0.45)]",
              i === 3 && "bg-[oklch(0.92_0.09_148_/_0.30)]",
            )}>
              <div className="text-base sm:text-xl font-semibold text-foreground">{s.v}</div>
              <div className="mt-0.5 text-[10.5px] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/60 px-4 sm:px-5 py-3 text-[12px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <button onClick={() => setLiked((s) => !s)}
            className={cn("inline-flex items-center gap-1.5 hover:text-foreground", liked && "text-accent")}>
            <Heart className={cn("h-4 w-4", liked && "fill-current")} /> {96 + (liked ? 1 : 0)}
          </button>
          <span className="inline-flex items-center gap-1.5"><MessageCircle className="h-4 w-4" /> 18</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setSaved((s) => !s)} aria-label="Save"
            className={cn("inline-flex h-8 w-8 items-center justify-center rounded-full hover:text-foreground hover:bg-muted/60",
              saved && "text-primary")}>
            <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
          </button>
          <button aria-label="Share"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:text-foreground hover:bg-muted/60">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   Right-rail widgets
   ============================================================ */
function RailCard({ title, action, children }: { title: string; action?: { label: string; onClick?: () => void }; children: React.ReactNode }) {
  return (
    <div className="surface rounded-2xl p-4 animate-rise">
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-semibold tracking-tight text-foreground">{title}</div>
        {action && (
          <button onClick={action.onClick}
            className="text-[11px] font-medium text-primary hover:underline">
            {action.label}
          </button>
        )}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function EmployeeShoutoutWidget() {
  return (
    <RailCard title="Employee Shoutout" action={{ label: "View all" }}>
      <div className="flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-[oklch(0.32_0.16_295)] text-white flex items-center justify-center text-base font-semibold ring-4 ring-primary/10">
          {EMPLOYEE_SHOUTOUT.initials}
        </div>
        <div className="mt-2 text-[13px] font-semibold text-foreground">{EMPLOYEE_SHOUTOUT.name}</div>
        <div className="text-[11px] text-muted-foreground">{EMPLOYEE_SHOUTOUT.role}</div>
        <p className="mt-2 text-[11.5px] leading-snug text-foreground/80 max-w-[18rem]">
          {EMPLOYEE_SHOUTOUT.message}
        </p>
        <button className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-primary/40 px-3 py-2 text-[12px] font-medium text-primary hover:bg-primary/8">
          <Megaphone className="h-3.5 w-3.5" /> Give Shoutout
        </button>
      </div>
    </RailCard>
  );
}

function QuickPollWidget() {
  const [pick, setPick] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);
  // Mock distribution for results
  const dist: Record<string, number> = { solar: 28, wind: 41, store: 18, ev: 13 };
  return (
    <RailCard title="Quick Poll" action={{ label: "View all" }}>
      <div className="text-[12.5px] font-medium text-foreground/90">{QUICK_POLL.question}</div>
      <ul className="mt-2.5 space-y-1.5">
        {QUICK_POLL.options.map((o) => {
          const selected = pick === o.id;
          if (voted) {
            const pct = dist[o.id] ?? 0;
            return (
              <li key={o.id} className={cn(
                "relative overflow-hidden rounded-lg border px-2.5 py-1.5 text-[12px]",
                selected ? "border-primary/40 bg-primary/8" : "border-border bg-card",
              )}>
                <div className="absolute inset-y-0 left-0 bg-primary/15" style={{ width: `${pct}%` }} />
                <div className="relative flex items-center justify-between">
                  <span className="text-foreground/90">{o.label}</span>
                  <span className="text-foreground/70 font-medium">{pct}%</span>
                </div>
              </li>
            );
          }
          return (
            <li key={o.id}>
              <button onClick={() => setPick(o.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[12px] transition",
                  selected ? "border-primary/40 bg-primary/8 text-foreground"
                           : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30",
                )}>
                <span className={cn(
                  "h-3.5 w-3.5 rounded-full border flex items-center justify-center",
                  selected ? "border-primary" : "border-border",
                )}>
                  {selected && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </span>
                <span className="flex-1">{o.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <button
        onClick={() => pick && setVoted(true)}
        disabled={!pick || voted}
        className="mt-3 w-full rounded-xl bg-primary px-3 py-2 text-[12.5px] font-medium text-primary-foreground disabled:opacity-50">
        {voted ? "Thanks for voting" : "Vote Now"}
      </button>
      <div className="mt-2 text-center text-[10.5px] text-muted-foreground">{QUICK_POLL.totalVotes} votes</div>
    </RailCard>
  );
}

function MiniQuizWidget() {
  const [pick, setPick] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  return (
    <RailCard title="Mini Quiz" action={{ label: "View all" }}>
      <div className="text-[12.5px] font-medium text-foreground/90">{MINI_QUIZ.question}</div>
      <ul className="mt-2.5 space-y-1.5">
        {MINI_QUIZ.options.map((o) => {
          const selected = pick === o.id;
          const status =
            revealed && selected && o.correct ? "ring-2 ring-accent/60 bg-accent/10 text-foreground"
            : revealed && selected && !o.correct ? "ring-2 ring-destructive/50 bg-destructive/10 text-foreground"
            : revealed && o.correct ? "ring-2 ring-accent/40 bg-accent/5 text-foreground"
            : selected ? "border-primary/40 bg-primary/8 text-foreground"
            : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30";
          return (
            <li key={o.id}>
              <button onClick={() => !revealed && setPick(o.id)}
                className={cn("flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[12px] transition", status)}>
                <span className={cn(
                  "h-3.5 w-3.5 rounded-full border flex items-center justify-center",
                  selected ? "border-primary" : "border-border",
                )}>
                  {selected && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </span>
                <span className="flex-1">{o.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <button
        onClick={() => pick && setRevealed(true)}
        disabled={!pick || revealed}
        className="mt-3 w-full rounded-xl border border-primary/40 px-3 py-2 text-[12.5px] font-medium text-primary hover:bg-primary/8 disabled:opacity-50">
        {revealed ? "Answer revealed" : "Play Quiz"}
      </button>
      <div className="mt-2 text-center text-[10.5px] text-muted-foreground">{MINI_QUIZ.participants} participants</div>
    </RailCard>
  );
}

function WhatsHappeningWidget() {
  const toneClass: Record<string, string> = {
    purple: "tile-purple", green: "tile-green", lavender: "tile-lavender",
  };
  const [seg, setSeg] = useState<EventStatus>("upcoming");
  const segs: { key: EventStatus; label: string }[] = [
    { key: "upcoming",  label: "Upcoming"  },
    { key: "ongoing",   label: "Ongoing"   },
    { key: "completed", label: "Completed" },
  ];
  const stateTag: Record<EventStatus, string> = {
    upcoming:  "bg-primary/10 text-primary",
    ongoing:   "bg-accent/15 text-accent",
    completed: "bg-muted text-muted-foreground",
  };
  const items = EVENTS.filter((e) => e.status === seg);
  return (
    <RailCard title="What's Happening" action={{ label: "View calendar" }}>
      <div className="mb-2.5 inline-flex rounded-full border border-border bg-card p-0.5">
        {segs.map((s) => (
          <button key={s.key} onClick={() => setSeg(s.key)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10.5px] font-medium transition",
              seg === s.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}>
            {s.label}
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <div className="text-[11.5px] text-muted-foreground">Nothing to show right now.</div>
      ) : (
        <ul className="space-y-2.5">
          {items.map((e) => (
            <li key={e.id} className="flex items-center gap-2.5">
              <span className={cn("tile h-9 w-9 rounded-lg", toneClass[e.tone])}>
                <Calendar className="h-4 w-4" strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="text-[12.5px] font-medium text-foreground truncate">{e.title}</div>
                  <span className={cn("rounded-full px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide", stateTag[e.status])}>
                    {e.status === "upcoming" ? "Soon" : e.status === "ongoing" ? "Live" : "Done"}
                  </span>
                </div>
                <div className="text-[10.5px] text-muted-foreground">{e.date}{e.time && e.time !== "—" ? ` · ${e.time}` : ""}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </RailCard>
  );
}

function IdeasBoxWidget() {
  const statusTone: Record<string, string> = {
    "New":       "bg-accent/15 text-accent",
    "In Review": "bg-primary/10 text-primary",
    "Adopted":   "bg-emerald-500/15 text-emerald-600",
  };
  return (
    <RailCard title="Ideas Box" action={{ label: "View all" }}>
      <div className="rounded-xl border border-border bg-card p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="text-[12.5px] font-semibold text-foreground">{LATEST_IDEA.title}</div>
          <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide", statusTone[LATEST_IDEA.status])}>
            {LATEST_IDEA.status}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> {LATEST_IDEA.upvotes} upvotes</span>
          <span className="inline-flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {LATEST_IDEA.comments} comments</span>
        </div>
        <button className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/40 px-3 py-1.5 text-[11.5px] font-medium text-primary hover:bg-primary/8">
          View Discussion <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </RailCard>
  );
}

function CreatorsCanvasWidget() {
  const kindIcon: Record<CreatorKind, React.ComponentType<{ className?: string }>> = {
    photo: Camera, writing: PenLine, sketch: Brush, video: Video, poetry: BookOpen, article: FileText2,
  };
  return (
    <RailCard title="Creator's Canvas" action={{ label: "View all" }}>
      <div className="grid grid-cols-3 gap-2">
        {CREATOR_PREVIEWS.slice(0, 6).map((c) => {
          const Icon = kindIcon[c.kind];
          return (
            <button key={c.id}
              className={cn(
                "group relative overflow-hidden rounded-xl aspect-square text-left text-white bg-gradient-to-br",
                COVER_BG[c.cover],
              )}>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <span className="absolute top-1.5 left-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/40 backdrop-blur">
                <Icon className="h-3 w-3" />
              </span>
              <div className="absolute bottom-1.5 left-1.5 right-1.5">
                <div className="text-[9.5px] font-semibold leading-tight line-clamp-2">{c.title}</div>
                <div className="text-[8.5px] text-white/75 truncate">{c.author}</div>
              </div>
            </button>
          );
        })}
      </div>
    </RailCard>
  );
}


function TodayAtResolvenWidget() {
  return (
    <RailCard title="Today at Resolven">
      <ul className="text-[11.5px] text-muted-foreground space-y-1">
        {TODAY_AT_RESOLVEN.map((row) => (
          <li key={row.l} className="flex items-baseline gap-2">
            <span className="text-foreground font-semibold">{row.v}</span>
            <span>{row.l}</span>
          </li>
        ))}
      </ul>
    </RailCard>
  );
}

/* Re-exports for archive + detail */
export { EDITIONS, COVER_BG };
export type { Edition, Category };
