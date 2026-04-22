"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Shield, Upload, CheckCircle, XCircle, AlertTriangle, Eye, EyeOff,
  Loader, Users, UserPlus, Trash2, LogOut, ChevronDown, Lock, User,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type AdminUser = { id: string; username: string; display_name: string; role: string; created_at: string };
type Session   = { username: string; displayName: string; role: string; token: string };
type RosterRow = Record<string, string | null>;
type Tab       = "roster" | "admins";

// ─── CSV Import helpers (unchanged) ──────────────────────────────────────────

const ALL_FIELDS = [
  { key: "badge_number",         label: "Website ID / Badge",   required: false },
  { key: "name",                 label: "Name",                  required: true  },
  { key: "callsign",             label: "Callsign",              required: false },
  { key: "rank",                 label: "Rank",                  required: true  },
  { key: "division",             label: "Assignment / Division", required: false },
  { key: "joined_date",          label: "Date of Membership",    required: false },
  { key: "phone_number",         label: "Phone Number",          required: false },
  { key: "status",               label: "Activity Status",       required: false },
  { key: "april_total_activity", label: "April Total Activity",  required: false },
  { key: "april_patrol_hours",   label: "April Patrol Hours",    required: false },
  { key: "april_admin_hours",    label: "April Admin Hours",     required: false },
  { key: "april_patrol_logs",    label: "April Patrol Logs",     required: false },
  { key: "march_total_activity", label: "March Total Activity",  required: false },
  { key: "march_patrol_hours",   label: "March Patrol Hours",    required: false },
  { key: "march_admin_hours",    label: "March Admin Hours",     required: false },
  { key: "march_patrol_logs",    label: "March Patrol Logs",     required: false },
  { key: "patrol_last_seen",     label: "Patrol Last Seen",      required: false },
  { key: "admin_last_seen",      label: "Admin Last Seen",       required: false },
];

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cols: string[] = [];
    let cur = "", inQuote = false;
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === "," && !inQuote) { cols.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    cols.push(cur.trim());
    rows.push(cols);
  }
  return rows;
}

function findHeaderRow(rows: string[][]): number {
  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const lower = rows[i].map(c => c.toLowerCase());
    if (lower.some(c => c.includes("name")) && lower.some(c => c.includes("rank"))) return i;
  }
  return 0;
}

function guessMapping(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  headers.forEach((h, i) => {
    const l = h.toLowerCase().trim();
    if (l === "name")                                                                map.name                 = i;
    if (l === "rank")                                                                map.rank                 = i;
    if (l.includes("callsign"))                                                      map.callsign             = i;
    if (l === "website id" || l.includes("badge"))                                   map.badge_number         = i;
    if (l === "assignment" || l.includes("division"))                                map.division             = i;
    if (l.includes("membership") || l.includes("joined"))                            map.joined_date          = i;
    if (l.includes("phone"))                                                         map.phone_number         = i;
    if (l === "activity status")                                                     map.status               = i;
    if (l === "april total activity")                                                map.april_total_activity = i;
    if (l === "april patrol hour's" || l === "april patrol hours")                   map.april_patrol_hours   = i;
    if (l === "april admin hour's"  || l === "april admin hours")                    map.april_admin_hours    = i;
    if (l === "april patrol logs")                                                   map.april_patrol_logs    = i;
    if (l === "march total activity")                                                map.march_total_activity = i;
    if (l === "march patrol hour's" || l === "march patrol hours")                   map.march_patrol_hours   = i;
    if (l === "march admin hour's"  || l === "march admin hours")                    map.march_admin_hours    = i;
    if (l === "march patrol logs")                                                   map.march_patrol_logs    = i;
    if (l === "patrol last seen")                                                    map.patrol_last_seen     = i;
    if (l === "admin last seen")                                                     map.admin_last_seen      = i;
  });
  return map;
}

function normalizeStatus(raw: string): string {
  const v = raw.toLowerCase().trim();
  if (v === "active") return "Active";
  if (v === "loa" || v.includes("leave")) return "LOA";
  return "Inactive";
}

