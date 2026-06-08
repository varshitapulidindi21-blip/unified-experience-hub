import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Sparkles, User } from "lucide-react";

/**
 * Native-app style bottom navigation for mobile only.
 * Hidden on md+ where the desktop TopBar takes over.
 */
type NavItem = {
  to: "/" | "/modules" | "/resolven-ai" | "/expense-claims";
  label: string;
  icon: typeof Home;
  accent?: boolean;
};

const ITEMS: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/modules", label: "Modules", icon: LayoutGrid },
  { to: "/resolven-ai", label: "AI", icon: Sparkles, accent: true },
  { to: "/expense-claims", label: "Claims", icon: User },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed inset-x-0 bottom-0 z-40"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.5rem)" }}
    >
      <div className="mx-3 mb-2 rounded-[1.5rem] border border-border/60 bg-card/85 px-2 py-1.5 shadow-elev backdrop-blur-xl">
        <ul className="grid grid-cols-4">
          {ITEMS.map(({ to, label, icon: Icon, accent }) => {
            const active = pathname === to || (to !== "/" && pathname.startsWith(to));
            return (
              <li key={to}>
                <Link
                  to={to}
                  className="group relative flex flex-col items-center justify-center gap-0.5 py-2"
                >
                  <span
                    className={[
                      "flex h-9 w-12 items-center justify-center rounded-2xl transition-all duration-300",
                      active
                        ? accent
                          ? "bg-accent/15 text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_25%,transparent)]"
                          : "bg-primary/12 text-primary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_22%,transparent)]"
                        : "text-muted-foreground group-active:scale-95",
                    ].join(" ")}
                  >
                    <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={active ? 2.1 : 1.8} />
                  </span>
                  <span
                    className={[
                      "text-[10px] font-medium tracking-wide transition-colors",
                      active ? (accent ? "text-accent" : "text-primary") : "text-muted-foreground",
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
