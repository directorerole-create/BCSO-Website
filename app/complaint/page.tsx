"use client";
import { useState, useId } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, FileText, Clock, Hash, User, Shield, Calendar, Camera, ChevronDown } from "lucide-react";

function generateReportNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `BCO-${y}-${seq}`;
}

const REPORT_NO = generateReportNumber();
const TODAY = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

type FieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
};

function Field({ label, required, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-display text-[9px] tracking-[0.35em] uppercase text-[var(--text-muted)] flex items-center gap-1">
        {label}
        {required && <span className="text-red-400 text-xs leading-none">*</span>}
      </label>
      {children}
      {hint && <p className="font-display text-[8px] tracking-wider text-[var(--text-muted)] opacity-60 italic">{hint}</p>}
    </div>
  );
}

const inputCls = `
  w-full bg-transparent border-b-2 border-[var(--border)] focus:border-[var(--badge)]
  text-[var(--text-primary)] text-sm font-mono py-2 px-0 outline-none
  transition-colors duration-200 placeholder:text-[var(--text-muted)] placeholder:text-xs placeholder:font-body placeholder:not-italic
`.trim();

const textareaCls = `
  w-full bg-[var(--bg-panel-alt)] border border-[var(--border)] focus:border-[var(--badge)]
  text-[var(--text-primary)] text-sm font-body py-3 px-4 outline-none rounded
  transition-colors duration-200 placeholder:text-[var(--text-muted)] placeholder:text-xs resize-none
`.trim();

const selectCls = `
  w-full bg-[var(--bg-panel-alt)] border-b-2 border-[var(--border)] focus:border-[var(--badge)]
  text-[var(--text-primary)] text-sm font-mono py-2 px-0 outline-none
  transition-colors duration-200 appearance-none
`.trim();

type FormState = {
  complainantName: string;
  websiteId: string;
  profileLink: string;
  officerName: string;
  officerWebsiteId: string;
  subdivision: string;
  dateOfIncident: string;
  timeOfIncident: string;
  description: string;
  evidence: File | null;
};

