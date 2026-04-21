"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BookOpen, Users, Star, Home, Sun, Moon, Settings, Search, Menu, X, FileText, Shield
} from "lucide-react";
import { PoliceLightBar } from "./PoliceLightBar";

const navItems = [
  { href: "/",         icon: Home,     label: "Home"                      },
  { href: "/policies", icon: BookOpen, label: "Standard Operating Procedures" },
  { href: "/policies", icon: FileText, label: "Policy Memorandum",  sub: true },
  { href: "/roster",   icon: Users,    label: "BCSO Public Roster"        },
  { href: "/staff",    icon: Star,     label: "Meet the Staff"            },
  { href: "/admin",    icon: Shield,   label: "Admin Portal",      sub: true },
];

export function Sidebar() {
  const pathname  = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen]       = useState(false);
  const [search, setSearch]   = useState("");

  useEffect(() => { setMounted(true); }, []);

  const content = (
    <div className="flex flex-col h-full">
      {/* Top light bar */}
      <div className="h-[3px] w-full flex-shrink-0 overflow-hidden">
        <div className="h-full w-full" style={{
          background: "linear-gradient(90deg, #E63946 0%, #E63946 48%, #111 49%, #1D6FCC 50%, #1D6FCC 100%)",
          animation: "navBarFlash 1s ease-in-out infinite"
        }} />
        <style>{`@keyframes navBarFlash { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      </div>

      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-[var(--border)] flex-shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image src="/BCSOBadge.png" alt="BCSO" fill className="object-contain drop-shadow-[0_0_8px_rgba(201,162,39,0.5)]" />
          </div>
          <div>
            <div className="font-display text-sm font-bold text-badge tracking-widest uppercase leading-tight">
              Blaine County
            </div>
            <div className="font-display text-[10px] text-[var(--text-muted)] tracking-[0.2em] uppercase">
              Sheriff&apos;s Office
            </div>
          </div>
        </div>
        <p className="text-[9px] font-display tracking-[0.25em] text-[var(--text-muted)] uppercase mt-2">
          Protect &middot; Serve &middot; Lead
        </p>
        <div className="mt-3">
          <PoliceLightBar />
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const active = item.href !== "/" ? pathname.startsWith(item.href) : pathname === "/";
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-150 group ${
                active
                  ? "bg-[var(--badge)]/15 border border-[var(--badge)]/30 text-badge"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel-alt)] hover:text-[var(--text-primary)]"
              } ${item.sub ? "opacity-80" : ""}`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${active ? "text-badge" : "text-[var(--text-muted)] group-hover:text-badge"} transition-colors`}
                strokeWidth={1.5}
              />
              <span className={`font-display text-[10px] tracking-widest uppercase leading-tight ${active ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Search */}
      <div className="px-4 py-4 border-t border-[var(--border)] flex-shrink-0">
        <p className="font-display text-[9px] tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">Search</p>
        <Link href="/policies" onClick={() => setOpen(false)}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search policies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input w-full pl-3 pr-8 py-2 rounded-lg text-xs"
            />
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-muted)]" />
          </div>
        </Link>
      </div>

      {/* Bottom row: theme + settings */}
      <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between flex-shrink-0">
        <button
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-badge transition-colors"
        >
          <Settings className="w-4 h-4" strokeWidth={1.5} />
          <span className="font-display text-[9px] tracking-widest uppercase">Settings</span>
        </button>
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-7 h-7 rounded border border-[var(--border)] bg-[var(--bg-panel-alt)] flex items-center justify-center text-[var(--text-muted)] hover:text-badge hover:border-badge transition-all"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Mission statement */}
      <div className="px-4 py-5 border-t border-[var(--border)] text-center flex-shrink-0">
        <div className="relative w-10 h-10 mx-auto mb-3 opacity-60">
          <Image src="/BCSOBadge.png" alt="" fill className="object-contain" />
        </div>
        <p className="font-display text-[9px] tracking-[0.3em] text-badge uppercase mb-2">Our Mission</p>
        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
          To protect the community, serve with integrity, and lead with honor.
        </p>
        <p className="text-[9px] text-[var(--text-muted)] mt-3 opacity-60">
          &copy; 2026 Blaine County Sheriff&apos;s Office
          <br />All Rights Reserved
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

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-60 bg-[var(--bg-panel)] border-r border-[var(--border)] transition-transform duration-300 md:hidden overflow-y-auto ${open ? "translate-x-0" : "-translate-x-full"}`}>
        {content}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 bg-[var(--bg-panel)] border-r border-[var(--border)] fixed inset-y-0 left-0 z-30 overflow-y-auto">
        {content}
      </aside>
    </>
  );
}
