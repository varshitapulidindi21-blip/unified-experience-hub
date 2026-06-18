import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Newspaper, Search, SlidersHorizontal, Grid3x3, List, Heart, MessageCircle,
  Bookmark, MoreHorizontal, Mail, Leaf, Lightbulb, Users as UsersIcon,
  Activity, Sparkles, ArrowRight, ChevronDown,
} from "lucide-react";
import { MobileAppHeader } from "@/components/MobileAppHeader";
import { TopBar } from "@/components/TopBar";
import { SparkleFab } from "@/components/SparkleFab";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/newsletter")({
  head: () => ({
    meta: [
      { title: "Newsletter Archive — Resolven" },
      { name: "description", content: "Catch up on every Resolven monthly newsletter — stories, milestones and impact." },
    ],
  }),
  component: NewsletterPage,
});

type TabKey = "all" | "saved";

type Edition = {
  id: string;
  title: string;
  month: string;
  year: string;
  date: string;
  readMin: number;
  excerpt: string;
  likes: number;
  comments: number;
  cover: "purple" | "green" | "lavender" | "green-light" | "deep-purple" | "deep-green";
};

const EDITIONS: Edition[] = [
  { id: "jun26", title: "Powering Progress, Shaping Tomorrow", month: "JUNE", year: "2026", date: "2 Jun 2026", readMin: 8, excerpt: "Building a sustainable future together.", likes: 128, comments: 24, cover: "purple" },
  { id: "may26", title: "Our Planet, Our Promise",            month: "MAY",  year: "2026", date: "5 May 2026", readMin: 7, excerpt: "Highlights from our sustainability journey.", likes: 112, comments: 18, cover: "green" },
  { id: "apr26", title: "Innovate. Collaborate. Accelerate.", month: "APR",  year: "2026", date: "6 Apr 2026", readMin: 6, excerpt: "Driving innovation across every touchpoint.",  likes: 104, comments: 16, cover: "deep-purple" },
  { id: "mar26", title: "People Powering Possibility",        month: "MAR",  year: "2026", date: "3 Mar 2026", readMin: 6, excerpt: "Celebrating our people and their impact.",   likes: 98,  comments: 14, cover: "lavender" },
  { id: "feb26", title: "Sustainable Solutions, Stronger Tomorrow", month: "FEB", year: "2026", date: "3 Feb 2026", readMin: 7, excerpt: "Solutions that create lasting change.",       likes: 96,  comments: 12, cover: "deep-green" },
  { id: "jan26", title: "A Brighter Future, Together",        month: "JAN",  year: "2026", date: "6 Jan 2026", readMin: 6, excerpt: "Kicking off the year with purpose and energy.", likes: 92,  comments: 10, cover: "green-light" },
  { id: "dec25", title: "Milestones That Matter",             month: "DEC",  year: "2025", date: "2 Dec 2025", readMin: 5, excerpt: "A look back at our biggest achievements.",     likes: 88,  comments: 9,  cover: "purple" },
  { id: "nov25", title: "Stronger Together, Always",          month: "NOV",  year: "2025", date: "4 Nov 2025", readMin: 5, excerpt: "Stories of collaboration and community.",     likes: 85,  comments: 8,  cover: "deep-purple" },
];

const POPULAR_TOPICS = [
  { icon: Leaf,       label: "Sustainability",   count: 12, tone: "tile-green" },
  { icon: Lightbulb,  label: "Innovation",       count: 9,  tone: "tile-lavender" },
  { icon: UsersIcon,  label: "People & Culture", count: 8,  tone: "tile-purple" },
  { icon: Activity,   label: "Operations",       count: 7,  tone: "tile-green-light" },
  { icon: Sparkles,   label: "Community",        count: 6,  tone: "tile-grey" },
];

function NewsletterPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const editions = useMemo(() => {
    const base = tab === "saved" ? EDITIONS.filter((e) => saved[e.id]) : EDITIONS;
    if (!q.trim()) return base;
    const needle = q.toLowerCase();
    return base.filter(
      (e) => e.title.toLowerCase().includes(needle) || e.excerpt.toLowerCase().includes(needle),
    );
  }, [tab, q, saved]);

  return (
    <div className="min-h-screen">
      <div className="hidden md:block"><TopBar /></div>
      <main className="mx-auto w-full max-w-[1400px] space-y-4 px-4 py-4 sm:space-y-7 sm:px-6 sm:py-8">
        <MobileAppHeader pageLabel="Newsletter" searchPlaceholder="Search newsletters…" />

        {/* Page header */}
        <header className="surface rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 animate-rise">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-start gap-3 sm:gap-4">
              <span className="tile tile-lavender h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl shrink-0">
                <Newspaper className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" strokeWidth={1.75} />
              </span>
              <div>
                <div className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Resolven Monthly
                </div>
                <h1 className="mt-1 text-xl sm:text-2xl md:text-3xl font-display italic tracking-tight">
                  <span className="text-primary dark:text-white">Newsletter</span>{" "}
                  <span className="text-accent">Archive</span>
                </h1>
                <p className="mt-1 text-xs sm:text-sm font-light text-muted-foreground max-w-prose">
                  Catch up on all our past editions and updates.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search newsletters…"
                  className="h-9 w-44 sm:w-64 rounded-full border border-border bg-card pl-9 pr-3 text-xs sm:text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                />
              </div>
              <button className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-[11px] sm:text-xs font-medium text-foreground/80 hover:border-primary/40">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5 sm:mt-6 flex items-center justify-between gap-3 border-b border-border">
            <div className="flex gap-1 sm:gap-2">
              {([
                ["all", "All Editions"],
                ["saved", "My Saved"],
              ] as const).map(([key, label]) => {
                const active = tab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={cn(
                      "relative px-3 sm:px-4 py-2.5 text-[12px] sm:text-sm font-medium transition-colors",
                      active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {label}
                    {active && (
                      <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-1 pb-2">
              <div className="text-[11px] text-muted-foreground mr-2 hidden sm:block">
                Showing {editions.length} of {EDITIONS.length}
              </div>
              <ViewToggle view={view} onChange={setView} />
            </div>
          </div>
        </header>

        {/* Main + sidebar */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1fr_320px]">
          {/* Editions grid */}
          <section className="surface rounded-2xl sm:rounded-3xl p-3 sm:p-5 animate-rise">
            {editions.length === 0 ? (
              <EmptyState />
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {editions.map((e) => (
                  <EditionCard
                    key={e.id}
                    edition={e}
                    liked={!!liked[e.id]}
                    saved={!!saved[e.id]}
                    onLike={() => setLiked((s) => ({ ...s, [e.id]: !s[e.id] }))}
                    onSave={() => setSaved((s) => ({ ...s, [e.id]: !s[e.id] }))}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {editions.map((e) => (
                  <EditionRow
                    key={e.id}
                    edition={e}
                    liked={!!liked[e.id]}
                    saved={!!saved[e.id]}
                    onLike={() => setLiked((s) => ({ ...s, [e.id]: !s[e.id] }))}
                    onSave={() => setSaved((s) => ({ ...s, [e.id]: !s[e.id] }))}
                  />
                ))}
              </div>
            )}

            <div className="mt-4 sm:mt-6 flex justify-center">
              <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground/80 hover:border-primary/40">
                Load more <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-4 sm:space-y-5">
            <SidebarCard title="Popular Topics">
              <ul className="space-y-2">
                {POPULAR_TOPICS.map((t) => (
                  <li key={t.label}>
                    <button className="group flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-muted/50">
                      <span className={cn("tile h-7 w-7 rounded-lg", t.tone)}>
                        <t.icon className="h-3.5 w-3.5" strokeWidth={1.9} />
                      </span>
                      <span className="flex-1 text-[12.5px] font-medium text-foreground">{t.label}</span>
                      <span className="text-[11px] text-muted-foreground">{t.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-medium text-primary hover:underline">
                View all topics <ArrowRight className="h-3 w-3" />
              </button>
            </SidebarCard>

            <SidebarCard title="Newsletter Stats">
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Total Editions"   value="18" />
                <Stat label="Total Reactions" value="1,248" />
                <Stat label="Total Comments"  value="256" />
                <Stat label="Saved by You"    value={String(Object.values(saved).filter(Boolean).length)} />
              </div>
            </SidebarCard>

            <SidebarCard title="Never Miss an Update" subtle="Subscribe to get the latest newsletter straight to your inbox.">
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-medium text-primary-foreground shadow-soft hover:opacity-95">
                <Mail className="h-4 w-4" /> Subscribe Now
              </button>
            </SidebarCard>
          </aside>
        </div>
      </main>
      <SparkleFab />
    </div>
  );
}

/* ---------- Sub-components ---------- */

function ViewToggle({ view, onChange }: { view: "grid" | "list"; onChange: (v: "grid" | "list") => void }) {
  return (
    <div className="inline-flex rounded-full border border-border bg-card p-0.5">
      {([
        ["grid", Grid3x3],
        ["list", List],
      ] as const).map(([key, Icon]) => {
        const active = view === key;
        return (
          <button
            key={key}
            aria-label={key === "grid" ? "Grid view" : "List view"}
            onClick={() => onChange(key)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}

const COVER_BG: Record<Edition["cover"], string> = {
  "purple":       "from-[oklch(0.48_0.18_295)] via-[oklch(0.42_0.18_295)] to-[oklch(0.32_0.16_295)]",
  "deep-purple":  "from-[oklch(0.38_0.18_295)] via-[oklch(0.30_0.16_295)] to-[oklch(0.22_0.13_295)]",
  "green":        "from-[oklch(0.62_0.16_148)] via-[oklch(0.50_0.16_148)] to-[oklch(0.36_0.13_148)]",
  "deep-green":   "from-[oklch(0.42_0.14_148)] via-[oklch(0.32_0.12_148)] to-[oklch(0.22_0.09_148)]",
  "lavender":     "from-[oklch(0.78_0.07_305)] via-[oklch(0.62_0.10_300)] to-[oklch(0.42_0.16_295)]",
  "green-light":  "from-[oklch(0.82_0.14_132)] via-[oklch(0.70_0.16_138)] to-[oklch(0.50_0.16_148)]",
};

function EditionCard({
  edition, liked, saved, onLike, onSave,
}: {
  edition: Edition;
  liked: boolean; saved: boolean;
  onLike: () => void; onSave: () => void;
}) {
  return (
    <article className="module-card overflow-hidden rounded-2xl p-0">
      <div className={cn("relative aspect-[4/3] bg-gradient-to-br p-4 text-white", COVER_BG[edition.cover])}>
        <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
          Newsletter
        </span>
        <h3 className="mt-3 font-display text-[1.05rem] sm:text-[1.2rem] font-semibold leading-tight tracking-tight line-clamp-3">
          {edition.title}
        </h3>
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">
              {edition.month} {edition.year}
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">
              Edition
            </div>
          </div>
          <span className="h-[3px] w-10 rounded-full bg-white/70" />
        </div>
      </div>

      <div className="p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[12.5px] font-semibold text-foreground truncate">
              {edition.month.charAt(0) + edition.month.slice(1).toLowerCase()} {edition.year} Edition
            </div>
            <div className="mt-0.5 text-[10.5px] text-muted-foreground">
              {edition.date} · {edition.readMin} min read
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground" aria-label="More">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-[12px] leading-snug text-muted-foreground line-clamp-2">
          {edition.excerpt}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <button onClick={onLike} className={cn("inline-flex items-center gap-1 hover:text-foreground", liked && "text-accent")}>
              <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} /> {edition.likes + (liked ? 1 : 0)}
            </button>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" /> {edition.comments}
            </span>
          </div>
          <button onClick={onSave} className={cn("text-muted-foreground hover:text-foreground", saved && "text-primary")} aria-label="Save">
            <Bookmark className={cn("h-3.5 w-3.5", saved && "fill-current")} />
          </button>
        </div>
      </div>
    </article>
  );
}

function EditionRow({
  edition, liked, saved, onLike, onSave,
}: {
  edition: Edition;
  liked: boolean; saved: boolean;
  onLike: () => void; onSave: () => void;
}) {
  return (
    <article className="module-card flex gap-3 sm:gap-4 items-center p-2.5 sm:p-3 rounded-xl">
      <div className={cn("relative h-16 w-20 sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br", COVER_BG[edition.cover])}>
        <div className="absolute bottom-1 left-1.5 text-[8.5px] font-semibold uppercase tracking-wider text-white/85">
          {edition.month} {edition.year}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-foreground truncate">{edition.title}</div>
        <div className="mt-0.5 text-[10.5px] text-muted-foreground">{edition.date} · {edition.readMin} min read</div>
        <p className="mt-1 text-[12px] text-muted-foreground line-clamp-1">{edition.excerpt}</p>
      </div>
      <div className="hidden sm:flex items-center gap-3 text-[11px] text-muted-foreground">
        <button onClick={onLike} className={cn("inline-flex items-center gap-1", liked && "text-accent")}>
          <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} /> {edition.likes + (liked ? 1 : 0)}
        </button>
        <span className="inline-flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5" /> {edition.comments}
        </span>
        <button onClick={onSave} className={cn(saved && "text-primary")} aria-label="Save">
          <Bookmark className={cn("h-3.5 w-3.5", saved && "fill-current")} />
        </button>
      </div>
    </article>
  );
}

function SidebarCard({
  title, subtle, children,
}: { title: string; subtle?: string; children: React.ReactNode }) {
  return (
    <div className="surface rounded-2xl p-4 sm:p-5 animate-rise">
      <div className="text-[13px] font-semibold tracking-tight text-foreground">{title}</div>
      {subtle && <p className="mt-1 text-[11.5px] font-light text-muted-foreground">{subtle}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-2.5">
      <div className="text-base sm:text-lg font-semibold text-primary">{value}</div>
      <div className="mt-0.5 text-[10.5px] text-muted-foreground">{label}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="tile tile-lavender h-12 w-12 rounded-2xl">
        <Bookmark className="h-5 w-5" strokeWidth={1.7} />
      </span>
      <div className="mt-3 text-sm font-semibold text-foreground">Nothing saved yet</div>
      <p className="mt-1 max-w-xs text-[12px] text-muted-foreground">
        Tap the bookmark on any edition to save it here for later.
      </p>
    </div>
  );
}
