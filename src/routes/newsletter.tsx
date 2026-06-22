import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search, Heart, MessageCircle, Bookmark, Share2, ArrowRight, ArrowLeft,
  Home, Moon, Sun, Quote, Sparkles, Leaf, Archive as ArchiveIcon,
  Clock, Calendar, TrendingUp, Users as UsersIcon, Lightbulb,
} from "lucide-react";
import { MobileAppHeader } from "@/components/MobileAppHeader";
import { SparkleFab } from "@/components/SparkleFab";
import { cn } from "@/lib/utils";
import {
  EDITIONS, COVER_BG, LEADERSHIP_QUOTE, IMPACT_STATS,
  type Edition, type Category,
} from "@/lib/newsletter-data";

export const Route = createFileRoute("/newsletter")({
  head: () => ({
    meta: [
      { title: "Newsletter — Resolven" },
      { name: "description", content: "Monthly stories, leadership voices and sustainability updates from across Resolven." },
    ],
  }),
  component: NewsletterLayout,
});

/* Layout: index renders feed; child routes render through Outlet */
function NewsletterLayout() {
  const matches = useMatches();
  const isLeaf = matches[matches.length - 1]?.routeId === "/newsletter";
  return isLeaf ? <NewsletterFeed /> : <Outlet />;
}

/* ---------- Branded hero ---------- */
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

