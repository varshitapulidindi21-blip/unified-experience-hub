import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ComponentType, type SVGProps } from "react";
import {
  CheckSquare, Settings2, FilePlus, FileText, HeartPulse, Plane, Receipt, Sparkles,
  Sheet, Users, FileSignature, Shield, Megaphone, Brain, Cog, Handshake, Newspaper,
  Briefcase, DraftingCompass, Atom, Calculator, ClipboardList, TrendingUp,
  Scale, Cpu, BadgeCheck, HardHat, Truck, BarChart3, Building2, Headphones, GraduationCap,
  Zap, ArrowUpRight,
} from "lucide-react";
import { SharePointBrandIcon, SapBrandIcon } from "@/components/brand-icons";
import { TopBar } from "@/components/TopBar";
import { GreetingHero } from "@/components/GreetingHero";
import { AnnouncementsBar } from "@/components/AnnouncementsBar";
import { SectionHeading } from "@/components/SectionHeading";
import { ModuleTile } from "@/components/ModuleTile";
import { MobileAppHeader } from "@/components/MobileAppHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — Resolven Hub" },
      { name: "description", content: "Your Resolven workspace: modules, announcements, and AI." },
    ],
  }),
  component: HomePage,
});

const selfService = [
  { icon: CheckSquare, title: "My Tasks", subtitle: "Every pending action across modules", tone: "purple" as const },
  { icon: Settings2, title: "IT Support", subtitle: "Raise a ticket · Service Desk", tone: "green" as const },
  { icon: FilePlus, title: "Raise IT Ticket", subtitle: "Report issue, request service or view history", tone: "lavender" as const },
  { icon: FileText, title: "Policies", subtitle: "Browse all published policies across departments", tone: "green-light" as const },
  { icon: HeartPulse, title: "Medical & Benefits", subtitle: "Insurance, wellness, reimbursement claims", tone: "grey" as const },
  { icon: Plane, title: "Travel Request", subtitle: "Raise domestic + international travel", tone: "purple" as const, to: "/travel-request" },

  { icon: Receipt, title: "Expense Claims", subtitle: "Submit + track reimbursement claims", tone: "green" as const, to: "/expense-claims" },
  { icon: Sparkles, title: "Idea", subtitle: "Share ideas, track reviews + outcomes", tone: "lavender" as const },
];

const business = [
  { icon: SharePointBrandIcon, title: "Zelestra SharePoint", subtitle: "Intranet docs, team sites, shared drives", tone: "green" as const, pinned: true, brand: true },
  { icon: SapBrandIcon, title: "Zelestra SAP", subtitle: "Enterprise resource planning (Hana cloud)", tone: "purple" as const, pinned: true, brand: true },
  { icon: Sheet, title: "Smartsheets", subtitle: "Project plans, trackers, team workspaces", tone: "lavender" as const },
  { icon: Users, title: "Taxcon HRMS", subtitle: "Payroll, attendance, HR letters (India)", tone: "green-light" as const, pinned: true },
  { icon: FileSignature, title: "DocuSign", subtitle: "e-Signature for contracts + approvals", tone: "purple" as const },
  { icon: Cog, title: "HOTO", subtitle: "Handover, takeover and maintenance operations", tone: "grey" as const },
  { icon: Shield, title: "Permit System", subtitle: "Permit to Work — S1, S2, S3 workflow", tone: "green" as const },
  { icon: Megaphone, title: "Announcements", subtitle: "Corporate updates and visibility windows", tone: "lavender" as const },
  { icon: Brain, title: "Resolven AI", subtitle: "Contextual insights and copilot actions", tone: "green" as const, pinned: true },
  { icon: Handshake, title: "Admin Hub", subtitle: "Global masters, RBAC, module config", tone: "purple" as const },
];

const departments = [
  { icon: Users, label: "Human Resources", tone: "purple" as const },
  { icon: Calculator, label: "Finance", tone: "green" as const },
  { icon: DraftingCompass, label: "Engineering", tone: "lavender" as const },
  { icon: ClipboardList, label: "Procurement", tone: "green-light" as const },
  { icon: TrendingUp, label: "Marketing", tone: "grey" as const },
  { icon: Scale, label: "Legal", tone: "green" as const },
  { icon: Cpu, label: "IT", tone: "purple" as const },
  { icon: BadgeCheck, label: "Quality", tone: "green-light" as const },
  { icon: HardHat, label: "HSE", tone: "lavender" as const },
  { icon: Truck, label: "Supply Chain", tone: "purple" as const },
  { icon: Atom, label: "R&D", tone: "grey" as const },
  { icon: Briefcase, label: "Operations", tone: "green" as const },
  { icon: BarChart3, label: "Strategy", tone: "green-light" as const },
  { icon: Building2, label: "Business Dev", tone: "lavender" as const },
  { icon: Headphones, label: "Customer Care", tone: "green" as const },
  { icon: GraduationCap, label: "Learning", tone: "purple" as const },
];

const toneBg: Record<string, string> = {
  purple: "tile-purple",
  green: "tile-green",
  lavender: "tile-lavender",
  "green-light": "tile-green-light",
  grey: "tile-grey",
};

