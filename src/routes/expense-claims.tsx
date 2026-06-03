import { useState, useEffect } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard, ClipboardList, PlusCircle, Inbox, Wallet, ShieldCheck, Tag, ScrollText,
  Receipt, Paperclip, FileCheck2, Trash2, Pencil, Plus,
  Calendar, Search, X, Save, Send, CheckCircle2,
  Home, Moon, Sun,
} from "lucide-react";
import { SparkleFab } from "@/components/SparkleFab";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/expense-claims")({
  head: () => ({
    meta: [
      { title: "Expense Claims — Resolven" },
      { name: "description", content: "Submit, track and manage employee reimbursements, approvals and finance processing." },
    ],
  }),
  component: ExpenseClaimsPage,
});

type TabKey = "dashboard" | "my" | "new" | "queue" | "finance" | "rules" | "categories" | "audit";

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "dashboard",  label: "Dashboard",      icon: LayoutDashboard },
  { key: "my",         label: "My Claims",      icon: ClipboardList },
  { key: "new",        label: "New Claim",      icon: PlusCircle },
  { key: "queue",      label: "Approval Queue", icon: Inbox },
  { key: "finance",    label: "Finance Queue",  icon: Wallet },
  { key: "rules",      label: "Approval Rules", icon: ShieldCheck },
  { key: "categories", label: "Categories",     icon: Tag },
  { key: "audit",      label: "Audit Log",      icon: ScrollText },
];

function ExpenseClaimsPage() {
  const [tab, setTab] = useState<TabKey>("dashboard");

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-[1400px] space-y-5 px-4 py-5 sm:space-y-7 sm:px-6 sm:py-8">
        <BrandedHero />
        <TabBar tab={tab} onChange={setTab} />

        <div className="animate-rise">
          {tab === "dashboard"  && <DashboardTab onNew={() => setTab("new")} />}
          {tab === "my"         && <MyClaimsTab onNew={() => setTab("new")} />}
          {tab === "new"        && <NewClaimTab onCancel={() => setTab("dashboard")} />}
          {tab === "queue"      && <ApprovalQueueTab />}
          {tab === "finance"    && <FinanceQueueTab />}
          {tab === "rules"      && <ApprovalRulesTab />}
          {tab === "categories" && <CategoriesTab />}
          {tab === "audit"      && <AuditLogTab />}
        </div>
      </main>
      <SparkleFab />
    </div>
  );
}

/* ---------- Shared chrome ---------- */

function BrandedHero() {
  return (
    <section className="travel-hero relative overflow-hidden rounded-2xl border border-border/60 shadow-soft sm:rounded-[1.4rem]">
      <div className="travel-hero-atmosphere pointer-events-none absolute inset-0 mix-blend-screen" />
      <div className="relative flex min-h-[88px] items-center px-5 py-5 sm:min-h-[100px] sm:px-8">
        <Link
          to="/"
          aria-label="Back to home"
          className="group inline-flex min-w-0 max-w-2xl items-center gap-2.5 sm:gap-3"
        >
          <ArrowLeft
            className="shrink-0 text-[#3DB769] transition-all duration-200 group-hover:-translate-x-0.5 group-hover:opacity-80"
            style={{ width: "1.15rem", height: "1.15rem" }}
            strokeWidth={2.4}
          />
          <h1 className="text-2xl text-white sm:text-[1.75rem] md:text-[2rem]">
            Expense Claims
          </h1>
        </Link>
      </div>
    </section>
  );
}

