import { createFileRoute, Link } from "@tanstack/react-router";
import { type ComponentType, type SVGProps, useState } from "react";
import { ArrowLeft,
  CheckSquare, Settings2, FilePlus, FileText, HeartPulse, Plane, Receipt, Sparkles,
  Sheet, Users, FileSignature, Cog, Shield, Megaphone, Brain, Handshake, Newspaper,
} from "lucide-react";
import { SharePointBrandIcon, SapBrandIcon } from "@/components/brand-icons";
import { TopBar } from "@/components/TopBar";
import { SectionHeading } from "@/components/SectionHeading";
import { ModuleTile } from "@/components/ModuleTile";
import { MobileAppHeader } from "@/components/MobileAppHeader";

export const Route = createFileRoute("/modules")({
  head: () => ({
    meta: [
      { title: "All Modules — Resolven Hub" },
      { name: "description", content: "Pin and access every Resolven module." },
    ],
  }),
  component: ModulesPage,
});

const personal = [
  { icon: CheckSquare, title: "My Tasks", subtitle: "Every pending action across modules", tone: "purple" as const },
  { icon: Settings2, title: "IT Support", subtitle: "Raise a ticket · Service Desk", tone: "green" as const },
  { icon: FilePlus, title: "Raise IT Ticket", subtitle: "Report issue, request service or view history", tone: "lavender" as const },
  { icon: FileText, title: "Policies", subtitle: "Browse all published policies across departments", tone: "green-light" as const },
  { icon: HeartPulse, title: "Medical & Benefits", subtitle: "Insurance, wellness, reimbursement claims", tone: "grey" as const },
 { icon: Plane, title: "Travel Request", subtitle: "Raise domestic + international travel requests", tone: "purple" as const, to: "/travel-request" },

  { icon: Receipt, title: "Expense Claims", subtitle: "Submit + track reimbursement claims", tone: "green" as const, to: "/expense-claims" },
  { icon: Sparkles, title: "Idea", subtitle: "Share ideas, track reviews + outcomes", tone: "lavender" as const },
];

const workspaces = [
  { icon: SharePointBrandIcon, title: "Zelestra SharePoint", subtitle: "Intranet docs, team sites, shared drives", tone: "green" as const, pinned: true, brand: true },
  { icon: SapBrandIcon, title: "Zelestra SAP", subtitle: "Enterprise resource planning (Hana cloud)", tone: "purple" as const, pinned: true, brand: true },
  { icon: Sheet, title: "Smartsheets", subtitle: "Project plans, trackers, team workspaces", tone: "lavender" as const },
  { icon: Users, title: "Taxcon HRMS", subtitle: "Payroll, attendance, HR letters (India)", tone: "green-light" as const, pinned: true },
  { icon: FileSignature, title: "DocuSign", subtitle: "e-Signature for contracts + approvals", tone: "purple" as const },
  { icon: Cog, title: "HOTO", subtitle: "Handover, takeover and maintenance operations", tone: "grey" as const },
  { icon: Shield, title: "Permit System", subtitle: "Permit to Work — S1, S2, S3 workflow management", tone: "green" as const },
  { icon: Newspaper, title: "Newsletter", subtitle: "Monthly editions, stories + archive", tone: "lavender" as const, to: "/newsletter" },
  { icon: Megaphone, title: "Announcements", subtitle: "Corporate updates and visibility windows", tone: "lavender" as const },
  { icon: Brain, title: "Resolven AI", subtitle: "Contextual insights and copilot actions", tone: "green" as const, pinned: true },
  { icon: Handshake, title: "Admin Hub", subtitle: "Global masters, RBAC, module config and platform admin", tone: "purple" as const },
];

function ModulesPage() {
  const [workspace, setWorkspace] = useState<"ess" | "bm">("ess");
  const active = workspace === "ess" ? personal : workspaces;

  return (
    <div className="min-h-screen">
      <div className="hidden md:block"><TopBar /></div>
      <main className="mx-auto w-full max-w-[1400px] space-y-4 px-4 py-4 sm:space-y-10 sm:px-6 sm:py-10">
        <MobileAppHeader pageLabel="Modules" />

        <section className="mobile-native-section md:hidden">
          <div className="mobile-segmented" role="tablist" aria-label="Workspace">
            {[["ess", "ESS"], ["bm", "BM"]].map(([key, label]) => (
              <button
                key={key}
                role="tab"
                aria-selected={workspace === key}
                onClick={() => setWorkspace(key as "ess" | "bm")}
                className={workspace === key ? "is-active" : ""}
              >
                {label}
              </button>
            ))}
          </div>
          {workspace === "ess" ? (
            <div className="mobile-module-grid mt-3">
              {active.map((m) => <MobileModuleTile key={m.title} {...m} />)}
            </div>
          ) : (
            <div className="mobile-module-rail mt-3">
              {active.map((m) => <MobileModuleTile key={m.title} {...m} />)}
            </div>
          )}
        </section>

        <div className="hidden items-start justify-between gap-4 sm:gap-6 md:flex">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-border/60 bg-card/70 shadow-soft backdrop-blur transition-all duration-300 hover:border-primary/40 hover:shadow-elev"
            >
              <ArrowLeft className="h-[1rem] w-[1rem] sm:h-[1.1rem] sm:w-[1.1rem]" />
            </Link>
            <h1 className="text-[1.6rem] sm:text-[2rem] md:text-[2.5rem]">
              <span className="text-primary dark:text-white">All</span>{" "}
              <span className="text-accent">Modules</span>
            </h1>
          </div>
          <p className="hidden max-w-md text-right text-xs font-light leading-relaxed text-muted-foreground md:block">
            Pin tiles to anchor them on your home · unpinned tiles appear only when frequently used
          </p>
        </div>

        <section className="hidden surface animate-rise rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:block md:p-8">
          <SectionHeading
            eyebrow="PERSONAL"
            primary="Employee"
            accent="Self-Service"
            right={<span className="hidden sm:inline-flex rounded-full bg-secondary/70 px-3 py-1 text-[11px] font-medium text-secondary-foreground">8 modules</span>}
          />
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {personal.map((m) => <ModuleTile key={m.title} {...m} large />)}
          </div>
        </section>

        <section className="hidden surface animate-rise rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:block md:p-8">
          <SectionHeading
            eyebrow="WORKSPACES"
            primary="Business"
            accent="Modules"
            right={<span className="hidden sm:inline-flex rounded-full bg-secondary/70 px-3 py-1 text-[11px] font-medium text-secondary-foreground">10 modules</span>}
          />
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
            {workspaces.map((m) => <ModuleTile key={m.title} {...m} large />)}
          </div>
        </section>
      </main>
    </div>
  );
}

const toneBg = {
  purple: "tile-purple",
  green: "tile-green",
  lavender: "tile-lavender",
  "green-light": "tile-green-light",
  grey: "tile-grey",
};

function MobileModuleTile({
  icon: Icon,
  title,
  tone = "purple",
  brand,
  to,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number | string }>;
  title: string;
  tone?: keyof typeof toneBg;
  brand?: boolean;
  to?: string;
}) {
  const content = (
    <>
      <span className={brand ? "mobile-brand-icon" : `mobile-app-icon ${toneBg[tone]}`}>
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <span className="line-clamp-2 text-center text-[0.72rem] font-medium leading-tight text-foreground">
        {title.replace(" Request", "").replace(" Claims", "")}
      </span>
    </>
  );
  return to ? <Link to={to} className="mobile-module-tile">{content}</Link> : <button className="mobile-module-tile">{content}</button>;
}
