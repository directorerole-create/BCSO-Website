"use client";
import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import type { AEData } from "./page";

// ── Types ────────────────────────────────────────────────────────────────────

type UItem = { category: string; value: string };
type UniformClass = {
  name: string;
  minRank: string;
  description?: string;
  image?: string; // path in /public
  items: UItem[];
};
type Department = { key: string; label: string; classes: UniformClass[] };

// ── Data ─────────────────────────────────────────────────────────────────────

const GROOMING: { title: string; body: string }[] = [
  {
    title: "Jewelry",
    body: "No jewelry, pins, necklaces, piercings, or bracelets of any kind shall be worn with the uniform. Exceptions: Watches, Rings, and Females may have one single earring per earlobe.",
  },
  {
    title: "Hair",
    body: "Hair shall be clean, neat and well groomed. Must not touch the top of the uniform shirt collar in a normal posture, must not interfere with any issued headgear, and must not be dyed or tinted in any exaggerated or unnatural color.",
  },
  {
    title: "Facial Hair",
    body: "Facial hair shall be clean, neat and well groomed. Must match the color of the individual's regular hair color and must not be longer than one-half inch in length.",
  },
  {
    title: "Shoes",
    body: "The use of light-up shoes, as well as any footwear not expressly permitted within the established guidelines, is strictly prohibited.",
  },
  {
    title: "Tattoos",
    body: "Tattoos shall not be located on the head, face, neck, or scalp, and not on the hands, fingers, or wrists below the wrist bone. Body art that is indecent, gang-related, or contrary to the purpose of law enforcement is prohibited regardless of visibility.",
  },
];

