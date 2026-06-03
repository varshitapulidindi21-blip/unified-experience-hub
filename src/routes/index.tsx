import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutGrid,
  ListChecks,
  Activity,
  FolderKanban,
  BookOpen,
  Handshake,
  Zap,
  Award,
  ShieldCheck,
  Scale,
  ClipboardCheck,
  AlertTriangle,
  FileBarChart,
  Sparkles,
  Bot,
  Settings,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import energyImg from "@/assets/energy.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Resolven — Enterprise Operations Platform" },
      { name: "description", content: "Resolven unifies monitoring, governance, compliance and AI insights for renewable energy operations." },
    ],
  }),
  component: Home,
});

type Tone = "purple" | "green" | "lavender" | "lightGreen" | "gray";

const toneStyles: Record<Tone, string> = {
  purple: "bg-[var(--brand-purple)] text-white",
  green: "bg-[var(--brand-green)] text-white",
  lavender: "bg-[var(--brand-purple-soft)] text-[var(--brand-purple)]",
  lightGreen: "bg-[var(--brand-green-soft)] text-[oklch(0.32_0.12_150)]",
  gray: "bg-[var(--brand-gray-soft)] text-[var(--brand-gray)]",
};

type Module = { title: string; desc: string; icon: ComponentType<{ className?: string }>; tone: Tone };

const modules: Module[] = [
  { title: "Dashboard", desc: "Portfolio health and executive KPIs", icon: LayoutGrid, tone: "purple" },
  { title: "My Tasks", desc: "Approvals and pending actions", icon: ListChecks, tone: "lavender" },
  { title: "Central Monitoring", desc: "Live alarms and plant performance", icon: Activity, tone: "green" },
  { title: "Project Management", desc: "Tracking, milestones and execution", icon: FolderKanban, tone: "purple" },
  { title: "Knowledge Vault", desc: "Documents and searchable knowledge", icon: BookOpen, tone: "lavender" },
  { title: "HOTO", desc: "Handover, takeover and maintenance operations", icon: Handshake, tone: "gray" },
  { title: "Digital Function", desc: "ITSM, IT assets, IT budget and planner", icon: Zap, tone: "green" },
  { title: "Quality Management", desc: "Supplier quality and governance workflows", icon: Award, tone: "lightGreen" },
  { title: "HSE", desc: "Incidents, audits and safe-hours management", icon: ShieldCheck, tone: "purple" },
  { title: "Contracts & Obligations", desc: "Contract intake, legal review and obligation tracking", icon: Scale, tone: "purple" },
  { title: "Compliances", desc: "Regulatory timelines and controls", icon: ClipboardCheck, tone: "lightGreen" },
  { title: "Risk & Governance", desc: "Enterprise risk and mitigation controls", icon: AlertTriangle, tone: "gray" },
  { title: "Reports", desc: "Scheduled and ad-hoc reporting", icon: FileBarChart, tone: "lavender" },
  { title: "Resolven AI", desc: "Contextual insights and copilot actions", icon: Sparkles, tone: "green" },
  { title: "AI Studio", desc: "Build and deploy custom agents", icon: Bot, tone: "purple" },
  { title: "Admin Setting", desc: "Access to admin settings", icon: Settings, tone: "lavender" },
];

function Home() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Top bar */}
        <header className="bg-card border-b border-border">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
            <Logo />
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDark((d) => !d)}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted transition"
                aria-label="Toggle theme"
              >
                {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className="flex items-center gap-1 rounded-md border border-border bg-[var(--brand-purple-soft)] px-2 py-1">
                <span className="grid h-8 w-8 place-items-center rounded bg-[var(--brand-purple)] font-semibold text-white">SS</span>
                <ChevronDown className="h-4 w-4 text-[var(--brand-purple)]" />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-6 py-8">
          {/* Welcome */}
          <section className="relative overflow-hidden rounded-2xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  <span className="text-[var(--brand-purple)]">Good Morning,</span>{" "}
                  <span className="text-[var(--brand-green)]">Samarth Sachdeva</span>
                </h1>
                <p className="mt-3 font-semibold text-[var(--brand-purple)]">Welcome back</p>
                <p className="text-sm text-muted-foreground">Last login 4/6/2026, 9:53:46 AM</p>
              </div>
              <div className="flex gap-3">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="h-32 w-28 overflow-hidden rounded-xl shadow-sm md:h-36 md:w-36"
                    style={{ clipPath: "polygon(12% 0, 100% 0, 88% 100%, 0 100%)" }}
                  >
                    <img
                      src={energyImg}
                      alt="Renewable energy"
                      width={1024}
                      height={1024}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: i === 0 ? "left center" : "right center" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Announcements */}
          <section className="mt-8">
            <h2 className="text-xs font-bold tracking-[0.18em] text-[var(--brand-purple)]">ANNOUNCEMENTS</h2>
            <div className="mt-3 flex items-center overflow-hidden rounded-md">
              <div className="flex flex-1 items-center gap-3 bg-[var(--brand-green)] px-4 py-3 text-sm text-white">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-green-soft)] ring-2 ring-white/60" />
                <p>
                  <span className="font-semibold">Corporate announcement:</span>{" "}
                  Planned release window on Friday 10 PM IST.
                </p>
              </div>
              <div className="flex h-12 items-stretch gap-1.5 bg-[var(--brand-green)] px-3">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-3 bg-[var(--brand-green-soft)]/70"
                    style={{ clipPath: "polygon(30% 0, 100% 0, 70% 100%, 0 100%)" }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Modules */}
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold tracking-[0.18em] text-[var(--brand-purple)]">BUSINESS MODULES</h2>
              <button className="text-xs font-bold tracking-[0.18em] text-[var(--brand-green)] hover:underline">
                VIEW ALL
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {modules.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.title}
                    className="group flex flex-col items-start rounded-xl bg-card p-4 text-left shadow-sm ring-1 ring-border/60 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--brand-purple)]/30"
                  >
                    <span className={`grid h-11 w-11 place-items-center rounded-xl ${toneStyles[m.tone]} shadow-sm`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-sm font-semibold text-foreground">{m.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{m.desc}</p>
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-extrabold tracking-tight text-[var(--brand-purple)]">
        RES
        <span className="relative inline-block">
          <span className="relative z-10">O</span>
          <span className="absolute inset-0 -m-0.5 rounded-full bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-purple)] opacity-90" />
        </span>
        LVEN
      </span>
    </div>
  );
}
