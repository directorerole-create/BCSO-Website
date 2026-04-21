import { supabase, StaffMember } from "@/lib/supabase";
import { Shield, Star, MessageSquare, Calendar } from "lucide-react";

async function getStaff(): Promise<StaffMember[]> {
  try {
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

const RANK_TIER: Record<string, { color: string; label: string }> = {
  Sheriff:        { color: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",  label: "Command" },
  Undersheriff:   { color: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",  label: "Command" },
  Captain:        { color: "text-orange-400 border-orange-400/40 bg-orange-400/10",  label: "Leadership" },
  Lieutenant:     { color: "text-blue-400 border-blue-400/40 bg-blue-400/10",        label: "Supervision" },
  Sergeant:       { color: "text-blue-400 border-blue-400/40 bg-blue-400/10",        label: "Supervision" },
  Detective:      { color: "text-purple-400 border-purple-400/40 bg-purple-400/10",  label: "Investigations" },
};

function StaffAvatar({ name, avatarUrl, rank }: { name: string; avatarUrl: string | null; rank: string }) {
  const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const tier = RANK_TIER[rank];
  if (avatarUrl) {
    return (
      <div className="relative">
        <img src={avatarUrl} alt={name} className="w-24 h-24 rounded-full object-cover border-2 border-[var(--badge)] mx-auto" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[var(--bg-panel)] bg-[var(--badge)] flex items-center justify-center">
          <Shield className="w-3 h-3 text-[var(--bg-primary)]" />
        </div>
      </div>
    );
  }
  return (
    <div className="relative mx-auto w-24 h-24">
      <div
        className={`w-24 h-24 rounded-full border-2 flex items-center justify-center ${tier?.color ?? "border-[var(--badge)]/40 bg-[var(--badge)]/10 text-badge"}`}
        style={{ background: "radial-gradient(circle at 40% 40%, rgba(201,162,39,0.12), rgba(201,162,39,0.03))" }}
      >
        <span className="font-display text-2xl font-bold text-badge">{initials}</span>
      </div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[var(--bg-panel)] bg-[var(--badge)] flex items-center justify-center">
        <Shield className="w-3 h-3 text-[var(--bg-primary)]" />
      </div>
    </div>
  );
}

function StaffCard({ member }: { member: StaffMember }) {
  const tier = RANK_TIER[member.rank];
  return (
    <div className="panel p-6 flex flex-col items-center text-center group hover:border-[var(--badge)]/40 hover:-translate-y-1 transition-all duration-300">
      {/* Avatar */}
      <div className="mb-4 relative">
        <StaffAvatar name={member.name} avatarUrl={member.avatar_url} rank={member.rank} />
      </div>

      {/* Rank tier badge */}
      {tier && (
        <span className={`text-[9px] font-display tracking-widest uppercase px-2 py-0.5 rounded border mb-2 ${tier.color}`}>
          {tier.label}
        </span>
      )}

      {/* Name */}
      <h3 className="font-display text-base font-bold text-primary-color tracking-wide group-hover:text-badge transition-colors">
        {member.name}
      </h3>

      {/* Rank */}
      <p className="font-display text-xs text-badge tracking-widest uppercase mt-0.5">{member.rank}</p>

      {/* Role */}
      <p className="text-xs text-[var(--text-muted)] mt-1 font-body">{member.role}</p>

      {/* Badge + division */}
      <div className="flex items-center gap-3 mt-3 flex-wrap justify-center">
        {member.badge_number && (
          <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider">
            Badge #{member.badge_number}
          </span>
        )}
        {member.division && (
          <span className="text-[10px] text-[var(--text-muted)] tracking-wider">{member.division}</span>
        )}
      </div>

      {/* Divider */}
      <div className="w-12 h-[1px] bg-[var(--badge)]/30 my-4" />

      {/* Bio */}
      {member.bio && (
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-4">{member.bio}</p>
      )}

      {/* Footer info */}
      <div className="mt-4 pt-4 border-t border-[var(--border)] w-full flex flex-col gap-2">
        {member.join_date && (
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-[var(--text-muted)]">
            <Calendar className="w-3 h-3" />
            Joined {new Date(member.join_date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
          </div>
        )}
        {member.contact_discord && (
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-badge">
            <MessageSquare className="w-3 h-3" />
            {member.contact_discord}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function StaffPage() {
  const staff = await getStaff();

  const command = staff.filter((m) => ["Sheriff", "Undersheriff"].includes(m.rank));
  const leadership = staff.filter((m) => ["Captain", "Lieutenant"].includes(m.rank));
  const other = staff.filter((m) => !["Sheriff", "Undersheriff", "Captain", "Lieutenant"].includes(m.rank));

  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-14 text-center">
        <span className="font-display text-[10px] tracking-[0.5em] text-badge uppercase block mb-3">Department Portal</span>
        <h1 className="font-display text-4xl font-bold text-primary-color tracking-tight flex items-center justify-center gap-3 mb-3">
          <Star className="w-8 h-8 text-badge" strokeWidth={1.5} />
          MEET THE STAFF
        </h1>
        <p className="text-[var(--text-secondary)] text-sm max-w-lg mx-auto">
          The command staff and leadership team of the department — dedicated to upholding standards and building the community.
        </p>
        <div className="flex items-center gap-3 justify-center mt-6">
          <div className="h-[1px] w-16 bg-[var(--badge)]/30" />
          <Shield className="w-4 h-4 text-badge opacity-50" />
          <div className="h-[1px] w-16 bg-[var(--badge)]/30" />
        </div>
      </div>

      {staff.length === 0 ? (
        <div className="max-w-xl mx-auto panel py-20 text-center text-[var(--text-muted)] font-display text-sm tracking-wider">
          No staff profiles available yet.
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Command */}
          {command.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[var(--badge)]/40" />
                <span className="font-display text-xs tracking-[0.4em] text-badge uppercase px-4 py-1.5 border border-[var(--badge)]/30 rounded">
                  Command
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[var(--badge)]/40" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {command.map((m) => <StaffCard key={m.id} member={m} />)}
              </div>
            </section>
          )}

          {/* Leadership */}
          {leadership.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[var(--border)]" />
                <span className="font-display text-xs tracking-[0.4em] text-[var(--text-secondary)] uppercase px-4 py-1.5 border border-[var(--border)] rounded">
                  Leadership
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[var(--border)]" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {leadership.map((m) => <StaffCard key={m.id} member={m} />)}
              </div>
            </section>
          )}

          {/* Other staff */}
          {other.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[var(--border)]" />
                <span className="font-display text-xs tracking-[0.4em] text-[var(--text-secondary)] uppercase px-4 py-1.5 border border-[var(--border)] rounded">
                  Department Staff
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[var(--border)]" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {other.map((m) => <StaffCard key={m.id} member={m} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