const BCSO_CLASSES: UniformClass[] = [
  {
    name: "Class A", minRank: "Probationary Deputy",
    items: [
      { category: "Masks",                 value: "AE"          },
      { category: "Upper Body",            value: "#12"         },
      { category: "Lower Body",            value: "#233"        },
      { category: "Bags & Parachutes",     value: "#144"        },
      { category: "Shoes",                 value: "#21 or #111" },
      { category: "Scarfs & Chains",       value: "AE"          },
      { category: "Shirt & Accessory",     value: "AE"          },
      { category: "Body Armor & Acc.",     value: "AE"          },
      { category: "Badges & Logos",        value: "AE"          },
      { category: "Shirt Overlays & Jackets", value: "#672"     },
      { category: "Hats",                  value: "N/A"         },
    ],
  },
  {
    name: "Class B", minRank: "Deputy",
    items: [
      { category: "Masks",                 value: "AE"   },
      { category: "Upper Body",            value: "#12"  },
      { category: "Lower Body",            value: "#233" },
      { category: "Bags & Parachutes",     value: "#144" },
      { category: "Shoes",                 value: "#111" },
      { category: "Scarfs & Chains",       value: "AE"   },
      { category: "Shirt & Accessory",     value: "AE"   },
      { category: "Body Armor & Acc.",     value: "AE"   },
      { category: "Badges & Logos",        value: "AE"   },
      { category: "Shirt Overlays & Jackets", value: "#675" },
      { category: "Hats",                  value: "AE"   },
    ],
  },
  {
    name: "Class C", minRank: "Deputy",
    items: [
      { category: "Masks",                 value: "AE"   },
      { category: "Upper Body",            value: "#11"  },
      { category: "Lower Body",            value: "#233" },
      { category: "Bags & Parachutes",     value: "#144" },
      { category: "Shoes",                 value: "#111" },
      { category: "Scarfs & Chains",       value: "AE"   },
      { category: "Shirt & Accessory",     value: "AE"   },
      { category: "Body Armor & Acc.",     value: "AE"   },
      { category: "Badges & Logos",        value: "AE"   },
      { category: "Shirt Overlays & Jackets", value: "#674" },
      { category: "Hats",                  value: "AE"   },
    ],
  },
  {
    name: "Rolled Sleeves", minRank: "Senior Deputy",
    items: [
      { category: "Masks",                 value: "AE"   },
      { category: "Upper Body",            value: "#11"  },
      { category: "Lower Body",            value: "#233" },
      { category: "Bags & Parachutes",     value: "AE"   },
      { category: "Shoes",                 value: "#111" },
      { category: "Scarfs & Chains",       value: "AE"   },
      { category: "Shirt & Accessory",     value: "AE"   },
      { category: "Body Armor & Acc.",     value: "AE"   },
      { category: "Badges & Logos",        value: "AE"   },
      { category: "Shirt Overlays & Jackets", value: "AE" },
      { category: "Hats",                  value: "AE"   },
    ],
  },
  {
    name: "Short Sleeve Polo", minRank: "Master Deputy",
    items: [
      { category: "Masks",                 value: "AE"          },
      { category: "Upper Body",            value: "#11"         },
      { category: "Lower Body",            value: "#232"        },
      { category: "Bags & Parachutes",     value: "AE"          },
      { category: "Shoes",                 value: "#61 or #111" },
      { category: "Scarfs & Chains",       value: "AE"          },
      { category: "Shirt & Accessory",     value: "AE"          },
      { category: "Body Armor & Acc.",     value: "AE"          },
      { category: "Badges & Logos",        value: "AE"          },
      { category: "Shirt Overlays & Jackets", value: "#676"     },
      { category: "Hats",                  value: "AE"          },
    ],
  },
  {
    name: "Short Sleeve Polo w/ Undershirt", minRank: "Master Deputy",
    items: [
      { category: "Masks",                 value: "AE"          },
      { category: "Upper Body",            value: "#12"         },
      { category: "Lower Body",            value: "#232"        },
      { category: "Bags & Parachutes",     value: "AE"          },
      { category: "Shoes",                 value: "#61 or #111" },
      { category: "Scarfs & Chains",       value: "AE"          },
      { category: "Shirt & Accessory",     value: "AE"          },
      { category: "Body Armor & Acc.",     value: "AE"          },
      { category: "Badges & Logos",        value: "AE"          },
      { category: "Shirt Overlays & Jackets", value: "#677"     },
      { category: "Hats",                  value: "AE"          },
    ],
  },
  {
    name: "Long Sleeve Polo", minRank: "Corporal",
    items: [
      { category: "Masks",                 value: "AE"          },
      { category: "Upper Body",            value: "#11"         },
      { category: "Lower Body",            value: "#232"        },
      { category: "Bags & Parachutes",     value: "AE"          },
      { category: "Shoes",                 value: "#61 or #111" },
      { category: "Scarfs & Chains",       value: "AE"          },
      { category: "Shirt & Accessory",     value: "AE"          },
      { category: "Body Armor & Acc.",     value: "AE"          },
      { category: "Badges & Logos",        value: "AE"          },
      { category: "Shirt Overlays & Jackets", value: "#678"     },
      { category: "Hats",                  value: "AE"          },
    ],
  },
  {
    name: "Casual Clothing", minRank: "Lieutenant",
    items: [
      { category: "Upper Body",            value: "#0"          },
      { category: "Lower Body",            value: "#232"        },
      { category: "Bags & Parachutes",     value: "AE"          },
      { category: "Shoes",                 value: "#61 or #111" },
      { category: "Scarfs & Chains",       value: "AE"          },
      { category: "Shirt & Accessory",     value: "AE"          },
      { category: "Body Armor & Acc.",     value: "AE"          },
      { category: "Badges & Logos",        value: "AE"          },
      { category: "Shirt Overlays & Jackets", value: "#683"     },
      { category: "Hats",                  value: "AE"          },
    ],
  },
  {
    name: "Plain Clothes", minRank: "Senior Deputy",
    description: "Plain clothes operations only — requires supervisor authorization.",
    items: [
      { category: "Upper Body",            value: "#12"  },
      { category: "Lower Body",            value: "#232" },
      { category: "Bags & Parachutes",     value: "AE"   },
      { category: "Shoes",                 value: "AE"   },
      { category: "Shirt & Accessory",     value: "#107" },
      { category: "Body Armor & Acc.",     value: "AE"   },
      { category: "Badges & Logos",        value: "AE"   },
      { category: "Shirt Overlays & Jackets", value: "#690" },
      { category: "Hats",                  value: "AE"   },
    ],
  },
  {
    name: "Command", minRank: "Captain",
    description: "All items are Authorized Equipment — full discretion for command-rank personnel.",
    items: [
      { category: "Masks",                 value: "AE" },
      { category: "Upper Body",            value: "AE" },
      { category: "Lower Body",            value: "AE" },
      { category: "Bags & Parachutes",     value: "AE" },
      { category: "Shoes",                 value: "AE" },
      { category: "Scarfs & Chains",       value: "AE" },
      { category: "Shirt & Accessory",     value: "AE" },
      { category: "Body Armor & Acc.",     value: "AE" },
      { category: "Badges & Logos",        value: "AE" },
      { category: "Shirt Overlays & Jackets", value: "AE" },
      { category: "Hats",                  value: "AE" },
    ],
  },
];

