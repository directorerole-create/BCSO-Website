import Link from "next/link";
import Image from "next/image";
import { Users, BookOpen, Star, ChevronRight, Radio } from "lucide-react";
import { supabase } from "@/lib/supabase";

async function getStats() {
  try {
    const [{ count: rosterCount }, { count: policyCount }, { count: staffCount }] = await Promise.all([
      supabase.from("roster").select("*", { count: "exact", head: true }).eq("status", "Active"),
      supabase.from("policies").select("*", { count: "exact", head: true }),
      supabase.from("staff").select("*", { count: "exact", head: true }),
    ]);
    return { rosterCount: rosterCount ?? 0, policyCount: policyCount ?? 0, staffCount: staffCount ?? 0 };
  } catch {
    return { rosterCount: 0, policyCount: 0, staffCount: 0 };
  }
}

const quickLinks = [
  {
    href: "/roster",
    icon: Users,
    label: "Department Roster",
    description: "View all active personnel, ranks, and divisions",
    color: "text-blue-400",
    border: "border-blue-500/20 hover:border-blue-500/50",
    bg: "hover:bg-blue-500/5",
  },
  {
    href: "/policies",
    icon: BookOpen,
    label: "Policies & SOPs",
    description: "Search and read all department standard operating procedures",
    color: "text-badge",
    border: "border-[var(--badge)]/20 hover:border-[var(--badge)]/50",
    bg: "hover:bg-[var(--badge)]/5",
  },
  {
    href: "/staff",
    icon: Star,
    label: "Meet the Staff",
    description: "Learn about leadership and command staff",
    color: "text-emerald-400",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    bg: "hover:bg-emerald-500/5",
  },
];

export default async function HomePage() {
  const { rosterCount, policyCount, staffCount } = await getStats();

  return (
    <div className="min-h-screen hex-bg">
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden scanlines">
        {/* Background layers */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(201,162,39,0.05) 0%, transparent 70%)" }} />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge emblem */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-36 h-36 relative badge-glow">
                <Image src="/BCSOBadge.png" alt="BCSO Badge" fill className="object-contain drop-shadow-[0_0_20px_rgba(201,162,39,0.4)]" />
              </div>
              {/* Orbit ring */}
              <div className="absolute inset-[-12px] rounded-full border border-[var(--badge)]/20"
                style={{ animation: "spin 20s linear infinite" }} />
              <div className="absolute inset-[-24px] rounded-full border border-[var(--badge)]/10"
                style={{ animation: "spin 30s linear infinite reverse" }} />
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          </div>

          {/* Department name */}
          <div className="mb-2">
            <span className="font-display text-[10px] tracking-[0.5em] text-badge uppercase block mb-4">
              Official Portal
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-color leading-none tracking-tight mb-4">
            SHERIFF&apos;S
            <span className="block text-badge">DEPARTMENT</span>
          </h1>
          <p className="font-display text-sm tracking-[0.3em] text-[var(--text-muted)] uppercase mb-6">
            Roleplay Division &mdash; Est. 2022
          </p>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-base leading-relaxed mb-10">
            Welcome to the official department portal. Access the roster, standard operating procedures,
            and meet the command staff.
          </p>

          {/* Radio status */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--badge)]/30 bg-[var(--badge)]/5 text-badge text-xs font-display tracking-widest uppercase mb-10">
            <Radio className="w-3 h-3" />
            <span>All Units — 10-8 In Service</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Quick nav */}
          <div className="flex flex-wrap justify-center gap-3">
            {quickLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-display text-xs tracking-widest uppercase px-6 py-3 rounded border border-[var(--badge)]/30 bg-[var(--badge)]/10 text-badge hover:bg-[var(--badge)]/20 hover:border-[var(--badge)]/60 transition-all duration-200 flex items-center gap-2"
              >
                {label}
                <ChevronRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-panel)]">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-3 divide-x divide-[var(--border)]">
          {[
            { label: "Active Personnel", value: rosterCount, suffix: "" },
            { label: "Policies & SOPs", value: policyCount, suffix: "" },
            { label: "Command Staff", value: staffCount, suffix: "" },
          ].map(({ label, value, suffix }) => (
            <div key={label} className="text-center px-6">
              <div className="font-display text-3xl font-bold text-badge">
                {value}{suffix}
              </div>
              <div className="text-xs text-[var(--text-muted)] tracking-widest uppercase mt-1 font-display">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick access cards */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="mb-10 text-center">
          <span className="font-display text-[10px] tracking-[0.4em] text-badge uppercase">Department Portal</span>
          <h2 className="font-display text-2xl font-bold text-primary-color mt-2 tracking-wide">Quick Access</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {quickLinks.map(({ href, icon: Icon, label, description, color, border, bg }) => (
            <Link
              key={href}
              href={href}
              className={`panel p-6 group transition-all duration-200 ${border} ${bg} hover:-translate-y-1`}
            >
              <div className={`w-10 h-10 rounded-lg border ${border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.5} />
              </div>
              <h3 className={`font-display text-sm font-semibold tracking-wide ${color} mb-2 uppercase`}>
                {label}
              </h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">{description}</p>
              <div className={`mt-4 flex items-center gap-1 text-xs ${color} font-display tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity`}>
                Access <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Dispatch callout */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-panel-alt)]">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-[var(--badge)]/40" />
            <span className="font-display text-[10px] tracking-[0.5em] text-badge uppercase">Dispatch</span>
            <div className="h-[1px] w-12 bg-[var(--badge)]/40" />
          </div>
          <p className="font-display text-lg text-[var(--text-secondary)] tracking-wide">
            &ldquo;All units, all units — be advised this portal is now live.&rdquo;
          </p>
          <p className="text-sm text-[var(--text-muted)] mt-2">All data syncs automatically from Google Sheets &amp; Docs.</p>
        </div>
      </section>
    </div>
  );
}
