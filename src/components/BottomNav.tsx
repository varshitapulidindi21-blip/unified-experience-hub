import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, CheckSquare, Home, User } from "lucide-react";
import aiLogo from "@/assets/resolven-ai-logo.png";

/**
 * Native-app style bottom navigation with center floating AI button + curved notch.
 */
type NavItem = {
  to: "/" | "/tasks" | "/dashboard" | "/profile" | "/resolven-ai";
  label: string;
  icon: typeof Home;
};

const LEFT: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
];
const RIGHT: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const location = useRouterState({ select: (s) => s.location });
  const pathname = location.pathname;

  const renderItem = ({ to, label, icon: Icon }: NavItem) => {
    const active = pathname === to;
    return (
      <li key={`${to}-${label}`} className="flex justify-center">
        <Link
          to={to}
          className="group flex flex-col items-center justify-center gap-0.5 py-1.5 px-2"
        >
          <Icon
            className={[
              "h-[1.15rem] w-[1.15rem] transition-colors",
              active ? "text-primary" : "text-muted-foreground",
            ].join(" ")}
            strokeWidth={active ? 2.2 : 1.8}
          />
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
  };

  const aiActive = pathname === "/resolven-ai";

  return (
    <nav
      aria-label="Primary"
      className="mobile-bottom-nav md:hidden fixed inset-x-0 bottom-0 z-40"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.5rem)" }}
    >
      <div className="mobile-nav-wrap mx-3 mb-2">
        {/* Curved SVG notch background */}
        <svg
          className="mobile-nav-svg"
          viewBox="0 0 360 80"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <filter id="navShadow" x="-20%" y="-50%" width="140%" height="220%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.18" />
            </filter>
          </defs>
          <path
            className="mobile-nav-path"
            filter="url(#navShadow)"
            d="M16 18 H156 A24 26 0 0 0 204 18 H344 C352 18 358 24 358 32 V70 C358 76 354 80 348 80 H12 C6 80 2 76 2 70 V32 C2 24 8 18 16 18 Z"
          />
        </svg>

        <ul className="mobile-nav-grid">
          {LEFT.map(renderItem)}
          <li className="flex justify-center">
            <Link
              to="/resolven-ai"
              aria-label="Resolven AI"
              className="mobile-nav-fab-link group flex flex-col items-center justify-center gap-0.5 py-1.5 px-2"
            >
              <span className={["mobile-nav-fab", aiActive ? "is-active" : ""].join(" ")}>
                <img src={aiLogo} alt="" className="h-[1.15rem] w-[1.15rem] object-contain" />
              </span>
              <span
                className={[
                  "text-[10px] font-medium tracking-wide transition-colors",
                  aiActive ? "text-primary" : "text-muted-foreground",
                ].join(" ")}
              >
                AI
              </span>
            </Link>
          </li>
          {RIGHT.map(renderItem)}
        </ul>
      </div>
    </nav>
  );
}