function normalizeDate(raw: string): string | null {
  if (!raw?.trim()) return null;
  const num = Number(raw);
  if (!isNaN(num) && num > 40000 && num < 60000) {
    return new Date((num - 25569) * 86400 * 1000).toISOString().split("T")[0];
  }
  const d = new Date(raw);
  return isNaN(d.getTime()) ? raw : d.toISOString().split("T")[0];
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (s: Session) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.ok) {
        const session: Session = { ...data.user, token: data.token };
        localStorage.setItem("bcso_admin", JSON.stringify(session));
        onLogin(session);
      } else {
        setError(data.error ?? "Login failed.");
      }
    } catch {
      setError("Could not connect. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ filter: ["drop-shadow(0 0 8px rgba(201,162,39,0.4))", "drop-shadow(0 0 18px rgba(201,162,39,0.7))", "drop-shadow(0 0 8px rgba(201,162,39,0.4))"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex justify-center mb-4"
          >
            <Image src="/BCSOBadge.png" alt="BCSO" width={64} height={64} />
          </motion.div>
          <span className="font-display text-[9px] tracking-[0.45em] text-badge uppercase block mb-1">Blaine County Sheriff's Office</span>
          <h1 className="font-display text-2xl font-black text-primary-color tracking-tight">Admin Portal</h1>
          <p className="text-[var(--text-muted)] text-xs mt-1">Restricted access — authorized personnel only</p>
        </div>

        {/* Card */}
        <div className="panel p-8">
          <div className="flex items-center gap-2 mb-6 pb-5 border-b border-[var(--border)]">
            <Lock className="w-4 h-4 text-badge" strokeWidth={1.5} />
            <span className="font-display text-xs tracking-widest uppercase text-[var(--text-secondary)]">Secure Login</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-display text-[9px] tracking-[0.35em] uppercase text-[var(--text-muted)] block mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
                <input
                  type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="your.username" autoComplete="username" autoFocus
                  className="search-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="font-display text-[9px] tracking-[0.35em] uppercase text-[var(--text-muted)] block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
                <input
                  type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="search-input w-full pl-10 pr-10 py-2.5 rounded-lg text-sm"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-badge transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-400 text-xs panel px-3 py-2 border-red-500/30"
                >
                  <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit" disabled={loading || !username || !password}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full font-display text-xs tracking-[0.3em] uppercase py-3 rounded bg-badge text-[var(--bg-primary)] font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <motion.span className="block w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />}
              {loading ? "Verifying..." : "Sign In"}
            </motion.button>
          </form>
        </div>

        <p className="text-center font-display text-[8px] tracking-widest text-[var(--text-muted)] uppercase mt-5 opacity-40">
          All access attempts are logged
        </p>
      </motion.div>
    </div>
  );
}

// ─── Admin Profiles Tab ───────────────────────────────────────────────────────

