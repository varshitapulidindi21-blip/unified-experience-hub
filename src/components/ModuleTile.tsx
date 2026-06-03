import type { ComponentType, SVGProps } from "react";
import { Pin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Tone = "purple" | "green" | "lavender" | "green-light" | "grey";

const toneClass: Record<Tone, string> = {
  purple: "tile-purple",
  green: "tile-green",
  lavender: "tile-lavender",
  "green-light": "tile-green-light",
  grey: "tile-grey",
};

export function ModuleTile({
  icon: Icon,
  title,
  subtitle,
  tone = "purple",
  pinned,
  large,
  brand,
  to,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number | string }>;
  title: string;
  subtitle?: string;
  tone?: Tone;
  pinned?: boolean;
  large?: boolean;
  brand?: boolean;
  to?: string;
}) {
  const inner = (
    <>
      {brand ? (
        <div className="brand-tile shrink-0 h-8 w-8 sm:h-12 sm:w-12 rounded-[0.55rem] sm:rounded-[0.95rem]">
          <Icon className="h-[1.05rem] w-[1.05rem] sm:h-9 sm:w-9" />
        </div>
      ) : (
        <div className={cn("tile shrink-0 h-8 w-8 sm:h-12 sm:w-12 rounded-[0.55rem] sm:rounded-[0.95rem]", toneClass[tone])}>
          <Icon className="h-[0.85rem] w-[0.85rem] sm:h-[1.35rem] sm:w-[1.35rem]" strokeWidth={1.75} />
        </div>
      )}
      <div className={cn("min-w-0 flex-1", pinned && (large ? "pr-0" : "pr-6"))}>
        <div className={cn(
          "font-medium text-[0.8rem] sm:text-[0.95rem] leading-tight tracking-tight truncate",
          large && pinned && "pr-7",
        )}>
          {title}
        </div>
        {subtitle && (
          <div className="mc-sub mt-0.5 sm:mt-1 text-[0.66rem] sm:text-xs font-light leading-snug sm:leading-relaxed text-muted-foreground line-clamp-2">
            {subtitle}
          </div>
        )}
      </div>
      {pinned && (
        <span
          className={cn(
            "absolute flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent",
            large ? "right-3 top-3" : "right-2.5 top-2.5",
          )}
          aria-label="Pinned"
        >
          <Pin className="h-3 w-3" />
        </span>
      )}
    </>
  );

  const className = cn(
    "module-card group flex gap-2 sm:gap-4 p-2.5 sm:p-4 md:p-5",
    large ? "flex-col items-start" : "items-center",
    to && "cursor-pointer",
  );

  if (to) {
    return <Link to={to} className={className}>{inner}</Link>;
  }
  return <div className={className}>{inner}</div>;
}

