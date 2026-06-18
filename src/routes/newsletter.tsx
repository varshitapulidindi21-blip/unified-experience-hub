import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Newspaper, Search, SlidersHorizontal, Grid3x3, List, Heart, MessageCircle,
  Bookmark, MoreHorizontal, Mail, Leaf, Lightbulb, Users as UsersIcon,
  Activity, Sparkles, ArrowRight, ChevronDown, Home, Moon, Sun, X,
} from "lucide-react";
import { MobileAppHeader } from "@/components/MobileAppHeader";
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
type Category = "Sustainability" | "Innovation" | "People & Culture" | "Operations" | "Community";

export type Edition = {
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
  category: Category;
};

export const EDITIONS: Edition[] = [
  { id: "jun26", title: "Powering Progress, Shaping Tomorrow", month: "JUNE", year: "2026", date: "2 Jun 2026", readMin: 8, excerpt: "Building a sustainable future together.", likes: 128, comments: 24, cover: "purple", category: "Sustainability" },
  { id: "may26", title: "Our Planet, Our Promise",            month: "MAY",  year: "2026", date: "5 May 2026", readMin: 7, excerpt: "Highlights from our sustainability journey.", likes: 112, comments: 18, cover: "green", category: "Sustainability" },
  { id: "apr26", title: "Innovate. Collaborate. Accelerate.", month: "APR",  year: "2026", date: "6 Apr 2026", readMin: 6, excerpt: "Driving innovation across every touchpoint.",  likes: 104, comments: 16, cover: "deep-purple", category: "Innovation" },
  { id: "mar26", title: "People Powering Possibility",        month: "MAR",  year: "2026", date: "3 Mar 2026", readMin: 6, excerpt: "Celebrating our people and their impact.",   likes: 98,  comments: 14, cover: "lavender", category: "People & Culture" },
  { id: "feb26", title: "Sustainable Solutions, Stronger Tomorrow", month: "FEB", year: "2026", date: "3 Feb 2026", readMin: 7, excerpt: "Solutions that create lasting change.",       likes: 96,  comments: 12, cover: "deep-green", category: "Sustainability" },
  { id: "jan26", title: "A Brighter Future, Together",        month: "JAN",  year: "2026", date: "6 Jan 2026", readMin: 6, excerpt: "Kicking off the year with purpose and energy.", likes: 92,  comments: 10, cover: "green-light", category: "Community" },
  { id: "dec25", title: "Milestones That Matter",             month: "DEC",  year: "2025", date: "2 Dec 2025", readMin: 5, excerpt: "A look back at our biggest achievements.",     likes: 88,  comments: 9,  cover: "purple", category: "Operations" },
  { id: "nov25", title: "Stronger Together, Always",          month: "NOV",  year: "2025", date: "4 Nov 2025", readMin: 5, excerpt: "Stories of collaboration and community.",     likes: 85,  comments: 8,  cover: "deep-purple", category: "Community" },
];

const POPULAR_TOPICS: { icon: typeof Leaf; label: Category; tone: string }[] = [
  { icon: Leaf,       label: "Sustainability",   tone: "tile-green" },
  { icon: Lightbulb,  label: "Innovation",       tone: "tile-lavender" },
  { icon: UsersIcon,  label: "People & Culture", tone: "tile-purple" },
  { icon: Activity,   label: "Operations",       tone: "tile-green-light" },
  { icon: Sparkles,   label: "Community",        tone: "tile-grey" },
];

/* ---------- Branded hero (compact, mirrors Travel/Claims) ---------- */
function HeroThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.classList.contains("dark")); }, []);
  const toggle = () => {
    const next = !dark; setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("resolven-theme", next ? "dark" : "light"); } catch {}
  };
  return (
    <button onClick={toggle} aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center text-white/85 transition-all duration-200 hover:text-white hover:-translate-y-0.5">
      {dark ? <Sun className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.9} /> : <Moon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.9} />}
    </button>
  );
}

