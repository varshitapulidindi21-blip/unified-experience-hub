import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Paperclip, Send, Home, MessageSquare,
  Search, MoreHorizontal, Edit3, Trash2, Pin, Share2, Menu, X, Clock,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

import aiLogo from "@/assets/resolven-ai-logo.png";

export const Route = createFileRoute("/resolven-ai")({
  head: () => ({
    meta: [
      { title: "Resolven AI — Resolven Hub" },
      { name: "description", content: "Search internal data, analyze documents, and browse the web." },
    ],
  }),
  component: AIPage,
});

const conversations = [
  { title: "Quarterly report draft", time: "1d" },
  { title: "Vendor onboarding flow", time: "3d" },
];

type PopupKind = "new" | "search" | "recents" | null;

function AIPage() {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [popup, setPopup] = useState<PopupKind>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopup(null);
      }
    }
    if (popup) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [popup]);

  return (
    <div className="min-h-screen relative">
      {/* Ambient background — light mode (dreamy lavender/green) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 dark:hidden"
        style={{
          background:
            "radial-gradient(1400px 960px at -8% -12%, color-mix(in oklab, var(--brand-lavender) 88%, white 12%) 0%, transparent 58%), radial-gradient(980px 760px at 100% 2%, color-mix(in oklab, var(--brand-purple) 52%, white 48%) 0%, transparent 60%), radial-gradient(1100px 840px at 108% 100%, color-mix(in oklab, var(--brand-green-light) 68%, white 32%) 0%, transparent 58%), radial-gradient(940px 700px at 10% 104%, color-mix(in oklab, var(--brand-green) 34%, white 66%) 0%, transparent 60%), radial-gradient(820px 560px at 52% 38%, color-mix(in oklab, var(--brand-purple) 18%, white 82%) 0%, transparent 66%), linear-gradient(135deg, color-mix(in oklab, var(--brand-lavender) 62%, white 38%) 0%, color-mix(in oklab, var(--brand-purple) 22%, white 78%) 42%, color-mix(in oklab, var(--brand-green-light) 48%, white 52%) 100%)",
        }}
      />
      {/* Soft cloudy highlights — light mode */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 dark:hidden opacity-50"
        style={{
          background:
            "radial-gradient(620px 360px at 74% 26%, color-mix(in oklab, white 72%, transparent) 0%, transparent 68%), radial-gradient(520px 320px at 26% 78%, color-mix(in oklab, white 54%, transparent) 0%, transparent 70%), radial-gradient(460px 280px at 48% 58%, color-mix(in oklab, var(--brand-lavender) 16%, white 84%) 0%, transparent 72%)",
          filter: "blur(40px)",
        }}
      />
      {/* Ambient background — dark mode */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 hidden dark:block"
        style={{
          background:
            "radial-gradient(1200px 800px at 30% 0%, color-mix(in oklab, var(--brand-purple) 22%, transparent), transparent 70%), radial-gradient(1000px 700px at 80% 100%, color-mix(in oklab, var(--brand-green) 12%, transparent), transparent 75%)",
        }}
      />



      <header className="sticky top-0 z-30 hidden w-full border-b border-border/50 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/45 md:block">
        <div className="mx-auto flex h-14 sm:h-16 w-full max-w-[1400px] items-center px-2 sm:px-4">
          {/* Sidebar toggle: collapsed → logo with hover→hamburger swap; expanded → logo left + hamburger right */}
          {sidebarExpanded ? (
            <div className="flex w-[260px] shrink-0 items-center justify-between pr-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl">
                <img src={aiLogo} alt="Resolven AI" className="h-7 w-7 object-contain" />
              </span>
              <button
                onClick={() => {
                  if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
                    setSidebarExpanded(false);
                    setPopup(null);
                  } else {
                    setMobileSidebarOpen(false);
                  }
                }}
                aria-label="Collapse sidebar"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground/85 transition-colors hover:bg-secondary/60"
              >
                <Menu className="h-[1.2rem] w-[1.2rem]" strokeWidth={1.9} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
                  setSidebarExpanded(true);
                  setPopup(null);
                } else {
                  setMobileSidebarOpen(true);
                }
              }}
              aria-label="Open sidebar"
              className="ai-nav-swap relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-secondary/60"
            >
              <img src={aiLogo} alt="Resolven AI" className="ai-nav-logo absolute h-7 w-7 object-contain" />
              <Menu className="ai-nav-bars absolute h-[1.2rem] w-[1.2rem] text-foreground/85" strokeWidth={1.9} />
            </button>
          )}

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <Link
              to="/"
              aria-label="Home"
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-xl text-foreground/80 transition-all duration-200 hover:bg-secondary/70 hover:text-foreground hover:scale-[1.04]"
            >
              <Home className="h-[1.05rem] w-[1.05rem]" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px]">
        {/* Desktop collapsible sidebar */}
        <aside
          className={`relative hidden md:flex shrink-0 flex-col border-r border-border/50 transition-[width] duration-300 ease-out ${
            sidebarExpanded ? "w-[260px]" : "w-[64px]"
          }`}
        >
          <DesktopSidebar
            expanded={sidebarExpanded}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            popup={popup}
            setPopup={setPopup}
            popupRef={popupRef}
          />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-in fade-in"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-[320px] flex-col border-r border-border/60 bg-background/95 backdrop-blur-xl shadow-elev md:hidden animate-in slide-in-from-left duration-300">
              <div className="flex h-14 items-center justify-end px-3 border-b border-border/40">
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground/70 hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ExpandedList openMenu={openMenu} setOpenMenu={setOpenMenu} />
            </aside>
          </>
        )}

        {/* Main chat area */}
        <section className="relative flex min-h-[calc(100vh-11rem)] flex-1 flex-col sm:min-h-[calc(100vh-4rem)]">
          {/* Greeting */}
          <div className="flex flex-1 items-center justify-center px-5 pt-3 pb-44 sm:px-10 sm:pt-10 sm:pb-10 md:px-16">
            <div className="relative flex w-full max-w-2xl flex-col items-center text-center">
              <div className="relative flex items-center justify-center">
                {/* Soft aura */}
                <span
                  aria-hidden
                  className="ai-logo-aura absolute h-40 w-40 sm:h-52 sm:w-52 rounded-full blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, color-mix(in oklab, var(--brand-purple) 35%, transparent) 0%, color-mix(in oklab, var(--brand-green) 18%, transparent) 55%, transparent 75%)",
                  }}
                />
                <img
                  src={aiLogo}
                  alt="Resolven AI"
                  className="ai-logo-intro relative h-20 w-20 object-contain drop-shadow-[0_10px_30px_rgba(80,40,160,0.35)] sm:h-32 sm:w-32"
                />
              </div>
              <h1
                className="mt-5 text-[1.55rem] tracking-tight leading-[1.05] sm:mt-8 sm:text-[2.6rem] md:text-[3rem]"
                style={{ fontFamily: "Montserrat, system-ui, sans-serif", fontWeight: 700, fontStyle: "italic" }}
              >
                <span className="text-primary dark:text-white">Hi,</span>{" "}
                <span className="text-accent">Samarth</span>
              </h1>
              <p
                className="mt-3 text-[0.95rem] font-light text-muted-foreground sm:mt-4 sm:text-lg"
                style={{ fontFamily: "Montserrat, system-ui, sans-serif" }}
              >
                How can I help you today?
              </p>
              <p className="mt-1 text-sm font-light text-muted-foreground/80">
                Ask anything, or pick up where you left off.
              </p>

              {/* Desktop input bar — inline */}
              <div className="hidden sm:flex relative mt-8 w-full items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-2.5 shadow-elev backdrop-blur-2xl transition-all duration-300 focus-within:border-primary/40 focus-within:shadow-glow">
                <button
                  aria-label="Attach files"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-primary transition hover:bg-secondary"
                >
                  <Paperclip className="h-5 w-5" strokeWidth={1.6} />
                </button>
                <input
                  className="flex-1 bg-transparent px-1 text-sm font-light text-foreground placeholder:text-muted-foreground focus:outline-none"
                  placeholder="Ask Resolven AI anything…"
                />
                <button
                  aria-label="Send"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-soft transition hover:scale-105"
                  style={{ background: "linear-gradient(135deg, var(--brand-purple), var(--brand-green))" }}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile input bar — sticky at bottom */}
          <div className="sm:hidden fixed inset-x-0 z-20 border-t border-border/40 bg-background/85 px-3 pt-2.5 backdrop-blur-xl" style={{ bottom: 0, paddingBottom: "calc(env(safe-area-inset-bottom) + 0.7rem)" }}>
            <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/90 px-2 py-1.5 shadow-elev focus-within:border-primary/40">
              <button
                aria-label="Attach files"
                className="flex h-9 w-9 items-center justify-center rounded-full text-primary transition active:scale-95"
              >
                <Paperclip className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.6} />
              </button>
              <input
                className="flex-1 bg-transparent px-1 text-[0.95rem] font-light text-foreground placeholder:text-muted-foreground focus:outline-none"
                placeholder="Ask Resolven AI…"
              />
              <button
                aria-label="Send"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white transition active:scale-95"
                style={{ background: "linear-gradient(135deg, var(--brand-purple), var(--brand-green))" }}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function RailIconButton({
  label, onClick, children, hideTooltip,
}: { label: string; onClick?: () => void; children: React.ReactNode; hideTooltip?: boolean }) {
  return (
    <div className="group/rail relative">
      <button
        onClick={onClick}
        aria-label={label}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground/80 transition-all duration-200 hover:bg-secondary/70 hover:text-foreground active:scale-95"
      >
        {children}
      </button>
      {!hideTooltip && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-md border border-border/60 bg-popover/95 px-2.5 py-1 text-[11px] font-medium text-popover-foreground opacity-0 shadow-elev backdrop-blur transition-all duration-200 group-hover/rail:translate-x-0 group-hover/rail:opacity-100"
        >
          {label}
        </span>
      )}
    </div>
  );
}

