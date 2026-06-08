import { cn } from "@/lib/utils";

/**
 * Brand dual-color section heading.
 * Day mode: first word = Resolven purple, rest = Resolven green
 * Night mode: first word = white, rest = Resolven green
 * Italic display typography with slightly increased letter-spacing.
 */
export function DualHeading({
  text,
  className,
  as: Tag = "h3",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
}) {
  const trimmed = text.trim();
  const idx = trimmed.indexOf(" ");
  const first = idx === -1 ? trimmed : trimmed.slice(0, idx);
  const rest = idx === -1 ? "" : trimmed.slice(idx + 1);
  return (
    <Tag
      className={cn(
        "font-display italic tracking-[0.005em] text-base sm:text-lg leading-tight",
        className,
      )}
      style={{ letterSpacing: "0.01em" }}
    >
      <span className="text-primary dark:text-white">{first}</span>
      {rest && <> <span className="text-accent">{rest}</span></>}
    </Tag>
  );
}