/* ---------- Feed (landing) ---------- */
function NewsletterFeed() {
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const featured = EDITIONS.find((e) => e.featured) ?? EDITIONS[0];
  const sustainability = EDITIONS.filter((e) => e.category === "Sustainability").slice(0, 3);
  const recent = EDITIONS.filter((e) => e.id !== featured.id).slice(0, 6);

  const toggleLike = (id: string) => setLiked((s) => ({ ...s, [id]: !s[id] }));
  const toggleSave = (id: string) => setSaved((s) => ({ ...s, [id]: !s[id] }));

  const filteredRecent = q.trim()
    ? recent.filter((e) =>
        e.title.toLowerCase().includes(q.toLowerCase()) ||
        e.excerpt.toLowerCase().includes(q.toLowerCase()))
    : recent;

  return (
    <div className="min-h-screen">
      <div className="hidden md:block"><NewsletterHero /></div>
      <main className="mx-auto w-full max-w-[1400px] space-y-5 px-4 py-4 sm:space-y-7 sm:px-6 sm:py-8">
        <MobileAppHeader pageLabel="Newsletter" />

        {/* Search + archive entry */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search stories, topics, people…"
              className="h-10 w-full rounded-full border border-border bg-card pl-10 pr-4 text-[13px] outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <Link to="/newsletter/archive"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-card px-4 h-10 text-[12.5px] font-medium text-foreground/80 hover:border-primary/40 hover:text-foreground transition">
            <ArchiveIcon className="h-3.5 w-3.5" /> Full archive <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5 sm:space-y-6">
            {/* Featured */}
            <FeaturedCard
              edition={featured}
              liked={!!liked[featured.id]} saved={!!saved[featured.id]}
              onLike={() => toggleLike(featured.id)}
              onSave={() => toggleSave(featured.id)}
            />

            {/* Leadership quote */}
            <LeadershipQuoteBlock />

            {/* Sustainability section */}
            <SectionBlock
              eyebrow="SUSTAINABILITY"
              primary="Our Planet,"
              accent="Our Promise"
              icon={Leaf}
              hint="Stories from across our ESG mission"
            >
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
                {sustainability.map((e) => (
                  <FeedCard key={e.id} edition={e}
                    liked={!!liked[e.id]} saved={!!saved[e.id]}
                    onLike={() => toggleLike(e.id)} onSave={() => toggleSave(e.id)} />
                ))}
              </div>
            </SectionBlock>

            {/* Recent */}
            <SectionBlock
              eyebrow="LATEST"
              primary="Recent"
              accent="Editions"
              icon={Sparkles}
              hint="Fresh stories from the Resolven community"
            >
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                {filteredRecent.map((e) => (
                  <FeedRow key={e.id} edition={e}
                    liked={!!liked[e.id]} saved={!!saved[e.id]}
                    onLike={() => toggleLike(e.id)} onSave={() => toggleSave(e.id)} />
                ))}
                {filteredRecent.length === 0 && (
                  <div className="surface col-span-full rounded-2xl p-6 text-center text-[12.5px] text-muted-foreground">
                    No matches for "{q}". Try the full archive.
                  </div>
                )}
              </div>
            </SectionBlock>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-4">
            <SidebarPanel title="This month at Resolven" subtle="Numbers that matter">
              <div className="grid grid-cols-2 gap-2.5">
                {IMPACT_STATS.map((s) => (
                  <div key={s.l} className="rounded-xl border border-border/60 bg-card/60 p-3">
                    <div className="text-base font-semibold text-primary">{s.v}</div>
                    <div className="mt-0.5 text-[10.5px] text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </SidebarPanel>

            <SidebarPanel title="Categories">
              <ul className="space-y-1.5">
                {[
                  { icon: Leaf,      label: "Sustainability",   tone: "tile-green" },
                  { icon: Lightbulb, label: "Innovation",       tone: "tile-lavender" },
                  { icon: UsersIcon, label: "People & Culture", tone: "tile-purple" },
                  { icon: TrendingUp,label: "Operations",       tone: "tile-green-light" },
                  { icon: Sparkles,  label: "Community",        tone: "tile-grey" },
                ].map((t) => {
                  const count = EDITIONS.filter((e) => e.category === t.label).length;
                  return (
                    <li key={t.label}>
                      <Link to="/newsletter/archive" search={{ topic: t.label } as any}
                        className="flex w-full items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-muted/50 transition">
                        <span className={cn("tile h-7 w-7 rounded-lg", t.tone)}>
                          <t.icon className="h-3.5 w-3.5" strokeWidth={1.9} />
                        </span>
                        <span className="flex-1 text-[12.5px] font-medium text-foreground">{t.label}</span>
                        <span className="text-[11px] text-muted-foreground">{count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </SidebarPanel>

            <SidebarPanel title="Never miss an edition" subtle="Get every newsletter delivered to your inbox.">
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-medium text-primary-foreground shadow-soft hover:opacity-95 transition">
                Subscribe
              </button>
            </SidebarPanel>
          </aside>
        </div>
      </main>
      <SparkleFab />
    </div>
  );
}

/* ---------- Building blocks ---------- */

function SectionBlock({
  eyebrow, primary, accent, icon: Icon, hint, children,
}: {
  eyebrow: string; primary: string; accent: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  hint?: string; children: React.ReactNode;
}) {
  return (
    <section className="surface rounded-2xl sm:rounded-3xl p-4 sm:p-6 animate-rise">
      <div className="mb-3 sm:mb-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <Icon className="h-3.5 w-3.5" strokeWidth={1.9} /> {eyebrow}
          </div>
          <h2 className="mt-1 font-display italic text-[1.15rem] sm:text-[1.4rem] font-bold tracking-tight leading-tight">
            <span className="text-foreground">{primary}</span>{" "}
            <span className="text-accent">{accent}</span>
          </h2>
        </div>
        {hint && <p className="hidden sm:block max-w-xs text-right text-[11px] font-light text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function FeaturedCard({
  edition, liked, saved, onLike, onSave,
}: { edition: Edition; liked: boolean; saved: boolean; onLike: () => void; onSave: () => void }) {
  return (
    <article className="module-card overflow-hidden rounded-2xl sm:rounded-3xl p-0 animate-rise">
      <Link to="/newsletter/$id" params={{ id: edition.id }} className="block group">
        <div className={cn(
          "relative aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-br p-5 sm:p-8 md:p-10 text-white",
          COVER_BG[edition.cover],
        )}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
          <div className="relative flex h-full flex-col justify-between max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                Featured
              </span>
              <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                {edition.category}
              </span>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/75">
                {edition.month} {edition.year} Edition
              </div>
              <h3 className="mt-1.5 font-display italic text-xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                {edition.title}
              </h3>
              <p className="mt-2 max-w-xl text-[12.5px] sm:text-sm text-white/85 font-light line-clamp-2">
                {edition.excerpt}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/80">
                <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {edition.date}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {edition.readMin} min read</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <EngagementBar edition={edition} liked={liked} saved={saved} onLike={onLike} onSave={onSave} />
    </article>
  );
}

function LeadershipQuoteBlock() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 animate-rise"
      style={{ background: "linear-gradient(135deg, oklch(0.42 0.18 295) 0%, oklch(0.28 0.14 295) 100%)" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.12),transparent_55%)]" />
      <div className="relative grid grid-cols-[1fr_auto] gap-4 sm:gap-6 items-center text-white">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/65">
            <Quote className="h-3.5 w-3.5" /> Leadership Voice
          </div>
          <p className="mt-2 font-display italic text-[15px] sm:text-xl md:text-2xl leading-snug font-medium">
            "{LEADERSHIP_QUOTE.text}"
          </p>
          <div className="mt-3 text-[12px] sm:text-sm font-medium">— {LEADERSHIP_QUOTE.author}</div>
          <div className="text-[11px] sm:text-xs text-white/70">{LEADERSHIP_QUOTE.role}</div>
        </div>
        <div className="hidden sm:flex h-16 w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur ring-1 ring-white/20 font-display italic font-bold text-xl">
          {LEADERSHIP_QUOTE.initials}
        </div>
      </div>
    </section>
  );
}

function FeedCard({
  edition, liked, saved, onLike, onSave,
}: { edition: Edition; liked: boolean; saved: boolean; onLike: () => void; onSave: () => void }) {
  return (
    <article className="module-card overflow-hidden rounded-2xl p-0">
      <Link to="/newsletter/$id" params={{ id: edition.id }} className="block">
        <div className={cn("relative aspect-[5/3] bg-gradient-to-br p-3.5 text-white", COVER_BG[edition.cover])}>
          <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-wider">
            {edition.category}
          </span>
          <h3 className="mt-2 font-display text-[0.95rem] font-semibold leading-tight tracking-tight line-clamp-2">
            {edition.title}
          </h3>
          <div className="absolute bottom-2.5 left-3.5 text-[9.5px] font-medium uppercase tracking-[0.18em] text-white/75">
            {edition.month} {edition.year}
          </div>
        </div>
      </Link>
      <div className="p-3">
        <p className="text-[11.5px] leading-snug text-muted-foreground line-clamp-2">{edition.excerpt}</p>
        <EngagementMini edition={edition} liked={liked} saved={saved} onLike={onLike} onSave={onSave} />
      </div>
    </article>
  );
}

function FeedRow({
  edition, liked, saved, onLike, onSave,
}: { edition: Edition; liked: boolean; saved: boolean; onLike: () => void; onSave: () => void }) {
  return (
    <article className="module-card overflow-hidden rounded-2xl p-0">
      <div className="flex">
        <Link to="/newsletter/$id" params={{ id: edition.id }}
          className={cn("relative h-auto w-24 sm:w-28 shrink-0 bg-gradient-to-br", COVER_BG[edition.cover])}>
          <div className="absolute bottom-1.5 left-1.5 text-[8.5px] font-semibold uppercase tracking-wider text-white/85">
            {edition.month}<br />{edition.year}
          </div>
        </Link>
        <div className="min-w-0 flex-1 p-3 sm:p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9.5px] font-medium uppercase tracking-wider text-primary">{edition.category}</span>
            <span className="text-[10px] text-muted-foreground">{edition.readMin} min</span>
          </div>
          <Link to="/newsletter/$id" params={{ id: edition.id }}
            className="mt-0.5 block text-[13px] font-semibold text-foreground hover:text-primary line-clamp-1">
            {edition.title}
          </Link>
          <p className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground line-clamp-2">{edition.excerpt}</p>
          <EngagementMini edition={edition} liked={liked} saved={saved} onLike={onLike} onSave={onSave} />
        </div>
      </div>
    </article>
  );
}

export function EngagementBar({
  edition, liked, saved, onLike, onSave,
}: { edition: Edition; liked: boolean; saved: boolean; onLike: () => void; onSave: () => void }) {
  return (
    <div className="flex items-center justify-between border-t border-border/60 px-4 py-3">
      <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
        <button onClick={onLike}
          className={cn("inline-flex items-center gap-1.5 hover:text-foreground transition", liked && "text-accent")}>
          <Heart className={cn("h-4 w-4", liked && "fill-current")} /> {edition.likes + (liked ? 1 : 0)}
        </button>
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4" /> {edition.comments}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={onSave} aria-label="Save"
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition",
            saved && "text-primary",
          )}>
          <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
        </button>
        <button aria-label="Share"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition">
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function EngagementMini({
  edition, liked, saved, onLike, onSave,
}: { edition: Edition; liked: boolean; saved: boolean; onLike: () => void; onSave: () => void }) {
  return (
    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
      <div className="flex items-center gap-3">
        <button onClick={onLike}
          className={cn("inline-flex items-center gap-1 hover:text-foreground", liked && "text-accent")}>
          <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} /> {edition.likes + (liked ? 1 : 0)}
        </button>
        <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {edition.comments}</span>
      </div>
      <button onClick={onSave} aria-label="Save"
        className={cn("hover:text-foreground", saved && "text-primary")}>
        <Bookmark className={cn("h-3.5 w-3.5", saved && "fill-current")} />
      </button>
    </div>
  );
}

function SidebarPanel({ title, subtle, children }: { title: string; subtle?: string; children: React.ReactNode }) {
  return (
    <div className="surface rounded-2xl p-4 sm:p-5 animate-rise">
      <div className="text-[13px] font-semibold tracking-tight text-foreground">{title}</div>
      {subtle && <p className="mt-0.5 text-[11px] font-light text-muted-foreground">{subtle}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

// Re-export shared tokens for legacy consumers (detail page)
export { EDITIONS, COVER_BG };
export type { Edition, Category };
