"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Shield, CheckCircle, XCircle, Eye, EyeOff,
  Loader, Users, UserPlus, Trash2, LogOut, ChevronDown, Lock, User, FileText, ChevronRight,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type AdminUser = { id: string; username: string; display_name: string; role: string; created_at: string };
type Session   = { username: string; displayName: string; role: string; token: string };
type Tab       = "admins" | "complaints";
type Complaint = {
  id: string; report_no: string; complainant_name: string; website_id: string;
  profile_link: string | null; officer_name: string; officer_website_id: string | null;
  subdivision: string | null; date_of_incident: string; time_of_incident: string;
  description: string; evidence_name: string | null; status: string; created_at: string;
};


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
    if (res.status === 401) {
      localStorage.removeItem("bcso_admin");
      window.location.reload();
      return;
    }
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

// ─── Complaints Tab ──────────────────────────────────────────────────────────

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  pending:       { label: "Pending Review",   color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
  investigating: { label: "Investigating",    color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
  resolved:      { label: "Resolved",         color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
  dismissed:     { label: "Dismissed",        color: "text-[var(--text-muted)] border-[var(--border)] bg-[var(--bg-panel-alt)]" },
};

function ComplaintsTab({ session }: { session: Session }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading]       = useState(true);
  const [expanded, setExpanded]     = useState<string | null>(null);
  const [updating, setUpdating]     = useState<string | null>(null);

  const headers = { "Authorization": `Bearer ${session.token}` };

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/complaints", { headers });
    if (res.status === 401) {
      localStorage.removeItem("bcso_admin");
      window.location.reload();
      return;
    }
    const data = await res.json();
    setComplaints(data.complaints ?? []);
    setLoading(false);
  }, [session.token]);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: string) {
    setUpdating(id);
    await fetch("/api/complaints", {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setComplaints(cs => cs.map(c => c.id === id ? { ...c, status } : c));
    setUpdating(null);
  }

  const counts = {
    pending:       complaints.filter(c => c.status === "pending").length,
    investigating: complaints.filter(c => c.status === "investigating").length,
    resolved:      complaints.filter(c => c.status === "resolved").length,
    dismissed:     complaints.filter(c => c.status === "dismissed").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-sm font-bold tracking-wide text-primary-color uppercase">Complaint Reports</h2>
          <p className="text-[var(--text-muted)] text-xs mt-0.5">Citizen-submitted complaints against department members</p>
        </div>
        <button onClick={load} className="font-display text-[10px] tracking-widest uppercase px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:border-badge hover:text-badge transition-colors">
          Refresh
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {(["pending","investigating","resolved","dismissed"] as const).map(s => (
          <div key={s} className="panel px-4 py-3 text-center">
            <div className={`font-display text-lg font-black ${STATUS_CFG[s].color.split(" ")[0]}`}>{counts[s]}</div>
            <div className="font-display text-[8px] tracking-widest text-[var(--text-muted)] uppercase mt-0.5">{STATUS_CFG[s].label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="panel py-14 flex items-center justify-center text-[var(--text-muted)]">
          <Loader className="w-5 h-5 animate-spin mr-2" /> Loading complaints...
        </div>
      ) : complaints.length === 0 ? (
        <div className="panel py-14 text-center text-[var(--text-muted)] font-display text-sm tracking-wider">
          No complaints have been filed yet.
        </div>
      ) : (
        <div className="space-y-2">
          {complaints.map(c => {
            const isOpen = expanded === c.id;
            const cfg = STATUS_CFG[c.status] ?? STATUS_CFG.pending;
            return (
              <div key={c.id} className="panel overflow-hidden">
                {/* Row header */}
                <button
                  onClick={() => setExpanded(isOpen ? null : c.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[var(--badge)]/5 transition-colors"
                >
                  <ChevronRight className={`w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-badge">{c.report_no}</span>
                      <span className={`font-display text-[8px] tracking-widest uppercase px-2 py-0.5 rounded border ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="text-[var(--text-secondary)] text-xs mt-0.5 truncate">
                      Re: <span className="font-semibold text-[var(--text-primary)]">{c.officer_name}</span>
                      {" — filed by "}{c.complainant_name}
                    </p>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] flex-shrink-0">
                    {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-[var(--border)] space-y-5">
                        {/* Info grid */}
                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 pt-3">
                          {[
                            ["Complainant",       c.complainant_name],
                            ["Website ID",        c.website_id],
                            ["Profile Link",      c.profile_link ?? "—"],
                            ["Officer",           c.officer_name],
                            ["Officer ID",        c.officer_website_id ?? "—"],
                            ["Subdivision",       c.subdivision ?? "—"],
                            ["Date of Incident",  c.date_of_incident],
                            ["Time of Incident",  c.time_of_incident],
                            ["Evidence",          c.evidence_name ?? "None attached"],
                          ].map(([label, value]) => (
                            <div key={label}>
                              <span className="font-display text-[8px] tracking-[0.3em] text-[var(--text-muted)] uppercase block mb-0.5">{label}</span>
                              <span className="text-[var(--text-primary)] text-xs">{value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Description */}
                        <div>
                          <span className="font-display text-[8px] tracking-[0.3em] text-[var(--text-muted)] uppercase block mb-1.5">Description</span>
                          <p className="text-[var(--text-secondary)] text-sm leading-relaxed bg-[var(--bg-panel-alt)] rounded p-4 border border-[var(--border)]">
                            {c.description}
                          </p>
                        </div>

                        {/* Status controls */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display text-[8px] tracking-[0.3em] text-[var(--text-muted)] uppercase mr-1">Set status:</span>
                          {(["pending","investigating","resolved","dismissed"] as const).map(s => (
                            <button
                              key={s}
                              onClick={() => setStatus(c.id, s)}
                              disabled={c.status === s || updating === c.id}
                              className={`font-display text-[9px] tracking-wider uppercase px-3 py-1.5 rounded border transition-all disabled:opacity-40 ${
                                c.status === s ? STATUS_CFG[s].color : "border-[var(--border)] text-[var(--text-muted)] hover:border-badge hover:text-badge"
                              }`}
                            >
                              {updating === c.id && c.status !== s ? <Loader className="w-2.5 h-2.5 animate-spin inline" /> : STATUS_CFG[s].label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab]         = useState<Tab>("admins");
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
    { key: "admins",     icon: Users,     label: "Admin Profiles" },
    { key: "complaints", icon: FileText,  label: "Complaints"     },
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
            {tab === "admins"     && <AdminProfilesTab session={session} />}
            {tab === "complaints" && <ComplaintsTab session={session} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
