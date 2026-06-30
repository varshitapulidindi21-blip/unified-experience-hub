import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Wrench, Cog, HardHat, CheckCircle2, FileText, FilePlus2, ClipboardList,
  Search, Filter, Calendar, MapPin, Plus, Download, ChevronDown, ShieldCheck,
  AlertTriangle, Clock, Ban, XCircle, FolderOpen, Hourglass, ShieldAlert,
  CircleCheck, CircleAlert, Lock, ClipboardCheck, Layers,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { SparkleFab } from "@/components/SparkleFab";
import { DualHeading } from "@/components/DualHeading";
import { MobileAppHeader } from "@/components/MobileAppHeader";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/permit-system")({
  head: () => ({
    meta: [
      { title: "Permit System — Resolven" },
      { name: "description", content: "Permit to Work — S1, S2, S3 approval workflow, PM Checklists and analytics." },
    ],
  }),
  component: PermitSystemPage,
});

type RoleKey = "s1" | "s2" | "s3" | "summary";
type SubKey = "my" | "request" | "checklist";

const ROLES: { key: RoleKey; label: string; icon: React.ComponentType<{ className?: string }>; sub: string }[] = [
  { key: "s1", label: "S1 — Technician", icon: Wrench, sub: "Raise, track and close PTW requests." },
  { key: "s2", label: "S2 — Engineer", icon: Cog, sub: "Review and recommend technician requests." },
  { key: "s3", label: "S3 — Manager", icon: HardHat, sub: "Issue approvals and manage permit closures." },
  { key: "summary", label: "Summary", icon: CheckCircle2, sub: "Cross-site analytics and KPI rollups." },
];

const SITES = ["ASPL", "Gorbea", "Bikaner", "Tumkur", "Madhya Solar"];

/* ---------- Demo data ---------- */

type PTW = {
  ref: string;
  site: string;
  location: string;
  workOrder: string;
  status: "open" | "pend-s2" | "pend-s3" | "approved" | "ext-req" | "close-req" | "close-ok" | "closed" | "expired" | "rejected" | "stopped";
  datePlanned: string;
  raisedBy: string;
};

const PTWs: PTW[] = [
  { ref: "PTW-2026-00184", site: "ASPL",   location: "Inverter Block A · INV-04", workOrder: "WO-78421",  status: "pend-s2",   datePlanned: "2026-06-30", raisedBy: "R. Mehta" },
  { ref: "PTW-2026-00183", site: "ASPL",   location: "MV Yard · TX-02",            workOrder: "WO-78410",  status: "pend-s3",   datePlanned: "2026-06-29", raisedBy: "V. Pulidindi" },
  { ref: "PTW-2026-00182", site: "Gorbea", location: "String Combiner SCB-17",     workOrder: "WO-78388",  status: "approved",  datePlanned: "2026-06-29", raisedBy: "K. Iyer" },
  { ref: "PTW-2026-00181", site: "ASPL",   location: "SCADA Cabinet",              workOrder: "WO-78366",  status: "close-req", datePlanned: "2026-06-28", raisedBy: "R. Mehta" },
  { ref: "PTW-2026-00180", site: "Bikaner",location: "Tracker Row TR-09",          workOrder: "WO-78351",  status: "closed",    datePlanned: "2026-06-27", raisedBy: "A. Sharma" },
  { ref: "PTW-2026-00179", site: "ASPL",   location: "HT Switchyard",              workOrder: "WO-78344",  status: "ext-req",   datePlanned: "2026-06-27", raisedBy: "P. Rao" },
  { ref: "PTW-2026-00178", site: "Tumkur", location: "Inverter Block C · INV-12",  workOrder: "WO-78329",  status: "open",      datePlanned: "2026-06-26", raisedBy: "S. Nair" },
  { ref: "PTW-2026-00177", site: "ASPL",   location: "DC String 3·B",              workOrder: "WO-78318",  status: "expired",   datePlanned: "2026-06-25", raisedBy: "R. Mehta" },
  { ref: "PTW-2026-00176", site: "Gorbea", location: "Met Mast",                   workOrder: "WO-78310",  status: "rejected",  datePlanned: "2026-06-25", raisedBy: "K. Iyer" },
  { ref: "PTW-2026-00175", site: "ASPL",   location: "BoP Pump House",             workOrder: "WO-78301",  status: "stopped",   datePlanned: "2026-06-24", raisedBy: "P. Rao" },
];

