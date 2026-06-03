import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Settings, ChevronDown, User, LogOut } from "lucide-react";
import logo from "@/assets/resolven-logo.png";
import logoWhite from "@/assets/resolven-logo-white.png";
import { ThemeToggle } from "./ThemeToggle";
import { signOut } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar({ showSearch = true }: { showSearch?: boolean }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut();
    navigate({ to: "/login", replace: true });
  };
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
      <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center gap-3 px-4 sm:gap-5 sm:px-6 md:h-[72px]">
        <Link to="/" className="flex items-center shrink-0 transition-opacity hover:opacity-90">
          <img src={logo} alt="Resolven" className="logo-light h-9 w-auto md:h-14" />
          <img src={logoWhite} alt="Resolven" className="logo-dark h-9 w-auto md:h-14" />
        </Link>

        {showSearch && (
          <div className="group hidden md:flex flex-1 items-center gap-3 rounded-full border border-border/70 bg-card/70 px-5 py-2.5 text-sm text-muted-foreground shadow-soft transition-all duration-300 focus-within:border-primary/40 hover:border-primary/40 hover:bg-card">
            <Search className="h-4 w-4 transition-colors group-focus-within:text-primary" />
            <input
              className="flex-1 bg-transparent font-light text-foreground placeholder:text-muted-foreground focus:outline-none"
              placeholder="Search modules, departments, pages…"
              aria-label="Search the platform"
            />
          </div>
        )}

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          {showSearch && (
            <button className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-foreground/80 transition hover:bg-secondary/70" aria-label="Search">
              <Search className="h-[1.05rem] w-[1.05rem]" />
            </button>
          )}
          <ThemeToggle />
          <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-foreground/80 transition-all duration-300 hover:bg-secondary/70 hover:text-foreground">
            <Settings className="h-[1.1rem] w-[1.1rem]" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="ml-1 sm:ml-2 flex items-center gap-1 sm:gap-1.5 rounded-xl bg-primary/95 p-1 pr-1.5 sm:pr-2 text-primary-foreground shadow-soft transition-all duration-300 hover:bg-primary hover:shadow-elev focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Account menu"
              >
                <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-secondary text-[10px] sm:text-xs font-medium text-secondary-foreground">
                  SS
                </span>
                <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-80" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-60 rounded-2xl border-border/60 bg-popover/95 p-1.5 backdrop-blur-xl shadow-elev"
            >
              <DropdownMenuLabel className="px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/95 text-xs font-semibold text-primary-foreground">
                    SS
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">Samarth Sachdeva</p>
                    <p className="truncate text-[11px] font-light text-muted-foreground">
                      samarthsachdeva@resolven.com
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm font-light focus:bg-secondary/70">
                <User className="mr-2 h-4 w-4 opacity-80" />
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleLogout}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm font-light text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4 opacity-80" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
