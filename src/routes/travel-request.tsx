import { useEffect, useState } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard, ClipboardList, PlusCircle, Inbox, ShieldCheck, ScrollText,
  Plane, Hotel, Wallet, Paperclip, FileCheck2, Trash2, Pencil, Plus,
  Calendar, Clock, MapPin, Search, X, Save, Send,
  Home, Moon, Sun, BadgeCheck,
} from "lucide-react";
import { SparkleFab } from "@/components/SparkleFab";
import { DualHeading } from "@/components/DualHeading";
import { MobileAppHeader } from "@/components/MobileAppHeader";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/travel-request")({
  head: () => ({
    meta: [
      { title: "Travel Requests — Resolven" },
      { name: "description", content: "Raise, approve and track domestic and international travel requests." },
    ],
  }),
  component: TravelRequestPage,
});

type TabKey = "dashboard" | "my" | "new" | "queue" | "rules" | "audit" | "entitlement";

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "dashboard",   label: "Dashboard", icon: LayoutDashboard },
  { key: "my",          label: "My Requests", icon: ClipboardList },
  { key: "new",         label: "New Request", icon: PlusCircle },
  { key: "queue",       label: "Approval Queue", icon: Inbox },
  { key: "rules",       label: "Approval Rules", icon: ShieldCheck },
  { key: "audit",       label: "Audit Log", icon: ScrollText },
  { key: "entitlement", label: "Travel Entitlement", icon: BadgeCheck },
];

function TravelRequestPage() {
  const [tab, setTab] = useState<TabKey>("dashboard");

  return (
    <div className="min-h-screen">
      <div className="hidden md:block"><BrandedHero /></div>
      <main className="mx-auto w-full max-w-[1400px] space-y-4 px-4 py-4 sm:space-y-7 sm:px-6 sm:py-8">
        <MobileAppHeader pageLabel="Travel" searchPlaceholder="Search requests, policies…" />
        <TabBar tab={tab} onChange={setTab} />

        <div className="animate-rise">
          {tab === "dashboard"   && <DashboardTab onNew={() => setTab("new")} />}
          {tab === "my"          && <MyRequestsTab />}
          {tab === "new"         && <NewRequestTab onCancel={() => setTab("dashboard")} />}
          {tab === "queue"       && <ApprovalQueueTab />}
          {tab === "rules"       && <ApprovalRulesTab />}
          {tab === "audit"       && <AuditLogTab />}
          {tab === "entitlement" && <TravelEntitlementTab />}
        </div>
      </main>
      <SparkleFab />
    </div>
  );
}

/* ---------- Shared chrome ---------- */

function HeroThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("resolven-theme", next ? "dark" : "light"); } catch {}
  };
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center text-white/85 transition-all duration-200 hover:text-white hover:-translate-y-0.5"
    >
      {dark ? <Sun className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.9} /> : <Moon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.9} />}
    </button>
  );
}

function BrandedHero() {
  return (
    <header className="travel-hero relative w-full overflow-hidden border-b border-white/10 shadow-soft">
      <div className="travel-hero-atmosphere pointer-events-none absolute inset-0 mix-blend-screen" />
      <div className="relative mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <h1 className="font-display italic font-bold tracking-tight text-white text-[1.15rem] sm:text-[1.35rem] md:text-[1.5rem] leading-none">
          Travel Request
        </h1>
        <div className="flex items-center gap-1 sm:gap-2">
          <HeroThemeToggle />
          <Link
            to="/"
            aria-label="Home"
            className="inline-flex h-9 w-9 items-center justify-center text-white/85 transition-all duration-200 hover:text-white hover:-translate-y-0.5"
          >
            <Home className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.9} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function TabBar({ tab, onChange }: { tab: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <div className="mobile-tab-rail surface rounded-2xl p-1.5 sm:p-2 overflow-x-auto scrollbar-hide">
      <div className="flex min-w-max gap-1 lg:grid lg:min-w-0 lg:grid-cols-7">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                "group relative inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[12.5px] sm:text-sm font-medium whitespace-nowrap transition-all duration-300",
                "lg:w-full lg:justify-center",
                active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
              )}
            >
              <Icon className="h-4 w-4 opacity-90" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Reusable bits ---------- */

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("app-card surface rounded-2xl p-5 sm:p-6", className)}>{children}</div>
  );
}