function PermitSystemPage() {
  const [role, setRole] = useState<RoleKey>("s1");
  const [site, setSite] = useState<string>("ASPL");
  const [startDate, setStartDate] = useState("2026-06-18");
  const [endDate, setEndDate] = useState("2026-06-30");

  return (
    <div className="min-h-screen">
      <div className="hidden md:block"><TopBar /></div>
      <main className="mx-auto w-full max-w-[1400px] space-y-4 px-4 py-4 sm:space-y-7 sm:px-6 sm:py-8">
        <MobileAppHeader pageLabel="Permit System" searchPlaceholder="Search PTW, WO, site…" />

        <PageHeader role={role} />

        <RoleSwitcher role={role} onChange={setRole} />

        <UniversalFilter site={site} setSite={setSite} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />

        <div className="animate-rise">
          {role === "s1" && <RoleSection role="s1" site={site} />}
          {role === "s2" && <RoleSection role="s2" site={site} />}
          {role === "s3" && <RoleSection role="s3" site={site} />}
          {role === "summary" && <SummarySection site={site} />}
        </div>
      </main>
      <SparkleFab />
    </div>
  );
}

/* ---------- Page chrome ---------- */

function PageHeader({ role }: { role: RoleKey }) {
  const meta = ROLES.find((r) => r.key === role)!;
  const heading =
    role === "s1" ? "Permit S1"
    : role === "s2" ? "Permit S2"
    : role === "s3" ? "Permit S3"
    : "Permit Summary";
  const portal =
    role === "s1" ? "S1 Portal"
    : role === "s2" ? "S2 Portal"
    : role === "s3" ? "S3 Portal"
    : "Analytics";
  return (
    <div className="hidden items-end justify-between gap-4 md:flex">
      <div>
        <h1 className="font-display italic text-[1.7rem] sm:text-[2rem] md:text-[2.4rem] leading-tight">
          <span className="text-primary dark:text-white">{heading.split(" ")[0]}</span>{" "}
          <span className="text-accent">{heading.split(" ").slice(1).join(" ")}</span>
        </h1>
        <p className="mt-1 text-[12.5px] font-light text-muted-foreground">{meta.sub}</p>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/12 px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.16em] text-accent ring-1 ring-accent/20">
        <ShieldCheck className="h-3.5 w-3.5" /> {portal}
      </span>
    </div>
  );
}

