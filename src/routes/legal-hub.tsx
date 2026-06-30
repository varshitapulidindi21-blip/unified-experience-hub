import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard, FileText, FileSignature, ListChecks, Building2, ShieldCheck,
  Search, Plus, Download, Filter, Calendar, ChevronRight, Upload, AlertTriangle,
  Clock, CheckCircle2, Scale, FolderOpen,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { SparkleFab } from "@/components/SparkleFab";
import { DualHeading } from "@/components/DualHeading";
import { MobileAppHeader } from "@/components/MobileAppHeader";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/legal-hub")({
  head: () => ({
    meta: [
      { title: "Legal Hub — Resolven" },
      { name: "description", content: "Contracts, obligations, SPVs and compliance — Resolven Legal Hub." },
    ],
  }),
  component: LegalHubPage,
});

type TabKey = "dashboard" | "documents" | "contracts" | "obligations" | "spvs" | "compliance";

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "dashboard",   label: "Dashboard",    icon: LayoutDashboard },
  { key: "documents",   label: "Documents",    icon: FileText },
  { key: "contracts",   label: "Contracts",    icon: FileSignature },
  { key: "obligations", label: "Obligations",  icon: ListChecks },
  { key: "spvs",        label: "SPVs",         icon: Building2 },
  { key: "compliance",  label: "Compliance",   icon: ShieldCheck },
];

/* ---------- Demo data ---------- */

type Contract = {
  id: string;
  title: string;
  counterparty: string;
  spv: string;
  value: string;
  start: string;
  end: string;
  status: "active" | "expiring" | "draft" | "expired" | "terminated";
  owner: string;
};

const CONTRACTS: Contract[] = [
  { id: "CT-2026-0184", title: "EPC Master Agreement — Gorbea III",   counterparty: "Larsen & Toubro",      spv: "Gorbea Solar SPV",      value: "₹ 184 Cr", start: "2025-04-12", end: "2027-03-31", status: "active",    owner: "P. Suresh" },
  { id: "CT-2026-0182", title: "O&M Services — ASPL Phase II",        counterparty: "Sterling & Wilson",     spv: "ASPL Renewables",       value: "₹ 22 Cr",  start: "2025-01-01", end: "2026-07-31", status: "expiring",  owner: "K. Iyer" },
  { id: "CT-2026-0179", title: "Module Supply — Bikaner",             counterparty: "First Solar Inc.",      spv: "Bikaner Sun Pvt Ltd",   value: "$ 14.6 M", start: "2026-02-10", end: "2027-02-09", status: "active",    owner: "V. Pulidindi" },
  { id: "CT-2026-0175", title: "PPA — Tumkur 200 MW",                 counterparty: "Karnataka Power Corp",  spv: "Tumkur Green SPV",      value: "₹ 1,240 Cr",start: "2024-09-01", end: "2049-08-31", status: "active",    owner: "A. Banerjee" },
  { id: "CT-2026-0171", title: "Land Lease — Madhya Site",            counterparty: "MP Industrial Dev Corp",spv: "Madhya Solar SPV",      value: "₹ 6.2 Cr", start: "2023-07-01", end: "2026-06-30", status: "expiring",  owner: "S. Nair" },
  { id: "CT-2026-0168", title: "Insurance — Asset Cover",             counterparty: "ICICI Lombard",          spv: "Group",                 value: "₹ 8.4 Cr", start: "2026-04-01", end: "2027-03-31", status: "active",    owner: "R. Mehta" },
  { id: "CT-2026-0164", title: "Inverter Supply — Tumkur",            counterparty: "Sungrow Power",          spv: "Tumkur Green SPV",      value: "$ 7.2 M",  start: "2025-08-15", end: "2026-08-14", status: "active",    owner: "K. Iyer" },
  { id: "CT-2026-0159", title: "Consulting — IPO advisory",           counterparty: "EY India",               spv: "Group",                 value: "₹ 4.1 Cr", start: "2026-01-15", end: "2026-12-31", status: "draft",     owner: "M. Krishnan" },
];

type Obligation = {
  id: string;
  title: string;
  contract: string;
  due: string;
  owner: string;
  status: "open" | "due-soon" | "overdue" | "complete";
  category: "Financial" | "Reporting" | "Regulatory" | "Operational";
};

