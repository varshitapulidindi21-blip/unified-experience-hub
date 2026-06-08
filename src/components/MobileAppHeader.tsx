import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function MobileAppHeader({
  name = "Samarth Sachdeva",
  pageLabel,
  searchPlaceholder = "Search modules, pages…",
}: {
  name?: string;
  pageLabel?: string;
  searchPlaceholder?: string;
}) {
  return (
    <header className="mobile-app-header md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mobile-app-kicker">Good Morning</p>
          <div className="mt-0.5 flex items-center gap-2">
            <h1 className="truncate text-[1.12rem] font-semibold not-italic leading-tight text-foreground">
              {name}
            </h1>
            {pageLabel && <span className="mobile-context-chip">{pageLabel}</span>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <ThemeToggle />
          <button className="mobile-avatar" aria-label="Account menu">SS</button>
        </div>
      </div>

      <label className="mobile-search-field mt-3 flex items-center gap-2.5">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.9} />
        <input
          aria-label="Search"
          placeholder={searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent text-[0.9rem] font-light text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </label>
    </header>
  );
}