function HomePage() {
  const [workspace, setWorkspace] = useState<"ess" | "bm">("ess");
  const activeModules = workspace === "ess" ? selfService : business;

  return (
    <div className="min-h-screen">
      <div className="hidden md:block"><TopBar /></div>
      <main className="mx-auto w-full max-w-[1400px] space-y-4 px-4 py-4 sm:space-y-8 sm:px-6 sm:py-8 md:space-y-10 md:py-10">
        <MobileAppHeader />

        {/* Operational insights banner (mobile) */}
        <Link to="/modules" className="md:hidden mobile-insights-banner -mt-1 block">
          <div className="mobile-insights-banner__inner">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mobile-insights-eyebrow">
                  <Zap className="h-2.5 w-2.5" strokeWidth={2.2} /> Today · Live Insight
                </div>
                <h2 className="mt-1 text-[0.95rem] not-italic font-semibold leading-tight tracking-tight text-white">
                  Solar yield trending +12% today
                </h2>
                <p className="mt-0.5 text-[0.68rem] leading-snug text-white/75">
                  3 sites exceeding forecast · 2 maintenance windows planned
                </p>
              </div>
              <span className="mobile-insights-arrow">
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
            </div>
            <div className="mobile-insights-stats">
              <div><span>3.4 GWh</span><label>Today</label></div>
              <div><span>412 t</span><label>CO₂ saved</label></div>
              <div><span>98%</span><label>Uptime</label></div>
            </div>
          </div>
        </Link>

        <div className="hidden md:block"><GreetingHero name="Samarth Sachdeva" /></div>
        <AnnouncementsBar />

        <section className="mobile-native-section md:hidden">
          <div className="mobile-chips" role="tablist" aria-label="Workspace">
            {[
              ["ess", "Employee Self-Service"],
              ["bm", "Business Modules"],
            ].map(([key, label]) => {
              const active = workspace === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setWorkspace(key as "ess" | "bm")}
                  className={["mobile-chip", active ? "is-active" : ""].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {workspace === "ess" ? (
            <div className="mobile-module-grid mt-3">
              {activeModules.map((m) => <MobileModuleTile key={m.title} {...m} />)}
            </div>
          ) : (
            <div className="mobile-module-rail mt-3">
              {activeModules.map((m) => <MobileModuleTile key={m.title} {...m} />)}
            </div>
          )}
        </section>

        {/* My Department — single folder for the logged-in employee */}
        <section className="mobile-native-section md:hidden">
          <div className="mb-2 flex items-end justify-between px-1">
            <div>
              <div className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                My department
              </div>
              <h2 className="mt-0.5 text-[0.9rem] not-italic font-semibold tracking-tight text-foreground">
                Your workspace folder
              </h2>
            </div>
            <button className="text-[0.65rem] font-semibold text-primary">Open</button>
          </div>
          <MyDepartmentCard department={departments[0]} />
        </section>


        <section className="hidden space-y-4 sm:space-y-5 md:block">
          <div className="flex items-end justify-between gap-4 px-1">
            <div>
              <div className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Workspace
              </div>
              <h2 className="mt-1 text-lg sm:text-xl md:text-2xl">
                <span className="text-primary dark:text-white">All</span>{" "}
                <span className="text-accent">Modules</span>
              </h2>
            </div>
            <Link
              to="/modules"
              className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-accent shadow-soft backdrop-blur transition-all duration-300 hover:border-accent/40 hover:shadow-elev"
            >
              View all
              <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-2">
            <div className="surface animate-rise rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8">
              <SectionHeading eyebrow="PERSONAL" primary="Employee" accent="Self-Service" />
              <div className="grid grid-cols-1 gap-3 sm:gap-3.5 sm:grid-cols-2">
                {selfService.map((m) => (
                  <ModuleTile key={m.title} {...m} />
                ))}
              </div>
            </div>

            <div className="surface animate-rise rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8">
              <SectionHeading eyebrow="WORKSPACES" primary="Business" accent="Modules" />
              <div className="grid grid-cols-1 gap-3 sm:gap-3.5 sm:grid-cols-2">
                {business.slice(0, 8).map((m) => (
                  <ModuleTile key={m.title} {...m} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="hidden surface animate-rise rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:block md:p-8">
          <SectionHeading
            eyebrow="SHAREPOINT"
            primary="Department"
            accent="Folders"
            right={<span className="text-xs font-light text-muted-foreground">16 departments</span>}
          />
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {departments.map((d) => (
              <div
                key={d.label}
                className="dept-card module-card group flex flex-col items-center gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl p-3 sm:p-3.5"
              >
                <div className={`tile ${toneBg[d.tone]} h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl`}>
                  <d.icon className="h-4 w-4 sm:h-[1.05rem] sm:w-[1.05rem]" strokeWidth={1.75} />
                </div>
                <div className="text-center text-[10.5px] sm:text-[11.5px] font-medium leading-tight">
                  {d.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="py-6 sm:py-8 text-center text-[10px] sm:text-[11px] font-light tracking-wide text-muted-foreground">
          © 2026 Resolve In Action · Built with the Resolven Design System
        </footer>
      </main>
    </div>
  );
}

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
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </span>
      <span className="line-clamp-2 text-center text-[0.64rem] font-medium leading-tight text-foreground">
        {title.replace(" Request", "").replace(" Claims", "")}
      </span>
    </>
  );

  const className = "mobile-module-tile";
  return to ? <Link to={to} className={className}>{content}</Link> : <button className={className}>{content}</button>;
}

function MyDepartmentCard({
  department,
}: {
  department: { icon: ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number | string }>; label: string; tone: keyof typeof toneBg };
}) {
  const { icon: Icon, label, tone } = department;
  return (
    <button className="mobile-mydept-card">
      <span className={`mobile-mydept-icon ${toneBg[tone]}`}>
        <Icon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.7} />
      </span>
      <div className="flex-1 text-left">
        <div className="text-[0.8rem] font-semibold leading-tight text-foreground">{label}</div>
        <div className="mt-0.5 text-[0.62rem] text-muted-foreground">12 files · 4 shared · updated today</div>
      </div>
      <span className="mobile-mydept-chev" aria-hidden>›</span>
    </button>
  );
}