function StatusPill({ status }: { status: "approved" | "pending" | "rejected" | "draft" | "completed" }) {
  const map: Record<typeof status, string> = {
    approved:  "bg-accent/15 text-accent ring-accent/25",
    completed: "bg-accent/15 text-accent ring-accent/25",
    pending:   "bg-amber-500/15 text-amber-600 ring-amber-500/25 dark:text-amber-300",
    rejected:  "bg-destructive/12 text-destructive ring-destructive/25",
    draft:     "bg-muted text-muted-foreground ring-border",
  } as const;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wider ring-1", map[status])}>
      {status}
    </span>
  );
}

function Field({ label, hint, children, required }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-[11.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}{required && <span className="text-destructive">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] font-light text-muted-foreground">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-border/70 bg-card/60 px-3.5 py-2.5 text-sm font-light text-foreground placeholder:text-muted-foreground/70 shadow-soft transition-all duration-200 focus:border-primary/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 backdrop-blur";
const selectClass = cn(inputClass, "travel-select");
const dateClass = cn(inputClass, "travel-date pr-14");
const timeClass = cn(inputClass, "travel-time pr-14");

/* ---------- Dashboard ---------- */

function DashboardTab({ onNew }: { onNew: () => void }) {
  const stats = [
    { label: "All Requests",      value: 0, icon: Plane },
    { label: "Awaiting My Approval", value: 0, icon: Inbox, accent: false },
    { label: "Pending Approval",  value: 0, icon: MapPin },
    { label: "Approved + Completed", value: 0, icon: FileCheck2 },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <button
            key={s.label}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-card/70 p-4 sm:p-5 text-left shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elev",
              s.accent ? "border-primary/30 ring-1 ring-primary/20" : "border-border/70",
            )}
          >
            <div className="flex items-center gap-2.5">
              <span className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg ring-1",
                s.accent ? "bg-primary/12 text-primary ring-primary/20" : "bg-secondary/60 text-secondary-foreground ring-border/60",
              )}>
                <s.icon className="h-4 w-4" strokeWidth={1.8} />
              </span>
              <span className="text-[10.5px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </span>
            </div>
            <div className="mt-3 text-3xl sm:text-[2rem] font-display italic text-foreground">{s.value}</div>
          </button>
        ))}
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <DualHeading text="Recent requests" />
            <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Your latest activity at a glance.</p>
          </div>
          <button onClick={onNew} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-[11.5px] font-medium uppercase tracking-[0.14em] text-primary-foreground shadow-soft transition hover:shadow-elev">
            <Plus className="h-3.5 w-3.5" /> New
          </button>
        </div>
        <EmptyState
          title="No travel requests yet"
          description="Click New Request to raise your first travel request."
        />
      </Card>
    </div>
  );
}

/* ---------- My Requests ---------- */

function MyRequestsTab() {
  const [scope, setScope] = useState<"mine" | "org">("mine");
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-xl bg-secondary/60 p-1">
          {(["mine", "org"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-[12px] font-medium transition",
                scope === s ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s === "mine" ? "My requests" : "All in org"}
            </button>
          ))}
        </div>
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input className={cn(inputClass, "pl-9")} placeholder="Search by ref no or purpose…" />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select className={selectClass}><option>All statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>
        <select className={selectClass}><option>All types</option><option>Domestic</option><option>International</option></select>
      </div>

      <div className="mt-5">
        <DataTable
          headers={["Ref no", "Purpose", "Type", "From → To", "Dates", "Cost", "Status", "Submitted"]}
          emptyText="No travel requests match the current filters."
        />
      </div>
    </Card>
  );
}

/* ---------- New Request ---------- */

type Leg = { id: string; from: string; to: string; departDate: string; departTime: string; returnDate: string; returnTime: string; airline: string };