function RoleSwitcher({ role, onChange }: { role: RoleKey; onChange: (r: RoleKey) => void }) {
  return (
    <div className="surface rounded-2xl p-1.5 sm:p-2 overflow-x-auto scrollbar-hide">
      <div className="flex min-w-max gap-1 lg:grid lg:min-w-0 lg:grid-cols-4">
        {ROLES.map(({ key, label, icon: Icon }) => {
          const active = role === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                "group relative inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[12.5px] sm:text-sm font-medium whitespace-nowrap transition-all duration-300 lg:w-full lg:justify-center",
                active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
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

function UniversalFilter({
  site, setSite, startDate, setStartDate, endDate, setEndDate,
}: {
  site: string; setSite: (s: string) => void;
  startDate: string; setStartDate: (s: string) => void;
  endDate: string; setEndDate: (s: string) => void;
}) {
  return (
    <div className="app-card surface rounded-2xl p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        <Filter className="h-3.5 w-3.5" /> Universal filter · applies to all sections
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Site" icon={<MapPin className="h-3.5 w-3.5" />}>
          <select value={site} onChange={(e) => setSite(e.target.value)} className={selectClass}>
            {SITES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Start date" icon={<Calendar className="h-3.5 w-3.5" />}>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={dateClass} />
        </Field>
        <Field label="End date" icon={<Calendar className="h-3.5 w-3.5" />}>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={dateClass} />
        </Field>
      </div>
      <div className="mt-3 text-[11.5px] font-light text-muted-foreground">
        <span className="font-medium text-foreground">{site}</span> · {startDate} → {endDate}
      </div>
    </div>
  );
}

/* ---------- Field / input primitives ---------- */

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {icon}{label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-border/70 bg-card/60 px-3.5 py-2.5 text-sm font-light text-foreground placeholder:text-muted-foreground/70 shadow-soft transition-all duration-200 focus:border-primary/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 backdrop-blur";
const selectClass = cn(inputClass, "appearance-none pr-9");
const dateClass = cn(inputClass, "pr-3");

/* ---------- Card + StatusPill ---------- */

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("app-card surface rounded-2xl p-5 sm:p-6", className)}>{children}</div>;
}

const STATUS_META: Record<PTW["status"], { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  open:        { label: "Open",        cls: "bg-blue-500/12 text-blue-600 ring-blue-500/25 dark:text-blue-300",   icon: FolderOpen },
  "pend-s2":   { label: "Pend. S2",    cls: "bg-amber-500/15 text-amber-600 ring-amber-500/25 dark:text-amber-300", icon: Hourglass },
  "pend-s3":   { label: "Pend. S3",    cls: "bg-amber-500/15 text-amber-600 ring-amber-500/25 dark:text-amber-300", icon: Hourglass },
  approved:    { label: "Approved",    cls: "bg-accent/15 text-accent ring-accent/25",                              icon: CircleCheck },
  "ext-req":   { label: "Ext. Req.",   cls: "bg-purple-500/12 text-purple-600 ring-purple-500/25 dark:text-purple-300", icon: CircleAlert },
  "close-req": { label: "Close Req.",  cls: "bg-amber-500/15 text-amber-600 ring-amber-500/25 dark:text-amber-300", icon: ClipboardCheck },
  "close-ok":  { label: "Close OK",    cls: "bg-sky-500/15 text-sky-600 ring-sky-500/25 dark:text-sky-300",         icon: CheckCircle2 },
  closed:      { label: "Closed",      cls: "bg-muted text-muted-foreground ring-border",                            icon: Lock },
  expired:     { label: "Expired",     cls: "bg-destructive/12 text-destructive ring-destructive/25",               icon: Clock },
  rejected:    { label: "Rejected",    cls: "bg-destructive/12 text-destructive ring-destructive/25",               icon: XCircle },
  stopped:     { label: "Stopped",     cls: "bg-orange-500/15 text-orange-600 ring-orange-500/25 dark:text-orange-300", icon: Ban },
};

function StatusPill({ status }: { status: PTW["status"] }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wider ring-1", meta.cls)}>
      <Icon className="h-3 w-3" /> {meta.label}
    </span>
  );
}

/* ---------- KPI cards ---------- */

type Kpi = { key: string; label: string; value: number; icon: React.ComponentType<{ className?: string }>; tone: "default" | "amber" | "accent" | "blue" | "purple" | "red" | "orange" | "muted" };

const TONE: Record<Kpi["tone"], string> = {
  default: "border-primary/30 ring-primary/15 [&_.kpi-icon]:bg-primary/12 [&_.kpi-icon]:text-primary",
  amber:   "border-amber-500/30 ring-amber-500/15 [&_.kpi-icon]:bg-amber-500/15 [&_.kpi-icon]:text-amber-600 dark:[&_.kpi-icon]:text-amber-300",
  accent:  "border-accent/30 ring-accent/15 [&_.kpi-icon]:bg-accent/15 [&_.kpi-icon]:text-accent",
  blue:    "border-blue-500/30 ring-blue-500/15 [&_.kpi-icon]:bg-blue-500/12 [&_.kpi-icon]:text-blue-600 dark:[&_.kpi-icon]:text-blue-300",
  purple:  "border-purple-500/30 ring-purple-500/15 [&_.kpi-icon]:bg-purple-500/12 [&_.kpi-icon]:text-purple-600 dark:[&_.kpi-icon]:text-purple-300",
  red:     "border-destructive/30 ring-destructive/15 [&_.kpi-icon]:bg-destructive/12 [&_.kpi-icon]:text-destructive",
  orange:  "border-orange-500/30 ring-orange-500/15 [&_.kpi-icon]:bg-orange-500/15 [&_.kpi-icon]:text-orange-600 dark:[&_.kpi-icon]:text-orange-300",
  muted:   "border-border/70 ring-border [&_.kpi-icon]:bg-secondary/60 [&_.kpi-icon]:text-secondary-foreground",
};

function KpiGrid({ items, columns = 6 }: { items: Kpi[]; columns?: 4 | 5 | 6 }) {
  const gridCls = columns === 4 ? "lg:grid-cols-4" : columns === 5 ? "lg:grid-cols-5" : "lg:grid-cols-6";
  return (
    <div>
      <div className="mb-3 text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground">KPI Summary</div>
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4", gridCls)}>
        {items.map((s) => (
          <button
            key={s.key}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-card/70 p-4 sm:p-4 text-left shadow-soft backdrop-blur ring-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elev",
              TONE[s.tone],
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="kpi-icon flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-inset ring-white/0">
                <s.icon className="h-4 w-4" />
              </span>
              <div className="text-[1.65rem] sm:text-[1.85rem] font-display italic leading-none text-foreground">{s.value}</div>
            </div>
            <div className="mt-3 text-[10.5px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {s.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- KPI rollups ---------- */

function useKpis(role: RoleKey, site: string): { primary: Kpi[]; secondary: Kpi[] } {
  return useMemo(() => {
    const rows = PTWs.filter((p) => p.site === site);
    const count = (s: PTW["status"]) => rows.filter((p) => p.status === s).length;
    const primary: Kpi[] = [
      { key: "total",    label: "Total",     value: rows.length, icon: ClipboardList, tone: "default" },
      { key: "open",     label: "Open",      value: count("open"), icon: FolderOpen, tone: "amber" },
      { key: "pend-s2",  label: "Pend. S2",  value: count("pend-s2"), icon: Hourglass, tone: "amber" },
      { key: "pend-s3",  label: "Pend. S3",  value: count("pend-s3"), icon: Hourglass, tone: "amber" },
      { key: "approved", label: "Approved",  value: count("approved"), icon: CircleCheck, tone: "accent" },
      { key: "ext-req",  label: "Ext. Req.", value: count("ext-req"), icon: CircleAlert, tone: "purple" },
      { key: "close-req",label: "Close Req.",value: count("close-req"), icon: ClipboardCheck, tone: "amber" },
      { key: "close-ok", label: "Close OK",  value: count("close-ok"), icon: CheckCircle2, tone: "blue" },
      { key: "closed",   label: "Closed",    value: count("closed"), icon: Lock, tone: "muted" },
    ];
    const secondary: Kpi[] = [
      { key: "expired",  label: "Expired",   value: count("expired"), icon: Clock, tone: "red" },
      { key: "rejected", label: "Rejected",  value: count("rejected"), icon: XCircle, tone: "red" },
      { key: "stopped",  label: "Stopped",   value: count("stopped"), icon: Ban, tone: "orange" },
    ];
    // S2 sees a slightly trimmed primary list, S1 sees the request-focused subset
    if (role === "s1") return { primary: primary.slice(0, 5), secondary };
    if (role === "s2") return { primary: primary.slice(0, 6), secondary };
    return { primary, secondary };
  }, [role, site]);
}

/* ---------- Role section ---------- */

function RoleSection({ role, site }: { role: Exclude<RoleKey, "summary">; site: string }) {
  const [sub, setSub] = useState<SubKey>("my");
  const { primary, secondary } = useKpis(role, site);

  const subTabs: { key: SubKey; label: string; icon: React.ComponentType<{ className?: string }> }[] =
    role === "s3"
      ? [
          { key: "my",        label: "My PTWs",     icon: FileText },
          { key: "checklist", label: "PM Checklist", icon: ClipboardList },
        ]
      : [
          { key: "my",        label: "My PTWs",     icon: FileText },
          { key: "request",   label: "Request PTW", icon: FilePlus2 },
          { key: "checklist", label: "PM Checklist", icon: ClipboardList },
        ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {role === "s3" && (
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <DualHeading text="Manager actions" />
              <p className="mt-0.5 text-[12px] font-light text-muted-foreground">Open new work or initiate a PM checklist for this site.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2 text-[12.5px] font-medium text-accent shadow-soft transition hover:bg-accent/15">
                <ClipboardCheck className="h-4 w-4" /> Create Checklist
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-[12.5px] font-medium text-accent-foreground shadow-soft transition hover:shadow-elev">
                <Plus className="h-4 w-4" /> Create Work Order
              </button>
            </div>
          </div>
        </Card>
      )}

      <KpiGrid items={primary} columns={role === "s3" ? 6 : 5} />
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {secondary.map((s) => (
          <button
            key={s.key}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-card/70 p-4 text-left shadow-soft backdrop-blur ring-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elev",
              TONE[s.tone],
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="kpi-icon flex h-8 w-8 items-center justify-center rounded-lg">
                <s.icon className="h-4 w-4" />
              </span>
              <div className="text-[1.65rem] font-display italic leading-none text-foreground">{s.value}</div>
            </div>
            <div className="mt-3 text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Sub tabs */}
      <div className="surface rounded-2xl p-1.5 overflow-x-auto scrollbar-hide">
        <div className={cn("flex min-w-max gap-1 lg:min-w-0", subTabs.length === 3 ? "lg:grid lg:grid-cols-3" : "lg:grid lg:grid-cols-2")}>
          {subTabs.map(({ key, label, icon: Icon }) => {
            const active = sub === key;
            return (
              <button
                key={key}
                onClick={() => setSub(key)}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-[12.5px] font-medium whitespace-nowrap transition lg:w-full",
                  active ? "bg-accent text-accent-foreground shadow-soft" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="animate-rise">
        {sub === "my"        && <MyPTWsTab role={role} site={site} />}
        {sub === "request"   && role !== "s3" && <RequestPTWTab role={role} />}
        {sub === "checklist" && <PMChecklistTab site={site} />}
      </div>
    </div>
  );
}

/* ---------- My PTWs ---------- */

function MyPTWsTab({ role, site }: { role: Exclude<RoleKey, "summary">; site: string }) {
  const [search, setSearch] = useState("");
  const rows = PTWs.filter((p) => p.site === site).filter((p) =>
    !search ? true : [p.ref, p.workOrder, p.location, p.raisedBy].some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );
  const queueLabel = role === "s1" ? "S1 queue" : role === "s2" ? "S2 queue" : "S3 queue";

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 sm:pb-4">
        <div>
          <DualHeading text="My PTW" />
          <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">{rows.length} records · {site}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(inputClass, "pl-9 sm:min-w-[280px]")}
              placeholder="Search work order, site, location…"
            />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-3 py-1.5 text-[11px] font-medium text-secondary-foreground">
            {rows.length} records
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/12 px-3 py-1.5 text-[11px] font-medium text-blue-600 dark:text-blue-300 ring-1 ring-blue-500/25">
            {queueLabel}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40">
            <tr className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {["Work order", "Site", "Location / equipment", "Status", "Date planned", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-14 text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                    <FileText className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-foreground">No records match the selected filter</p>
                  <p className="mt-1 text-[12px] font-light text-muted-foreground">Click Total in the KPI row above to see all records</p>
                </td>
              </tr>
            ) : rows.map((p, i) => (
              <tr key={p.ref} className={cn("border-t border-border/60 transition-colors hover:bg-secondary/30", i % 2 && "bg-card/40")}>
                <td className="px-4 py-3 font-medium text-foreground">
                  <div>{p.workOrder}</div>
                  <div className="text-[11px] font-light text-muted-foreground">{p.ref}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.site}</td>
                <td className="px-4 py-3 text-foreground">{p.location}</td>
                <td className="px-4 py-3"><StatusPill status={p.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{p.datePlanned}</td>
                <td className="px-4 py-3">
                  <button className="rounded-lg border border-border/70 bg-card/60 px-3 py-1.5 text-[11.5px] font-medium text-foreground transition hover:border-primary/40 hover:shadow-soft">
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ---------- Request PTW ---------- */

function RequestPTWTab({ role }: { role: "s1" | "s2" }) {
  const [selected, setSelected] = useState<string[]>([]);
  const available = PTWs.filter((p) => p.status === "open" || p.status === "pend-s2");

  const toggle = (wo: string) =>
    setSelected((p) => (p.includes(wo) ? p.filter((x) => x !== wo) : [...p, wo]));

  return (
    <div className="space-y-5">
      <Card>
        <DualHeading text="Request PTW" />
        <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">
          {role === "s1"
            ? "Select one or more work orders and submit them for S2 review."
            : "Forward S1 requests to S3 with engineering recommendations."}
        </p>

        <div className="mt-4">
          <Field label="Work orders">
            <div className="rounded-xl border border-border/70 bg-card/60 px-3.5 py-3 shadow-soft">
              {selected.length === 0 ? (
                <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                  <span>Click to select work orders…</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {selected.map((wo) => (
                    <span key={wo} className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1 text-[11px] font-medium text-primary ring-1 ring-primary/20">
                      {wo}
                      <button onClick={() => toggle(wo)} className="text-primary/70 hover:text-primary">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Field>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {available.map((p) => {
            const active = selected.includes(p.workOrder);
            return (
              <button
                key={p.ref}
                onClick={() => toggle(p.workOrder)}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border bg-card/60 px-4 py-3 text-left shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elev",
                  active ? "border-primary/50 ring-1 ring-primary/20" : "border-border/70",
                )}
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">{p.workOrder}</div>
                  <div className="truncate text-[11.5px] font-light text-muted-foreground">{p.location}</div>
                </div>
                <StatusPill status={p.status} />
              </button>
            );
          })}
        </div>
      </Card>

      {selected.length === 0 ? (
        <Card>
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-10 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <ClipboardList className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">Select one or more work orders from the dropdown above</p>
            <p className="mt-1 text-[12px] font-light text-muted-foreground">You can submit multiple PTW requests in a single batch.</p>
          </div>
        </Card>
      ) : (
        <Card>
          <DualHeading text="Hazard & controls" />
          <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Capture isolation, PPE and emergency notes before forwarding.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Type of work"><select className={selectClass}><option>Electrical — LV</option><option>Electrical — HV</option><option>Mechanical</option><option>Hot work</option><option>Working at height</option></select></Field>
            <Field label="Risk rating"><select className={selectClass}><option>Low</option><option>Medium</option><option>High</option></select></Field>
            <Field label="Isolation required"><select className={selectClass}><option>Yes</option><option>No</option></select></Field>
            <Field label="PPE checklist"><input className={inputClass} placeholder="Hard hat, gloves, FR clothing…" /></Field>
            <div className="sm:col-span-2">
              <Field label="Description of work">
                <textarea rows={3} className={cn(inputClass, "resize-none")} placeholder="Describe the scope of work, hazards identified and proposed mitigations…" />
              </Field>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-[12.5px] font-medium text-foreground shadow-soft transition hover:border-primary/40">Save draft</button>
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[12.5px] font-medium text-primary-foreground shadow-soft transition hover:shadow-elev">
              Submit to {role === "s1" ? "S2" : "S3"} ({selected.length})
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ---------- PM Checklist ---------- */

type PMRow = { id: string; title: string; site: string; assignee: string; due: string; status: "open-points" | "awaiting-s2" | "awaiting-s3" | "closure-pending" | "closed" | "followup" };
const PM_ROWS: PMRow[] = [
  { id: "PM-26-0411", title: "Quarterly Inverter PM",       site: "ASPL",    assignee: "R. Mehta",     due: "2026-07-05", status: "open-points" },
  { id: "PM-26-0410", title: "MV Switchgear thermography",  site: "ASPL",    assignee: "K. Iyer",      due: "2026-07-02", status: "awaiting-s2" },
  { id: "PM-26-0409", title: "SCB cleaning & retorque",     site: "Gorbea",  assignee: "V. Pulidindi", due: "2026-07-01", status: "awaiting-s3" },
  { id: "PM-26-0408", title: "Tracker actuator service",    site: "Bikaner", assignee: "A. Sharma",    due: "2026-06-30", status: "closure-pending" },
  { id: "PM-26-0407", title: "BoP water tank inspection",   site: "ASPL",    assignee: "P. Rao",       due: "2026-06-28", status: "closed" },
  { id: "PM-26-0406", title: "Battery room ventilation",    site: "Tumkur",  assignee: "S. Nair",      due: "2026-06-26", status: "followup" },
];

const PM_STATUS: Record<PMRow["status"], { label: string; cls: string }> = {
  "open-points":     { label: "Open Points",     cls: "bg-destructive/12 text-destructive ring-destructive/25" },
  "awaiting-s2":     { label: "Awaiting S2",     cls: "bg-amber-500/15 text-amber-600 ring-amber-500/25 dark:text-amber-300" },
  "awaiting-s3":     { label: "Awaiting S3",     cls: "bg-blue-500/12 text-blue-600 ring-blue-500/25 dark:text-blue-300" },
  "closure-pending": { label: "Closure Pending", cls: "bg-purple-500/12 text-purple-600 ring-purple-500/25 dark:text-purple-300" },
  closed:            { label: "Closed",          cls: "bg-accent/15 text-accent ring-accent/25" },
  followup:          { label: "Follow-up WO",    cls: "bg-secondary text-secondary-foreground ring-border" },
};

function PMChecklistTab({ site }: { site: string }) {
  const rows = PM_ROWS.filter((r) => r.site === site);
  const count = (s: PMRow["status"]) => PM_ROWS.filter((r) => r.site === site && r.status === s).length;
  const items: Kpi[] = [
    { key: "total",  label: "Total",          value: rows.length, icon: ClipboardList, tone: "default" },
    { key: "open",   label: "Open Points",    value: count("open-points"), icon: AlertTriangle, tone: "red" },
    { key: "aw-s2",  label: "Awaiting S2",    value: count("awaiting-s2"), icon: Hourglass, tone: "amber" },
    { key: "aw-s3",  label: "Awaiting S3",    value: count("awaiting-s3"), icon: Hourglass, tone: "blue" },
    { key: "close",  label: "Closure Pending",value: count("closure-pending"), icon: ClipboardCheck, tone: "purple" },
    { key: "closed", label: "Closed",         value: count("closed"), icon: Lock, tone: "accent" },
    { key: "fu",     label: "Follow-up WOs",  value: count("followup"), icon: ShieldAlert, tone: "muted" },
  ];

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <DualHeading text="PM Checklists" />
            <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">{rows.length} records · PM checklist summary</p>
          </div>
          <button className="inline-flex w-max items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-[11.5px] font-medium text-foreground shadow-soft transition hover:border-primary/40">
            <Download className="h-3.5 w-3.5" /> Export insights
          </button>
        </div>
        <div className="mt-5">
          <KpiGrid items={items} />
        </div>
      </Card>

      <Card>
        <DualHeading text="Management insights" />
        <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Analytics window applies to the insight panels below.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="From"><input type="date" defaultValue="2026-03-26" className={dateClass} /></Field>
          <Field label="To"><input type="date" defaultValue="2026-06-24" className={dateClass} /></Field>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Planned WOs",   value: "184", icon: ClipboardList, sub: "in window" },
            { label: "PTWs Closed",   value: "127", icon: CheckCircle2,  sub: "69% closure rate" },
            { label: "Completion",    value: "82%", icon: Layers,        sub: "on-time vs planned" },
            { label: "Avg full cycle",value: "3.4d",icon: Hourglass,     sub: "request → closure" },
          ].map((m) => (
            <div key={m.label} className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-soft">
              <div className="flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                <m.icon className="h-3.5 w-3.5" /> {m.label}
              </div>
              <div className="mt-2 text-[1.65rem] font-display italic text-foreground">{m.value}</div>
              <div className="text-[11px] font-light text-muted-foreground">{m.sub}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {["Ref", "Title", "Assignee", "Due", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm font-light text-muted-foreground">No PM checklists for this site in the window.</td></tr>
              ) : rows.map((r, i) => {
                const meta = PM_STATUS[r.status];
                return (
                  <tr key={r.id} className={cn("border-t border-border/60 transition-colors hover:bg-secondary/30", i % 2 && "bg-card/40")}>
                    <td className="px-4 py-3 font-medium text-foreground">{r.id}</td>
                    <td className="px-4 py-3 text-foreground">{r.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.assignee}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.due}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wider ring-1", meta.cls)}>{meta.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ---------- Summary section ---------- */

function SummarySection({ site }: { site: string }) {
  const all = PTWs.length;
  const closed = PTWs.filter((p) => p.status === "closed" || p.status === "close-ok").length;
  const pending = PTWs.filter((p) => p.status.startsWith("pend")).length;
  const expired = PTWs.filter((p) => p.status === "expired").length;

  const items: Kpi[] = [
    { key: "all",     label: "All PTWs",    value: all,     icon: ClipboardList, tone: "default" },
    { key: "closed",  label: "Closed",      value: closed,  icon: CheckCircle2,  tone: "accent" },
    { key: "pending", label: "Pending",     value: pending, icon: Hourglass,     tone: "amber" },
    { key: "expired", label: "Expired",     value: expired, icon: Clock,         tone: "red" },
  ];

  const byStatus = (Object.keys(STATUS_META) as PTW["status"][]).map((s) => ({
    status: s,
    count: PTWs.filter((p) => p.status === s).length,
  }));
  const maxCount = Math.max(1, ...byStatus.map((b) => b.count));

  return (
    <div className="space-y-5 sm:space-y-6">
      <KpiGrid items={items} columns={4} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <DualHeading text="Status distribution" />
          <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">All PTWs across {site} and partner sites in the current window.</p>
          <div className="mt-5 space-y-3">
            {byStatus.map((b) => {
              const meta = STATUS_META[b.status];
              const pct = Math.round((b.count / maxCount) * 100);
              return (
                <div key={b.status}>
                  <div className="mb-1 flex items-center justify-between text-[11.5px]">
                    <span className="font-medium text-foreground">{meta.label}</span>
                    <span className="font-light text-muted-foreground">{b.count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/60">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <DualHeading text="Site rollup" />
          <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Active permits per site.</p>
          <div className="mt-5 space-y-2.5">
            {SITES.map((s) => {
              const count = PTWs.filter((p) => p.site === s).length;
              return (
                <div key={s} className="flex items-center justify-between rounded-xl border border-border/70 bg-card/60 px-4 py-3 shadow-soft">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{s}</span>
                  </div>
                  <span className="text-[11.5px] font-medium text-muted-foreground">{count} active</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <DualHeading text="Recent closures" />
            <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Permits closed in the last 7 days.</p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-[11.5px] font-medium text-foreground shadow-soft transition hover:border-primary/40">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {["Ref", "Site", "Location", "Closed by", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PTWs.filter((p) => ["closed", "close-ok"].includes(p.status)).map((p, i) => (
                <tr key={p.ref} className={cn("border-t border-border/60", i % 2 && "bg-card/40")}>
                  <td className="px-4 py-3 font-medium text-foreground">{p.ref}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.site}</td>
                  <td className="px-4 py-3 text-foreground">{p.location}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.raisedBy}</td>
                  <td className="px-4 py-3"><StatusPill status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