const LSCSO_CLASSES: UniformClass[] = [
  {
    name: "Class A", minRank: "Probationary Deputy",
    items: [
      { category: "Masks",                 value: "AE"          },
      { category: "Upper Body",            value: "#4"          },
      { category: "Lower Body",            value: "#233"        },
      { category: "Bags & Parachutes",     value: "#148"        },
      { category: "Shoes",                 value: "#21 or #111" },
      { category: "Scarfs & Chains",       value: "AE"          },
      { category: "Shirt & Accessory",     value: "AE"          },
      { category: "Body Armor & Acc.",     value: "AE"          },
      { category: "Badges & Logos",        value: "AE"          },
      { category: "Shirt Overlays & Jackets", value: "#680"     },
      { category: "Hats",                  value: "N/A"         },
    ],
  },
  {
    name: "Class B", minRank: "Deputy",
    items: [
      { category: "Masks",                 value: "AE"   },
      { category: "Upper Body",            value: "#12"  },
      { category: "Lower Body",            value: "#233" },
      { category: "Bags & Parachutes",     value: "#148" },
      { category: "Shoes",                 value: "#111" },
      { category: "Scarfs & Chains",       value: "AE"   },
      { category: "Shirt & Accessory",     value: "AE"   },
      { category: "Body Armor & Acc.",     value: "AE"   },
      { category: "Badges & Logos",        value: "AE"   },
      { category: "Shirt Overlays & Jackets", value: "#681" },
      { category: "Hats",                  value: "AE"   },
    ],
  },
  {
    name: "Class C", minRank: "Deputy",
    items: [
      { category: "Masks",                 value: "AE"   },
      { category: "Upper Body",            value: "#11"  },
      { category: "Lower Body",            value: "#233" },
      { category: "Bags & Parachutes",     value: "#148" },
      { category: "Shoes",                 value: "#111" },
      { category: "Scarfs & Chains",       value: "AE"   },
      { category: "Shirt & Accessory",     value: "AE"   },
      { category: "Body Armor & Acc.",     value: "AE"   },
      { category: "Badges & Logos",        value: "AE"   },
      { category: "Shirt Overlays & Jackets", value: "#682" },
      { category: "Hats",                  value: "AE"   },
    ],
  },
  {
    name: "Utility Class B", minRank: "Senior Deputy",
    items: [
      { category: "Masks",                 value: "AE"          },
      { category: "Upper Body",            value: "#11"         },
      { category: "Lower Body",            value: "#232"        },
      { category: "Bags & Parachutes",     value: "AE"          },
      { category: "Shoes",                 value: "#61 or #111" },
      { category: "Scarfs & Chains",       value: "AE"          },
      { category: "Shirt & Accessory",     value: "AE"          },
      { category: "Body Armor & Acc.",     value: "AE"          },
      { category: "Badges & Logos",        value: "AE"          },
      { category: "Shirt Overlays & Jackets", value: "AE"       },
      { category: "Hats",                  value: "AE"          },
    ],
  },
  {
    name: "Utility Class C", minRank: "Senior Deputy",
    items: [
      { category: "Masks",                 value: "AE"          },
      { category: "Upper Body",            value: "#11"         },
      { category: "Lower Body",            value: "#232"        },
      { category: "Bags & Parachutes",     value: "AE"          },
      { category: "Shoes",                 value: "#61 or #111" },
      { category: "Scarfs & Chains",       value: "AE"          },
      { category: "Shirt & Accessory",     value: "AE"          },
      { category: "Body Armor & Acc.",     value: "AE"          },
      { category: "Badges & Logos",        value: "AE"          },
      { category: "Shirt Overlays & Jackets", value: "#692"     },
      { category: "Hats",                  value: "AE"          },
    ],
  },
  {
    name: "Utility Rolled Sleeves", minRank: "Senior Deputy",
    items: [
      { category: "Masks",                 value: "AE"          },
      { category: "Upper Body",            value: "#11"         },
      { category: "Lower Body",            value: "#232"        },
      { category: "Bags & Parachutes",     value: "AE"          },
      { category: "Shoes",                 value: "#61 or #111" },
      { category: "Scarfs & Chains",       value: "AE"          },
      { category: "Shirt & Accessory",     value: "AE"          },
      { category: "Body Armor & Acc.",     value: "AE"          },
      { category: "Badges & Logos",        value: "AE"          },
      { category: "Shirt Overlays & Jackets", value: "#691"     },
      { category: "Hats",                  value: "AE"          },
    ],
  },
  {
    name: "Short Sleeve Polo", minRank: "Master Deputy",
    items: [
      { category: "Masks",                 value: "AE"          },
      { category: "Upper Body",            value: "#11"         },
      { category: "Lower Body",            value: "#232"        },
      { category: "Bags & Parachutes",     value: "AE"          },
      { category: "Shoes",                 value: "#61 or #111" },
      { category: "Scarfs & Chains",       value: "AE"          },
      { category: "Shirt & Accessory",     value: "AE"          },
      { category: "Body Armor & Acc.",     value: "AE"          },
      { category: "Badges & Logos",        value: "AE"          },
      { category: "Shirt Overlays & Jackets", value: "#679"     },
      { category: "Hats",                  value: "AE"          },
    ],
  },
  {
    name: "Long Sleeve Polo", minRank: "Corporal",
    items: [
      { category: "Masks",                 value: "AE"          },
      { category: "Upper Body",            value: "#11"         },
      { category: "Lower Body",            value: "#232"        },
      { category: "Bags & Parachutes",     value: "AE"          },
      { category: "Shoes",                 value: "#61 or #111" },
      { category: "Scarfs & Chains",       value: "AE"          },
      { category: "Shirt & Accessory",     value: "AE"          },
      { category: "Body Armor & Acc.",     value: "AE"          },
      { category: "Badges & Logos",        value: "AE"          },
      { category: "Shirt Overlays & Jackets", value: "AE"       },
      { category: "Hats",                  value: "AE"          },
    ],
  },
  {
    name: "Plain Clothes", minRank: "Senior Deputy",
    description: "Plain clothes operations only — requires supervisor authorization.",
    items: [
      { category: "Masks",                 value: "#0"   },
      { category: "Upper Body",            value: "#12"  },
      { category: "Lower Body",            value: "#233" },
      { category: "Bags & Parachutes",     value: "AE"   },
      { category: "Shoes",                 value: "AE"   },
      { category: "Shirt & Accessory",     value: "#15"  },
      { category: "Body Armor & Acc.",     value: "AE"   },
      { category: "Badges & Logos",        value: "AE"   },
      { category: "Shirt Overlays & Jackets", value: "#684" },
      { category: "Hats",                  value: "AE"   },
    ],
  },
  {
    name: "Command", minRank: "Captain",
    description: "Command-rank personnel may wear the following with full AE discretion.",
    items: [
      { category: "Upper Body",            value: "#12"  },
      { category: "Lower Body",            value: "#232" },
      { category: "Bags & Parachutes",     value: "AE"   },
      { category: "Shoes",                 value: "AE"   },
      { category: "Shirt & Accessory",     value: "#15"  },
      { category: "Body Armor & Acc.",     value: "#86"  },
      { category: "Badges & Logos",        value: "AE"   },
      { category: "Shirt Overlays & Jackets", value: "#686" },
      { category: "Hats",                  value: "AE"   },
    ],
  },
];

