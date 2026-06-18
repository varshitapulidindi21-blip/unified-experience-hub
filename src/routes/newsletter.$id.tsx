import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Home, Moon, Sun, Heart, MessageCircle, Bookmark, Share2,
  Clock, Calendar, Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SparkleFab } from "@/components/SparkleFab";
import { EDITIONS, COVER_BG, type Edition } from "./newsletter";

export const Route = createFileRoute("/newsletter/$id")({
  head: ({ params }) => {
    const e = EDITIONS.find((x) => x.id === params.id);
    return {
      meta: [
        { title: e ? `${e.title} — Resolven Newsletter` : "Newsletter — Resolven" },
        { name: "description", content: e?.excerpt ?? "Resolven monthly newsletter." },
      ],
    };
  },
  loader: ({ params }) => {
    const edition = EDITIONS.find((e) => e.id === params.id);
    if (!edition) throw notFound();
    return { edition };
  },
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <p className="text-sm text-muted-foreground">Newsletter not found.</p>
      <Link to="/newsletter" className="mt-3 inline-block text-sm text-primary hover:underline">
        Back to archive
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-destructive" role="alert">{String(error)}</div>
  ),
  component: NewsletterDetail,
});

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
      className="inline-flex h-9 w-9 items-center justify-center text-white/85 hover:text-white">
      {dark ? <Sun className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.9} /> : <Moon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.9} />}
    </button>
  );
}

function BrandedHero() {
  return (
    <header className="travel-hero relative w-full overflow-hidden border-b border-white/10 shadow-soft">
      <div className="travel-hero-atmosphere pointer-events-none absolute inset-0 mix-blend-screen" />
      <div className="relative mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <Link to="/newsletter" aria-label="Back"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/85 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
          </Link>
          <h1 className="font-display italic font-bold tracking-tight text-white text-[1.05rem] sm:text-[1.25rem] leading-none truncate">
            Newsletter
          </h1>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <HeroThemeToggle />
          <Link to="/" aria-label="Home"
            className="inline-flex h-9 w-9 items-center justify-center text-white/85 hover:text-white">
            <Home className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.9} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function NewsletterDetail() {
  const { edition } = Route.useLoaderData() as { edition: Edition };
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="min-h-screen">
      <BrandedHero />

      <main className="mx-auto w-full max-w-[1100px] space-y-4 sm:space-y-6 px-4 py-4 sm:px-6 sm:py-8">
        {/* Mobile back */}
        <Link to="/newsletter"
          className="md:hidden inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to archive
        </Link>

        {/* Hero cover */}
        <section className={cn("relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br p-6 sm:p-10 text-white animate-rise",
          COVER_BG[edition.cover])}>
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider">
              {edition.category}
            </span>
            <div className="mt-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white/75">
              {edition.month} {edition.year} Edition
            </div>
            <h1 className="mt-2 font-display italic text-2xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              {edition.title}
            </h1>
            <p className="mt-3 max-w-xl text-[13px] sm:text-base text-white/85 font-light">
              {edition.excerpt}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-white/75">
              <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {edition.date}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {edition.readMin} min read</span>
            </div>
          </div>
        </section>

        {/* Engagement bar */}
        <div className="surface rounded-2xl p-3 sm:p-4 flex items-center justify-between animate-rise">
          <div className="flex items-center gap-4 text-[12px] sm:text-sm text-muted-foreground">
            <button onClick={() => setLiked((s) => !s)}
              className={cn("inline-flex items-center gap-1.5 hover:text-foreground", liked && "text-accent")}>
              <Heart className={cn("h-4 w-4", liked && "fill-current")} /> {edition.likes + (liked ? 1 : 0)}
            </button>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" /> {edition.comments}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setSaved((s) => !s)}
              className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40",
                saved && "text-primary border-primary/50")}
              aria-label="Save">
              <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
            </button>
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40"
              aria-label="Share">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <article className="surface rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 animate-rise prose-like space-y-4 sm:space-y-5">
          <h2 className="font-display italic text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            A note from the editor
          </h2>
          <p className="text-[13.5px] sm:text-[15px] leading-relaxed text-foreground/85">
            This month at Resolven, we're celebrating the people, projects and partnerships that
            make our mission possible. From breakthroughs on the operations floor to community
            initiatives across our sites, every story in this edition reflects our shared
            commitment to <span className="text-primary font-medium">{edition.category.toLowerCase()}</span>.
          </p>
          <p className="text-[13.5px] sm:text-[15px] leading-relaxed text-foreground/85">
            We hope you find inspiration in these pages — and that you'll share what resonates
            with your team. Your voice is what keeps Resolven moving forward.
          </p>

          <h3 className="pt-2 font-display italic text-lg sm:text-xl font-semibold tracking-tight text-foreground">
            Highlights this edition
          </h3>
          <ul className="space-y-2 text-[13.5px] sm:text-[15px] leading-relaxed text-foreground/85">
            <li className="flex gap-2"><span className="text-primary">•</span> A behind-the-scenes look at our newest sustainability initiative.</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Employee spotlight: meet the team driving innovation across our sites.</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Numbers that matter — our impact in figures this quarter.</li>
            <li className="flex gap-2"><span className="text-primary">•</span> Upcoming events you won't want to miss.</li>
          </ul>
        </article>

        {/* Leadership message */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 animate-rise"
          style={{ background: "linear-gradient(135deg, var(--brand-purple) 0%, var(--brand-purple-deep, var(--brand-purple)) 100%)" }}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-center text-white">
            <div>
              <Quote className="h-6 w-6 text-white/60" />
              <p className="mt-2 font-display italic text-lg sm:text-xl leading-snug">
                At Resolven, we don't just meet today's energy needs — we build solutions that
                empower tomorrow.
              </p>
              <div className="mt-3 text-[12px] sm:text-sm font-medium">— Vikram Mehta</div>
              <div className="text-[11px] sm:text-xs text-white/75">CEO, Resolven</div>
            </div>
            <div className="hidden md:flex h-24 w-24 lg:h-28 lg:w-28 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur ring-1 ring-white/20 text-2xl font-display italic font-bold">
              VM
            </div>
          </div>
        </section>

        {/* Numbers strip */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 animate-rise">
          {[
            { v: "12.8M", l: "kWh Renewable" },
            { v: "8,452", l: "tCO₂ Avoided" },
            { v: "2.3M", l: "Litres Saved" },
            { v: "1,200+", l: "Communities" },
          ].map((s) => (
            <div key={s.l} className="surface rounded-2xl p-4 text-center">
              <div className="text-lg sm:text-2xl font-semibold text-primary">{s.v}</div>
              <div className="mt-0.5 text-[10.5px] sm:text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </section>

        <div className="pt-2">
          <Link to="/newsletter"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all editions
          </Link>
        </div>
      </main>
      <SparkleFab />
    </div>
  );
}
