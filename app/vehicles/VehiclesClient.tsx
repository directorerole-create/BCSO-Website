"use client";
import { useState } from "react";
import { ExternalLink, Car } from "lucide-react";
import type { RankVehicles, ColorEntry, VehicleData, ColorData } from "./page";

// ── Rank table ────────────────────────────────────────────────────────────────

function VehicleTile({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center font-display text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 whitespace-nowrap">
      {name}
    </span>
  );
}

function RankTable({ data, sheetId, gid }: { data: VehicleData; sheetId: string; gid: string }) {
  if (data.source === "fallback" || data.ranks.length === 0) {
    return (
      <div className="panel flex flex-col items-center justify-center py-16 gap-4 border border-[var(--badge)]/10">
        <Car className="w-8 h-8 text-badge/20" strokeWidth={1} />
        <p className="text-[var(--text-muted)] text-sm font-display tracking-wide">
          Could not load vehicle data
        </p>
        <a
          href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit?gid=${gid}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-display tracking-widest uppercase text-[10px] text-badge/60 hover:text-badge transition-colors"
        >
          <ExternalLink className="w-3 h-3" /> View in spreadsheet
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="panel overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[180px_1fr] gap-4 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-panel-alt)]">
          <span className="font-display text-[9px] tracking-widest text-[var(--text-muted)] uppercase">Rank</span>
          <span className="font-display text-[9px] tracking-widest text-[var(--text-muted)] uppercase">Authorized Vehicles</span>
        </div>

        {data.ranks.map((r, i) => (
          <div key={i} className="grid grid-cols-[180px_1fr] gap-4 px-4 py-3 border-b border-[var(--border)]/40 last:border-0 hover:bg-[var(--badge)]/3 transition-colors items-start">
            <span className="font-display text-sm font-semibold text-[var(--text-primary)] leading-snug pt-0.5">
              {r.rank}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {r.vehicles.map(v => <VehicleTile key={v} name={v} />)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <a
          href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit?gid=${gid}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-display tracking-widest uppercase text-[10px] text-badge/50 hover:text-badge transition-colors"
        >
          <ExternalLink className="w-3 h-3" /> View full vehicle structure
        </a>
      </div>
    </div>
  );
}

// ── Colors tab ────────────────────────────────────────────────────────────────

function ColorsView({ data, sheetId, gid }: { data: ColorData; sheetId: string; gid: string }) {
  const approved = data.colors.filter(c => c.approved);
  const denied   = data.colors.filter(c => !c.approved);

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="panel border border-[var(--badge)]/10 px-5 py-4">
        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
          Approved colors for unmarked and ghosted patrol vehicles. Only classic and metallic paint options
          are permitted. Custom colors, neons, pearlescent, and chrome finishes are not allowed.
        </p>
      </div>

      {approved.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] flex-1 bg-emerald-500/20" />
            <span className="font-display text-[9px] tracking-[0.4em] text-emerald-400 uppercase">
              Approved — {approved.length}
            </span>
            <div className="h-[1px] flex-1 bg-emerald-500/20" />
          </div>
          <div className="flex flex-wrap gap-2">
            {approved.map(c => (
              <span key={c.name}
                className="font-display text-[10px] tracking-wide px-3 py-1.5 rounded border border-emerald-500/25 bg-emerald-500/10 text-emerald-400">
                {c.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {denied.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] flex-1 bg-red-500/15" />
            <span className="font-display text-[9px] tracking-[0.4em] text-red-400/70 uppercase">
              Not Approved — {denied.length}
            </span>
            <div className="h-[1px] flex-1 bg-red-500/15" />
          </div>
          <div className="flex flex-wrap gap-2">
            {denied.map(c => (
              <span key={c.name}
                className="font-display text-[10px] tracking-wide px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--bg-panel-alt)] text-[var(--text-muted)] line-through">
                {c.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <a
          href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit?gid=${gid}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-display tracking-widest uppercase text-[10px] text-badge/50 hover:text-badge transition-colors"
        >
          <ExternalLink className="w-3 h-3" /> View source spreadsheet
        </a>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

type Props = {
  bcso: VehicleData;
  lscso: VehicleData;
  colorData: ColorData;
  sheetId: string;
  gids: { bcso: string; lscso: string; colors: string };
};

const MAIN_TABS = [
  { key: "bcso",   label: "BCSO" },
  { key: "lscso",  label: "LSCSO" },
  { key: "colors", label: "Unmarked Colors" },
];

export function VehiclesClient({ bcso, lscso, colorData, sheetId, gids }: Props) {
  const [tab, setTab] = useState("bcso");

  const isLive = tab === "colors" ? colorData.source === "live" : (tab === "bcso" ? bcso : lscso).source === "live";

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <span className="font-display text-[10px] tracking-[0.5em] text-badge uppercase block mb-1">
          Department Portal
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-color tracking-tight flex items-center gap-3">
          <Car className="w-6 h-6 sm:w-7 sm:h-7 text-badge flex-shrink-0" strokeWidth={1.5} />
          VEHICLE STRUCTURE
          {isLive ? (
            <span className="text-[9px] font-display tracking-[0.3em] uppercase text-emerald-400 font-semibold flex items-center gap-1 mt-1 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Live
            </span>
          ) : (
            <span className="text-[9px] font-display tracking-[0.3em] uppercase text-[var(--text-muted)] font-semibold flex items-center gap-1 mt-1 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] inline-block" />Offline
            </span>
          )}
        </h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Authorized vehicles by rank &amp; approved unmarked colors
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 p-1 rounded-lg bg-[var(--bg-panel)] border border-[var(--border)]/50 w-fit">
        {MAIN_TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`font-display text-xs tracking-[0.3em] uppercase px-5 py-2 rounded transition-all ${
              tab === t.key
                ? "bg-badge text-black font-bold"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "bcso"   && <RankTable data={bcso}   sheetId={sheetId} gid={gids.bcso} />}
      {tab === "lscso"  && <RankTable data={lscso}  sheetId={sheetId} gid={gids.lscso} />}
      {tab === "colors" && <ColorsView data={colorData} sheetId={sheetId} gid={gids.colors} />}
    </div>
  );
}