export default function ComplaintPage() {
  const [form, setForm] = useState<FormState>({
    complainantName: "",
    websiteId: "",
    profileLink: "",
    officerName: "",
    officerWebsiteId: "",
    subdivision: "",
    dateOfIncident: "",
    timeOfIncident: "",
    description: "",
    evidence: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function set(k: keyof FormState, v: string) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.complainantName.trim()) e.complainantName = "Required";
    if (!form.websiteId.trim()) e.websiteId = "Required";
    if (!form.officerName.trim()) e.officerName = "Required";
    if (!form.dateOfIncident) e.dateOfIncident = "Required";
    if (!form.timeOfIncident) e.timeOfIncident = "Required";
    if (!form.description.trim()) e.description = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md w-full text-center"
        >
          <div className="panel p-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <CheckCircle className="w-16 h-16 text-emerald-400" strokeWidth={1.5} />
            </motion.div>
            <div className="font-display text-[9px] tracking-[0.4em] text-[var(--text-muted)] uppercase mb-2">Report Filed</div>
            <h2 className="font-display text-2xl font-black text-primary-color mb-3">Complaint Submitted</h2>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
              Your complaint has been received and logged. A supervisor will review your report.
            </p>
            <div className="panel p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between">
                <span className="font-display text-[9px] tracking-widest text-[var(--text-muted)] uppercase">Report No.</span>
                <span className="font-mono text-sm text-badge font-bold">{REPORT_NO}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-display text-[9px] tracking-widest text-[var(--text-muted)] uppercase">Status</span>
                <span className="font-display text-[9px] tracking-widest text-yellow-400 uppercase">Pending Review</span>
              </div>
              <div className="flex justify-between">
                <span className="font-display text-[9px] tracking-widest text-[var(--text-muted)] uppercase">Date</span>
                <span className="font-mono text-xs text-[var(--text-secondary)]">{TODAY}</span>
              </div>
            </div>
            <button
              onClick={() => { setSubmitted(false); setForm({ complainantName:"",websiteId:"",profileLink:"",officerName:"",officerWebsiteId:"",subdivision:"",dateOfIncident:"",timeOfIncident:"",description:"",evidence:null }); }}
              className="font-display text-[10px] tracking-widest uppercase text-[var(--text-muted)] hover:text-badge transition-colors"
            >
              File Another Report
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 pb-20">
      <div className="max-w-3xl mx-auto">

        {/* Page label */}
        <div className="text-center mb-8">
          <span className="font-display text-[10px] tracking-[0.5em] text-badge uppercase block mb-2">Department Portal</span>
          <h1 className="font-display text-3xl font-bold text-primary-color tracking-tight flex items-center justify-center gap-3">
            <FileText className="w-7 h-7 text-badge" strokeWidth={1.5} />
            FILE A COMPLAINT
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">Submit a formal complaint against a department member</p>
        </div>

        {/* The "document" */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-panel)]"
          style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.5)" }}
        >
          {/* Red + Blue top stripe — official form header color */}
          <div className="flex h-2">
            <div className="flex-1 bg-red-600" />
            <div className="flex-1 bg-blue-600" />
          </div>

          {/* Document header */}
          <div className="px-8 py-6 border-b border-[var(--border)] bg-[var(--bg-panel-alt)]/50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <Image src="/BCSOBadge.png" alt="BCSO" fill className="object-contain"
                    style={{ filter: "drop-shadow(0 0 6px rgba(201,162,39,0.4))" }} />
                </div>
                <div>
                  <div className="font-display text-[8px] tracking-[0.4em] text-[var(--text-muted)] uppercase">Blaine County</div>
                  <div className="font-display text-lg font-black text-badge tracking-wide uppercase">Sheriff's Office</div>
                  <div className="font-display text-[8px] tracking-[0.3em] text-[var(--text-muted)] uppercase mt-0.5">Citizen Complaint Report</div>
                </div>
              </div>

              {/* Report meta */}
              <div className="text-right space-y-1.5 flex-shrink-0">
                <div>
                  <div className="font-display text-[7px] tracking-widest text-[var(--text-muted)] uppercase">Report No.</div>
                  <div className="font-mono text-sm font-bold text-badge">{REPORT_NO}</div>
                </div>
                <div>
                  <div className="font-display text-[7px] tracking-widest text-[var(--text-muted)] uppercase">Date Filed</div>
                  <div className="font-mono text-xs text-[var(--text-secondary)]">{TODAY}</div>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 border border-yellow-500/40 rounded bg-yellow-500/10">
                  <div className="w-1 h-1 rounded-full bg-yellow-400" />
                  <span className="font-display text-[7px] tracking-widest text-yellow-400 uppercase">Pending Review</span>
                </div>
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025] z-0">
            <div className="relative w-80 h-80">
              <Image src="/BCSOBadge.png" alt="" fill className="object-contain" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 px-8 py-0 space-y-0">

            {/* ── SECTION I ── */}
            <div className="py-7 border-b border-[var(--border)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 rounded bg-badge/20 border border-badge/40 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-[10px] font-bold text-badge">I</span>
                </div>
                <h2 className="font-display text-xs font-bold tracking-[0.3em] text-[var(--text-primary)] uppercase">Complainant Information</h2>
                <div className="flex-1 h-[1px] bg-[var(--border)]" />
              </div>

              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                <Field label="Your Name & Unit Number" required hint="e.g. John D. 1L-22">
                  <input type="text" value={form.complainantName} onChange={e => set("complainantName", e.target.value)}
                    placeholder="John D. 1L-22" className={inputCls} />
                  {errors.complainantName && <p className="text-red-400 text-[9px] font-display tracking-wider mt-0.5">{errors.complainantName}</p>}
                </Field>

                <Field label="Website ID" required hint="Your web profile ID">
                  <input type="text" value={form.websiteId} onChange={e => set("websiteId", e.target.value)}
                    placeholder="Your Web ID" className={inputCls} />
                  {errors.websiteId && <p className="text-red-400 text-[9px] font-display tracking-wider mt-0.5">{errors.websiteId}</p>}
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Website Profile Link" hint="https://www.oasisrp.online/profile/...">
                    <input type="url" value={form.profileLink} onChange={e => set("profileLink", e.target.value)}
                      placeholder="https://www.oasisrp.online/profile/..." className={inputCls} />
                  </Field>
                </div>
              </div>
            </div>

            {/* ── SECTION II ── */}
            <div className="py-7 border-b border-[var(--border)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 rounded bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-[10px] font-bold text-red-400">II</span>
                </div>
                <h2 className="font-display text-xs font-bold tracking-[0.3em] text-[var(--text-primary)] uppercase">Officer in Question</h2>
                <div className="flex-1 h-[1px] bg-[var(--border)]" />
              </div>

              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                <Field label="Officer Name" required hint="e.g. Vance L. 2L-15">
                  <input type="text" value={form.officerName} onChange={e => set("officerName", e.target.value)}
                    placeholder="Vance L. 2L-15" className={inputCls} />
                  {errors.officerName && <p className="text-red-400 text-[9px] font-display tracking-wider mt-0.5">{errors.officerName}</p>}
                </Field>

                <Field label="Officer's Website ID" hint="If known">
                  <input type="text" value={form.officerWebsiteId} onChange={e => set("officerWebsiteId", e.target.value)}
                    placeholder="Officer Web ID" className={inputCls} />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Was the officer active within a subdivision?" hint="e.g. No / Yes, K-9 / Unknown">
                    <div className="relative">
                      <select value={form.subdivision} onChange={e => set("subdivision", e.target.value)} className={selectCls}>
                        <option value="">— Select —</option>
                        <option value="No">No</option>
                        <option value="Yes - K-9">Yes — K-9</option>
                        <option value="Yes - SWAT">Yes — SWAT</option>
                        <option value="Yes - Investigations">Yes — Investigations</option>
                        <option value="Yes - Traffic">Yes — Traffic</option>
                        <option value="Unknown">Unknown</option>
                      </select>
                      <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
                    </div>
                  </Field>
                </div>
              </div>
            </div>

            {/* ── SECTION III ── */}
            <div className="py-7 border-b border-[var(--border)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 rounded bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-[10px] font-bold text-blue-400">III</span>
                </div>
                <h2 className="font-display text-xs font-bold tracking-[0.3em] text-[var(--text-primary)] uppercase">Incident Details</h2>
                <div className="flex-1 h-[1px] bg-[var(--border)]" />
              </div>

              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                <Field label="Date of Incident" required>
                  <input type="date" value={form.dateOfIncident} onChange={e => set("dateOfIncident", e.target.value)}
                    className={inputCls} style={{ colorScheme: "dark" }} />
                  {errors.dateOfIncident && <p className="text-red-400 text-[9px] font-display tracking-wider mt-0.5">{errors.dateOfIncident}</p>}
                </Field>

                <Field label="Time of Incident" required>
                  <input type="time" value={form.timeOfIncident} onChange={e => set("timeOfIncident", e.target.value)}
                    className={inputCls} style={{ colorScheme: "dark" }} />
                  {errors.timeOfIncident && <p className="text-red-400 text-[9px] font-display tracking-wider mt-0.5">{errors.timeOfIncident}</p>}
                </Field>
              </div>

              <Field label="Description of the Incident" required hint="Provide a detailed account of what happened">
                <textarea value={form.description} onChange={e => set("description", e.target.value)}
                  rows={6} placeholder="Provide a detailed account of what happened, including the sequence of events, any witnesses present, and the outcome..."
                  className={textareaCls} />
                {errors.description && <p className="text-red-400 text-[9px] font-display tracking-wider mt-1">{errors.description}</p>}
              </Field>
            </div>

            {/* ── SECTION IV — Evidence ── */}
            <div className="py-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 rounded bg-purple-500/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-[10px] font-bold text-purple-400">IV</span>
                </div>
                <h2 className="font-display text-xs font-bold tracking-[0.3em] text-[var(--text-primary)] uppercase">Evidence</h2>
                <div className="flex-1 h-[1px] bg-[var(--border)]" />
              </div>

              <Field label="Evidence File (Video, Screenshots)" hint="Optional — attach supporting media">
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[var(--border)] hover:border-badge/50 rounded-lg cursor-pointer transition-colors group">
                  <Camera className="w-6 h-6 text-[var(--text-muted)] group-hover:text-badge transition-colors mb-2" strokeWidth={1.5} />
                  <span className="font-display text-[9px] tracking-widest text-[var(--text-muted)] group-hover:text-badge uppercase transition-colors">
                    {form.evidence ? form.evidence.name : "Click to attach file"}
                  </span>
                  <input type="file" className="hidden" accept="image/*,video/*"
                    onChange={e => setForm(f => ({ ...f, evidence: e.target.files?.[0] ?? null }))} />
                </label>
              </Field>
            </div>

            {/* ── Signature / Submit ── */}
            <div className="border-t border-[var(--border)] bg-[var(--bg-panel-alt)]/40 px-8 py-6 -mx-8">
              <div className="flex items-center justify-between gap-6 flex-wrap">
                <div className="text-[10px] text-[var(--text-muted)] leading-relaxed max-w-sm font-body">
                  By submitting this report, I confirm that all information provided is accurate and truthful to the best of my knowledge.
                  False reports may result in disciplinary action.
                </div>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative font-display text-xs tracking-[0.3em] uppercase px-8 py-3 rounded border overflow-hidden transition-all disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, rgba(201,162,39,0.15), rgba(201,162,39,0.05))",
                    borderColor: "rgba(201,162,39,0.5)",
                    color: "var(--badge)",
                  }}
                >
                  <AnimatePresence mode="wait">
                    {submitting ? (
                      <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="block w-3 h-3 border-2 border-badge/30 border-t-badge rounded-full"
                        />
                        Submitting...
                      </motion.span>
                    ) : (
                      <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        Submit Report
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

          </form>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-center font-display text-[8px] tracking-widest text-[var(--text-muted)] uppercase mt-6 opacity-50">
          This report is for official use only &mdash; Blaine County Sheriff&apos;s Office &mdash; All submissions are logged
        </p>
      </div>
    </div>
  );
}
