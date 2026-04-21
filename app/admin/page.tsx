"use client";
import { useState, useRef } from "react";
import { Shield, Upload, CheckCircle, XCircle, AlertTriangle, Eye, EyeOff, Loader } from "lucide-react";

type RosterRow = {
  badge_number: string | null;
  name: string;
  callsign: string | null;
  rank: string;
  division: string | null;
  status: string;
  joined_date: string | null;
  avatar_url: null;
};

type Step = "login" | "upload" | "map" | "preview" | "done";

const REQUIRED_FIELDS = ["name", "rank"] as const;
const ALL_FIELDS = [
  { key: "name",         label: "Name",            required: true  },
  { key: "rank",         label: "Rank",             required: true  },
  { key: "badge_number", label: "Badge / ID",       required: false },
  { key: "callsign",     label: "Callsign",         required: false },
  { key: "division",     label: "Division / Assignment", required: false },
  { key: "status",       label: "Status",           required: false },
  { key: "joined_date",  label: "Date Joined",      required: false },
];

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols: string[] = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === "," && !inQuote) { cols.push(cur.trim()); cur = ""; }
      else { cur += ch; }
    }
    cols.push(cur.trim());
    rows.push(cols);
  }
  return rows;
}

function findHeaderRow(rows: string[][]): number {
  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const lower = rows[i].map(c => c.toLowerCase());
    if (lower.some(c => c.includes("name")) && lower.some(c => c.includes("rank"))) {
      return i;
    }
  }
  return 0;
}

function guessMapping(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  headers.forEach((h, i) => {
    const l = h.toLowerCase();
    if (l.includes("name"))                                         map.name         = i;
    if (l.includes("rank"))                                         map.rank         = i;
    if (l.includes("callsign") || l.includes("call sign"))         map.callsign     = i;
    if (l.includes("badge") || l.includes("id") || l === "website id") map.badge_number = i;
    if (l.includes("division") || l.includes("assignment") || l.includes("bureau")) map.division = i;
    if (l.includes("status") || l.includes("activity status"))     map.status       = i;
    if (l.includes("date") || l.includes("joined") || l.includes("membership")) map.joined_date = i;
  });
  return map;
}

function normalizeStatus(raw: string): string {
  const v = raw.toLowerCase().trim();
  if (v === "active")                          return "Active";
  if (v === "loa" || v.includes("leave"))      return "LOA";
  if (v === "inactive" || v === "terminated")  return "Inactive";
  return "Active";
}