function BrandedHero({ title = "Newsletter Archive" }: { title?: string }) {
  return (
    <header className="travel-hero relative w-full overflow-hidden border-b border-white/10 shadow-soft">
      <div className="travel-hero-atmosphere pointer-events-none absolute inset-0 mix-blend-screen" />
      <div className="relative mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <Link to="/modules" aria-label="Back"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/85 hover:text-white hover:bg-white/10 transition">
            <ArrowRight className="h-[1.05rem] w-[1.05rem] rotate-180" strokeWidth={2} />
          </Link>
          <h1 className="font-display italic font-bold tracking-tight text-white text-[1.15rem] sm:text-[1.35rem] md:text-[1.5rem] leading-none truncate">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <HeroThemeToggle />
          <Link to="/" aria-label="Home"
            className="inline-flex h-9 w-9 items-center justify-center text-white/85 transition-all duration-200 hover:text-white hover:-translate-y-0.5">
            <Home className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.9} />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------- Page ---------- */
function NewsletterPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");
  const [year, setYear] = useState<string>("all");
  const [topic, setTopic] = useState<string>("all");
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [filterOpen, setFilterOpen] = useState(false);

  const editions = useMemo(() => {
    let base = tab === "saved" ? EDITIONS.filter((e) => saved[e.id]) : EDITIONS;
    if (year !== "all") base = base.filter((e) => e.year === year);
    if (topic !== "all") base = base.filter((e) => e.category === topic);
    if (q.trim()) {
      const n = q.toLowerCase();
      base = base.filter((e) =>
        e.title.toLowerCase().includes(n) ||
        e.excerpt.toLowerCase().includes(n) ||
        e.category.toLowerCase().includes(n),
      );
    }
    return base;
  }, [tab, q, saved, year, topic]);

  const years = Array.from(new Set(EDITIONS.map((e) => e.year)));

  return (
    <div className="min-h-screen">
      <div className="hidden md:block"><BrandedHero /></div>
      <main className="mx-auto w-full max-w-[1400px] space-y-4 px-4 py-4 sm:space-y-7 sm:px-6 sm:py-8">
        <MobileAppHeader pageLabel="Newsletter" />

        {/* Tabs row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs tab={tab} onChange={setTab} />
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search newsletters…"
                className="h-9 w-full sm:w-64 rounded-full border border-border bg-card pl-9 pr-3 text-xs sm:text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <button onClick={() => setFilterOpen(true)}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-[11px] sm:text-xs font-medium text-foreground/80 hover:border-primary/40">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
            </button>
            <div className="hidden sm:block"><ViewToggle view={view} onChange={setView} /></div>
          </div>
        </div>

        {/* Main + sidebar */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1fr_320px]">
          <section className="animate-rise">
            <div className="mb-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Showing {editions.length} of {EDITIONS.length} editions</span>
              {(year !== "all" || topic !== "all") && (
                <button onClick={() => { setYear("all"); setTopic("all"); }}
                  className="text-primary hover:underline">Clear filters</button>
              )}
            </div>

            {editions.length === 0 ? (
              <div className="surface rounded-2xl p-6"><EmptyState /></div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {editions.map((e) => (
                  <EditionCard
                    key={e.id} edition={e}
                    liked={!!liked[e.id]} saved={!!saved[e.id]}
                    onLike={() => setLiked((s) => ({ ...s, [e.id]: !s[e.id] }))}
                    onSave={() => setSaved((s) => ({ ...s, [e.id]: !s[e.id] }))}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {editions.map((e) => (
                  <EditionRow
                    key={e.id} edition={e}
                    liked={!!liked[e.id]} saved={!!saved[e.id]}
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

          {/* Sidebar (desktop only) */}
          <aside className="hidden lg:block space-y-4 sm:space-y-5">
            <SidebarCard title="Newsletter Stats">
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Total Editions"  value={String(EDITIONS.length)} />
                <Stat label="Total Reactions" value="1,248" />
                <Stat label="Total Comments"  value="256" />
                <Stat label="Saved by You"    value={String(Object.values(saved).filter(Boolean).length)} />
              </div>
            </SidebarCard>

            <SidebarCard title="Popular Topics">
              <ul className="space-y-2">
                {POPULAR_TOPICS.map((t) => {
                  const count = EDITIONS.filter((e) => e.category === t.label).length;
                  const active = topic === t.label;
                  return (
                    <li key={t.label}>
                      <button
                        onClick={() => setTopic(active ? "all" : t.label)}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-muted/50",
                          active && "bg-primary/10",
                        )}
                      >
                        <span className={cn("tile h-7 w-7 rounded-lg", t.tone)}>
                          <t.icon className="h-3.5 w-3.5" strokeWidth={1.9} />
                        </span>
                        <span className="flex-1 text-[12.5px] font-medium text-foreground">{t.label}</span>
                        <span className="text-[11px] text-muted-foreground">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
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

      {/* Filter sheet */}
      {filterOpen && (
        <FilterSheet
          year={year} topic={topic} years={years}
          onYear={setYear} onTopic={setTopic}
          onClose={() => setFilterOpen(false)}
          onClear={() => { setYear("all"); setTopic("all"); }}
        />
      )}
    </div>
  );
}

/* ---------- Tabs (matches existing Resolven tab style) ---------- */
function Tabs({ tab, onChange }: { tab: TabKey; onChange: (t: TabKey) => void }) {
  const items: { key: TabKey; label: string }[] = [
    { key: "all", label: "All Editions" },
    { key: "saved", label: "Saved" },
  ];
  return (
    <div className="surface inline-flex rounded-2xl p-1.5">
      {items.map(({ key, label }) => {
        const active = tab === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              "rounded-xl px-3.5 py-2 text-[12.5px] sm:text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function ViewToggle({ view, onChange }: { view: "grid" | "list"; onChange: (v: "grid" | "list") => void }) {
  return (
    <div className="inline-flex rounded-full border border-border bg-card p-0.5">
      {([
        ["grid", Grid3x3],
        ["list", List],
      ] as const).map(([key, Icon]) => {
        const active = view === key;
        return (
          <button key={key} aria-label={key === "grid" ? "Grid view" : "List view"}
            onClick={() => onChange(key)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}>
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}

export const COVER_BG: Record<Edition["cover"], string> = {
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
  edition: Edition; liked: boolean; saved: boolean; onLike: () => void; onSave: () => void;
}) {
  return (
    <article className="module-card overflow-hidden rounded-2xl p-0">
      <Link to="/newsletter/$id" params={{ id: edition.id }} className="block">
        <div className={cn("relative aspect-[4/3] bg-gradient-to-br p-4 text-white", COVER_BG[edition.cover])}>
          <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
            {edition.category}
          </span>
          <h3 className="mt-3 font-display text-[1.05rem] sm:text-[1.2rem] font-semibold leading-tight tracking-tight line-clamp-3">
            {edition.title}
          </h3>
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">
                {edition.month} {edition.year}
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">Edition</div>
            </div>
            <span className="h-[3px] w-10 rounded-full bg-white/70" />
          </div>
        </div>
      </Link>

      <div className="p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to="/newsletter/$id" params={{ id: edition.id }}
              className="block text-[12.5px] font-semibold text-foreground truncate hover:text-primary">
              {edition.month.charAt(0) + edition.month.slice(1).toLowerCase()} {edition.year} Edition
            </Link>
            <div className="mt-0.5 text-[10.5px] text-muted-foreground">
              {edition.date} · {edition.readMin} min read
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground" aria-label="More">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-[12px] leading-snug text-muted-foreground line-clamp-2">{edition.excerpt}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <button onClick={onLike}
              className={cn("inline-flex items-center gap-1 hover:text-foreground", liked && "text-accent")}>
              <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} /> {edition.likes + (liked ? 1 : 0)}
            </button>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" /> {edition.comments}
            </span>
          </div>
          <button onClick={onSave}
            className={cn("text-muted-foreground hover:text-foreground", saved && "text-primary")}
            aria-label="Save">
            <Bookmark className={cn("h-3.5 w-3.5", saved && "fill-current")} />
          </button>
        </div>
      </div>
    </article>
  );
}

function EditionRow({
  edition, liked, saved, onLike, onSave,
}: { edition: Edition; liked: boolean; saved: boolean; onLike: () => void; onSave: () => void }) {
  return (
    <Link to="/newsletter/$id" params={{ id: edition.id }}
      className="module-card flex gap-3 sm:gap-4 items-center p-2.5 sm:p-3 rounded-xl">
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
      <div className="hidden sm:flex items-center gap-3 text-[11px] text-muted-foreground" onClick={(e) => e.preventDefault()}>
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
    </Link>
  );
}

function SidebarCard({ title, subtle, children }: { title: string; subtle?: string; children: React.ReactNode }) {
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
      <div className="mt-3 text-sm font-semibold text-foreground">Nothing here yet</div>
      <p className="mt-1 max-w-xs text-[12px] text-muted-foreground">
        Try clearing filters or save an edition to find it here later.
      </p>
    </div>
  );
}

/* ---------- Filter sheet (responsive: bottom-sheet on mobile, modal on desktop) ---------- */
function FilterSheet({
  year, topic, years, onYear, onTopic, onClose, onClear,
}: {
  year: string; topic: string; years: string[];
  onYear: (v: string) => void; onTopic: (v: string) => void;
  onClose: () => void; onClear: () => void;
}) {
  const topics: (Category | "all")[] = ["all", "Sustainability", "Innovation", "People & Culture", "Operations", "Community"];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm"
      onClick={onClose}>
      <div className="surface w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 animate-rise"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold tracking-tight">Filter Editions</div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Year</div>
            <div className="flex flex-wrap gap-2">
              <Chip active={year === "all"} onClick={() => onYear("all")}>All</Chip>
              {years.map((y) => (
                <Chip key={y} active={year === y} onClick={() => onYear(y)}>{y}</Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Topic</div>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <Chip key={t} active={topic === t} onClick={() => onTopic(t)}>{t === "all" ? "All" : t}</Chip>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button onClick={onClear}
            className="flex-1 inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-[13px] font-medium text-foreground/80 hover:border-primary/40">
            Clear all
          </button>
          <button onClick={onClose}
            className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-[13px] font-medium text-primary-foreground shadow-soft hover:opacity-95">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-[12px] font-medium transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground/80 hover:border-primary/40",
      )}>
      {children}
    </button>
  );
}
