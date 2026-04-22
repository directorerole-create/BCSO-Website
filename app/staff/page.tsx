"use client";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { STAFF_DATA, StaticStaffMember } from "@/lib/staff-data";
import { Shield, Star, Hash, ChevronDown } from "lucide-react";

const RANK_CONFIG: Record<string, { color: string; glow: string; border: string; tier: string; tierColor: string }> = {
  Sheriff:      { color: "#f59e0b", glow: "rgba(245,158,11,0.35)", border: "rgba(245,158,11,0.5)",  tier: "Command",    tierColor: "text-yellow-400" },
  Undersheriff: { color: "#f59e0b", glow: "rgba(245,158,11,0.3)",  border: "rgba(245,158,11,0.45)", tier: "Command",    tierColor: "text-yellow-400" },
  "Chief Deputy": { color: "#fb923c", glow: "rgba(251,146,60,0.3)",  border: "rgba(251,146,60,0.45)", tier: "Senior Staff", tierColor: "text-orange-400" },
  Colonel:      { color: "#fb923c", glow: "rgba(251,146,60,0.25)", border: "rgba(251,146,60,0.4)",  tier: "Senior Staff", tierColor: "text-orange-400" },
};

function getInitials(name: string) {
  return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
}

function TiltCard({ member, index }: { member: StaticStaffMember; index: number }) {
  const cfg = RANK_CONFIG[member.rank] ?? RANK_CONFIG["Colonel"];
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [6, -6]);
  const rotateY = useTransform(x, [-60, 60], [-6, 6]);
  const [hovered, setHovered] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);
  const targetBadge = parseInt(member.badge_number, 10);

  // Badge number count-up on mount
  useEffect(() => {
    let start = 0;
    const steps = 30;
    const inc = Math.ceil(targetBadge / steps);
    const timer = setInterval(() => {
      start = Math.min(start + inc, targetBadge);
      setBadgeCount(start);
      if (start >= targetBadge) clearInterval(timer);
    }, 30 + index * 10);
    return () => clearInterval(timer);
  }, [targetBadge, index]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setHovered(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 800 }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative cursor-default"
      >
        {/* Glow backdrop */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-0"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${cfg.glow} 0%, transparent 70%)`, filter: "blur(2px)" }}
        />

        {/* Card */}
        <motion.div
          className="relative z-10 rounded-2xl overflow-hidden border"
          animate={{
            borderColor: hovered ? cfg.border : "rgba(255,255,255,0.06)",
            boxShadow: hovered
              ? `0 20px 60px -10px ${cfg.glow}, 0 0 0 1px ${cfg.border}`
              : "0 4px 24px rgba(0,0,0,0.4)",
          }}
          transition={{ duration: 0.3 }}
          style={{ background: "var(--bg-panel)" }}
        >
          {/* Top color bar */}
          <motion.div
            className="h-[3px] w-full"
            animate={{ opacity: hovered ? 1 : 0.4 }}
            style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }}
          />

          {/* Shimmer sweep on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                initial={{ x: "-100%", opacity: 0.6 }}
                animate={{ x: "200%", opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                style={{ background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)` }}
              />
            )}
          </AnimatePresence>

          <div className="p-7 flex flex-col items-center text-center">
            {/* Avatar ring */}
            <div className="relative mb-5">
              {/* Spinning gradient ring */}
              <motion.div
                className="absolute -inset-[3px] rounded-full z-0"
                animate={{ rotate: hovered ? 360 : 0 }}
                transition={{ duration: hovered ? 3 : 0, ease: "linear", repeat: hovered ? Infinity : 0 }}
                style={{
                  background: `conic-gradient(${cfg.color}, transparent 60%, ${cfg.color})`,
                  borderRadius: "50%",
                }}
              />
              {/* Static ring base */}
              <div className="absolute -inset-[3px] rounded-full z-0"
                style={{ background: `conic-gradient(${cfg.color} 0%, transparent 50%)`, opacity: 0.3 }} />

              {/* Avatar circle */}
              <div
                className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${cfg.glow.replace("0.3", "0.25")}, rgba(0,0,0,0.6))`,
                  border: `2px solid ${cfg.border}`,
                }}
              >
                <span className="font-display text-3xl font-black" style={{ color: cfg.color }}>
                  {getInitials(member.name)}
                </span>
              </div>

              {/* Shield badge */}
              <motion.div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center z-20 border-2"
                style={{ background: cfg.color, borderColor: "var(--bg-panel)" }}
                animate={{ scale: hovered ? 1.15 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Shield className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
              </motion.div>
            </div>

            {/* Tier badge */}
            <motion.span
              className={`font-display text-[9px] tracking-[0.35em] uppercase px-2.5 py-1 rounded-sm border mb-3 ${cfg.tierColor}`}
              style={{ borderColor: cfg.border, background: `${cfg.glow.replace("0.3", "0.1")}` }}
              animate={{ opacity: hovered ? 1 : 0.75 }}
            >
              {cfg.tier}
            </motion.span>

            {/* Name */}
            <motion.h3
              className="font-display text-xl font-black tracking-wide mb-1"
              animate={{ color: hovered ? cfg.color : "var(--text-primary)" }}
              transition={{ duration: 0.2 }}
            >
              {member.name}
            </motion.h3>

            {/* Rank */}
            <p className="font-display text-sm tracking-widest uppercase mb-4" style={{ color: cfg.color, opacity: 0.9 }}>
              {member.rank}
            </p>

            {/* Divider */}
            <motion.div
              className="w-full h-[1px] mb-4"
              style={{ background: `linear-gradient(90deg, transparent, ${cfg.border}, transparent)` }}
              animate={{ opacity: hovered ? 1 : 0.4 }}
            />

            {/* Info rows */}
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display text-[9px] tracking-widest text-[var(--text-muted)] uppercase">Badge</span>
                <span className="font-mono text-sm font-bold" style={{ color: cfg.color }}>
                  #{badgeCount.toString().padStart(4, "0")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-display text-[9px] tracking-widest text-[var(--text-muted)] uppercase">Role</span>
                <span className="text-[11px] text-[var(--text-secondary)] text-right max-w-[60%] leading-tight">{member.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-display text-[9px] tracking-widest text-[var(--text-muted)] uppercase">Division</span>
                <span className="text-[11px] text-[var(--text-secondary)]">{member.division}</span>
              </div>
            </div>

            {/* Status pip */}
            <div className="flex items-center gap-1.5 mt-5">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
                style={{ boxShadow: "0 0 6px #34d399" }}
              />
              <span className="font-display text-[8px] tracking-[0.3em] text-emerald-400 uppercase">Active Duty</span>
            </div>
          </div>

          {/* Bottom color bar */}
          <motion.div
            className="h-[2px] w-full"
            animate={{ opacity: hovered ? 0.6 : 0.1 }}
            style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function StaffPage() {
  const command = STAFF_DATA.filter(m => ["Sheriff", "Undersheriff"].includes(m.rank));
  const senior  = STAFF_DATA.filter(m => ["Chief Deputy", "Colonel"].includes(m.rank));

  return (
    <div className="min-h-screen pb-20">
      {/* Hero header */}
      <div className="relative overflow-hidden px-6 pt-10 pb-16 text-center">
        {/* Animated background rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-[var(--badge)]/10"
              initial={{ width: 100 * i, height: 100 * i, opacity: 0 }}
              animate={{ width: 200 * i, height: 200 * i, opacity: [0, 0.3, 0] }}
              transition={{ duration: 4, delay: i * 1.2, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-display text-[10px] tracking-[0.5em] text-badge uppercase block mb-4">Department Portal</span>

          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src="/BCSOBadge.png" alt="BCSO" width={64} height={64}
                style={{ filter: "drop-shadow(0 0 20px rgba(201,162,39,0.6))" }} />
            </motion.div>

            <h1 className="font-display text-4xl font-black text-primary-color tracking-tight">
              MEET THE STAFF
            </h1>

            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Image src="/BCSOBadge.png" alt="BCSO" width={64} height={64}
                style={{ filter: "drop-shadow(0 0 20px rgba(201,162,39,0.6))", transform: "scaleX(-1)" }} />
            </motion.div>
          </div>

          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto mb-6">
            The command structure of the Blaine County Sheriff&apos;s Office — dedicated to upholding the law and leading with integrity.
          </p>

          <div className="flex items-center gap-3 justify-center">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-[var(--badge)]/40" />
            <Star className="w-4 h-4 text-badge opacity-60" />
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-[var(--badge)]/40" />
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6 space-y-16">
        {/* Command */}
        <section>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-yellow-400/40" />
            <span className="font-display text-xs tracking-[0.4em] text-yellow-400 uppercase px-5 py-1.5 border border-yellow-400/30 rounded bg-yellow-400/5">
              Command
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-yellow-400/40" />
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {command.map((m, i) => <TiltCard key={m.id} member={m} index={i} />)}
          </div>
        </section>

        {/* Senior Staff */}
        <section>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-orange-400/40" />
            <span className="font-display text-xs tracking-[0.4em] text-orange-400 uppercase px-5 py-1.5 border border-orange-400/30 rounded bg-orange-400/5">
              Senior Staff
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-orange-400/40" />
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {senior.map((m, i) => <TiltCard key={m.id} member={m} index={i + 2} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