export default function AdminPage() {
  const [step, setStep]             = useState<Step>("login");
  const [password, setPassword]     = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [loginError, setLoginError] = useState("");
  const [csvRows, setCsvRows]       = useState<string[][]>([]);
  const [headerIdx, setHeaderIdx]   = useState(0);
  const [mapping, setMapping]       = useState<Record<string, number>>({});
  const [preview, setPreview]       = useState<RosterRow[]>([]);
  const [importing, setImporting]   = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── LOGIN ──
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password.length >= 8) {
      // We verify the real secret server-side on import; this just gates the UI
      fetch("/api/admin-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: password }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.ok) { setStep("upload"); setLoginError(""); }
          else setLoginError("Incorrect password.");
        })
        .catch(() => setLoginError("Could not connect. Try again."));
    } else {
      setLoginError("Password too short.");
    }
  }

  // ── FILE UPLOAD ──
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = parseCSV(text);
      if (rows.length < 2) return;
      const hIdx = findHeaderRow(rows);
      const headers = rows[hIdx];
      const guessed = guessMapping(headers);
      setCsvRows(rows);
      setHeaderIdx(hIdx);
      setMapping(guessed);
      setStep("map");
    };
    reader.readAsText(file);
  }

  // ── BUILD PREVIEW ──
  function buildPreview() {
    const headers = csvRows[headerIdx];
    const dataRows = csvRows.slice(headerIdx + 1).filter(r => r.some(c => c.trim() !== ""));
    const rows: RosterRow[] = dataRows
      .map(r => {
        const get = (key: string) => mapping[key] !== undefined ? (r[mapping[key]] ?? "") : "";
        const name = get("name").trim();
        if (!name) return null;
        const joined = get("joined_date").trim();
        let joinedDate: string | null = null;
        if (joined) {
          const d = new Date(joined);
          if (!isNaN(d.getTime())) joinedDate = d.toISOString().split("T")[0];
        }
        return {
          name,
          rank:         get("rank").trim() || "Deputy",
          badge_number: get("badge_number").trim() || null,
          callsign:     get("callsign").trim() || null,
          division:     get("division").trim() || null,
          status:       normalizeStatus(get("status")),
          joined_date:  joinedDate,
          avatar_url:   null,
        } as RosterRow;
      })
      .filter(Boolean) as RosterRow[];
    setPreview(rows);
    setStep("preview");
    void headers;
  }

  // ── IMPORT ──
  async function handleImport() {
    setImporting(true);
    try {
      const res = await fetch("/api/sync-roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: password, roster: preview }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setImportResult({ success: true, message: `Successfully imported ${data.count} roster members.` });
      } else {
        setImportResult({ success: false, message: data.error ?? "Import failed." });
      }
      setStep("done");
    } catch {
      setImportResult({ success: false, message: "Network error. Check your connection." });
      setStep("done");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <span className="font-display text-[10px] tracking-[0.5em] text-badge uppercase block mb-2">Admin Portal</span>
          <h1 className="font-display text-3xl font-bold text-primary-color tracking-tight flex items-center gap-3">
            <Shield className="w-7 h-7 text-badge" strokeWidth={1.5} />
            ROSTER IMPORT
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 text-sm">
            Export your Google Sheet as CSV and upload it here to sync the roster.
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {["Login", "Upload CSV", "Map Columns", "Preview", "Done"].map((label, i) => {
            const stepKeys: Step[] = ["login", "upload", "map", "preview", "done"];
            const active = stepKeys[i] === step;
            const past = stepKeys.indexOf(step) > i;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-display font-bold transition-all ${
                  past ? "bg-badge text-[var(--bg-primary)]" :
                  active ? "border-2 border-badge text-badge" :
                  "border border-[var(--border)] text-[var(--text-muted)]"
                }`}>
                  {past ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] font-display tracking-wider uppercase hidden sm:block ${active ? "text-badge" : "text-[var(--text-muted)]"}`}>
                  {label}
                </span>
                {i < 4 && <div className="w-4 h-[1px] bg-[var(--border)]" />}
              </div>
            );
          })}
        </div>

        {/* ── STEP: LOGIN ── */}
        {step === "login" && (
          <div className="panel p-8 max-w-sm">
            <h2 className="font-display text-sm font-semibold text-primary-color tracking-wide mb-6 uppercase">Enter Admin Password</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Sync secret / admin password"
                  className="search-input w-full px-4 py-3 rounded-lg pr-10 text-sm"
                  autoFocus
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginError && (
                <p className="text-red-400 text-xs flex items-center gap-1"><XCircle className="w-3 h-3" />{loginError}</p>
              )}
              <button type="submit"
                className="w-full font-display text-xs tracking-widest uppercase py-3 rounded bg-badge text-[var(--bg-primary)] font-bold hover:opacity-90 transition-opacity">
                Enter
              </button>
            </form>
          </div>
        )}

        {/* ── STEP: UPLOAD ── */}
        {step === "upload" && (
          <div className="panel p-8">
            <h2 className="font-display text-sm font-semibold text-primary-color tracking-wide mb-2 uppercase">Upload CSV</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-6">
              In Google Sheets: <strong className="text-primary-color">File → Download → Comma Separated Values (.csv)</strong>
            </p>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-[var(--badge)]/40 rounded-lg p-12 text-center cursor-pointer hover:border-[var(--badge)] hover:bg-[var(--badge)]/5 transition-all"
            >
              <Upload className="w-10 h-10 text-badge mx-auto mb-3" strokeWidth={1.5} />
              <p className="font-display text-sm text-[var(--text-secondary)] tracking-wide">Click to select your CSV file</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Public Roster export from Google Sheets</p>
            </div>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
          </div>
        )}

        {/* ── STEP: MAP ── */}
        {step === "map" && (
          <div className="panel p-8">
            <h2 className="font-display text-sm font-semibold text-primary-color tracking-wide mb-2 uppercase">Map Columns</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-1">
              Header row detected at row <strong className="text-badge">{headerIdx + 1}</strong>.
              Match each field to the right CSV column.
            </p>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs text-[var(--text-muted)]">Header row:</span>
              <input type="number" min={1} max={20} value={headerIdx + 1}
                onChange={e => setHeaderIdx(Number(e.target.value) - 1)}
                className="search-input w-16 px-2 py-1 rounded text-xs text-center" />
            </div>

            <div className="space-y-3 mb-8">
              {ALL_FIELDS.map(field => (
                <div key={field.key} className="flex items-center gap-4">
                  <div className="w-40 flex-shrink-0">
                    <span className="font-display text-xs tracking-wider text-[var(--text-secondary)] uppercase">
                      {field.label}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                    </span>
                  </div>
                  <select
                    value={mapping[field.key] ?? ""}
                    onChange={e => setMapping(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                    className="search-input flex-1 px-3 py-2 rounded text-sm"
                  >
                    <option value="">— skip —</option>
                    {csvRows[headerIdx]?.map((col, i) => (
                      <option key={i} value={i}>Col {i + 1}: {col || `(empty)`}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("upload")}
                className="font-display text-xs tracking-widest uppercase px-6 py-3 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--badge)] transition-colors">
                Back
              </button>
              <button
                onClick={buildPreview}
                disabled={!mapping.name && !mapping.rank}
                className="font-display text-xs tracking-widest uppercase px-6 py-3 rounded bg-badge text-[var(--bg-primary)] font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Preview Import
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: PREVIEW ── */}
        {step === "preview" && (
          <div>
            <div className="panel p-5 mb-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-badge flex-shrink-0" />
              <p className="text-sm text-[var(--text-secondary)]">
                This will <strong className="text-primary-color">replace all current roster data</strong> with the {preview.length} rows below.
              </p>
            </div>

            <div className="panel overflow-hidden mb-5">
              <div className="grid grid-cols-[1fr_1fr_1fr_1fr_80px] gap-3 px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-panel-alt)]">
                {["Name", "Rank", "Callsign", "Division", "Status"].map(h => (
                  <span key={h} className="font-display text-[10px] tracking-widest text-[var(--text-muted)] uppercase">{h}</span>
                ))}
              </div>
              <div className="divide-y divide-[var(--border)] max-h-96 overflow-y-auto">
                {preview.map((m, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_80px] gap-3 px-4 py-2.5 text-sm">
                    <span className="text-[var(--text-primary)] font-medium truncate">{m.name}</span>
                    <span className="text-badge font-display text-xs tracking-wide truncate">{m.rank}</span>
                    <span className="text-[var(--text-muted)] text-xs">{m.callsign ?? "—"}</span>
                    <span className="text-[var(--text-muted)] text-xs truncate">{m.division ?? "—"}</span>
                    <span className={`text-[10px] font-display tracking-wider px-1.5 py-0.5 rounded text-center ${
                      m.status === "Active" ? "status-active" : m.status === "LOA" ? "status-loa" : "status-inactive"
                    }`}>{m.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("map")}
                className="font-display text-xs tracking-widest uppercase px-6 py-3 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--badge)] transition-colors">
                Back
              </button>
              <button onClick={handleImport} disabled={importing}
                className="font-display text-xs tracking-widest uppercase px-8 py-3 rounded bg-badge text-[var(--bg-primary)] font-bold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2">
                {importing && <Loader className="w-4 h-4 animate-spin" />}
                {importing ? "Importing..." : `Import ${preview.length} Members`}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: DONE ── */}
        {step === "done" && importResult && (
          <div className={`panel p-8 text-center ${importResult.success ? "border-emerald-500/30" : "border-red-500/30"}`}>
            {importResult.success
              ? <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              : <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            }
            <h2 className={`font-display text-lg font-bold tracking-wide mb-2 ${importResult.success ? "text-emerald-400" : "text-red-400"}`}>
              {importResult.success ? "Import Successful" : "Import Failed"}
            </h2>
            <p className="text-[var(--text-secondary)] text-sm mb-6">{importResult.message}</p>
            <div className="flex gap-3 justify-center">
              {importResult.success && (
                <a href="/roster"
                  className="font-display text-xs tracking-widest uppercase px-6 py-3 rounded bg-badge text-[var(--bg-primary)] font-bold hover:opacity-90 transition-opacity">
                  View Roster
                </a>
              )}
              <button onClick={() => { setStep("upload"); setImportResult(null); }}
                className="font-display text-xs tracking-widest uppercase px-6 py-3 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--badge)] transition-colors">
                Import Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