const OBLIGATIONS: Obligation[] = [
  { id: "OB-441", title: "Submit quarterly generation report",     contract: "CT-2026-0175", due: "2026-07-10", owner: "V. Pulidindi", status: "due-soon", category: "Reporting" },
  { id: "OB-440", title: "Lease renewal notice — Madhya",          contract: "CT-2026-0171", due: "2026-06-30", owner: "S. Nair",       status: "overdue",  category: "Regulatory" },
  { id: "OB-439", title: "Insurance premium remittance",            contract: "CT-2026-0168", due: "2026-07-15", owner: "R. Mehta",      status: "open",     category: "Financial" },
  { id: "OB-438", title: "Annual safety audit submission",          contract: "CT-2026-0184", due: "2026-09-01", owner: "P. Suresh",     status: "open",     category: "Regulatory" },
  { id: "OB-437", title: "Vendor performance scorecard",            contract: "CT-2026-0182", due: "2026-07-05", owner: "K. Iyer",       status: "due-soon", category: "Operational" },
  { id: "OB-436", title: "Bank guarantee renewal",                  contract: "CT-2026-0179", due: "2026-08-20", owner: "V. Pulidindi", status: "open",     category: "Financial" },
  { id: "OB-435", title: "GST filing — Tumkur SPV",                 contract: "CT-2026-0175", due: "2026-06-20", owner: "A. Banerjee",   status: "complete", category: "Regulatory" },
];

type SPV = { id: string; name: string; state: string; capacity: string; contracts: number; obligations: number; status: "operational" | "construction" | "planning" };
const SPVS: SPV[] = [
  { id: "SPV-01", name: "Gorbea Solar SPV",   state: "Spain",      capacity: "320 MWp", contracts: 14, obligations: 7,  status: "operational" },
  { id: "SPV-02", name: "ASPL Renewables",    state: "Telangana",  capacity: "150 MWp", contracts: 11, obligations: 5,  status: "operational" },
  { id: "SPV-03", name: "Bikaner Sun Pvt Ltd",state: "Rajasthan",  capacity: "400 MWp", contracts: 9,  obligations: 4,  status: "construction" },
  { id: "SPV-04", name: "Tumkur Green SPV",   state: "Karnataka",  capacity: "200 MWp", contracts: 18, obligations: 9,  status: "operational" },
  { id: "SPV-05", name: "Madhya Solar SPV",   state: "MP",         capacity: "90 MWp",  contracts: 7,  obligations: 3,  status: "construction" },
  { id: "SPV-06", name: "Andhra Wind SPV",    state: "Andhra Pradesh", capacity: "120 MW", contracts: 5, obligations: 2, status: "planning" },
];

/* ---------- Page ---------- */

function LegalHubPage() {
  const [tab, setTab] = useState<TabKey>("dashboard");

  return (
    <div className="min-h-screen">
      <div className="hidden md:block"><TopBar /></div>
      <main className="mx-auto w-full max-w-[1400px] space-y-4 px-4 py-4 sm:space-y-7 sm:px-6 sm:py-8">
        <MobileAppHeader pageLabel="Legal Hub" searchPlaceholder="Search contracts, obligations…" />

        <div className="hidden items-end justify-between gap-4 md:flex">
          <div>
            <h1 className="font-display italic text-[1.7rem] sm:text-[2rem] md:text-[2.4rem] leading-tight">
              <span className="text-primary dark:text-white">Legal</span>{" "}
              <span className="text-accent">Hub</span>
            </h1>
            <p className="mt-1 text-[12.5px] font-light text-muted-foreground">Contracts, obligations, SPVs and regulatory compliance — all in one place.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/12 px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.16em] text-accent ring-1 ring-accent/20">
            <Scale className="h-3.5 w-3.5" /> Group view
          </span>
        </div>

        <TabBar tab={tab} onChange={setTab} />

        <div className="animate-rise">
          {tab === "dashboard"   && <DashboardTab onTab={setTab} />}
          {tab === "documents"   && <DocumentsTab />}
          {tab === "contracts"   && <ContractsTab />}
          {tab === "obligations" && <ObligationsTab />}
          {tab === "spvs"        && <SPVsTab />}
          {tab === "compliance"  && <ComplianceTab />}
        </div>
      </main>
      <SparkleFab />
    </div>
  );
}

function TabBar({ tab, onChange }: { tab: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <div className="surface rounded-2xl p-1.5 sm:p-2 overflow-x-auto scrollbar-hide">
      <div className="flex min-w-max gap-1 lg:grid lg:min-w-0 lg:grid-cols-6">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[12.5px] sm:text-sm font-medium whitespace-nowrap transition-all duration-300 lg:w-full lg:justify-center",
                active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
              )}
            >
              <Icon className="h-4 w-4 opacity-90" /> {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Primitives ---------- */

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("app-card surface rounded-2xl p-5 sm:p-6", className)}>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-border/70 bg-card/60 px-3.5 py-2.5 text-sm font-light text-foreground placeholder:text-muted-foreground/70 shadow-soft transition-all duration-200 focus:border-primary/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 backdrop-blur";
const selectClass = cn(inputClass, "appearance-none pr-9");

