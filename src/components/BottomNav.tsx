import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, CheckSquare, Home } from "lucide-react";
import aiLogo from "@/assets/resolven-ai-logo.png";

/**
 * Native-app style bottom navigation for mobile only.
 * Hidden on md+ where the desktop TopBar takes over.
 */
type NavItem = {
  to: "/" | "/modules" | "/resolven-ai";
  label: string;
  icon?: typeof Home;
  hash?: string;
  ai?: boolean;
};

const ITEMS: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/resolven-ai", label: "AI", ai: true },
  { to: "/modules", hash: "tasks", label: "My Tasks", icon: CheckSquare },
  { to: "/modules", label: "Dashboard", icon: BarChart3 },
];

export function BottomNav() {
  const location = useRouterState({ select: (s) => s.location });
  const pathname = location.pathname;
  const currentHash = location.hash;

  return (
    <nav
      aria-label="Primary"
      className="mobile-bottom-nav md:hidden fixed inset-x-0 bottom-0 z-40"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.5rem)" }}
    >
      <div className="mx-3 mb-2 rounded-[1.35rem] border border-border/45 bg-card/90 px-2 py-1.5 shadow-elev backdrop-blur-xl">
        <ul className="grid grid-cols-4">
          {ITEMS.map(({ to, hash, label, icon: Icon, ai }) => {
            const active = pathname === to && (hash ? currentHash === hash : currentHash === "");
            return (
              <li key={`${to}-${label}`}>
                <Link
                  to={to}
                  hash={hash}
                  className="group relative flex flex-col items-center justify-center gap-0.5 py-1.5"
                >
                  <span
                    className={[
                      "flex h-8 w-11 items-center justify-center rounded-2xl transition-all duration-300",
                      active
                        ? "bg-primary/12 text-primary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_22%,transparent),0_8px_18px_-14px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]"
                        : "text-muted-foreground group-active:scale-95",
                    ].join(" ")}
                  >
                    {ai ? (
                      <img src={aiLogo} alt="" className="h-[1.15rem] w-[1.15rem] object-contain" />
                    ) : Icon ? (
                      <Icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={active ? 2.1 : 1.8} />
                    ) : null}
                  </span>
                  <span
                    className={[
                      "text-[10px] font-medium tracking-wide transition-colors",
                      active ? "text-primary" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
