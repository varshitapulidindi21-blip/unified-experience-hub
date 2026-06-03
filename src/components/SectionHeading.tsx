export function SectionHeading({
  eyebrow,
  primary,
  accent,
  right,
}: {
  eyebrow?: string;
  primary: string;
  accent: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div className="space-y-1.5">
        {eyebrow && (
          <div className="flex items-center gap-2 text-[10.5px] font-medium tracking-[0.22em] uppercase text-accent/90">
            <span className="inline-block h-px w-6 bg-accent/60" />
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-[1.6rem] md:text-[1.95rem] leading-[1.05]">
          <span className="text-primary dark:text-white">{primary}</span>{" "}
          <span className="text-accent">{accent}</span>
        </h2>
      </div>
      {right}
    </div>
  );
}