function TabBar({ tab, onChange }: { tab: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <div className="surface rounded-2xl p-1.5 sm:p-2 overflow-x-auto scrollbar-hide">
      <div className="flex min-w-max gap-1 lg:grid lg:min-w-0 lg:grid-cols-8">
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
  return <div className={cn("surface rounded-2xl p-5 sm:p-6", className)}>{children}</div>;
}

function StatusPill({ status }: { status: "approved" | "pending" | "rejected" | "draft" | "paid" }) {
  const map: Record<typeof status, string> = {
    approved: "bg-accent/15 text-accent ring-accent/25",
    paid:     "bg-accent/15 text-accent ring-accent/25",
    pending:  "bg-amber-500/15 text-amber-600 ring-amber-500/25 dark:text-amber-300",
    rejected: "bg-destructive/12 text-destructive ring-destructive/25",
    draft:    "bg-muted text-muted-foreground ring-border",
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

function ProfileField({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
      {sub && <div className="text-[11px] font-light text-accent">{sub}</div>}
    </div>
  );
}

/* ---------- Dashboard ---------- */

function DashboardTab({ onNew }: { onNew: () => void }) {
  const stats = [
    { label: "All Claims",            value: 0, icon: Receipt },
    { label: "Awaiting My Approval",  value: 0, icon: Inbox, accent: true },
    { label: "Pending Approval",      value: 0, icon: ShieldCheck },
    { label: "Approved + Paid",       value: 0, icon: CheckCircle2 },
    { label: "Finance Queue",         value: 0, icon: Wallet },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
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
            <h3 className="text-base sm:text-lg text-foreground">Recent claims</h3>
            <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Your latest reimbursement activity at a glance.</p>
          </div>
          <button onClick={onNew} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-[11.5px] font-medium uppercase tracking-[0.14em] text-primary-foreground shadow-soft transition hover:shadow-elev">
            <Plus className="h-3.5 w-3.5" /> New
          </button>
        </div>
        <EmptyState
          title="No claims yet"
          description="Click New Claim to raise your first reimbursement."
        />
      </Card>
    </div>
  );
}

/* ---------- My Claims ---------- */

function MyClaimsTab({ onNew }: { onNew: () => void }) {
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
              {s === "mine" ? "My claims" : "All in org"}
            </button>
          ))}
        </div>
        <div className="flex flex-1 items-center gap-2 sm:max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input className={cn(inputClass, "pl-9")} placeholder="Search by ref no or purpose…" />
          </div>
          <button onClick={onNew} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2.5 text-[12.5px] font-medium text-primary-foreground shadow-soft transition hover:shadow-elev">
            <Plus className="h-4 w-4" /> New Claim
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select className={selectClass}><option>All statuses</option><option>Draft</option><option>Pending</option><option>Approved</option><option>Rejected</option><option>Paid</option></select>
        <select className={selectClass}><option>All claim types</option><option>Travel Expense</option><option>Imprest</option><option>Misc</option><option>Training</option><option>Gift</option></select>
      </div>

      <div className="mt-5">
        <DataTable
          headers={["Ref no", "Type", "Purpose", "Amount", "Status", "Submitted"]}
          emptyText="No claims match the current filters."
        />
      </div>
    </Card>
  );
}

/* ---------- New Claim ---------- */

type LineItem = { id: string; category: string; date: string; description: string; amount: string; hasReceipt: boolean };

