import { Bell } from "lucide-react";

type Variant = "home" | "page";

export function MobileAppHeader({
  name = "Samarth Sachdeva",
  pageLabel,
  pageSubtitle,
  variant,
  hideNotifications,
}: {
  name?: string;
  pageLabel?: string;
  pageSubtitle?: string;
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

  const trimmed = (pageLabel ?? "").trim();
  const spaceIdx = trimmed.indexOf(" ");
  const firstWord = spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
  const restWords = spaceIdx === -1 ? "" : trimmed.slice(spaceIdx + 1);

  return (
    <header className="mobile-app-header mobile-app-header--page md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1
            className="italic font-bold tracking-tight text-[1.45rem] leading-[1.1]"
            style={{ fontFamily: "Montserrat, system-ui, sans-serif", color: "var(--brand-purple-deep, var(--brand-purple))" }}
          >
            {firstWord}
            {restWords && (
              <span style={{ color: "var(--brand-green)" }}>{" "}{restWords}</span>
            )}
          </h1>
          {pageSubtitle && (
            <p
              className="mt-1 text-[0.72rem] font-normal italic text-muted-foreground/85"
              style={{ fontFamily: "Montserrat, system-ui, sans-serif" }}
            >
              {pageSubtitle}
            </p>
          )}
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

