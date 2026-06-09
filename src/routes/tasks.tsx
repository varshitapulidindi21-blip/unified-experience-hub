import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  { key: "hoto", label: "HOTO" },
  { key: "legal", label: "Legal Hub" },
  { key: "hse", label: "HSE" },
  { key: "expense", label: "Expense Claims" },
] as const;

type TabKey = typeof TABS[number]["key"];

const TASKS: Record<TabKey, Array<{ title: string; meta: string; status: "pending" | "review" | "approved"; due: string }>> = {
  all: [
    { title: "Approve travel — Mumbai → Madrid", meta: "Travel · Sneha Rao", status: "pending", due: "Today" },
    { title: "Sign vendor MSA — Acme Solar", meta: "Legal · DocuSign", status: "review", due: "Tomorrow" },
    { title: "HSE: PPE audit closeout — Site 12", meta: "HSE · Daily report", status: "pending", due: "2d" },
    { title: "Expense claim — Q2 client offsite", meta: "Finance · ₹84,200", status: "approved", due: "Done" },
  ],
  hoto: [
    { title: "HOTO checklist — Substation B", meta: "Engineering · 14 items", status: "pending", due: "Today" },
    { title: "Handover sign-off — Phase 2", meta: "Ops · Awaiting EIC", status: "review", due: "Tomorrow" },
  ],
  legal: [
    { title: "Sign vendor MSA — Acme Solar", meta: "Legal · DocuSign", status: "review", due: "Tomorrow" },
    { title: "NDA — Bidder shortlist 3", meta: "Legal · Procurement", status: "pending", due: "3d" },
  ],
  hse: [
    { title: "HSE: PPE audit closeout — Site 12", meta: "HSE · Daily report", status: "pending", due: "2d" },
    { title: "Incident review — Near-miss #244", meta: "HSE · Investigation", status: "review", due: "This week" },
  ],
  expense: [
    { title: "Expense claim — Q2 client offsite", meta: "Finance · ₹84,200", status: "approved", due: "Done" },
    { title: "Reimburse — Site visit fuel", meta: "Finance · ₹4,180", status: "pending", due: "Today" },
  ],
};

function TasksPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const items = TASKS[tab];

  return (
    <div className="min-h-screen">
      <div className="hidden md:block"><TopBar /></div>
      <main className="mx-auto w-full max-w-[1400px] space-y-4 px-4 pt-2 pb-28 sm:space-y-6 sm:px-6 sm:py-8">
        <MobileAppHeader pageLabel="My Tasks" />

        {/* Swiggy-style curved chip tabs */}
        <nav className="mobile-curved-tabs md:hidden" role="tablist" aria-label="Task category">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                className={["mobile-curved-tab", active ? "is-active" : ""].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </nav>

        <section className="md:hidden space-y-2.5">
          {items.map((t) => (
            <article key={t.title} className="mobile-task-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-[0.95rem] font-semibold text-foreground">{t.title}</h3>
                  <p className="mt-0.5 text-[0.72rem] text-muted-foreground">{t.meta}</p>
                </div>
                <span className={`mobile-task-status status-${t.status}`}>
                  {t.status === "pending" ? "Pending" : t.status === "review" ? "In review" : "Approved"}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[0.72rem]">
                <span className="text-muted-foreground">Due · <span className="font-medium text-foreground">{t.due}</span></span>
                <button className="text-primary font-semibold">Open</button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
