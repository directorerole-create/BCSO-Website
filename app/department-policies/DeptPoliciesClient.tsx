"use client";
import { useState } from "react";
import Image from "next/image";
import { Menu, X, ChevronRight } from "lucide-react";
import { DeptPolicy } from "@/lib/dept-policies-data";

function renderBody(text: string) {
  return text.split("\n").map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2" />;

    if (line.startsWith("**") && line.endsWith("**") && !line.slice(2, -2).includes("**")) {
      return (
        <p key={i} className="font-semibold text-badge mt-4 mb-1 text-sm">
          {line.slice(2, -2)}
        </p>
      );
    }

    if (line.startsWith("- ")) {
      const html = line.slice(2).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      return (
        <li key={i} className="ml-5 mb-1.5 text-[var(--text-secondary)] text-sm leading-relaxed list-disc"
          dangerouslySetInnerHTML={{ __html: html }} />
      );
    }

    const html = line.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return (
      <p key={i} className="text-[var(--text-secondary)] text-sm leading-relaxed mb-2"
        dangerouslySetInnerHTML={{ __html: html }} />
    );
  });
}

function PolicyDocument({ policy }: { policy: DeptPolicy }) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Document header — matches the screenshot style */}
      <div className="rounded-t-lg overflow-hidden border border-[var(--badge)]/20 mb-8">
        <div className="flex items-stretch">
          {/* Dark left panel */}
          <div className="flex-1 bg-[var(--bg-panel-alt)] px-6 py-5 flex items-center">
            <div>
              <p className="font-display text-[8px] tracking-[0.5em] text-badge/60 uppercase mb-1">
                Department Directive
              </p>
              <p className="font-display text-2xl font-black text-[var(--text-primary)] tracking-tight leading-tight">
                {policy.title}
              </p>
            </div>
          </div>
          {/* Gold right panel */}
          <div className="flex-shrink-0 bg-badge flex flex-col items-center justify-center px-6 py-4 gap-2">
            <Image src="/BCSOBadge.png" alt="BCSO" width={52} height={52}
              className="object-contain drop-shadow-lg" />
            <div className="text-center">
              <p className="font-display text-[8px] tracking-wider text-black/70 uppercase leading-tight">
                Blaine County
              </p>
              <p className="font-display text-[8px] tracking-wider text-black/70 uppercase leading-tight">
                Sheriff&rsquo;s Office
              </p>
            </div>
          </div>
        </div>

        {/* Metadata bar */}
        <div className="bg-[var(--bg-panel)] border-t border-[var(--badge)]/15 px-6 py-3 grid grid-cols-3 gap-4">
          <div>
            <p className="font-display text-[8px] tracking-[0.4em] text-[var(--text-muted)] uppercase mb-0.5">
              Directive Number
            </p>
            <p className="font-mono text-sm font-bold text-badge">{policy.docNumber}</p>
          </div>
          <div>
            <p className="font-display text-[8px] tracking-[0.4em] text-[var(--text-muted)] uppercase mb-0.5">
              Effective Date
            </p>
            <p className="text-sm text-[var(--text-primary)] font-medium">{policy.effectiveDate}</p>
          </div>
          <div>
            <p className="font-display text-[8px] tracking-[0.4em] text-[var(--text-muted)] uppercase mb-0.5">
              Last Updated
            </p>
            <p className="text-sm text-[var(--text-primary)] font-medium">{policy.lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* Policy sections */}
      <div className="space-y-8 panel px-6 sm:px-8 py-8">
        {policy.sections.map((s, i) => (
          <div key={i}>
            <h3 className="font-display text-base font-bold text-badge tracking-wide mb-3 pb-1.5 border-b border-[var(--badge)]/15">
              {s.heading}
            </h3>
            <div className="pl-1">
              {renderBody(s.body)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 px-1">
        <p className="font-display text-[8px] tracking-[0.3em] text-[var(--text-muted)]/40 uppercase text-center">
          BCSO Official Directive &bull; {policy.docNumber} &bull; Blaine County Sheriff&rsquo;s Office
        </p>
      </div>
    </div>
  );
}

export function DeptPoliciesClient({ policies, source }: { policies: DeptPolicy[]; source?: "live" | "offline" }) {
  const [activeId, setActiveId]   = useState(policies[0]?.id ?? "");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const active = policies.find(p => p.id === activeId) ?? policies[0];

  const SidebarContents = () => (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 border-b border-[var(--border)]/50">
        <p className="font-display text-[8px] tracking-[0.45em] text-badge/60 uppercase mb-1">
          Department Directives
        </p>
        <p className="font-display text-xs font-bold text-[var(--text-primary)]">
          {policies.length} Policies
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {policies.map(p => {
          const isActive = p.id === activeId;
          return (
            <button key={p.id}
              onClick={() => { setActiveId(p.id); setDrawerOpen(false); }}
              className={`w-full text-left flex items-start gap-2 px-2.5 py-2.5 rounded transition-all group ${
                isActive
                  ? "bg-[var(--badge)]/10 border border-[var(--badge)]/25"
                  : "hover:bg-[var(--bg-panel-alt)]"
              }`}
            >
              <span className={`font-mono text-[9px] font-bold flex-shrink-0 mt-0.5 ${isActive ? "text-badge" : "text-[var(--text-muted)]"}`}>
                {p.number}
              </span>
              <span className={`font-display text-xs leading-snug tracking-wide ${isActive ? "text-badge font-semibold" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"}`}>
                {p.title}
              </span>
              {isActive && <ChevronRight className="w-3 h-3 text-badge/60 flex-shrink-0 ml-auto mt-0.5" />}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Page header */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-5 border-b border-[var(--border)]">
        <span className="font-display text-[10px] tracking-[0.5em] text-badge uppercase block mb-2">
          Department Portal
        </span>
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display text-xl sm:text-3xl font-bold text-primary-color tracking-tight flex items-center gap-3">
            DEPARTMENT POLICIES
            {source === "live" && (
              <span className="text-[9px] font-display tracking-[0.3em] uppercase text-emerald-400 font-semibold flex items-center gap-1 mt-1 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Live
              </span>
            )}
            {source === "offline" && (
              <span className="text-[9px] font-display tracking-[0.3em] uppercase text-red-400 font-semibold flex items-center gap-1 mt-1 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />Offline
              </span>
            )}
          </h1>
          <button onClick={() => setDrawerOpen(true)}
            className="md:hidden flex items-center gap-1.5 font-display text-[9px] tracking-widest uppercase px-3 py-2 rounded border border-[var(--border)] text-[var(--text-muted)] hover:text-badge hover:border-badge/50 transition-colors flex-shrink-0 mt-1">
            <Menu className="w-3.5 h-3.5" /> Policies
          </button>
        </div>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Blaine County Sheriff&rsquo;s Office &mdash; Official Directives &amp; Additional Policies
        </p>
      </div>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[var(--bg-panel)] border-r border-[var(--border)] flex flex-col transition-transform duration-300 md:hidden ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[var(--border)]/50">
          <span className="font-display text-[9px] tracking-[0.4em] text-badge uppercase">Policies</span>
          <button onClick={() => setDrawerOpen(false)} className="text-[var(--text-muted)] hover:text-badge transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <SidebarContents />
      </div>

      {/* Desktop layout */}
      <div className="flex flex-1 overflow-hidden justify-center" style={{ height: "calc(100vh - 140px)" }}>
        <div className="flex w-full max-w-6xl min-w-0">

          {/* Desktop sidebar */}
          <aside className="hidden md:flex w-64 flex-shrink-0 border-r border-[var(--border)]/50 flex-col overflow-hidden">
            <SidebarContents />
          </aside>

          {/* Document view */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
            {active && <PolicyDocument policy={active} />}
          </main>

        </div>
      </div>
    </div>
  );
}
