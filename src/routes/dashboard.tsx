import { createFileRoute } from "@tanstack/react-router";
import { Activity, Zap, Leaf, Gauge, TrendingUp, Sun } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { MobileAppHeader } from "@/components/MobileAppHeader";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Stats — Resolven Hub" },
      { name: "description", content: "Executive analytics across renewable operations." },
    ],
  }),
  component: DashboardPage,
});

const KPIS = [
  { icon: Zap, label: "Today's yield", value: "3.4 GWh", delta: "+12%", tone: "purple" as const },
  { icon: Leaf, label: "CO₂ saved", value: "412 t", delta: "+6%", tone: "green" as const },
  { icon: Gauge, label: "Uptime", value: "98%", delta: "+0.4%", tone: "lavender" as const },
  { icon: Sun, label: "Solar peak", value: "1.2 GW", delta: "+9%", tone: "green-light" as const },
];

const toneBg: Record<string, string> = {
  purple: "tile-purple",
  green: "tile-green",
  lavender: "tile-lavender",
  "green-light": "tile-green-light",
};

function DashboardPage() {
  return (
    <div className="min-h-screen">
      <div className="hidden md:block"><TopBar /></div>
      <main className="mx-auto w-full max-w-[1400px] space-y-4 px-4 pt-2 pb-28 sm:space-y-6 sm:px-6 sm:py-8">
        <MobileAppHeader pageLabel="Stats" />

        {/* Hero generation card */}
        <section className="md:hidden mobile-insights-banner">
          <div className="mobile-insights-banner__inner">
            <div className="mobile-insights-eyebrow"><Activity className="h-3 w-3" strokeWidth={2.2} /> Live Operations</div>
            <h2 className="mt-1.5 text-[1.1rem] font-semibold leading-tight tracking-tight text-white">
              Generation trending +12% today
            </h2>
            <p className="mt-1 text-[0.78rem] leading-snug text-white/75">
              3 sites exceeding forecast · 2 maintenance windows planned
            </p>
            <div className="mobile-insights-stats">
              <div><span>3.4 GWh</span><label>Today</label></div>
              <div><span>412 t</span><label>CO₂ saved</label></div>
              <div><span>98%</span><label>Uptime</label></div>
            </div>
          </div>
        </section>

        {/* KPI grid */}
        <section className="md:hidden grid grid-cols-2 gap-2.5">
          {KPIS.map((k) => (
            <div key={k.label} className="mobile-kpi-card">
              <div className="flex items-center justify-between">
                <span className={`mobile-app-icon ${toneBg[k.tone]}`} style={{ width: "2rem", height: "2rem", borderRadius: "0.7rem" }}>
                  <k.icon className="h-4 w-4" strokeWidth={1.9} />
                </span>
                <span className="mobile-kpi-delta"><TrendingUp className="h-3 w-3" /> {k.delta}</span>
              </div>
              <div className="mt-2.5 text-[1.15rem] font-bold tracking-tight text-foreground">{k.value}</div>
              <div className="text-[0.7rem] text-muted-foreground">{k.label}</div>
            </div>
          ))}
        </section>

        {/* Generation chart card (placeholder visual bars) */}
        <section className="md:hidden mobile-chart-card">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">Generation</div>
              <h3 className="mt-0.5 text-[1rem] font-semibold tracking-tight text-foreground">Last 7 days</h3>
            </div>
            <span className="mobile-kpi-delta"><TrendingUp className="h-3 w-3" /> +8.2%</span>
          </div>
          <div className="mt-4 flex h-28 items-end gap-2">
            {[40, 55, 48, 70, 62, 85, 92].map((h, i) => (
              <div key={i} className="mobile-chart-bar" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[0.62rem] text-muted-foreground">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <span key={d}>{d}</span>)}
          </div>
        </section>

        {/* Site performance */}
        <section className="md:hidden">
          <h3 className="mb-2 px-1 text-[0.95rem] font-extrabold italic tracking-tight text-foreground">Site performance</h3>
          <div className="space-y-2">
            {[
              { name: "Rajasthan I", val: "1.12 GWh", pct: 96 },
              { name: "Gujarat II", val: "0.84 GWh", pct: 88 },
              { name: "Karnataka I", val: "0.72 GWh", pct: 81 },
            ].map((s) => (
              <div key={s.name} className="mobile-site-row">
                <div className="flex items-center justify-between">
                  <span className="text-[0.88rem] font-medium text-foreground">{s.name}</span>
                  <span className="text-[0.78rem] font-semibold text-foreground">{s.val}</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: "linear-gradient(90deg, var(--brand-purple), var(--brand-green))" }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
