"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import { BookOpen, Users, Star, Home, Sun, Moon, Shield, Menu, X, Radio } from "lucide-react";
import { PoliceLightBar } from "./PoliceLightBar";

const NAV = [
  {
    group: "Portal",
    items: [
      { href: "/",         icon: Home,     label: "Dashboard"         },
      { href: "/policies", icon: BookOpen, label: "SOP Manual"        },
      { href: "/roster",   icon: Users,    label: "Personnel Roster"  },
      { href: "/staff",    icon: Star,     label: "Command Staff"     },
    ],
  },
  {
    group: "Admin",
    items: [
      { href: "/admin", icon: Shield, label: "Admin Portal" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const content = (
    <div className="flex flex-col h-full relative">
      {/* Gold left-edge accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--badge)] via-[var(--badge)]/40 to-transparent z-10" />

      {/* Header — ID card style */}
      <div className="pl-5 pr-4 pt-5 pb-0 flex-shrink-0">
        <div className="flex items-start gap-3">
          {/* Badge */}
          <div className="relative w-14 h-14 flex-shrink-0 mt-0.5">
            <Image
              src="/BCSOBadge.png"
              alt="BCSO"
              fill
              className="object-contain"
              style={{ filter: "drop-shadow(0 0 10px rgba(201,162,39,0.45)) drop-shadow(0 2px 4px rgba(0,0,0,0.6))" }}
            />
          </div>
          {/* Name block */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="font-display text-[9px] tracking-[0.35em] text-[var(--text-muted)] uppercase mb-0.5">
              County of Blaine
            </div>
            <div className="font-display text-sm font-black text-badge tracking-wide leading-tight uppercase">
              Sheriff&rsquo;s Office
            </div>
            <div className="font-display text-[8px] tracking-[0.2em] text-[var(--text-muted)] mt-1 uppercase">
              Protect &bull; Serve &bull; Lead
            </div>
          </div>
        </div>

        {/* Light bar */}
        <div className="mt-4 mb-0">
          <PoliceLightBar className="w-full justify-between" />
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between mt-2.5 mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span className="font-display text-[8px] tracking-[0.3em] text-emerald-400 uppercase">Portal Online</span>
          </div>
          <div className="flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 text-[var(--text-muted)]" strokeWidth={1.5} />
            <span className="font-mono text-[8px] text-[var(--text-muted)] tracking-wider">BCSO-7B</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-[var(--border)] flex-shrink-0" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <p className="font-display text-[8px] tracking-[0.4em] text-[var(--text-muted)] uppercase px-2 mb-1.5">
              {group}
            </p>
            <div className="space-y-0.5">
              {items.map(({ href, icon: Icon, label }) => {
                const active = href !== "/" ? pathname.startsWith(href) : pathname === "/";
                return (
                  <Link
                    key={href + label}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`
                      flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-r-lg transition-all duration-150 group relative
                      ${active
                        ? "text-badge bg-[var(--badge)]/8"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel-alt)]"
                      }
                    `}
                  >
                    {/* Left border accent for active */}
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-badge" />
                    )}
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? "text-badge" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"}`}
                      strokeWidth={1.5}
                    />
                    <span className={`text-[11px] font-display tracking-wide leading-none ${active ? "font-semibold" : "font-medium"}`}>
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-[var(--border)] flex-shrink-0" />

      {/* Bottom utility row */}
      <div className="pl-5 pr-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-1.5 hover:text-badge transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark"
                ? <><Sun className="w-3.5 h-3.5" /><span className="font-display text-[9px] tracking-widest uppercase">Light</span></>
                : <><Moon className="w-3.5 h-3.5" /><span className="font-display text-[9px] tracking-widest uppercase">Dark</span></>
              }
            </button>
          )}
        </div>
        <span className="font-mono text-[8px] text-[var(--text-muted)] opacity-50 tracking-widest">v1.0</span>
      </div>

      {/* Footer */}
      <div className="pl-5 pr-4 pb-5 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-[1px] flex-1 bg-[var(--badge)]/20" />
          <div className="relative w-5 h-5 opacity-30 flex-shrink-0">
            <Image src="/BCSOBadge.png" alt="" fill className="object-contain" />
          </div>
          <div className="h-[1px] flex-1 bg-[var(--badge)]/20" />
        </div>
        <p className="font-display text-[8px] tracking-[0.25em] text-[var(--text-muted)] opacity-50 uppercase text-center leading-relaxed">
          &copy; 2026 Blaine County Sheriff&rsquo;s Office<br />All Rights Reserved
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-panel)] flex items-center justify-center text-[var(--text-secondary)]"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 z-40 w-60 bg-[var(--bg-panel)] border-r border-[var(--border)] transition-transform duration-300 md:hidden overflow-y-auto ${open ? "translate-x-0" : "-translate-x-full"}`}>
        {content}
      </div>

      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 bg-[var(--bg-panel)] border-r border-[var(--border)] fixed inset-y-0 left-0 z-30 overflow-y-auto">
        {content}
      </aside>
    </>
  );
}
