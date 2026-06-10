import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, ChevronRight, Check } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { MobileAppHeader } from "@/components/MobileAppHeader";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "My Tasks — Resolven Hub" },
      { name: "description", content: "Every pending action across Resolven modules." },
    ],
  }),
  component: TasksPage,
});

const TABS = [
  { key: "all", label: "All" },
  { key: "hoto", label: "Hoto" },
  { key: "legal", label: "Legal Hub" },
  { key: "hse", label: "Hse" },
  { key: "expense", label: "Expense Claims" },
] as const;
type TabKey = typeof TABS[number]["key"];

type TagTone = "purple" | "green" | "amber" | "red";
type Task = {
  title: string;
  tags: { label: string; tone: TagTone }[];
  due: string;
  progress?: number;
  section: "approvals" | "in_progress";
  cat: Exclude<TabKey, "all">;
};

const TASKS: Task[] = [
  { title: "Approve Wind Farm 12 Maintenance PO", tags: [{ label: "Operations", tone: "purple" }, { label: "High", tone: "red" }], due: "Today", section: "approvals", cat: "hoto" },
  { title: "Sign Off Q2 ESG Disclosure", tags: [{ label: "Sustainability", tone: "purple" }, { label: "High", tone: "red" }], due: "Tomorrow", progress: 55, section: "approvals", cat: "legal" },
  { title: "Review 3 Travel Requests From Team", tags: [{ label: "HR", tone: "purple" }, { label: "Med", tone: "amber" }], due: "Wed", section: "approvals", cat: "expense" },
  { title: "Draft Solar Farm 7 Expansion Brief", tags: [{ label: "Engineering", tone: "purple" }, { label: "Med", tone: "amber" }], due: "Fri", progress: 35, section: "in_progress", cat: "hoto" },
  { title: "HSE Quarterly Audit Closeout — Site 12", tags: [{ label: "HSE", tone: "green" }, { label: "Low", tone: "green" }], due: "Next week", progress: 70, section: "in_progress", cat: "hse" },
];

const DONE_THIS_WEEK = 5;
const TOTAL_THIS_WEEK = 12;

function TaskCard({ t, done, onToggle }: { t: Task; done: boolean; onToggle: () => void }) {
  return (
    <article className="task-card-v2">
      <button
        type="button"
        onClick={onToggle}
        className="task-checkbox"
        data-checked={done}
        aria-label={done ? "Mark incomplete" : "Mark complete"}
        aria-pressed={done}
      >
        {done && <Check strokeWidth={3} />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="task-card-v2__title"
            style={done ? { textDecoration: "line-through", opacity: 0.55 } : undefined}
          >
            {t.title}
          </h3>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
        </div>
        <div className="task-card-v2__meta mt-1 flex flex-wrap items-center gap-1">
          {t.tags.map((tag) => {
            const label = tag.label.charAt(0).toUpperCase() + tag.label.slice(1).toLowerCase();
            return (
              <span key={tag.label} className={`task-tag tag-${tag.tone}`}>
                {label}
              </span>
            );
          })}
          <span className="inline-flex items-center gap-0.5 text-[0.58rem] leading-none text-muted-foreground/75">
            <Clock className="h-2 w-2" strokeWidth={1.7} />
            {t.due}
          </span>
        </div>
        {typeof t.progress === "number" && (
          <div className="task-progress mt-1.5">
            <div className="task-progress__fill" style={{ width: `${t.progress}%` }} />
          </div>
        )}
      </div>
    </article>
  );
}


function SectionLabel({ label, count }: { label: string; count: number }) {
  return (
    <div className="mt-3 mb-1.5 flex items-baseline justify-between px-0.5">
      <h2
        className="text-[0.82rem] font-medium not-italic text-foreground/80"
        style={{ fontFamily: "Montserrat, system-ui, sans-serif", letterSpacing: 0 }}
      >
        {label}
      </h2>
      <span
        className="text-[0.72rem] font-normal text-muted-foreground/60"
        style={{ fontFamily: "Montserrat, system-ui, sans-serif" }}
      >
        {count}
      </span>
    </div>
  );
}

function TasksPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [doneMap, setDoneMap] = useState<Record<string, boolean>>({});
  const toggle = (id: string) =>
    setDoneMap((m) => ({ ...m, [id]: !m[id] }));
  const pct = (DONE_THIS_WEEK / TOTAL_THIS_WEEK) * 100;
  const r = 22;
  const c = 2 * Math.PI * r;

  const filtered = tab === "all" ? TASKS : TASKS.filter((t) => t.cat === tab);
  const approvals = filtered.filter((t) => t.section === "approvals");
  const inProgress = filtered.filter((t) => t.section === "in_progress");
  const activeCount = TASKS.length - Object.values(doneMap).filter(Boolean).length;
  const dueThisWeek = TASKS.filter((t) => ["Today", "Tomorrow", "Wed", "Fri"].includes(t.due)).length;

  return (
    <div className="min-h-screen">
      <div className="hidden md:block"><TopBar /></div>
      <main className="mx-auto w-full max-w-[1400px] space-y-2.5 px-4 pt-2 pb-28 sm:space-y-6 sm:px-6 sm:py-8">
        <MobileAppHeader
          pageLabel="My Tasks"
          pageSubtitle={`${activeCount} active · ${dueThisWeek} due this week`}
          hideNotifications
        />


        {/* Underline tabs */}
        <nav className="md:hidden tasks-tabs" role="tablist" aria-label="Task category">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                className={["tasks-tab", active ? "is-active" : ""].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* Weekly progress hero */}
        <section className="md:hidden weekly-progress-card">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
                <circle cx="28" cy="28" r={r} fill="none" stroke="color-mix(in oklab, var(--brand-purple) 15%, transparent)" strokeWidth="5" />
                <circle
                  cx="28"
                  cy="28"
                  r={r}
                  fill="none"
                  stroke="var(--brand-purple)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={c - (c * pct) / 100}
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.58rem] font-medium tracking-[0.04em] text-muted-foreground">This week</p>
              <p className="text-[0.94rem] font-semibold text-foreground leading-tight">
                {DONE_THIS_WEEK} of {TOTAL_THIS_WEEK} done
              </p>
              <div className="mt-1.5 flex items-center gap-1">
                {Array.from({ length: 6 }).map((_, i) => {
                  const filled = i < Math.round((DONE_THIS_WEEK / TOTAL_THIS_WEEK) * 6);
                  const color = i < 2 ? "var(--brand-green)" : "var(--brand-purple)";
                  return (
                    <span
                      key={i}
                      className="h-1 flex-1 rounded-full"
                      style={{
                        background: filled ? color : "color-mix(in oklab, var(--color-border) 70%, transparent)",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {approvals.length > 0 && (
          <section className="md:hidden">
            <SectionLabel label="Approvals" count={approvals.length} />
            <div className="space-y-1.5">
              {approvals.map((t) => <TaskCard key={t.title} t={t} done={!!doneMap[t.title]} onToggle={() => toggle(t.title)} />)}
            </div>
          </section>
        )}

        {inProgress.length > 0 && (
          <section className="md:hidden">
            <SectionLabel label="In Progress" count={inProgress.length} />
            <div className="space-y-1.5">
              {inProgress.map((t) => <TaskCard key={t.title} t={t} done={!!doneMap[t.title]} onToggle={() => toggle(t.title)} />)}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <p className="md:hidden mt-6 text-center text-[0.78rem] text-muted-foreground">
            No tasks in this category.
          </p>
        )}
      </main>
    </div>
  );
}
