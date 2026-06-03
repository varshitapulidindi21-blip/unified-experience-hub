const items = [
  "Corporate announcement: Planned release window on Friday 10 PM IST.",
  "HR: Open enrollment for medical benefits closes May 30.",
  "IT: Scheduled VPN maintenance Saturday 2–4 AM IST.",
  "Finance: Q2 expense submissions due by month-end.",
  "Resolven AI: New document analysis features now available.",
];

export function AnnouncementsBar() {
  const loop = [...items, ...items];
  return (
    <section className="space-y-2">
      {/* Eyebrow label sits above the strip, fully separated */}
      <div className="px-1 text-[11px] font-bold uppercase tracking-[0.28em] text-primary dark:text-foreground/80">
        Announcements
      </div>

      {/* Full-width branded strip */}
      <div className="relative flex h-11 items-center overflow-hidden rounded-md bg-accent text-brand-black shadow-soft">
        {/* Marquee viewport */}
        <div
          className="marquee relative h-full flex-1"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 32px), transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 32px), transparent 100%)",
          }}
        >
          <div className="marquee-track flex h-full items-center whitespace-nowrap pl-6 text-[13px] font-light">
            {loop.map((text, i) => (
              <span key={i} className="inline-flex items-center gap-3">
                <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-black" />
                <span>
                  <span className="font-semibold">{text.split(":")[0]}:</span>
                  <span className="opacity-80">{text.includes(":") ? text.slice(text.indexOf(":") + 1) : ""}</span>
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Right-side branded parallelogram accents */}
        <div className="pointer-events-none relative z-10 ml-2 flex h-full shrink-0 items-center gap-1.5 pr-4">
          <span className="h-5 w-2.5 skew-x-[-20deg] bg-black/10" />
          <span className="h-5 w-2.5 skew-x-[-20deg] bg-black/20" />
          <span className="h-5 w-2.5 skew-x-[-20deg] bg-black/30" />
          <span className="h-5 w-2.5 skew-x-[-20deg] bg-black/45" />
        </div>
      </div>
    </section>
  );
}
