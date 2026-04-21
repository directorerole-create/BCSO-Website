"use client";
import { useState, useMemo } from "react";
import { Search, BookOpen, ChevronRight, ArrowLeft, Tag, Clock, Hash } from "lucide-react";
import { Policy } from "@/lib/supabase";

const CATEGORY_COLORS: Record<string, string> = {
  Operations: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  Patrol: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  Communications: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  General: "text-[var(--badge)] border-[var(--badge)]/30 bg-[var(--badge)]/10",
  Investigations: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  Training: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "text-[var(--text-secondary)] border-[var(--border)] bg-[var(--bg-panel-alt)]";
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const output: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("### ")) {
      output.push(<h3 key={i} className="font-display text-base font-semibold text-badge mt-6 mb-2 tracking-wide">{line.slice(4)}</h3>);
    } else if (line.startsWith("## ")) {
      output.push(<h2 key={i} className="font-display text-xl font-bold text-primary-color mt-8 mb-3 tracking-wide border-b border-[var(--border)] pb-2">{line.slice(3)}</h2>);
    } else if (line.startsWith("# ")) {
      output.push(<h1 key={i} className="font-display text-2xl font-bold text-badge mt-6 mb-4">{line.slice(2)}</h1>);
    } else if (line.startsWith("- **") || line.startsWith("- ")) {
      const text = line.slice(2);
      const formatted = text.replace(/\*\*([^*]+)\*\*/g, "<strong class='text-badge font-semibold'>$1</strong>");
      output.push(
        <li key={i} className="ml-4 mb-1 text-[var(--text-secondary)] text-sm leading-relaxed list-disc"
          dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    } else if (line.trim() === "") {
      output.push(<div key={i} className="h-2" />);
    } else {
      const formatted = line.replace(/\*\*([^*]+)\*\*/g, "<strong class='text-[var(--text-primary)] font-semibold'>$1</strong>");
      output.push(
        <p key={i} className="text-[var(--text-secondary)] text-sm leading-relaxed mb-2"
          dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    }
    i++;
  }
  return output;
}

export function PoliciesClient({ policies }: { policies: Policy[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selected, setSelected] = useState<Policy | null>(null);

  const categories = useMemo(() => {
    const set = new Set(policies.map((p) => p.category));
    return ["All", ...Array.from(set).sort()];
  }, [policies]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return policies.filter((p) => {
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        (p.policy_number ?? "").toLowerCase().includes(q);
      const matchCat = categoryFilter === "All" || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [policies, search, categoryFilter]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, Policy[]>>((acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    }, {});
  }, [filtered]);

  if (selected) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-badge transition-colors font-display text-xs tracking-widest uppercase mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Policies
          </button>

          <div className="panel p-8">
            {/* Policy header */}
            <div className="mb-6 pb-6 border-b border-[var(--border)]">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={`text-[10px] font-display tracking-widest uppercase px-2 py-1 rounded border ${getCategoryColor(selected.category)}`}>
                  {selected.category}
                </span>
                {selected.policy_number && (
                  <span className="flex items-center gap-1 text-[10px] font-display text-[var(--text-muted)] tracking-wider">
                    <Hash className="w-3 h-3" />
                    {selected.policy_number}
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl font-bold text-primary-color tracking-wide">{selected.title}</h1>
              <div className="flex items-center gap-2 mt-3 text-xs text-[var(--text-muted)]">
                <Clock className="w-3 h-3" />
                Last updated: {new Date(selected.last_updated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>

            {/* Policy content */}
            <div className="prose-custom">
              {renderMarkdown(selected.content)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <span className="font-display text-[10px] tracking-[0.5em] text-badge uppercase block mb-2">Department Portal</span>
        <h1 className="font-display text-4xl font-bold text-primary-color tracking-tight flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-badge" strokeWidth={1.5} />
          POLICIES &amp; SOPs
        </h1>
        <p className="text-[var(--text-secondary)] mt-2 text-sm">
          Standard Operating Procedures &mdash; synced from Google Docs
        </p>
      </div>

      {/* Search + filters */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search policies, SOPs, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`font-display text-[10px] tracking-widest uppercase px-4 py-2 rounded border transition-all ${
                  categoryFilter === cat
                    ? "border-[var(--badge)] bg-[var(--badge)]/10 text-badge"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--badge)]/50 hover:text-[var(--text-secondary)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {search && (
          <p className="mt-3 text-xs text-[var(--text-muted)] font-display tracking-wider">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
          </p>
        )}
      </div>

      {/* Grouped policy list */}
      <div className="max-w-6xl mx-auto space-y-8">
        {Object.entries(grouped).length === 0 ? (
          <div className="panel py-20 text-center text-[var(--text-muted)] font-display text-sm tracking-wider">
            No policies match your search.
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-4">
                <Tag className="w-4 h-4 text-badge" />
                <h2 className="font-display text-sm font-semibold tracking-widest text-badge uppercase">{category}</h2>
                <div className="flex-1 h-[1px] bg-[var(--border)]" />
                <span className="text-[10px] font-display text-[var(--text-muted)] tracking-wider">{items.length} doc{items.length !== 1 ? "s" : ""}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {items.map((policy) => (
                  <button
                    key={policy.id}
                    onClick={() => setSelected(policy)}
                    className="panel p-5 text-left group hover:border-[var(--badge)]/50 hover:bg-[var(--badge)]/5 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {policy.policy_number && (
                            <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider">
                              {policy.policy_number}
                            </span>
                          )}
                          <span className={`text-[9px] font-display tracking-widest uppercase px-1.5 py-0.5 rounded border ${getCategoryColor(category)}`}>
                            {category}
                          </span>
                        </div>
                        <h3 className="font-display text-sm font-semibold text-[var(--text-primary)] group-hover:text-badge transition-colors tracking-wide">
                          {policy.title}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">
                          {policy.content.replace(/#+\s/g, "").replace(/\*\*/g, "").slice(0, 120)}…
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-badge transition-colors flex-shrink-0 mt-1" />
                    </div>
                    <div className="mt-3 text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(policy.last_updated).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
