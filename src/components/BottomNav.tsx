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
          viewBox="0 0 360 68"
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
            d="M16 6 H146 C154 6 158 10 160 16 C164 30 172 38 180 38 C188 38 196 30 200 16 C202 10 206 6 214 6 H344 C352 6 358 12 358 20 V58 C358 64 354 68 348 68 H12 C6 68 2 64 2 58 V20 C2 12 8 6 16 6 Z"
          />
        </svg>

        <ul className="mobile-nav-grid">
          {LEFT.map(renderItem)}
          <li className="flex justify-center">
            <Link to="/resolven-ai" aria-label="Resolven AI" className="mobile-nav-fab-link">
              <span className={["mobile-nav-fab", aiActive ? "is-active" : ""].join(" ")}>
                <img src={aiLogo} alt="" className="h-[1.4rem] w-[1.4rem] object-contain" />
              </span>
              <span className="mt-0.5 text-[10px] font-medium tracking-wide text-muted-foreground">
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
