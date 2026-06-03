import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRightCircle, Mail, ArrowRight, Lock } from "lucide-react";
import loginBg from "@/assets/login-bg-energy.png";
import logo from "@/assets/resolven-logo.png";
import { signIn } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Resolven" },
      { name: "description", content: "Sign in to your Resolven workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSubmitting(true);
    signIn();
    setTimeout(() => navigate({ to: "/", replace: true }), 450);
  };

  const slant = { clipPath: "polygon(0 0, 100% 0, calc(100% - 44px) 100%, 0 100%)" } as const;
  const slantMobile = { clipPath: "polygon(28px 0, 100% 0, calc(100% - 28px) 100%, 0 100%)" } as const;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#2b1654]">
      {/* Background image */}
      <img
        src={loginBg}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* DESKTOP overlay — horizontal cinematic purple haze (left → right) */}
      <div
        aria-hidden
        className="absolute inset-0 hidden sm:block"
        style={{
          background:
            "linear-gradient(105deg, rgba(43,22,84,0.94) 0%, rgba(60,30,120,0.82) 30%, rgba(90,55,160,0.50) 55%, rgba(120,80,180,0.22) 78%, rgba(120,80,180,0.06) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 hidden sm:block"
        style={{
          background:
            "radial-gradient(950px 620px at 8% 35%, rgba(80,40,160,0.55), transparent 65%), radial-gradient(780px 520px at 100% 100%, rgba(40,200,120,0.16), transparent 70%)",
        }}
      />

      {/* MOBILE overlay — vertical top-down dreamy purple */}
      <div
        aria-hidden
        className="absolute inset-0 sm:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(43,22,84,0.92) 0%, rgba(60,30,120,0.78) 35%, rgba(90,55,160,0.45) 65%, rgba(120,80,180,0.18) 90%, rgba(120,80,180,0.05) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 sm:hidden"
        style={{
          background:
            "radial-gradient(700px 500px at 50% 0%, rgba(80,40,160,0.55), transparent 70%), radial-gradient(500px 380px at 50% 100%, rgba(40,200,120,0.14), transparent 75%)",
        }}
      />

      {/* Green slanted accent blocks — top right */}
      <div
        aria-hidden
        className="absolute right-4 top-4 sm:right-12 sm:top-10 flex gap-2 sm:gap-3 z-10"
      >
        <span className="block h-10 w-7 sm:h-20 sm:w-14 -skew-x-[22deg] bg-[#21c45d] shadow-[0_0_28px_rgba(33,196,93,0.55)]" />
        <span className="block h-10 w-7 sm:h-20 sm:w-14 -skew-x-[22deg] bg-[#21c45d] shadow-[0_0_28px_rgba(33,196,93,0.55)]" />
      </div>

      {/* =================== DESKTOP =================== */}
      <div className="relative z-10 hidden sm:flex h-full w-full items-stretch">
        <div className="w-full max-w-[640px] pt-[12vh] px-0">
          {/* Logo bar */}
          <div
            className="animate-rise relative flex h-[120px] items-center bg-white pl-16 pr-20"
            style={slant}
          >
            <img src={logo} alt="Resolven" className="h-24 w-auto" />
          </div>

          <div className="h-16" />

          <button
            onClick={handleLogin}
            disabled={submitting}
            className="animate-rise group relative flex h-[68px] w-full items-center bg-[#21c45d] pl-16 pr-20 text-white shadow-[0_10px_40px_-10px_rgba(33,196,93,0.55)] transition-all duration-300 hover:brightness-110 active:scale-[0.995] disabled:opacity-80"
            style={slant}
          >
            <ArrowRightCircle className="mr-3 h-5 w-5" strokeWidth={1.8} />
            <span className="text-[17px] font-medium tracking-wide" style={{ fontFamily: "Montserrat, system-ui, sans-serif" }}>
              Sign in with Resolven ID
            </span>
            <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
          </button>

          <div className="h-8" />

          {!showEmailForm && (
            <button
              onClick={() => setShowEmailForm(true)}
              className="animate-rise group relative flex h-[68px] w-full items-center bg-white/25 pl-16 pr-20 text-white backdrop-blur-md ring-1 ring-inset ring-white/20 transition-all duration-300 hover:bg-white/35"
              style={slant}
            >
              <Mail className="mr-3 h-5 w-5 text-white" strokeWidth={1.7} />
              <span className="text-[17px] font-medium tracking-wide" style={{ fontFamily: "Montserrat, system-ui, sans-serif" }}>
                Sign in with Email
              </span>
              <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
            </button>
          )}

          {showEmailForm && (
            <form onSubmit={handleLogin} className="relative animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="relative flex h-[68px] w-full items-center bg-white/25 pl-16 pr-20 text-white backdrop-blur-md ring-1 ring-inset ring-white/20" style={slant}>
                <Mail className="mr-3 h-5 w-5 text-white/90" strokeWidth={1.7} />
                <input type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                  className="flex-1 bg-transparent text-[16px] font-light tracking-wide text-white placeholder:text-white/70 focus:outline-none"
                  style={{ fontFamily: "Montserrat, system-ui, sans-serif" }} />
              </div>
              <div className="h-4" />
              <div className="relative flex h-[68px] w-full items-center bg-white/25 pl-16 pr-20 text-white backdrop-blur-md ring-1 ring-inset ring-white/20" style={slant}>
                <Lock className="mr-3 h-5 w-5 text-white/90" strokeWidth={1.7} />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
                  className="flex-1 bg-transparent text-[16px] font-light tracking-wide text-white placeholder:text-white/70 focus:outline-none"
                  style={{ fontFamily: "Montserrat, system-ui, sans-serif" }} />
              </div>
              <div className="h-6" />
              <button type="submit" disabled={submitting}
                className="group relative flex h-[68px] w-full items-center justify-center bg-white pl-16 pr-20 text-[#3b1d8a] shadow-[0_12px_40px_-12px_rgba(255,255,255,0.45)] transition-all duration-300 hover:brightness-105 active:scale-[0.995] disabled:opacity-80"
                style={slant}>
                <span className="text-[17px] font-semibold tracking-wide" style={{ fontFamily: "Montserrat, system-ui, sans-serif" }}>
                  {submitting ? "Signing in…" : "Login"}
                </span>
                <ArrowRight className="ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          )}

          <div className="h-10" />

          <button type="button"
            className="ml-16 text-[14px] font-medium tracking-wide text-white/95 transition-opacity hover:opacity-80"
            style={{ fontFamily: "Montserrat, system-ui, sans-serif" }}>
            Forgot Password?
          </button>
        </div>
      </div>

      {/* =================== MOBILE =================== */}
      <div className="relative z-10 sm:hidden flex h-full w-full flex-col items-center justify-center px-5">
        <div className="w-full max-w-[360px] flex flex-col items-stretch animate-rise">
          {/* Logo panel — centered, not edge-attached */}
          <div className="relative h-[96px] bg-white pl-6 pr-12 mx-auto w-full rounded-l-[2px] flex items-center justify-center" style={slantMobile}>
            <img src={logo} alt="Resolven" className="h-20 w-auto object-contain" />
          </div>

          <div className="h-5" />

          <button onClick={handleLogin} disabled={submitting}
            className="group relative flex h-[50px] w-full items-center bg-[#21c45d] pl-6 pr-10 text-white shadow-[0_8px_30px_-8px_rgba(33,196,93,0.55)] transition-all duration-300 active:scale-[0.995] disabled:opacity-80"
            style={slantMobile}>
            <ArrowRightCircle className="mr-2.5 h-4 w-4" strokeWidth={1.8} />
            <span className="text-[13px] font-medium tracking-wide" style={{ fontFamily: "Montserrat, system-ui, sans-serif" }}>
              Sign in with Resolven ID
            </span>
          </button>

          <div className="h-3" />

          {!showEmailForm && (
            <button onClick={() => setShowEmailForm(true)}
              className="group relative flex h-[50px] w-full items-center bg-white/25 pl-6 pr-10 text-white backdrop-blur-md ring-1 ring-inset ring-white/20 transition-all duration-300 active:bg-white/35"
              style={slantMobile}>
              <Mail className="mr-2.5 h-4 w-4 text-white" strokeWidth={1.7} />
              <span className="text-[13px] font-medium tracking-wide" style={{ fontFamily: "Montserrat, system-ui, sans-serif" }}>
                Sign in with Email
              </span>
            </button>
          )}

          {showEmailForm && (
            <form onSubmit={handleLogin} className="animate-in fade-in slide-in-from-top-2 duration-400">
              <div className="relative flex h-[46px] w-full items-center bg-white/25 pl-5 pr-9 text-white backdrop-blur-md ring-1 ring-inset ring-white/20" style={slantMobile}>
                <Mail className="mr-2 h-4 w-4 text-white/90" strokeWidth={1.7} />
                <input type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                  className="flex-1 bg-transparent text-[13px] font-light tracking-wide text-white placeholder:text-white/70 focus:outline-none"
                  style={{ fontFamily: "Montserrat, system-ui, sans-serif" }} />
              </div>
              <div className="h-2.5" />
              <div className="relative flex h-[46px] w-full items-center bg-white/25 pl-5 pr-9 text-white backdrop-blur-md ring-1 ring-inset ring-white/20" style={slantMobile}>
                <Lock className="mr-2 h-4 w-4 text-white/90" strokeWidth={1.7} />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
                  className="flex-1 bg-transparent text-[13px] font-light tracking-wide text-white placeholder:text-white/70 focus:outline-none"
                  style={{ fontFamily: "Montserrat, system-ui, sans-serif" }} />
              </div>
              <div className="h-3" />
              <button type="submit" disabled={submitting}
                className="relative flex h-[48px] w-full items-center justify-center bg-white pl-5 pr-9 text-[#3b1d8a] shadow-[0_10px_30px_-10px_rgba(255,255,255,0.45)] transition-all duration-300 active:scale-[0.995] disabled:opacity-80"
                style={slantMobile}>
                <span className="text-[14px] font-semibold tracking-wide" style={{ fontFamily: "Montserrat, system-ui, sans-serif" }}>
                  {submitting ? "Signing in…" : "Login"}
                </span>
              </button>
            </form>
          )}

          <div className="h-5" />

          <button type="button"
            className="self-center text-[12.5px] font-medium tracking-wide text-white/95 transition-opacity hover:opacity-80"
            style={{ fontFamily: "Montserrat, system-ui, sans-serif" }}>
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}
