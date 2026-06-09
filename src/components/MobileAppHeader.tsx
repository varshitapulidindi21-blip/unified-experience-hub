import { Bell } from "lucide-react";

type Variant = "home" | "page";

export function MobileAppHeader({
  name = "Samarth Sachdeva",
  pageLabel,
  variant,
  hideNotifications,
}: {
  name?: string;
  pageLabel?: string;
  searchPlaceholder?: string;
  variant?: Variant;
  hideNotifications?: boolean;
}) {
  const v: Variant = variant ?? (pageLabel ? "page" : "home");

  if (v === "home") {
    return (
      <header className="mobile-app-header mobile-app-header--home md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <button className="mobile-avatar" aria-label="Account menu">SS</button>
            <div className="min-w-0">
              <p className="mobile-app-kicker">Good morning</p>
              <h1 className="truncate text-[1.05rem] font-semibold not-italic leading-tight tracking-tight text-foreground">
                {name}
              </h1>
            </div>
          </div>
          {!hideNotifications && (
            <button className="mobile-icon-btn relative" aria-label="Notifications">
              <Bell className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.7} />
              <span className="mobile-icon-dot" />
            </button>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="mobile-app-header mobile-app-header--page md:hidden">
      <div className="flex items-center justify-between gap-3">
        <h1 className="min-w-0 truncate text-[1.15rem] font-semibold not-italic leading-tight tracking-tight text-foreground">
          {pageLabel}
        </h1>
        {!hideNotifications && (
          <button className="mobile-icon-btn relative" aria-label="Notifications">
            <Bell className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.7} />
            <span className="mobile-icon-dot" />
          </button>
        )}
      </div>
    </header>
  );
}