function AdminProfilesTab({ session }: { session: Session }) {
  const [admins, setAdmins]         = useState<AdminUser[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [deleting, setDeleting]     = useState(false);
  const [createErr, setCreateErr]   = useState("");
  const [creating, setCreating]     = useState(false);
  const [form, setForm] = useState({ username: "", displayName: "", role: "admin", password: "", confirm: "" });

  const headers = { "Authorization": `Bearer ${session.token}`, "Content-Type": "application/json" };

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin-users", { headers: { "Authorization": `Bearer ${session.token}` } });
    const data = await res.json();
    setAdmins(data.users ?? []);
    setLoading(false);
  }, [session.token]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { setCreateErr("Passwords do not match."); return; }
    if (form.password.length < 6) { setCreateErr("Password must be at least 6 characters."); return; }
    setCreating(true); setCreateErr("");
    const res = await fetch("/api/admin-users", {
      method: "POST", headers,
      body: JSON.stringify({ username: form.username, displayName: form.displayName, role: form.role, password: form.password }),
    });
    const data = await res.json();
    if (data.error) { setCreateErr(data.error); setCreating(false); return; }
    setForm({ username: "", displayName: "", role: "admin", password: "", confirm: "" });
    setShowCreate(false);
    load();
    setCreating(false);
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    await fetch("/api/admin-users", { method: "DELETE", headers, body: JSON.stringify({ id }) });
    setDeleteId(null);
    load();
    setDeleting(false);
  }

  const roleColor: Record<string, string> = {
    superadmin: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    admin:      "text-blue-400 border-blue-400/30 bg-blue-400/10",
    moderator:  "text-purple-400 border-purple-400/30 bg-purple-400/10",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-sm font-bold tracking-wide text-primary-color uppercase">Admin Profiles</h2>
          <p className="text-[var(--text-muted)] text-xs mt-0.5">Manage portal admin accounts</p>
        </div>
        {session.role === "superadmin" && (
          <motion.button
            onClick={() => setShowCreate(!showCreate)}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 font-display text-[10px] tracking-widest uppercase px-4 py-2 rounded border border-[var(--badge)]/50 text-badge hover:bg-[var(--badge)]/10 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Create Admin
          </motion.button>
        )}
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="panel p-6 mb-6 border-badge/20"
          >
            <h3 className="font-display text-xs tracking-widest uppercase text-badge mb-5">New Admin Account</h3>
            <form onSubmit={handleCreate}>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="font-display text-[9px] tracking-widest uppercase text-[var(--text-muted)] block mb-1">Display Name</label>
                  <input value={form.displayName} onChange={e => setForm(f => ({...f, displayName: e.target.value}))}
                    placeholder="John D." className="search-input w-full px-3 py-2 rounded text-sm" required />
                </div>
                <div>
                  <label className="font-display text-[9px] tracking-widest uppercase text-[var(--text-muted)] block mb-1">Username</label>
                  <input value={form.username} onChange={e => setForm(f => ({...f, username: e.target.value}))}
                    placeholder="john.d" className="search-input w-full px-3 py-2 rounded text-sm" required />
                </div>
                <div>
                  <label className="font-display text-[9px] tracking-widest uppercase text-[var(--text-muted)] block mb-1">Role</label>
                  <div className="relative">
                    <select value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))}
                      className="search-input w-full px-3 py-2 rounded text-sm appearance-none">
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="font-display text-[9px] tracking-widest uppercase text-[var(--text-muted)] block mb-1">Password</label>
                  <input type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
                    placeholder="Min. 6 characters" className="search-input w-full px-3 py-2 rounded text-sm" required />
                </div>
                <div className="sm:col-span-2 sm:w-1/2">
                  <label className="font-display text-[9px] tracking-widest uppercase text-[var(--text-muted)] block mb-1">Confirm Password</label>
                  <input type="password" value={form.confirm} onChange={e => setForm(f => ({...f, confirm: e.target.value}))}
                    placeholder="Re-enter password" className="search-input w-full px-3 py-2 rounded text-sm" required />
                </div>
              </div>
              {createErr && <p className="text-red-400 text-xs mb-3 flex items-center gap-1"><XCircle className="w-3 h-3" />{createErr}</p>}
              <div className="flex gap-3">
                <button type="submit" disabled={creating}
                  className="font-display text-[10px] tracking-widest uppercase px-5 py-2.5 rounded bg-badge text-[var(--bg-primary)] font-bold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2">
                  {creating && <Loader className="w-3 h-3 animate-spin" />}
                  {creating ? "Creating..." : "Create Account"}
                </button>
                <button type="button" onClick={() => setShowCreate(false)}
                  className="font-display text-[10px] tracking-widest uppercase px-5 py-2.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--badge)] transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin list */}
      <div className="panel overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_100px_120px_48px] gap-3 px-5 py-3 border-b border-[var(--border)] bg-[var(--bg-panel-alt)]">
          {["Display Name","Username","Role","Joined",""].map(h => (
            <span key={h} className="font-display text-[9px] tracking-widest text-[var(--text-muted)] uppercase">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center text-[var(--text-muted)]">
            <Loader className="w-5 h-5 animate-spin mr-2" /> Loading...
          </div>
        ) : admins.length === 0 ? (
          <div className="py-12 text-center text-[var(--text-muted)] font-display text-sm tracking-wider">
            No admin accounts found.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {admins.map(a => (
              <motion.div key={a.id} layout
                className="grid grid-cols-[1fr_1fr_100px_120px_48px] gap-3 px-5 py-3.5 items-center hover:bg-[var(--badge)]/5 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[var(--badge)]/20 border border-[var(--badge)]/30 flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-[9px] font-bold text-badge">{a.display_name[0]}</span>
                  </div>
                  <span className="font-medium text-sm text-[var(--text-primary)] truncate">{a.display_name}</span>
                  {a.username === session.username && (
                    <span className="font-display text-[8px] tracking-widest text-badge/60 uppercase">(you)</span>
                  )}
                </div>
                <span className="font-mono text-xs text-[var(--text-secondary)] truncate">{a.username}</span>
                <span className={`font-display text-[9px] tracking-widest uppercase px-2 py-0.5 rounded border text-center ${roleColor[a.role] ?? roleColor.admin}`}>
                  {a.role}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <div>
                  {session.role === "superadmin" && a.username !== session.username && (
                    deleteId === a.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDelete(a.id)} disabled={deleting}
                          className="font-display text-[8px] tracking-wider uppercase text-red-400 hover:text-red-300 transition-colors disabled:opacity-50">
                          {deleting ? <Loader className="w-3 h-3 animate-spin" /> : "Confirm"}
                        </button>
                        <button onClick={() => setDeleteId(null)} className="font-display text-[8px] tracking-wider uppercase text-[var(--text-muted)] hover:text-badge transition-colors ml-1">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteId(a.id)}
                        className="text-[var(--text-muted)] hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Roster Import Tab (existing flow) ───────────────────────────────────────

type ImportStep = "upload" | "map" | "preview" | "done";

function RosterImportTab({ session }: { session: Session }) {
  const [step, setStep]       = useState<ImportStep>("upload");
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [headerIdx, setHeaderIdx] = useState(0);
  const [mapping, setMapping]     = useState<Record<string, number>>({});
  const [preview, setPreview]     = useState<RosterRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult]       = useState<{ success: boolean; message: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target?.result as string);
      if (rows.length < 2) return;
      const hIdx = findHeaderRow(rows);
      setCsvRows(rows); setHeaderIdx(hIdx); setMapping(guessMapping(rows[hIdx])); setStep("map");
    };
    reader.readAsText(file);
  }

  function buildPreview() {
    const rows = csvRows.slice(headerIdx + 1)
      .filter(r => r.some(c => c.trim()))
      .map(r => {
        const get = (k: string) => mapping[k] !== undefined ? (r[mapping[k]] ?? "") : "";
        const name = get("name").trim();
        if (!name || name.toLowerCase() === "name") return null;
        return {
          name, rank: get("rank").trim() || "Deputy",
          badge_number: get("badge_number").trim() || null, callsign: get("callsign").trim() || null,
          division: get("division").trim() || null, status: normalizeStatus(get("status")),
          joined_date: normalizeDate(get("joined_date")), phone_number: get("phone_number").trim() || null,
          april_total_activity: get("april_total_activity").trim() || null,
          april_patrol_hours:   get("april_patrol_hours").trim()   || null,
          april_admin_hours:    get("april_admin_hours").trim()    || null,
          april_patrol_logs:    get("april_patrol_logs").trim()    || null,
          march_total_activity: get("march_total_activity").trim() || null,
          march_patrol_hours:   get("march_patrol_hours").trim()   || null,
          march_admin_hours:    get("march_admin_hours").trim()    || null,
          march_patrol_logs:    get("march_patrol_logs").trim()    || null,
          patrol_last_seen:     normalizeDate(get("patrol_last_seen")),
          admin_last_seen:      normalizeDate(get("admin_last_seen")), avatar_url: null,
        };
      }).filter(Boolean) as RosterRow[];
    setPreview(rows); setStep("preview");
  }

  async function handleImport() {
    setImporting(true);
    try {
      const res = await fetch("/api/sync-roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_SYNC_SECRET, roster: preview }),
      });
      const data = await res.json();
      setResult(res.ok && data.success
        ? { success: true, message: `Successfully imported ${data.count} roster members.` }
        : { success: false, message: data.error ?? "Import failed." }
      );
    } catch {
      setResult({ success: false, message: "Network error." });
    } finally {
      setImporting(false); setStep("done");
    }
  }

  const steps: ImportStep[] = ["upload", "map", "preview", "done"];
  const stepLabels = ["Upload CSV", "Map Columns", "Preview", "Done"];

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-sm font-bold tracking-wide text-primary-color uppercase">Roster Import</h2>
        <p className="text-[var(--text-muted)] text-xs mt-0.5">Export your Google Sheet as CSV and upload here</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {stepLabels.map((label, i) => {
          const active = steps[i] === step;
          const past   = steps.indexOf(step) > i;
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-display font-bold transition-all ${
                past ? "bg-badge text-[var(--bg-primary)]" : active ? "border-2 border-badge text-badge" : "border border-[var(--border)] text-[var(--text-muted)]"
              }`}>{past ? "✓" : i + 1}</div>
              <span className={`text-[10px] font-display tracking-wider uppercase hidden sm:block ${active ? "text-badge" : "text-[var(--text-muted)]"}`}>{label}</span>
              {i < 3 && <div className="w-4 h-[1px] bg-[var(--border)]" />}
            </div>
          );
        })}
      </div>

      {step === "upload" && (
        <div className="panel p-8">
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            In Google Sheets: <strong className="text-primary-color">File → Download → Comma Separated Values (.csv)</strong>
          </p>
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-[var(--badge)]/40 rounded-lg p-12 text-center cursor-pointer hover:border-[var(--badge)] hover:bg-[var(--badge)]/5 transition-all">
            <Upload className="w-10 h-10 text-badge mx-auto mb-3" strokeWidth={1.5} />
            <p className="font-display text-sm text-[var(--text-secondary)] tracking-wide">Click to select your CSV file</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Public Roster export from Google Sheets</p>
          </div>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        </div>
      )}

      {step === "map" && (
        <div className="panel p-8">
          <h3 className="font-display text-sm font-semibold text-primary-color tracking-wide mb-2 uppercase">Map Columns</h3>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs text-[var(--text-muted)]">Header row:</span>
            <input type="number" min={1} max={20} value={headerIdx + 1}
              onChange={e => { const idx = Number(e.target.value)-1; setHeaderIdx(idx); setMapping(guessMapping(csvRows[idx] ?? [])); }}
              className="search-input w-16 px-2 py-1 rounded text-xs text-center" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {ALL_FIELDS.map(f => (
              <div key={f.key} className="flex items-center gap-3">
                <span className="font-display text-[10px] tracking-wider text-[var(--text-secondary)] uppercase w-36 flex-shrink-0">
                  {f.label}{f.required && <span className="text-red-400 ml-1">*</span>}
                </span>
                <select value={mapping[f.key] ?? ""} onChange={e => setMapping(prev => ({...prev, [f.key]: Number(e.target.value)}))}
                  className="search-input flex-1 px-2 py-1.5 rounded text-xs">
                  <option value="">— skip —</option>
                  {csvRows[headerIdx]?.map((col, i) => <option key={i} value={i}>Col {i+1}: {col || "(empty)"}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep("upload")} className="font-display text-xs tracking-widest uppercase px-6 py-3 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--badge)] transition-colors">Back</button>
            <button onClick={buildPreview} className="font-display text-xs tracking-widest uppercase px-6 py-3 rounded bg-badge text-[var(--bg-primary)] font-bold hover:opacity-90 transition-opacity">Preview Import</button>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div>
          <div className="panel p-5 mb-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-badge flex-shrink-0" />
            <p className="text-sm text-[var(--text-secondary)]">This will <strong className="text-primary-color">replace all current roster data</strong> with the {preview.length} rows below.</p>
          </div>
          <div className="panel overflow-hidden mb-5">
            <div className="grid grid-cols-[1fr_1fr_1fr_80px] gap-3 px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-panel-alt)]">
              {["Name","Rank","Division","Status"].map(h => <span key={h} className="font-display text-[10px] tracking-widest text-[var(--text-muted)] uppercase">{h}</span>)}
            </div>
            <div className="divide-y divide-[var(--border)] max-h-96 overflow-y-auto">
              {preview.map((m, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_80px] gap-3 px-4 py-2.5 text-sm">
                  <span className="text-[var(--text-primary)] font-medium truncate">{String(m.name)}</span>
                  <span className="text-badge font-display text-xs tracking-wide truncate">{String(m.rank)}</span>
                  <span className="text-[var(--text-muted)] text-xs truncate">{String(m.division ?? "—")}</span>
                  <span className={`text-[10px] font-display tracking-wider px-1.5 py-0.5 rounded text-center ${m.status === "Active" ? "status-active" : m.status === "LOA" ? "status-loa" : "status-inactive"}`}>{String(m.status)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep("map")} className="font-display text-xs tracking-widest uppercase px-6 py-3 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--badge)] transition-colors">Back</button>
            <button onClick={handleImport} disabled={importing} className="font-display text-xs tracking-widest uppercase px-8 py-3 rounded bg-badge text-[var(--bg-primary)] font-bold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2">
              {importing && <Loader className="w-4 h-4 animate-spin" />}
              {importing ? "Importing..." : `Import ${preview.length} Members`}
            </button>
          </div>
        </div>
      )}

      {step === "done" && result && (
        <div className={`panel p-8 text-center ${result.success ? "border-emerald-500/30" : "border-red-500/30"}`}>
          {result.success ? <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" /> : <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />}
          <h2 className={`font-display text-lg font-bold tracking-wide mb-2 ${result.success ? "text-emerald-400" : "text-red-400"}`}>{result.success ? "Import Successful" : "Import Failed"}</h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6">{result.message}</p>
          <div className="flex gap-3 justify-center">
            {result.success && <a href="/roster" className="font-display text-xs tracking-widest uppercase px-6 py-3 rounded bg-badge text-[var(--bg-primary)] font-bold hover:opacity-90 transition-opacity">View Roster</a>}
            <button onClick={() => { setStep("upload"); setResult(null); }} className="font-display text-xs tracking-widest uppercase px-6 py-3 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--badge)] transition-colors">Import Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab]         = useState<Tab>("roster");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("bcso_admin");
      if (raw) setSession(JSON.parse(raw));
    } catch {}
  }, []);

  async function handleLogout() {
    if (session) {
      fetch("/api/admin-login", { method: "DELETE", headers: { "Authorization": `Bearer ${session.token}` } });
    }
    localStorage.removeItem("bcso_admin");
    setSession(null);
  }

  if (!mounted) return null;
  if (!session) return <LoginScreen onLogin={setSession} />;

  const TABS: { key: Tab; icon: typeof Shield; label: string }[] = [
    { key: "roster", icon: Upload, label: "Roster Import" },
    { key: "admins", icon: Users,  label: "Admin Profiles" },
  ];

  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <span className="font-display text-[10px] tracking-[0.5em] text-badge uppercase block mb-2">Admin Portal</span>
            <h1 className="font-display text-3xl font-bold text-primary-color tracking-tight flex items-center gap-3">
              <Shield className="w-7 h-7 text-badge" strokeWidth={1.5} />
              DASHBOARD
            </h1>
          </div>

          {/* Session info + logout */}
          <div className="flex items-center gap-3 panel px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-badge/20 border border-badge/40 flex items-center justify-center flex-shrink-0">
              <span className="font-display text-xs font-bold text-badge">{session.displayName[0]}</span>
            </div>
            <div>
              <p className="font-display text-xs font-bold text-[var(--text-primary)] tracking-wide">{session.displayName}</p>
              <p className={`font-display text-[8px] tracking-widest uppercase ${session.role === "superadmin" ? "text-yellow-400" : "text-blue-400"}`}>{session.role}</p>
            </div>
            <button onClick={handleLogout}
              className="ml-3 text-[var(--text-muted)] hover:text-red-400 transition-colors" aria-label="Sign out">
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 panel px-2 py-1.5 w-fit">
          {TABS.map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 font-display text-[10px] tracking-widest uppercase px-4 py-2 rounded transition-all ${
                tab === key ? "bg-badge text-[var(--bg-primary)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}>
              <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {tab === "roster" && <RosterImportTab session={session} />}
            {tab === "admins" && <AdminProfilesTab session={session} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
