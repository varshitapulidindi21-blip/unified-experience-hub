import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { X, Minus, Maximize2, Send } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import aiLogo from "@/assets/resolven-ai-logo.png";

// Premium tile for the colorful AI logo
function AiLogoTile({ size = "h-12 w-12", logoSize = "h-9 w-9", rounded = "rounded-2xl" }: { size?: string; logoSize?: string; rounded?: string }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-[#C8B6D8] dark:bg-[oklch(0.203_0.05_290)] ${size} ${rounded} ring-1 ring-white/10`}
      style={{
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.08) inset, 0 10px 30px -12px rgba(0,0,0,0.55)",
      }}
    >
      <span
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.18), transparent 60%)",
        }}
      />
      <img src={aiLogo} alt="" className={`relative ${logoSize} object-contain`} />
    </span>
  );
}

export function SparkleFab() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Link
        to="/resolven-ai"
        aria-label="Open Resolven AI"
        className="group fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C8B6D8] shadow-glow ring-1 ring-black/5 transition-all duration-500 active:scale-95 dark:bg-[oklch(0.203_0.05_290)]"
      >
        <img src={aiLogo} alt="" className="relative h-7 w-7 object-contain" />
      </Link>
    );
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => {
            setOpen(true);
            setMinimized(false);
          }}
          className="group fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C8B6D8] shadow-glow ring-1 ring-black/5 transition-all duration-500 hover:scale-[1.06] hover:shadow-elev dark:bg-[oklch(0.203_0.05_290)]"
          aria-label="Open Resolven AI"
        >
          <span
            className="absolute -inset-0.5 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-purple) 0%, var(--brand-green) 100%)",
            }}
          />
          <img
            src={aiLogo}
            alt=""
            className="relative h-8 w-8 object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </button>
      )}

      {open && minimized && (
        <button
          onClick={() => setMinimized(false)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-elev transition hover:scale-[1.03]"
        >
          <img src={aiLogo} alt="" className="h-5 w-5 object-contain" />
          Resolven AI
        </button>
      )}

      {open && !minimized && (
        <div className="animate-rise fixed bottom-6 right-6 z-40 flex h-[440px] w-[300px] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-elev backdrop-blur-xl">
          <div
            className="flex items-center justify-between px-4 py-3 text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-purple) 0%, var(--brand-purple-deep) 60%, var(--brand-green) 130%)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium tracking-tight">Resolven AI</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Link
                to="/resolven-ai"
                aria-label="Expand"
                className="flex h-7 w-7 items-center justify-center rounded-md text-white/85 transition hover:bg-white/15 hover:text-white"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={() => setMinimized(true)}
                aria-label="Minimize"
                className="flex h-7 w-7 items-center justify-center rounded-md text-white/85 transition hover:bg-white/15 hover:text-white"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-md text-white/85 transition hover:bg-white/15 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <div className="flex items-start gap-2.5">
              <AiLogoTile size="h-9 w-9" logoSize="h-7 w-7" rounded="rounded-xl" />
              <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-border/60 bg-secondary/40 px-3.5 py-2.5 text-[0.9rem] font-light leading-relaxed text-foreground">
                Hi Samarth — how can I help you today? Ask anything, or pick up where you left off.
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 p-3">
            <div className="flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-2 py-1.5 shadow-soft focus-within:border-primary/40">
              <input
                className="flex-1 bg-transparent px-1 text-sm font-light text-foreground placeholder:text-muted-foreground focus:outline-none"
                placeholder="Ask Resolven AI…"
              />
              <button
                aria-label="Send"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand-purple), var(--brand-green))",
                }}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
