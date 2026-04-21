"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Shield, Menu, X } from "lucide-react";
import { PoliceLightBar } from "./PoliceLightBar";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/roster", label: "Roster" },
  { href: "/policies", label: "Policies & SOPs" },
  { href: "/staff", label: "Meet the Staff" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--bg-panel)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-lg"
            : "bg-transparent"
        }`}
      >
        {/* Top light bar strip */}
        <div className="h-[3px] w-full flex overflow-hidden">
          <div className="flex-1" style={{ background: "linear-gradient(90deg, #E63946 0%, #E63946 48%, #1D1D1D 49%, #1D6FCC 50%, #1D6FCC 100%)", animation: "navBarFlash 1s ease-in-out infinite" }} />
          <style>{`
            @keyframes navBarFlash {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-full border-2 border-[var(--badge)] flex items-center justify-center badge-glow group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5 text-badge" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-sm font-700 text-badge tracking-widest uppercase">
                  Sheriff&apos;s Dept
                </span>
                <span className="text-[10px] text-[var(--text-muted)] tracking-[0.2em] uppercase font-mono">
                  Roleplay Division
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-display text-xs tracking-widest uppercase px-4 py-2 rounded transition-all duration-200 ${
                      active
                        ? "text-badge bg-[var(--badge)]/10 border border-[var(--badge)]/30"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel-alt)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <PoliceLightBar className="hidden sm:flex" />

              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-panel-alt)] flex items-center justify-center text-[var(--text-secondary)] hover:text-badge hover:border-badge transition-all duration-200"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-panel-alt)] flex items-center justify-center text-[var(--text-secondary)]"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg-panel)]/98 backdrop-blur-md">
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`font-display text-xs tracking-widest uppercase px-4 py-3 rounded transition-all ${
                      active
                        ? "text-badge bg-[var(--badge)]/10 border border-[var(--badge)]/30"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
