import { ThemeToggle } from "@/components/ThemeToggle";

type Variant = "home" | "page";

export function MobileAppHeader({
  name = "Samarth Sachdeva",
  pageLabel,
  variant,
}: {
  name?: string;
  pageLabel?: string;
  searchPlaceholder?: string;
  variant?: Variant;
}) {
  const v: Variant = variant ?? (pageLabel ? "page" : "home");

  if (v === "home") {
    return (
      <header className="mobile-app-header mobile-app-header--home md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mobile-app-kicker">Good Morning</p>
            <h1 className="mt-1 truncate text-[1.5rem] font-semibold not-italic leading-tight tracking-tight text-foreground">
              {name}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
            <ThemeToggle />
            <button className="mobile-avatar" aria-label="Account menu">SS</button>
          </div>
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
        <div className="flex shrink-0 items-center gap-1.5">
          <ThemeToggle />
          <button className="mobile-avatar" aria-label="Account menu">SS</button>
        </div>
      </div>
    </header>
  );
}
