"use client";
import { useState, useMemo, useRef } from "react";
import { Search, BookOpen, ChevronRight, ChevronDown, Hash, Menu, X } from "lucide-react";
import { SopSection, SopSubsection } from "@/lib/sop-data";

function renderContent(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    if (line.trim() === "") return <div key={i} className="h-2" />;
    if (line.startsWith("**") && line.endsWith("**") && !line.slice(2, -2).includes("**")) {
      return (
        <p key={i} className="font-display text-sm font-semibold text-badge tracking-wide mt-4 mb-1">
          {line.slice(2, -2)}
        </p>
      );
    }
    if (line.startsWith("- ")) {
      const text = line.slice(2).replace(/\*\*([^*]+)\*\*/g, "<strong class='text-[var(--text-primary)] font-semibold'>$1</strong>");
      return (
        <li key={i} className="ml-5 mb-2 text-[var(--text-secondary)] text-[15px] leading-relaxed list-disc"
          dangerouslySetInnerHTML={{ __html: text }} />
      );
    }
    const formatted = line.replace(/\*\*([^*]+)\*\*/g, "<strong class='text-[var(--text-primary)] font-semibold'>$1</strong>");
    return (
      <p key={i} className="text-[var(--text-secondary)] text-[15px] leading-relaxed mb-3"
        dangerouslySetInnerHTML={{ __html: formatted }} />
    );
  });
}

function SubsectionView({ sub }: { sub: SopSubsection }) {
  return (
    <div id={sub.id} className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-sm text-badge/70 font-bold">{sub.number}</span>
        <h3 className="font-display text-lg font-semibold text-primary-color tracking-wide">{sub.title}</h3>
      </div>
      <div className="pl-4 border-l border-[var(--border)]">
        {renderContent(sub.content)}
      </div>
    </div>
  );
}

type Props = { sections: SopSection[] };