const DEPARTMENTS: Department[] = [
  { key: "bcso",  label: "BCSO",  classes: BCSO_CLASSES  },
  { key: "lscso", label: "LSCSO", classes: LSCSO_CLASSES },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function ValueBadge({ value }: { value: string }) {
  if (value === "AE") {
    return (
      <span className="inline-block font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
        AE
      </span>
    );
  }
  if (value === "N/A") {
    return (
      <span className="inline-block font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--text-muted)]/10 text-[var(--text-muted)] border border-[var(--border)]">
        N/A
      </span>
    );
  }
  return (
    <span className="inline-block font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-badge/15 text-badge border border-badge/25">
      {value}
    </span>
  );
}

function UniformCard({ u }: { u: UniformClass }) {
  return (
    <div className="panel flex flex-col overflow-hidden border border-[var(--badge)]/10 hover:border-[var(--badge)]/25 transition-colors">
      {/* Image area */}
      <div className="relative bg-[var(--bg-panel-alt)] flex items-center justify-center overflow-hidden"
        style={{ minHeight: 180 }}>
        {u.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-20 py-10">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[var(--badge)] flex items-center justify-center">
              <span className="font-display text-[8px] tracking-widest text-badge uppercase text-center leading-tight px-1">
                No Image
              </span>
            </div>
          </div>
        )}
        {/* Gold top bar */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-badge/60 to-transparent" />
      </div>

      {/* Header */}
      <div className="px-4 pt-3.5 pb-2 border-b border-[var(--border)]/50">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-bold text-[var(--text-primary)] tracking-wide leading-snug">
            {u.name}
          </h3>
          <span className="font-display text-[8px] tracking-[0.3em] uppercase text-badge bg-badge/10 border border-badge/20 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
            {u.minRank}+
          </span>
        </div>
        {u.description && (
          <p className="text-[10px] text-[var(--text-muted)] mt-1 leading-snug">{u.description}</p>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 px-4 py-3">
        <table className="w-full text-[11px]">
          <tbody>
            {u.items.map(({ category, value }) => (
              <tr key={category} className="border-b border-[var(--border)]/20 last:border-0">
                <td className="py-1 pr-3 text-[var(--text-muted)] font-display tracking-wide">{category}</td>
                <td className="py-1 text-right"><ValueBadge value={value} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GroomingSection() {
  const [open, setOpen] = useState(false);
  return (
    <div className="panel border border-[var(--badge)]/15 mb-8">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <span className="font-display text-[8px] tracking-[0.4em] text-badge/60 uppercase block mb-0.5">
            Required Reading
          </span>
          <span className="font-display text-sm font-bold text-[var(--text-primary)] tracking-wide">
            Before You Begin — Grooming & Appearance Standards
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-badge/60 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-[var(--border)]/50 px-5 py-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GROOMING.map(({ title, body }) => (
            <div key={title} className="bg-[var(--bg-panel-alt)] rounded-lg p-3.5 border border-[var(--border)]/30">
              <p className="font-display text-[9px] tracking-[0.35em] text-badge uppercase mb-1.5">{title}</p>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AE tab ────────────────────────────────────────────────────────────────────

function AETab({ data, sheetUrl }: { data: AEData; sheetUrl: string }) {
  if (data.source === "fallback" || data.categories.length === 0) {
    return (
      <div className="panel flex flex-col items-center justify-center py-16 gap-4">
        <p className="text-[var(--text-muted)] text-sm font-display tracking-wide">
          Could not load equipment data
        </p>
        <a href={sheetUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-display tracking-widest uppercase text-[10px] text-badge/60 hover:text-badge transition-colors">
          <ExternalLink className="w-3 h-3" /> View in spreadsheet
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {data.categories.map(cat => (
        <div key={cat.name}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] flex-1 bg-[var(--badge)]/20" />
            <span className="font-display text-[9px] tracking-[0.4em] text-badge uppercase whitespace-nowrap">
              {cat.name}
            </span>
            <div className="h-[1px] flex-1 bg-[var(--badge)]/20" />
          </div>
          <div className="flex flex-wrap gap-2">
            {cat.items.map(item => (
              <div key={item}
                className="panel px-4 py-2.5 border border-[var(--badge)]/10 hover:border-[var(--badge)]/30 transition-colors group cursor-default">
                <span className="font-mono text-lg font-black text-badge leading-none group-hover:scale-105 transition-transform inline-block">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-center">
        <a href={sheetUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-display tracking-widest uppercase text-[10px] text-badge/50 hover:text-badge transition-colors">
          <ExternalLink className="w-3 h-3" /> View source spreadsheet
        </a>
      </div>
    </div>
  );
}

// ── Sub-tab helper ────────────────────────────────────────────────────────────

function SubTabs({ options, active, onChange }: {
  options: { key: string; label: string }[];
  active: string;
  onChange: (k: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 mb-6 p-1 rounded-lg bg-[var(--bg-panel)] border border-[var(--border)]/50 w-fit">
      {options.map(o => (
        <button key={o.key} onClick={() => onChange(o.key)}
          className={`font-display text-xs tracking-[0.3em] uppercase px-5 py-2 rounded transition-all ${
            active === o.key
              ? "bg-badge text-black font-bold"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

const MAIN_TABS = [
  { key: "uniforms",  label: "Uniforms"            },
  { key: "equipment", label: "Auth. Equipment"      },
];

export function UniformsClient({ aeData, aeSheetUrl }: { aeData: AEData; aeSheetUrl: string }) {
  const [mainTab, setMainTab] = useState<string>("uniforms");
  const [deptKey, setDeptKey] = useState<string>("bcso");

  const activeDept = DEPARTMENTS.find(d => d.key === deptKey)!;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-5 border-b border-[var(--border)]">
        <span className="font-display text-[10px] tracking-[0.5em] text-badge uppercase block mb-2">
          Department Portal
        </span>
        <h1 className="font-display text-xl sm:text-3xl font-bold text-primary-color tracking-tight flex items-center gap-3">
          UNIFORM STRUCTURE
          {mainTab === "equipment" && (
            aeData.source === "live"
              ? <span className="text-[9px] font-display tracking-[0.3em] uppercase text-emerald-400 font-semibold flex items-center gap-1 mt-1 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Live
                </span>
              : <span className="text-[9px] font-display tracking-[0.3em] uppercase text-[var(--text-muted)] font-semibold flex items-center gap-1 mt-1 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] inline-block" />Offline
                </span>
          )}
        </h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Blaine County Sheriff&rsquo;s Office &mdash; Approved Uniform Classes &amp; Authorized Equipment
        </p>
      </div>

      <div className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">

        {/* Main tabs */}
        <div className="flex items-center gap-1 mb-6 p-1 rounded-lg bg-[var(--bg-panel)] border border-[var(--border)]/50 w-fit">
          {MAIN_TABS.map(t => (
            <button key={t.key} onClick={() => setMainTab(t.key)}
              className={`font-display text-xs tracking-[0.3em] uppercase px-5 py-2 rounded transition-all ${
                mainTab === t.key
                  ? "bg-badge text-black font-bold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Uniforms tab ─────────────────────────────────── */}
        {mainTab === "uniforms" && (
          <>
            <GroomingSection />
            <SubTabs
              options={DEPARTMENTS.map(d => ({ key: d.key, label: d.label }))}
              active={deptKey}
              onChange={setDeptKey}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {activeDept.classes.map(u => <UniformCard key={u.name} u={u} />)}
            </div>
            <div className="mt-8 flex justify-center">
              <a
                href={`https://docs.google.com/spreadsheets/d/1TpKSyDi3ZaYP-uTRT-vL5-PZdRoIyWUUzzfutcOnPd8/edit?gid=${deptKey === "bcso" ? "1071299524" : "1947673441"}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-display tracking-widest uppercase text-[10px] text-badge/50 hover:text-badge transition-colors"
              >
                <ExternalLink className="w-3 h-3" /> View source spreadsheet
              </a>
            </div>
          </>
        )}

        {/* ── Auth Equipment tab ───────────────────────────── */}
        {mainTab === "equipment" && (
          <AETab data={aeData} sheetUrl={aeSheetUrl} />
        )}

      </div>
    </div>
  );
}
