import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users, Bell, Award, Mail, ShieldCheck, Smartphone,
  Palette, LifeBuoy, LogOut, Pencil, Sun, Moon,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { useTheme } from "@/hooks/useTheme";


export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Resolven Hub" },
      { name: "description", content: "Your Resolven profile, preferences and account settings." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen">

      <div className="hidden md:block"><TopBar /></div>
      <main className="mx-auto w-full max-w-[1400px] space-y-5 px-4 pt-4 pb-28 sm:px-6 sm:py-10">
        {/* Mobile page heading */}
        <header className="md:hidden flex items-center justify-between pt-[env(safe-area-inset-top)]">
          <h1 className="text-[1.5rem] font-extrabold italic tracking-tight text-foreground">Profile</h1>
        </header>

        {/* Hero card */}
        <section className="mobile-profile-hero md:hidden">
          <div className="mobile-profile-hero__bg" aria-hidden />
          <div className="relative flex flex-col items-center gap-2 pt-6 pb-5 px-5 text-center">
            <div className="mobile-profile-avatar">SS</div>
            <h2 className="mt-2 text-[1.25rem] font-extrabold italic tracking-tight text-white">
              Samarth Sachdeva
            </h2>
            <p className="text-[0.78rem] text-white/85">Senior Operations Lead · Resolven Energy</p>
            <p className="text-[0.72rem] text-white/70">3y 4m tenure </p>
            <button className="mobile-profile-edit mt-3">
              <Pencil className="h-3.5 w-3.5" strokeWidth={2.2} /> Edit profile
            </button>
          </div>
        </section>

        {/* Quick section */}
        <ListSection title="Quick">
          <ListRow icon={Users} label="My department" />
          <ListRow icon={Bell} label="Notifications" />
          <ListRow icon={Award} label="Recognition & badges" />
        </ListSection>

        {/* Account section */}
        <ListSection title="Account">
          <ListRow icon={Mail} label="Contact details" />
          <ListRow icon={ShieldCheck} label="Privacy & Security" />
          <ListRow icon={Smartphone} label="Connected devices" trailing="3" />
        </ListSection>

        {/* Preferences */}
        <ListSection title="Preferences">
          <ListRow
            icon={isDark ? Moon : Palette}
            label="Appearance"
            onClick={toggleTheme}
            trailing={
              <span className="mobile-profile-pill">
                {isDark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                {isDark ? "Dark" : "Light"}
              </span>
            }
            noChevron
          />

          <ListRow icon={LifeBuoy} label="Support" />
        </ListSection>

        <button className="mobile-signout md:hidden">
          <LogOut className="h-4 w-4" strokeWidth={2.2} /> Sign out
        </button>

        <div className="hidden md:block">
          <Link to="/" className="text-sm text-primary underline">Back to home</Link>
        </div>
      </main>
    </div>
  );
}

function ListSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="md:hidden">
      <h3 className="mb-2 px-1 text-[0.95rem] font-extrabold italic tracking-tight text-foreground">
        {title}
      </h3>
      <div className="mobile-profile-list">{children}</div>
    </section>
  );
}

function ListRow({
  icon: Icon,
  label,
  trailing,
  noChevron,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number | string }>;
  label: string;
  trailing?: React.ReactNode;
  noChevron?: boolean;
}) {
  return (
    <button className="mobile-profile-row">
      <span className="mobile-profile-row__icon">
        <Icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.8} />
      </span>
      <span className="flex-1 text-left text-[0.92rem] font-medium text-foreground">{label}</span>
      {trailing && <span className="text-[0.82rem] text-muted-foreground">{trailing}</span>}
      {!noChevron && !trailing && <span className="text-[1.1rem] leading-none text-muted-foreground">›</span>}
      {!noChevron && trailing && typeof trailing === "string" && (
        <span className="text-[1.1rem] leading-none text-muted-foreground">›</span>
      )}
    </button>
  );
}