export function PoliciesClient({ sections }: Props) {
  const [search, setSearch] = useState("");
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([sections[0]?.id ?? ""]));
  const [tocOpen, setTocOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const activeSection = sections.find(s => s.id === activeSectionId) ?? sections[0];

  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    const results: { section: SopSection; sub: SopSubsection }[] = [];
    for (const section of sections) {
      for (const sub of section.subsections) {
        if (sub.title.toLowerCase().includes(q) || sub.content.toLowerCase().includes(q) || section.title.toLowerCase().includes(q)) {
          results.push({ section, sub });
        }
      }
    }
    return results;
  }, [search, sections]);

  function toggleSection(id: string) {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function selectSection(id: string) {
    setActiveSectionId(id);
    setExpandedSections(prev => new Set([...prev, id]));
    setSearch("");
    setTocOpen(false);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }

  const TocContents = () => (
    <>
      {/* TOC header + search */}
      <div className="px-5 pt-5 pb-3 border-b border-[var(--border)]/40">
        <div className="flex items-center gap-2 mb-3">
          <Hash className="w-3 h-3 text-badge/60" />
          <span className="font-display text-[9px] tracking-[0.4em] text-[var(--text-muted)] uppercase">Table of Contents</span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search policies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input w-full pl-7 pr-3 py-1.5 rounded text-[11px]"
          />
        </div>
      </div>

      {/* Section list */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {sections.map(section => {
          const isActive = section.id === activeSectionId;
          const isExpanded = expandedSections.has(section.id);
          return (
            <div key={section.id} className="mb-0.5">
              <button
                onClick={() => { if (isActive) toggleSection(section.id); else selectSection(section.id); }}
                className={`w-full flex items-start gap-2.5 px-2 py-2 text-left rounded transition-all group ${isActive ? "bg-badge/8" : "hover:bg-[var(--border)]/20"}`}
              >
                <span className={`font-mono text-[10px] font-bold mt-0.5 w-5 flex-shrink-0 ${isActive ? "text-badge" : "text-[var(--text-muted)]"}`}>
                  {section.number}
                </span>
                <span className={`font-display text-[11px] tracking-wide flex-1 leading-snug ${isActive ? "text-badge font-semibold" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"}`}>
                  {section.title}
                </span>
                <ChevronDown className={`w-3 h-3 flex-shrink-0 mt-0.5 transition-transform duration-200 ${isActive ? "text-badge/70" : "text-[var(--text-muted)]/50"} ${isExpanded ? "rotate-180" : ""}`} />
              </button>
              {isExpanded && (
                <div className="ml-5 mt-0.5 mb-1 border-l-2 border-[var(--border)]/60 pl-3 space-y-0.5">
                  {section.subsections.map(sub => (
                    <a key={sub.id} href={`#${sub.id}`}
                      onClick={e => {
                        e.preventDefault();
                        if (!isActive) selectSection(section.id);
                        setTocOpen(false);
                        setTimeout(() => {
                          const el = document.getElementById(sub.id);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 50);
                      }}
                      className="flex items-baseline gap-2 py-1 px-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors group"
                    >
                      <span className="font-mono text-[9px] text-badge/40 flex-shrink-0 group-hover:text-badge/70 transition-colors">{sub.number}</span>
                      <span className="font-display text-[10px] tracking-wide leading-snug">{sub.title}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[var(--border)]/40">
        <p className="font-display text-[8px] tracking-[0.3em] text-[var(--text-muted)]/40 uppercase">BCSO Policy Manual — Rev. 2026</p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Page header */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-5 border-b border-[var(--border)]">
        <span className="font-display text-[10px] tracking-[0.5em] text-badge uppercase block mb-2">Department Portal</span>
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display text-xl sm:text-3xl font-bold text-primary-color tracking-tight flex items-center gap-2 sm:gap-3">
            <BookOpen className="w-5 h-5 sm:w-7 sm:h-7 text-badge flex-shrink-0" strokeWidth={1.5} />
            <span>STANDARD OPERATING PROCEDURES</span>
          </h1>
          {/* Mobile TOC toggle */}
          <button
            onClick={() => setTocOpen(true)}
            className="md:hidden flex items-center gap-1.5 font-display text-[9px] tracking-widest uppercase px-3 py-2 rounded border border-[var(--border)] text-[var(--text-muted)] hover:text-badge hover:border-badge/50 transition-colors flex-shrink-0 mt-1"
          >
            <Menu className="w-3.5 h-3.5" /> Contents
          </button>
        </div>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Blaine County Sheriff&apos;s Office &mdash; Official Policy Manual
        </p>
      </div>

      {/* Mobile TOC drawer backdrop */}
      {tocOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setTocOpen(false)} />
      )}

      {/* Mobile TOC drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[var(--bg-panel)] border-r border-[var(--border)] flex flex-col transition-transform duration-300 md:hidden ${tocOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 pt-5 pb-0">
          <span className="font-display text-[9px] tracking-[0.4em] text-badge uppercase">SOP Manual</span>
          <button onClick={() => setTocOpen(false)} className="text-[var(--text-muted)] hover:text-badge transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <TocContents />
      </div>

      {/* Desktop layout */}
      <div className="flex flex-1 overflow-hidden justify-center" style={{ height: "calc(100vh - 140px)" }}>
        <div className="flex w-full max-w-6xl min-w-0">

          {/* Desktop TOC sidebar */}
          <aside className="hidden md:flex w-64 flex-shrink-0 border-r border-[var(--border)]/50 flex-col overflow-hidden">
            <TocContents />
          </aside>

          {/* Content panel */}
          <main ref={contentRef} className="flex-1 overflow-y-auto min-w-0">
            {searchResults !== null ? (
              <div className="p-4 sm:p-8 max-w-3xl mx-auto">
                <p className="font-display text-xs tracking-widest text-[var(--text-muted)] uppercase mb-6">
                  {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
                </p>
                {searchResults.length === 0 ? (
                  <div className="panel py-16 text-center text-[var(--text-muted)] font-display text-sm tracking-wider">
                    No matching policies found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.map(({ section, sub }) => (
                      <button key={sub.id}
                        onClick={() => {
                          selectSection(section.id);
                          setTimeout(() => {
                            const el = document.getElementById(sub.id);
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                          }, 100);
                        }}
                        className="panel p-4 sm:p-5 text-left w-full group hover:border-[var(--badge)]/50 hover:bg-[var(--badge)]/5 transition-all"
                      >
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-mono text-[10px] text-badge/70">{sub.number}</span>
                          <span className="font-display text-[9px] tracking-widest uppercase text-[var(--text-muted)] px-1.5 py-0.5 border border-[var(--border)] rounded">
                            {section.number} — {section.title}
                          </span>
                        </div>
                        <h3 className="font-display text-sm font-semibold text-[var(--text-primary)] group-hover:text-badge transition-colors tracking-wide mb-1">{sub.title}</h3>
                        <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">{sub.content.replace(/\*\*/g, "").slice(0, 140)}…</p>
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-badge/60 font-display tracking-wide">
                          <ChevronRight className="w-3 h-3" /> View section
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : activeSection ? (
              <div className="p-4 sm:p-8 max-w-3xl mx-auto">
                <div className="mb-8 pb-6 border-b border-[var(--border)]">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="font-mono text-xs text-badge/60 font-bold tracking-wider">SECTION {activeSection.number}</span>
                    <div className="h-[1px] flex-1 bg-[var(--border)] hidden sm:block" />
                    <span className="text-[10px] font-display text-[var(--text-muted)] tracking-wider">
                      {activeSection.subsections.length} subsection{activeSection.subsections.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-primary-color tracking-tight">{activeSection.title}</h2>
                </div>
                <div>
                  {activeSection.subsections.map(sub => <SubsectionView key={sub.id} sub={sub} />)}
                </div>
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-[var(--border)]">
                  {(() => {
                    const idx = sections.findIndex(s => s.id === activeSection.id);
                    const prev = sections[idx - 1];
                    const next = sections[idx + 1];
                    return (
                      <>
                        {prev ? (
                          <button onClick={() => selectSection(prev.id)} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-badge transition-colors font-display text-xs tracking-widest uppercase">
                            <ChevronRight className="w-4 h-4 rotate-180" /><span className="hidden sm:inline">Section </span>{prev.number}
                          </button>
                        ) : <div />}
                        {next ? (
                          <button onClick={() => selectSection(next.id)} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-badge transition-colors font-display text-xs tracking-widest uppercase">
                            <span className="hidden sm:inline">Section </span>{next.number}<ChevronRight className="w-4 h-4" />
                          </button>
                        ) : <div />}
                      </>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[var(--text-muted)] font-display text-sm tracking-wider">
                Select a section from the sidebar.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