function DesktopSidebar({
  expanded, openMenu, setOpenMenu, popup, setPopup, popupRef,
}: {
  expanded: boolean;
  openMenu: number | null;
  setOpenMenu: (v: number | null) => void;
  popup: PopupKind;
  setPopup: (p: PopupKind) => void;
  popupRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  if (expanded) {
    return <ExpandedList openMenu={openMenu} setOpenMenu={setOpenMenu} />;
  }
  return (
    <div className="relative flex flex-col items-center gap-1 py-2">
      <RailIconButton label="New chat" hideTooltip onClick={() => setPopup(popup === "new" ? null : "new")}>
        <Edit3 className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.7} />
      </RailIconButton>
      <RailIconButton label="Search chats" onClick={() => setPopup(popup === "search" ? null : "search")}>
        <Search className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.7} />
      </RailIconButton>
      <RailIconButton label="Recents" onClick={() => setPopup(popup === "recents" ? null : "recents")}>
        <Clock className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.7} />
      </RailIconButton>

      {popup && (
        <div
          ref={popupRef}
          className="absolute left-full top-2 z-40 ml-3 w-72 rounded-2xl border border-border/60 bg-popover/85 p-3 shadow-elev backdrop-blur-2xl animate-in fade-in slide-in-from-left-2 duration-200"
        >
          {popup === "new" && (
            <div>
              <div className="px-2 pb-2 text-[11px] font-medium tracking-[0.18em] uppercase text-muted-foreground">New chat</div>
              <button
                onClick={() => setPopup(null)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/70"
              >
                <Edit3 className="h-4 w-4" /> Start a new conversation
              </button>
            </div>
          )}
          {popup === "search" && (
            <div>
              <div className="px-2 pb-2 text-[11px] font-medium tracking-[0.18em] uppercase text-muted-foreground">Search</div>
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder="Search chats…"
                  className="flex-1 bg-transparent text-sm font-light placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>
          )}
          {popup === "recents" && (
            <div>
              <div className="px-2 pb-2 text-[11px] font-medium tracking-[0.18em] uppercase text-muted-foreground">Recents</div>
              <ul className="space-y-0.5">
                {conversations.map((c, i) => (
                  <li key={i}>
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-light text-foreground hover:bg-secondary/70">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{c.title}</span>
                      <span className="ml-auto text-[11px] text-muted-foreground">{c.time}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ExpandedList({
  openMenu, setOpenMenu,
}: {
  openMenu: number | null;
  setOpenMenu: (v: number | null) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-4">
      <ul className="space-y-0.5">
        <ExpandedItem icon={Edit3} label="New chat" />
        <ExpandedItem icon={Search} label="Search chats" />
      </ul>
      <div>
        <div className="mb-2 px-3 text-[11px] font-medium tracking-[0.18em] uppercase text-muted-foreground">
          Conversations
        </div>
        <ul className="space-y-0.5">
          {conversations.map((c, i) => (
            <li
              key={i}
              className="group relative flex items-center justify-between rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-secondary/70"
            >
              <button className="flex flex-1 items-center gap-2 truncate text-left text-sm font-light text-foreground">
                <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span className="truncate">{c.title}</span>
              </button>
              <span className="ml-2 text-[11px] font-light text-muted-foreground transition-opacity group-hover:opacity-0">
                {c.time}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu(openMenu === i ? null : i);
                }}
                aria-label="Chat options"
                className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              {openMenu === i && (
                <div
                  className="absolute right-2 top-9 z-20 w-40 overflow-hidden rounded-lg border border-border bg-popover shadow-elev"
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <MenuItem icon={Edit3} label="Rename" />
                  <MenuItem icon={Pin} label="Pin" />
                  <MenuItem icon={Share2} label="Share" />
                  <MenuItem icon={Trash2} label="Delete" danger />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ExpandedItem({
  icon: Icon, label,
}: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <li>
      <button className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-secondary/70">
        <Icon className="h-[1.05rem] w-[1.05rem] text-muted-foreground transition-colors group-hover:text-foreground" />
        <span>{label}</span>
      </button>
    </li>
  );
}

function MenuItem({
  icon: Icon, label, danger,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-secondary ${
        danger ? "text-destructive" : "text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