function NewRequestTab({ onCancel }: { onCancel: () => void }) {
  const [section, setSection] = useState<"travel" | "stay" | "expense" | "files" | "summary">("travel");
  const [legs, setLegs] = useState<Leg[]>([
    { id: crypto.randomUUID(), from: "", to: "", departDate: "", departTime: "", returnDate: "", returnTime: "", airline: "" },
  ]);

  const addLeg = () =>
    setLegs((p) => [...p, { id: crypto.randomUUID(), from: "", to: "", departDate: "", departTime: "", returnDate: "", returnTime: "", airline: "" }]);
  const removeLeg = (id: string) => setLegs((p) => p.filter((l) => l.id !== id));
  const updateLeg = (id: string, patch: Partial<Leg>) =>
    setLegs((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const sections = [
    { key: "travel" as const,  label: "Travel",            icon: Plane },
    { key: "stay" as const,    label: "Accommodation",     icon: Hotel },
    { key: "expense" as const, label: "Expense & Advance", icon: Wallet },
    { key: "files" as const,   label: "Attachments",       icon: Paperclip },
    { key: "summary" as const, label: "Summary",           icon: FileCheck2 },
  ];

  return (
    <div className="space-y-5 pb-24 sm:pb-6">
      {/* Employee card */}
      <Card>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <ProfileField label="Employee"        value="Varshita P" />
          <ProfileField label="Employee ID"     value="varshita.p"  sub="varshita.pulidindi@partner.resolven.com" />
          <ProfileField label="Contact number"  value="7550081799" />
          <ProfileField label="Department"      value="—" />
          <ProfileField label="Designation"     value="—" />
          <Field label="Cost Center / Project Name">
            <input className={inputClass} placeholder="e.g. ENG-CC-101 or Gorbea Solar" />
          </Field>
        </div>
      </Card>

      {/* Inner section nav */}
      <div className="surface rounded-2xl p-1.5 overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max gap-1 lg:grid lg:min-w-0 lg:grid-cols-5">
          {sections.map(({ key, label, icon: Icon }) => {
            const active = section === key;
            return (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[12.5px] font-medium whitespace-nowrap transition lg:w-full lg:justify-center",
                  active ? "bg-accent text-accent-foreground shadow-soft" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <Icon className={cn("h-4 w-4", key === "files" && "text-primary")} /> {label}
              </button>
            );
          })}
        </div>
      </div>

      {section === "travel" && (
        <>
          <Card>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Travel type"><select className={selectClass}><option>Domestic</option><option>International</option></select></Field>
              <Field label="Mode"><select className={selectClass}><option>Air</option><option>Rail</option><option>Road</option></select></Field>
              <Field label="Priority"><select className={selectClass}><option>Normal</option><option>Urgent</option><option>Emergency</option></select></Field>
              <Field label="Air class"><select className={selectClass}><option>Economy</option><option>Premium Economy</option><option>Business</option></select></Field>
            </div>
            <div className="mt-4">
              <Field label="Travel purpose" required>
                <textarea rows={3} className={cn(inputClass, "resize-none")} placeholder="e.g. Customer kickoff for Gorbea Solar Project — week-long workshop with the operations team." />
              </Field>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <DualHeading text="Travel legs" />
                <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Multi-city trips: add a leg per hop. Returns can be entered as the last leg or via Return date.</p>
              </div>
              <button onClick={addLeg} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-[11.5px] font-medium uppercase tracking-[0.14em] text-white shadow-soft transition hover:bg-primary/90 hover:shadow-elev">
                <Plus className="h-3.5 w-3.5" /> Add leg
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {legs.map((leg, i) => (
                <div key={leg.id} className="relative rounded-2xl border border-border/70 bg-card/60 p-4 sm:p-5 shadow-soft backdrop-blur">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.16em] text-primary ring-1 ring-primary/15">
                      <Plane className="h-3.5 w-3.5" /> Leg {i + 1}
                    </span>
                    {legs.length > 1 && (
                      <button onClick={() => removeLeg(leg.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive" aria-label="Remove leg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="From"><input className={inputClass} value={leg.from} onChange={(e) => updateLeg(leg.id, { from: e.target.value })} placeholder="Mumbai" /></Field>
                    <Field label="To"><input className={inputClass} value={leg.to} onChange={(e) => updateLeg(leg.id, { to: e.target.value })} placeholder="Bengaluru" /></Field>
                    <Field label="Departure date">
                      <div className="relative">
                        <input type="date" className={dateClass} value={leg.departDate} onChange={(e) => updateLeg(leg.id, { departDate: e.target.value })} />
                        <Calendar className="pointer-events-none absolute right-[1.15rem] top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-white/85" />
                      </div>
                    </Field>
                    <Field label="Preferred departure time">
                      <div className="relative">
                        <input type="time" className={timeClass} value={leg.departTime} onChange={(e) => updateLeg(leg.id, { departTime: e.target.value })} />
                        <Clock className="pointer-events-none absolute right-[1.15rem] top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-white/85" />
                      </div>
                    </Field>
                    <Field label="Return date (optional)">
                      <div className="relative">
                        <input type="date" className={dateClass} value={leg.returnDate} onChange={(e) => updateLeg(leg.id, { returnDate: e.target.value })} />
                        <Calendar className="pointer-events-none absolute right-[1.15rem] top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-white/85" />
                      </div>
                    </Field>
                    <Field label="Preferred return time">
                      <div className="relative">
                        <input type="time" className={timeClass} value={leg.returnTime} onChange={(e) => updateLeg(leg.id, { returnTime: e.target.value })} />
                        <Clock className="pointer-events-none absolute right-[1.15rem] top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-white/85" />
                      </div>
                    </Field>
                    <Field label="Preferred airline"><input className={inputClass} value={leg.airline} onChange={(e) => updateLeg(leg.id, { airline: e.target.value })} placeholder="Indigo" /></Field>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {section === "stay" && (
        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="City"><input className={inputClass} placeholder="Bengaluru" /></Field>
            <Field label="Hotel preference"><input className={inputClass} placeholder="Any 4-star" /></Field>
            <Field label="Check-in">
              <div className="relative">
                <input type="date" className={dateClass} />
                <Calendar className="pointer-events-none absolute right-[1.15rem] top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-white/85" />
              </div>
            </Field>
            <Field label="Check-out">
              <div className="relative">
                <input type="date" className={dateClass} />
                <Calendar className="pointer-events-none absolute right-[1.15rem] top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-white/85" />
              </div>
            </Field>
            <Field label="Room type"><select className={selectClass}><option>Standard</option><option>Deluxe</option><option>Suite</option></select></Field>
            <Field label="Nightly budget (₹)"><input type="number" className={inputClass} placeholder="6000" /></Field>
          </div>
        </Card>
      )}

      {section === "expense" && (
        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Estimated cost (₹)"><input type="number" className={inputClass} placeholder="45000" /></Field>
            <Field label="Advance required (₹)"><input type="number" className={inputClass} placeholder="0" /></Field>
            <Field label="Currency"><select className={selectClass}><option>INR</option><option>USD</option><option>EUR</option></select></Field>
            <Field label="Cost category"><select className={selectClass}><option>Project travel</option><option>Training</option><option>Sales</option></select></Field>
          </div>
        </Card>
      )}

      {section === "files" && (
        <Card>
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-8 text-center">
            <Paperclip className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-2 text-sm font-medium text-foreground">Drop files or click to upload</p>
            <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Invitations, agendas, quotes — PDF, PNG, JPG up to 10MB.</p>
          </div>
        </Card>
      )}

      {section === "summary" && (
        <Card>
          <DualHeading text="Review & submit" />
          <p className="mt-1 text-[12px] font-light text-muted-foreground">Verify your details below. You can return to any section to edit before submitting.</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ["Employee", "Varshita P"],
              ["Travel type", "Domestic · Air · Economy"],
              ["Legs", `${legs.length} configured`],
              ["Priority", "Normal"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border/70 bg-card/60 px-4 py-3">
                <div className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{k}</div>
                <div className="mt-1 text-sm font-medium text-foreground">{v}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Sticky action bar */}
      <div className="sticky-cta sticky bottom-3 sm:bottom-4 z-20 mt-4">
        <div className="surface flex items-center justify-between gap-2 rounded-2xl px-3 py-2.5 sm:px-4">
          <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-medium text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground">
            <X className="h-4 w-4" /> Cancel
          </button>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-[12.5px] font-medium text-foreground shadow-soft transition hover:border-primary/40">
              <Save className="h-4 w-4" /> Save draft
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[12.5px] font-medium text-primary-foreground shadow-soft transition hover:shadow-elev">
              <Send className="h-4 w-4" /> Submit for approval
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
      {sub && <div className="text-[11px] font-light text-accent">{sub}</div>}
    </div>
  );
}

/* ---------- Approval Queue ---------- */

function ApprovalQueueTab() {
  const [filter, setFilter] = useState<"all" | "awaiting" | "approved" | "rejected">("all");
  const filters = [
    { key: "all" as const,      label: "All" },
    { key: "awaiting" as const, label: "Awaiting me" },
    { key: "approved" as const, label: "Approved by me" },
    { key: "rejected" as const, label: "Rejected by me" },
  ];
  return (
    <Card>
      <div className="inline-flex flex-wrap gap-1 rounded-xl bg-secondary/60 p-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-[12px] font-medium transition",
              filter === f.key ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="mt-5">
        <DataTable
          headers={["Ref no", "Requester", "Purpose", "Type", "From → To", "Cost", "Submitted", "Status"]}
          emptyText="No travel requests in your organisation yet."
        />
      </div>
    </Card>
  );
}

/* ---------- Approval Rules ---------- */

type Rule = { id: string; level: "L1" | "L2" | "L3"; name: string; travel: string; urgency: string; minCost?: number; approver: string; sla: number; active: boolean };

function ApprovalRulesTab() {
  const [rules, setRules] = useState<Rule[]>([
    { id: "1", level: "L1", name: "Manager / HOD approval (always required)", travel: "ANY", urgency: "ANY", approver: "TRAVEL_MANAGER", sla: 24, active: true },
    { id: "2", level: "L1", name: "Emergency — straight to CXO (24h SLA)",   travel: "ANY", urgency: "ANY", approver: "TRAVEL_CXO",    sla: 24, active: true },
    { id: "3", level: "L2", name: "Finance approval for cost > ₹50,000",       travel: "ANY", urgency: "ANY", minCost: 50000, approver: "TRAVEL_FINANCE", sla: 48, active: true },
    { id: "4", level: "L3", name: "CXO approval for International travel",     travel: "INTERNATIONAL", urgency: "ANY", approver: "TRAVEL_CXO", sla: 72, active: true },
  ]);
  const remove = (id: string) => setRules((p) => p.filter((r) => r.id !== id));

  return (
    <div className="space-y-5">
      <Card>
        <DualHeading text="Add rule" />
        <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Define an approval level with optional travel/urgency/cost gates.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Field label="Name"><input className={inputClass} placeholder="Rule name" /></Field>
          <Field label="Travel type"><select className={selectClass}><option>Any</option><option>Domestic</option><option>International</option></select></Field>
          <Field label="Urgency"><select className={selectClass}><option>Any</option><option>Normal</option><option>Urgent</option><option>Emergency</option></select></Field>
          <Field label="Min cost (₹)"><input className={inputClass} placeholder="—" /></Field>
          <Field label="Approver"><select className={selectClass}><option>Select approver</option><option>TRAVEL_MANAGER</option><option>TRAVEL_FINANCE</option><option>TRAVEL_CXO</option></select></Field>
          <Field label="Level"><input type="number" min={1} max={5} defaultValue={1} className={inputClass} /></Field>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-6">
          <Field label="SLA (hrs)"><input type="number" defaultValue={48} className={inputClass} /></Field>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[12.5px] font-medium text-primary-foreground shadow-soft transition hover:shadow-elev">
            <Plus className="h-4 w-4" /> Add rule
          </button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/40 text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {["Level", "Name", "Travel", "Urgency", "Min cost", "Approver", "SLA", "Active", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rules.map((r, i) => (
                <tr key={r.id} className={cn("border-t border-border/60 transition-colors hover:bg-secondary/30", i % 2 && "bg-card/40")}>
                  <td className="px-4 py-3"><span className="inline-flex h-7 min-w-[2.25rem] items-center justify-center rounded-lg bg-primary/12 px-2 text-[11px] font-medium text-primary ring-1 ring-primary/15">{r.level}</span></td>
                  <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.travel}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.urgency}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.minCost ? `₹ ${r.minCost.toLocaleString()}` : "—"}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{r.approver}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.sla}h</td>
                  <td className="px-4 py-3"><StatusPill status={r.active ? "approved" : "draft"} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => remove(r.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ---------- Audit Log ---------- */

function AuditLogTab() {
  const [type, setType] = useState("all");
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <select value={type} onChange={(e) => setType(e.target.value)} className={cn(selectClass, "sm:max-w-md")}>
          <option value="all">All event types</option>
          <option>Created</option><option>Approved</option><option>Rejected</option><option>Edited</option>
        </select>
        <div className="text-[11.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">0 events</div>
      </div>
      <div className="mt-5">
        <DataTable headers={["When", "Event", "Request", "Actor", "Details"]} emptyText="No events match the current filter." />
      </div>
    </Card>
  );
}

/* ---------- Shared table / empty ---------- */

function DataTable({ headers, emptyText }: { headers: string[]; emptyText: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40">
            <tr className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={headers.length} className="px-4 py-12 text-center text-sm font-light text-muted-foreground">
                {emptyText}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-10 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
        <Plane className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-[12px] font-light text-muted-foreground">{description}</p>
    </div>
  );
}

/* ---------- Travel Entitlement ---------- */

type Entitlement = {
  grade: string;
  domesticAir: string;
  hotelMetro: string;
  hotelNonMetro: string;
  localCar: string;
  outstationCar: string;
  dailyLimit: string;
};

const ENTITLEMENTS: Entitlement[] = [
  { grade: "CXO",        domesticAir: "Premium Economy", hotelMetro: "₹ 25,000", hotelNonMetro: "₹ 20,000", localCar: "SUV",            outstationCar: "SUV", dailyLimit: "₹ 4,000 / On Actuals" },
  { grade: "VP and above", domesticAir: "Economy",       hotelMetro: "₹ 15,000", hotelNonMetro: "₹ 10,000", localCar: "SUV",            outstationCar: "SUV", dailyLimit: "On Actuals" },
  { grade: "DGM to AVP", domesticAir: "Economy",         hotelMetro: "₹ 10,000", hotelNonMetro: "₹ 7,000",  localCar: "Premium Sedan",  outstationCar: "SUV", dailyLimit: "₹ 3,000" },
  { grade: "SM to GET",  domesticAir: "Economy",         hotelMetro: "₹ 7,000",  hotelNonMetro: "₹ 5,000",  localCar: "Sedan / H-Back", outstationCar: "SUV", dailyLimit: "₹ 2,500" },
];

function TravelEntitlementTab() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <Card>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <DualHeading text="Travel Entitlement Matrix" />
            <p className="mt-1 text-[12px] font-light text-muted-foreground">
              Approved travel, accommodation, and per-diem ceilings by grade. Used to validate every travel request automatically.
            </p>
          </div>
          <span className="inline-flex w-max items-center gap-1.5 rounded-full bg-accent/12 px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.16em] text-accent ring-1 ring-accent/20">
            <BadgeCheck className="h-3.5 w-3.5" /> Policy v2025.1
          </span>
        </div>
      </Card>

      {/* Desktop / tablet table */}
      <Card className="hidden p-0 overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/40 text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {["Grade", "Domestic Air", "Hotel Metro (max/night)", "Hotel Non-Metro (max/night)", "Local Car <150km", "Outstation Car >150km", "Travel Daily Limit (self)"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ENTITLEMENTS.map((r, i) => (
                <tr
                  key={r.grade}
                  className={cn(
                    "border-t border-border/50 transition-colors hover:bg-primary/[0.04]",
                    i % 2 && "bg-card/40",
                  )}
                >
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-lg bg-primary/12 px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-primary ring-1 ring-primary/15">
                      {r.grade}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-foreground font-light">{r.domesticAir}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{r.hotelMetro}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{r.hotelNonMetro}</td>
                  <td className="px-5 py-4 text-foreground font-light">{r.localCar}</td>
                  <td className="px-5 py-4 text-foreground font-light">{r.outstationCar}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-accent/12 px-2.5 py-1 text-[11.5px] font-medium text-accent ring-1 ring-accent/20">
                      {r.dailyLimit}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {ENTITLEMENTS.map((r) => (
          <div key={r.grade} className="surface rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex items-center rounded-lg bg-primary/12 px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-primary ring-1 ring-primary/15">
                {r.grade}
              </span>
              <span className="inline-flex items-center rounded-full bg-accent/12 px-2.5 py-0.5 text-[10.5px] font-medium text-accent ring-1 ring-accent/20">
                {r.dailyLimit}
              </span>
            </div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-[12.5px]">
              <EntitlementMobileRow label="Domestic Air" value={r.domesticAir} />
              <EntitlementMobileRow label="Hotel Metro" value={r.hotelMetro} />
              <EntitlementMobileRow label="Hotel Non-Metro" value={r.hotelNonMetro} />
              <EntitlementMobileRow label="Local Car <150km" value={r.localCar} />
              <EntitlementMobileRow label="Outstation Car" value={r.outstationCar} />
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

function EntitlementMobileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-foreground font-light">{value}</dd>
    </div>
  );
}