const C_STATUS: Record<Contract["status"], { label: string; cls: string }> = {
  active:     { label: "Active",     cls: "bg-accent/15 text-accent ring-accent/25" },
  expiring:   { label: "Expiring",   cls: "bg-amber-500/15 text-amber-600 ring-amber-500/25 dark:text-amber-300" },
  draft:      { label: "Draft",      cls: "bg-secondary text-secondary-foreground ring-border" },
  expired:    { label: "Expired",    cls: "bg-destructive/12 text-destructive ring-destructive/25" },
  terminated: { label: "Terminated", cls: "bg-destructive/12 text-destructive ring-destructive/25" },
};

const O_STATUS: Record<Obligation["status"], { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  open:       { label: "Open",      cls: "bg-blue-500/12 text-blue-600 ring-blue-500/25 dark:text-blue-300", icon: Clock },
  "due-soon": { label: "Due soon",  cls: "bg-amber-500/15 text-amber-600 ring-amber-500/25 dark:text-amber-300", icon: AlertTriangle },
  overdue:    { label: "Overdue",   cls: "bg-destructive/12 text-destructive ring-destructive/25", icon: AlertTriangle },
  complete:   { label: "Complete",  cls: "bg-accent/15 text-accent ring-accent/25", icon: CheckCircle2 },
};

function StatusPill({ label, cls }: { label: string; cls: string }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wider ring-1", cls)}>{label}</span>;
}

/* ---------- Dashboard ---------- */