function NewClaimTab({ onCancel }: { onCancel: () => void }) {
  const [section, setSection] = useState<"details" | "lines" | "files" | "summary">("details");
  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), category: "", date: "", description: "", amount: "", hasReceipt: false },
  ]);

  const addItem = () => setItems((p) => [...p, { id: crypto.randomUUID(), category: "", date: "", description: "", amount: "", hasReceipt: false }]);
  const removeItem = (id: string) => setItems((p) => p.filter((l) => l.id !== id));
  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setItems((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const total = items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);

  const sections = [
    { key: "details" as const, label: "Details",     icon: ClipboardList },
    { key: "lines" as const,   label: "Line Items",  icon: Receipt },
    { key: "files" as const,   label: "Attachments", icon: Paperclip },
    { key: "summary" as const, label: "Review",      icon: FileCheck2 },
  ];

  return (
    <div className="space-y-5 pb-24 sm:pb-6">
      {/* Employee card */}
      <Card>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <ProfileField label="Employee" value="Varshita P" />
          <ProfileField label="Employee ID" value="varshita.p" sub="varshita.pulidindi@partner.resolven.com" />
          <ProfileField label="Department" value="—" />
          <ProfileField label="Designation" value="—" />
        </div>
      </Card>

      {/* Inner section nav */}
      <div className="surface rounded-2xl p-1.5 overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max gap-1 lg:grid lg:min-w-0 lg:grid-cols-4">
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
                <Icon className="h-4 w-4" /> {label}
              </button>
            );
          })}
        </div>
      </div>

      {section === "details" && (
        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Claim type" required>
              <select className={selectClass}>
                <option>Travel Expense</option><option>Imprest</option><option>Misc</option><option>Training</option><option>Gift / Business Promotion</option><option>Telecom</option>
              </select>
            </Field>
            <Field label="Claim date" required>
              <div className="relative">
                <input type="date" className={dateClass} />
                <Calendar className="pointer-events-none absolute right-[1.15rem] top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-white/85" />
              </div>
            </Field>
            <Field label="Currency" required>
              <select className={selectClass}><option>INR</option><option>USD</option><option>EUR</option></select>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Linked travel request" required>
              <div className="rounded-xl border border-dashed border-border/80 bg-card/50 px-4 py-3 text-[12.5px] font-light italic text-muted-foreground">
                No approved + completed travel requests found. Travel must be <span className="font-medium text-foreground">APPROVED</span> and end-date must be in the past before a Travel Expense claim can link to it.
              </div>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Purpose / Description">
              <textarea rows={4} className={cn(inputClass, "resize-none")} placeholder="Brief context for finance / approver." />
            </Field>
          </div>

          <div className="mt-4 rounded-xl border border-border/70 bg-secondary/30 px-4 py-3 text-[12.5px]">
            <span className="font-medium text-foreground">Category-specific rules (Travel Expense): </span>
            <span className="font-light text-muted-foreground">Link required, claim total ≤ advance given.</span>
          </div>
        </Card>
      )}

      {section === "lines" && (
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg text-foreground">Line items</h3>
              <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Itemise each expense — category caps apply per row.</p>
            </div>
            <button onClick={addItem} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-[11.5px] font-medium uppercase tracking-[0.14em] text-white shadow-soft transition hover:bg-primary/90 hover:shadow-elev">
              <Plus className="h-3.5 w-3.5" /> Add line
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {items.map((it, i) => (
              <div key={it.id} className="relative rounded-2xl border border-border/70 bg-card/60 p-4 sm:p-5 shadow-soft backdrop-blur">
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.16em] text-white ring-1 ring-white/15">
                    <Receipt className="h-3.5 w-3.5" /> Item {i + 1}
                  </span>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(it.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive" aria-label="Remove line">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Category">
                    <select className={selectClass} value={it.category} onChange={(e) => updateItem(it.id, { category: e.target.value })}>
                      <option value="">Select…</option><option>Air Ticket</option><option>Client Meal</option><option>Food</option><option>Local Transport</option><option>Hotel</option><option>Client Gift</option>
                    </select>
                  </Field>
                  <Field label="Date">
                    <div className="relative">
                      <input type="date" className={dateClass} value={it.date} onChange={(e) => updateItem(it.id, { date: e.target.value })} />
                      <Calendar className="pointer-events-none absolute right-[1.15rem] top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-white/85" />
                    </div>
                  </Field>
                  <Field label="Amount (₹)">
                    <input type="number" className={inputClass} value={it.amount} onChange={(e) => updateItem(it.id, { amount: e.target.value })} placeholder="0" />
                  </Field>
                  <Field label="Receipt">
                    <label className="flex h-[42px] cursor-pointer items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3.5 text-sm font-light text-muted-foreground shadow-soft backdrop-blur transition hover:border-primary/40">
                      <input type="checkbox" className="h-4 w-4 accent-primary" checked={it.hasReceipt} onChange={(e) => updateItem(it.id, { hasReceipt: e.target.checked })} />
                      Attached
                    </label>
                  </Field>
                </div>
                <div className="mt-3">
                  <Field label="Description">
                    <input className={inputClass} value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} placeholder="Vendor, context…" />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-end gap-3 rounded-xl border border-border/70 bg-secondary/30 px-4 py-3">
            <span className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Total</span>
            <span className="font-display italic text-xl text-foreground">₹ {total.toLocaleString("en-IN")}</span>
          </div>
        </Card>
      )}

      {section === "files" && (
        <Card>
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-8 text-center">
            <Paperclip className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-2 text-sm font-medium text-foreground">Drop receipts or click to upload</p>
            <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Receipts, invoices, tax docs — PDF, PNG, JPG up to 10MB each.</p>
          </div>
        </Card>
      )}

      {section === "summary" && (
        <Card>
          <h3 className="text-base sm:text-lg text-foreground">Review & submit</h3>
          <p className="mt-1 text-[12px] font-light text-muted-foreground">Verify your claim details below. You can return to any section to edit before submitting.</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ["Employee", "Varshita P"],
              ["Claim type", "Travel Expense · INR"],
              ["Line items", `${items.length} configured`],
              ["Total", `₹ ${total.toLocaleString("en-IN")}`],
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
      <div className="sticky bottom-3 sm:bottom-4 z-20 mt-4">
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

/* ---------- Approval Queue ---------- */

function ApprovalQueueTab() {
  const [filter, setFilter] = useState<"awaiting" | "approved" | "rejected">("awaiting");
  const filters = [
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
          headers={["Ref no", "Employee", "Type", "Amount", "Submitted", "Status"]}
          emptyText="Nothing here."
        />
      </div>
    </Card>
  );
}

/* ---------- Finance Queue ---------- */

function FinanceQueueTab() {
  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-base sm:text-lg text-foreground">Finance queue</h3>
        <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Claims approved but not yet paid. Click a row to mark it as paid.</p>
      </div>
      <DataTable
        headers={["Ref no", "Employee", "Type", "Approved amount", "Approved at", "Status"]}
        emptyText="No claims awaiting payment."
      />
    </Card>
  );
}

/* ---------- Approval Rules ---------- */

type Rule = { id: string; level: "L1" | "L2" | "L3"; type: string; name: string; minAmt?: number; approver: string; sla: number; auto?: number; active: boolean };

function ApprovalRulesTab() {
  const [rules, setRules] = useState<Rule[]>([
    { id: "1", level: "L1", type: "Gift / Business Promotion", name: "Gift: Manager",       approver: "Manager", sla: 48, active: true },
    { id: "2", level: "L2", type: "Gift / Business Promotion", name: "Gift: Finance",       approver: "Finance", sla: 48, active: true },
    { id: "3", level: "L3", type: "Gift / Business Promotion", name: "Gift: CXO ≥ ₹5K",     minAmt: 5000, approver: "CXO",     sla: 72, active: true },
    { id: "4", level: "L1", type: "Imprest Settlement",        name: "Imprest: Finance",    approver: "Finance", sla: 48, auto: 5000, active: true },
  ]);
  const remove = (id: string) => setRules((p) => p.filter((r) => r.id !== id));

  return (
    <div className="space-y-5">
      <Card>
        <h3 className="text-base sm:text-lg text-foreground">Add rule</h3>
        <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Per claim-type chain. Auto-approve threshold short-circuits the chain entirely (used for Telecom ≤ ₹1K and Imprest ≤ ₹5K by default).</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Field label="Name"><input className={inputClass} placeholder="Rule name" /></Field>
          <Field label="Claim type"><select className={selectClass}><option>Any</option><option>Travel Expense</option><option>Imprest</option><option>Gift</option><option>Training</option><option>Misc</option></select></Field>
          <Field label="Min ₹"><input className={inputClass} placeholder="—" /></Field>
          <Field label="Approver"><select className={selectClass}><option>Manager</option><option>Finance</option><option>CXO</option><option>Admin</option></select></Field>
          <Field label="Level"><input type="number" min={1} max={5} defaultValue={1} className={inputClass} /></Field>
          <Field label="SLA (hrs)"><input type="number" defaultValue={48} className={inputClass} /></Field>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Auto-approve if ≤ ₹"><input className={inputClass} placeholder="—" /></Field>
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
                {["Type", "Level", "Name", "Min ₹", "Approver", "SLA", "Auto ≤", "Active", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rules.map((r, i) => (
                <tr key={r.id} className={cn("border-t border-border/60 transition-colors hover:bg-secondary/30", i % 2 && "bg-card/40")}>
                  <td className="px-4 py-3 font-medium text-foreground">{r.type}</td>
                  <td className="px-4 py-3"><span className="inline-flex h-7 min-w-[2.25rem] items-center justify-center rounded-lg bg-primary/12 px-2 text-[11px] font-medium text-primary ring-1 ring-primary/15">{r.level}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.minAmt ? `₹ ${r.minAmt.toLocaleString()}` : "—"}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{r.approver}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.sla}h</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.auto ? `₹ ${r.auto.toLocaleString()}` : "—"}</td>
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

/* ---------- Categories ---------- */

type Category = { id: string; name: string; types: string; perItem?: number; monthly?: number; receipt: boolean; hsn: boolean; taxable: boolean; active: boolean };

function CategoriesTab() {
  const [cats, setCats] = useState<Category[]>([
    { id: "1", name: "Air Ticket",  types: "TRAVEL_EXPENSE",                receipt: true,  hsn: false, taxable: false, active: true },
    { id: "2", name: "Client Gift", types: "GIFT",            perItem: 25000, receipt: true,  hsn: false, taxable: false, active: true },
    { id: "3", name: "Client Meal", types: "MISC,TRAVEL_EXPENSE",            receipt: false, hsn: false, taxable: false, active: true },
    { id: "4", name: "Course Fee",  types: "TRAINING",                       receipt: true,  hsn: false, taxable: false, active: true },
    { id: "5", name: "Food",        types: "TRAVEL_EXPENSE,IMPREST,MISC",    receipt: false, hsn: false, taxable: false, active: true },
  ]);
  const remove = (id: string) => setCats((p) => p.filter((c) => c.id !== id));

  return (
    <div className="space-y-5">
      <Card>
        <h3 className="text-base sm:text-lg text-foreground">Add category</h3>
        <p className="mt-0.5 text-[11.5px] font-light text-muted-foreground">Categories pickable in the line-item table. Per-item caps surface as inline guidance. Comma-separate <span className="font-medium text-foreground">applicableClaimTypes</span> (e.g. <span className="font-medium text-foreground">TRAVEL_EXPENSE,IMPREST</span>); use <span className="font-medium text-foreground">ANY</span> to apply to all claim types.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Name"><input className={inputClass} /></Field>
          <Field label="Applicable claim types"><input className={inputClass} placeholder="ANY" /></Field>
          <Field label="Per-item ₹"><input className={inputClass} /></Field>
          <Field label="Monthly ₹"><input className={inputClass} /></Field>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            {["Requires receipt", "Requires HSN", "Taxable", "Active"].map((l, i) => (
              <label key={l} className="inline-flex items-center gap-2 text-[12.5px] font-light text-muted-foreground">
                <input type="checkbox" defaultChecked={i === 3} className="h-4 w-4 accent-primary" />
                {l}
              </label>
            ))}
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[12.5px] font-medium text-primary-foreground shadow-soft transition hover:shadow-elev">
            <Plus className="h-4 w-4" /> Add category
          </button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/40 text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {["Name", "Claim types", "Per-item ₹", "Monthly ₹", "Receipt", "HSN", "Taxable", "Active", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cats.map((c, i) => (
                <tr key={c.id} className={cn("border-t border-border/60 transition-colors hover:bg-secondary/30", i % 2 && "bg-card/40")}>
                  <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-[12px]">{c.types}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.perItem ? `₹ ${c.perItem.toLocaleString()}` : "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.monthly ? `₹ ${c.monthly.toLocaleString()}` : "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.receipt ? "Yes" : "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.hsn ? "Yes" : "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.taxable ? "Yes" : "—"}</td>
                  <td className="px-4 py-3"><StatusPill status={c.active ? "approved" : "draft"} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => remove(c.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
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
          <option>Created</option><option>Submitted</option><option>Approved</option><option>Rejected</option><option>Paid</option>
        </select>
        <div className="text-[11.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">0 events</div>
      </div>
      <div className="mt-5">
        <DataTable headers={["When", "Event", "Claim", "Actor", "Details"]} emptyText="No events match the current filter." />
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
        <Receipt className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-[12px] font-light text-muted-foreground">{description}</p>
    </div>
  );
}
