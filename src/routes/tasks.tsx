import { createFileRoute } from "@tanstack/react-router";
import { Clock, ChevronRight } from "lucide-react";
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

type TagTone = "purple" | "green" | "amber" | "red";
type Task = {
  title: string;
  tags: { label: string; tone: TagTone }[];
  due: string;
  progress?: number;
};

const APPROVALS: Task[] = [
  {
    title: "Approve Wind Farm 12 maintenance PO",
    tags: [
      { label: "Operations", tone: "purple" },
      { label: "High", tone: "red" },
    ],
    due: "Today",
  },
  {
    title: "Sign off Q2 ESG disclosure",
    tags: [
      { label: "Sustainability", tone: "purple" },
      { label: "High", tone: "red" },
    ],
    due: "Tomorrow",
    progress: 55,
  },
  {
    title: "Review 3 travel requests from team",
    tags: [
      { label: "HR", tone: "purple" },
      { label: "Med", tone: "amber" },
    ],
    due: "Wed",
  },
];

const IN_PROGRESS: Task[] = [
  {
    title: "Draft Solar Farm 7 expansion brief",
    tags: [
      { label: "Engineering", tone: "purple" },
      { label: "Med", tone: "amber" },
    ],
    due: "Fri",
    progress: 35,
  },
  {
    title: "HSE quarterly audit closeout — Site 12",
    tags: [
      { label: "HSE", tone: "green" },
      { label: "Low", tone: "green" },
    ],
    due: "Next week",
    progress: 70,
  },
];

const DONE_THIS_WEEK = 5;
const TOTAL_THIS_WEEK = 12;

function TaskCard({ t }: { t: Task }) {
  return (
    <article className="task-card-v2">
      <button className="task-checkbox" aria-label="Mark complete" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="task-card-v2__title">{t.title}</h3>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/70" />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {t.tags.map((tag) => (
            <span key={tag.label} className={`task-tag tag-${tag.tone}`}>
              {tag.label.toUpperCase()}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground">
            <Clock className="h-3 w-3" strokeWidth={1.8} />
            {t.due}
          </span>
        </div>
        {typeof t.progress === "number" && (
          <div className="task-progress mt-2.5">
            <div className="task-progress__fill" style={{ width: `${t.progress}%` }} />
          </div>
        )}
      </div>
    </article>
  );
}

function SectionLabel({ label, count }: { label: string; count: number }) {
  return (
    <div className="mt-5 mb-2 flex items-center justify-between px-1">
      <h2 className="text-[0.72rem] font-extrabold tracking-[0.18em] text-muted-foreground">
        {label}
      </h2>
      <span className="text-[0.78rem] font-semibold text-muted-foreground">{count}</span>
    </div>
  );
}

function TasksPage() {
  const pct = (DONE_THIS_WEEK / TOTAL_THIS_WEEK) * 100;
  const r = 26;
  const c = 2 * Math.PI * r;

  return (
    <div className="min-h-screen">
      <div className="hidden md:block"><TopBar /></div>
      <main className="mx-auto w-full max-w-[1400px] space-y-3 px-4 pt-2 pb-28 sm:space-y-6 sm:px-6 sm:py-8">
        <MobileAppHeader pageLabel="My Tasks" hideNotifications />

        {/* Weekly progress hero */}
        <section className="md:hidden weekly-progress-card">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <svg width="68" height="68" viewBox="0 0 68 68" className="-rotate-90">
                <circle cx="34" cy="34" r={r} fill="none" stroke="color-mix(in oklab, var(--brand-purple) 15%, transparent)" strokeWidth="6" />
                <circle
                  cx="34"
                  cy="34"
                  r={r}
                  fill="none"
                  stroke="var(--brand-purple)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={c - (c * pct) / 100}
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.7rem] font-bold tracking-[0.18em] text-muted-foreground">THIS WEEK</p>
              <p className="text-[1.35rem] font-extrabold italic tracking-tight text-foreground leading-tight">
                {DONE_THIS_WEEK} of {TOTAL_THIS_WEEK} done
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                {Array.from({ length: TOTAL_THIS_WEEK > 6 ? 6 : TOTAL_THIS_WEEK }).map((_, i) => {
                  const filled = i < Math.round((DONE_THIS_WEEK / TOTAL_THIS_WEEK) * 6);
                  const color = i < 2 ? "var(--brand-green)" : i < 3 ? "var(--brand-purple)" : "transparent";
                  return (
                    <span
                      key={i}
                      className="h-1.5 flex-1 rounded-full"
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

        {/* Approvals */}
        <section className="md:hidden">
          <SectionLabel label="APPROVALS" count={APPROVALS.length} />
          <div className="space-y-2.5">
            {APPROVALS.map((t) => <TaskCard key={t.title} t={t} />)}
          </div>
        </section>

        {/* In progress */}
        <section className="md:hidden">
          <SectionLabel label="IN PROGRESS" count={IN_PROGRESS.length} />
          <div className="space-y-2.5">
            {IN_PROGRESS.map((t) => <TaskCard key={t.title} t={t} />)}
          </div>
        </section>
      </main>
    </div>
  );
}