function DashboardTab({ onTab }: { onTab: (t: TabKey) => void }) {
  const stats = [
    { label: "Active contracts",     value: CONTRACTS.filter((c) => c.status === "active").length, icon: FileSignature, accent: true },
    { label: "Expiring < 90 days",   value: CONTRACTS.filter((c) => c.status === "expiring").length, icon: AlertTriangle },
    { label: "Obligations open",     value: OBLIGATIONS.filter((o) => o.status !== "complete").length, icon: ListChecks },
    { label: "SPVs under management",value: SPVS.length, icon: Building2 },
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
                <s.icon className="h-4 w-4" />
              </span>
              <span className="text-[10.5px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </span>
            </div>
            <div className="mt-3 text-3xl sm:text-[2rem] font-display italic text-foreground">{s.value}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <DualHeading text="Recent contracts" />
              <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Latest activity across the portfolio.</p>
            </div>
            <button onClick={() => onTab("contracts")} className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-3 py-1 text-[11px] font-medium text-secondary-foreground transition hover:bg-secondary">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-4 space-y-2.5">
            {CONTRACTS.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/60 px-4 py-3 shadow-soft">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">{c.title}</div>
                  <div className="truncate text-[11.5px] font-light text-muted-foreground">{c.counterparty} · {c.spv}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden text-[11.5px] font-light text-muted-foreground sm:inline">{c.end}</span>
                  <StatusPill label={C_STATUS[c.status].label} cls={C_STATUS[c.status].cls} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <DualHeading text="Upcoming obligations" />
          <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Due in the next 30 days.</p>
          <div className="mt-4 space-y-2.5">
            {OBLIGATIONS.filter((o) => o.status !== "complete").slice(0, 5).map((o) => {
              const meta = O_STATUS[o.status];
              const Icon = meta.icon;
              return (
                <div key={o.id} className="rounded-xl border border-border/70 bg-card/60 px-4 py-3 shadow-soft">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-foreground">{o.title}</div>
                      <div className="text-[11px] font-light text-muted-foreground">{o.contract} · {o.owner}</div>
                    </div>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1", meta.cls)}>
                      <Icon className="h-3 w-3" /> {meta.label}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-light text-muted-foreground">
                    <Calendar className="h-3 w-3" /> {o.due}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Documents ---------- */

function DocumentsTab() {
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <DualHeading text="Document management" />
            <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Upload, tag and search legal documents across all SPVs.</p>
          </div>
          <button className="inline-flex w-max items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[12.5px] font-medium text-primary-foreground shadow-soft transition hover:shadow-elev">
            <Upload className="h-4 w-4" /> Upload document
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input className={cn(inputClass, "pl-9")} placeholder="Search by title, SPV or counterparty…" />
          </div>
          <select className={selectClass}>
            <option>All document types</option><option>Contract</option><option>NDA</option><option>License</option><option>Filing</option>
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { name: "EPC Master Agreement.pdf",          spv: "Gorbea Solar SPV", size: "4.2 MB", updated: "2 days ago" },
          { name: "Power Purchase Agreement.pdf",      spv: "Tumkur Green SPV", size: "11.6 MB", updated: "1 week ago" },
          { name: "Module Supply Order.pdf",           spv: "Bikaner Sun",      size: "2.1 MB", updated: "3 days ago" },
          { name: "Land Lease — Madhya.pdf",           spv: "Madhya Solar SPV", size: "5.7 MB", updated: "5 hours ago" },
          { name: "Insurance Policy 2026-27.pdf",      spv: "Group",            size: "1.4 MB", updated: "yesterday" },
          { name: "Board resolution — IPO mandate.pdf",spv: "Group",            size: "812 KB", updated: "today" },
        ].map((d) => (
          <div key={d.name} className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elev">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{d.name}</div>
                <div className="truncate text-[11.5px] font-light text-muted-foreground">{d.spv}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] font-light text-muted-foreground">
              <span>{d.size}</span>
              <span>{d.updated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Contracts ---------- */

function ContractsTab() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Contract["status"]>("all");
  const rows = useMemo(
    () => CONTRACTS
      .filter((c) => statusFilter === "all" ? true : c.status === statusFilter)
      .filter((c) => !search ? true : [c.id, c.title, c.counterparty, c.spv].some((v) => v.toLowerCase().includes(search.toLowerCase()))),
    [search, statusFilter],
  );

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <DualHeading text="Contract register" />
            <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">{rows.length} contracts · across {SPVS.length} SPVs</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-[11.5px] font-medium text-foreground shadow-soft transition hover:border-primary/40">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[12.5px] font-medium text-primary-foreground shadow-soft transition hover:shadow-elev">
              <Plus className="h-4 w-4" /> New contract
            </button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className={cn(inputClass, "pl-9")} placeholder="Search by title, counterparty or SPV…" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className={selectClass}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring</option>
            <option value="draft">Draft</option>
            <option value="expired">Expired</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {["Ref", "Title", "Counterparty", "SPV", "Value", "End date", "Owner", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm font-light text-muted-foreground">No contracts match the selected filters.</td></tr>
              ) : rows.map((c, i) => (
                <tr key={c.id} className={cn("border-t border-border/60 cursor-pointer transition-colors hover:bg-secondary/30", i % 2 && "bg-card/40")}>
                  <td className="px-4 py-3 font-medium text-foreground">{c.id}</td>
                  <td className="px-4 py-3 text-foreground">{c.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.counterparty}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.spv}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{c.value}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.end}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.owner}</td>
                  <td className="px-4 py-3"><StatusPill label={C_STATUS[c.status].label} cls={C_STATUS[c.status].cls} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inline contract detail — first row preview */}
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Contract detail · preview</div>
            <DualHeading text={CONTRACTS[0].title} />
          </div>
          <StatusPill label={C_STATUS[CONTRACTS[0].status].label} cls={C_STATUS[CONTRACTS[0].status].cls} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Counterparty", CONTRACTS[0].counterparty],
            ["SPV", CONTRACTS[0].spv],
            ["Value", CONTRACTS[0].value],
            ["Owner", CONTRACTS[0].owner],
            ["Start", CONTRACTS[0].start],
            ["End", CONTRACTS[0].end],
            ["Reference", CONTRACTS[0].id],
            ["Documents", "12 attachments"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border/70 bg-card/60 px-4 py-3">
              <div className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{k}</div>
              <div className="mt-1 text-sm font-medium text-foreground">{v}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------- Obligations ---------- */

function ObligationsTab() {
  const [filter, setFilter] = useState<"all" | Obligation["status"]>("all");
  const filters: { key: typeof filter; label: string }[] = [
    { key: "all",       label: "All" },
    { key: "overdue",   label: "Overdue" },
    { key: "due-soon",  label: "Due soon" },
    { key: "open",      label: "Open" },
    { key: "complete",  label: "Complete" },
  ];
  const rows = OBLIGATIONS.filter((o) => filter === "all" ? true : o.status === filter);

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <DualHeading text="Obligations tracker" />
          <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">{rows.length} items in the selected scope.</p>
        </div>
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
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border/60">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {["Ref", "Obligation", "Category", "Contract", "Due", "Owner", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm font-light text-muted-foreground">No obligations match this filter.</td></tr>
              ) : rows.map((o, i) => {
                const meta = O_STATUS[o.status];
                return (
                  <tr key={o.id} className={cn("border-t border-border/60", i % 2 && "bg-card/40")}>
                    <td className="px-4 py-3 font-medium text-foreground">{o.id}</td>
                    <td className="px-4 py-3 text-foreground">{o.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.contract}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.due}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.owner}</td>
                    <td className="px-4 py-3"><StatusPill label={meta.label} cls={meta.cls} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

/* ---------- SPVs ---------- */

const SPV_STATUS: Record<SPV["status"], string> = {
  operational:  "bg-accent/15 text-accent ring-accent/25",
  construction: "bg-amber-500/15 text-amber-600 ring-amber-500/25 dark:text-amber-300",
  planning:     "bg-blue-500/12 text-blue-600 ring-blue-500/25 dark:text-blue-300",
};

function SPVsTab() {
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <DualHeading text="Special purpose vehicles" />
            <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Project-level entities under the Resolven group.</p>
          </div>
          <button className="inline-flex w-max items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[12.5px] font-medium text-primary-foreground shadow-soft transition hover:shadow-elev">
            <Plus className="h-4 w-4" /> Register SPV
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SPVS.map((s) => (
          <div key={s.id} className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elev">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{s.name}</div>
                  <div className="text-[11.5px] font-light text-muted-foreground">{s.state} · {s.capacity}</div>
                </div>
              </div>
              <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wider ring-1", SPV_STATUS[s.status])}>
                {s.status}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-border/70 bg-card/60 px-3 py-2.5">
                <div className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Contracts</div>
                <div className="mt-0.5 text-base font-display italic text-foreground">{s.contracts}</div>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/60 px-3 py-2.5">
                <div className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Obligations</div>
                <div className="mt-0.5 text-base font-display italic text-foreground">{s.obligations}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Compliance ---------- */

function ComplianceTab() {
  const items = [
    { label: "Statutory filings up-to-date",     pct: 94, tone: "bg-accent" },
    { label: "Board resolutions documented",     pct: 88, tone: "bg-primary" },
    { label: "Contracts within validity",        pct: 76, tone: "bg-amber-500" },
    { label: "Regulatory licenses renewed",      pct: 92, tone: "bg-accent" },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          { label: "Compliance score", value: "92%", icon: ShieldCheck, accent: true },
          { label: "Open items",       value: "7",   icon: FolderOpen },
          { label: "Filings due 30d",  value: "3",   icon: Calendar },
          { label: "Audit findings",   value: "2",   icon: AlertTriangle },
        ].map((s) => (
          <div key={s.label} className={cn(
            "rounded-2xl border bg-card/70 p-4 sm:p-5 shadow-soft backdrop-blur",
            s.accent ? "border-primary/30 ring-1 ring-primary/20" : "border-border/70",
          )}>
            <div className="flex items-center gap-2.5">
              <span className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg ring-1",
                s.accent ? "bg-primary/12 text-primary ring-primary/20" : "bg-secondary/60 text-secondary-foreground ring-border/60",
              )}>
                <s.icon className="h-4 w-4" />
              </span>
              <span className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{s.label}</span>
            </div>
            <div className="mt-3 text-3xl sm:text-[2rem] font-display italic text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      <Card>
        <DualHeading text="Compliance health" />
        <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Rolling 90-day window across all SPVs.</p>
        <div className="mt-5 space-y-4">
          {items.map((i) => (
            <div key={i.label}>
              <div className="mb-1 flex items-center justify-between text-[12px]">
                <span className="font-medium text-foreground">{i.label}</span>
                <span className="font-light text-muted-foreground">{i.pct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/60">
                <div className={cn("h-full rounded-full", i.tone)} style={{ width: `${i.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <DualHeading text="Audit findings" />
            <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Open items requiring management attention.</p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-[11.5px] font-medium text-foreground shadow-soft transition hover:border-primary/40">
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
        </div>
        <div className="mt-4 space-y-2.5">
          {[
            { id: "AF-21", title: "Missing board resolution — Bikaner SPV capex",     severity: "Medium", owner: "S. Nair",  due: "2026-07-15" },
            { id: "AF-20", title: "Land lease registration pending — Madhya parcel B", severity: "High",   owner: "P. Suresh",due: "2026-07-01" },
          ].map((f) => (
            <div key={f.id} className="flex flex-col gap-2 rounded-xl border border-border/70 bg-card/60 px-4 py-3 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground">{f.id} · {f.title}</div>
                <div className="text-[11.5px] font-light text-muted-foreground">Owner {f.owner} · due {f.due}</div>
              </div>
              <span className={cn(
                "inline-flex w-max items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wider ring-1",
                f.severity === "High" ? "bg-destructive/12 text-destructive ring-destructive/25" : "bg-amber-500/15 text-amber-600 ring-amber-500/25 dark:text-amber-300",
              )}>
                {f.severity}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
