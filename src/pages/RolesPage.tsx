import { PageHeader } from "@/components/skill-ui";
import { Badge } from "@/components/ui/badge";
import { questionsForRole } from "@/data/questions";
import { ROLES } from "@/data/roles";
import { getSkill } from "@/data/skills";
import { useStudent } from "@/state/student";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Code2,
  Database,
  Layers,
  Palette,
  Server,
  ShieldCheck,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router";

const ROLE_ICONS: Record<string, LucideIcon> = {
  "frontend-developer": Code2,
  "backend-developer": Server,
  "data-analyst": Database,
  "ai-ml-engineer": BrainCircuit,
  "ui-ux-designer": Palette,
  "cybersecurity-analyst": ShieldCheck,
};

export default function RolesPage() {
  const { role: currentRole, state } = useStudent();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Step 1 · Choose a goal"
        title="Which career role are you preparing for?"
        description="SkillBridge maps each role to the skills employers actually ask for, then measures you against that map. You can switch goals anytime — your assessment history is kept per role."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ROLES.map((role) => {
          const Icon = ROLE_ICONS[role.id] ?? Layers;
          const count = questionsForRole(role).length;
          const minutes = Math.max(5, Math.round((count * 42) / 60));
          const coreCount = role.roleSkills.filter((rs) => rs.group === "core").length;
          const isCurrent = currentRole?.id === role.id;
          const hasAttempts = state.attempts.some((a) => a.roleId === role.id);
          const latestForRole = state.attempts
            .filter((a) => a.roleId === role.id)
            .sort((a, b) => b.finishedAt - a.finishedAt)[0];

          return (
            <Link
              key={role.id}
              to={`/roles/${role.id}`}
              className="glass-panel raise-hover group relative flex flex-col overflow-hidden rounded-2xl p-5"
            >
              {/* accent glow */}
              <div
                aria-hidden
                className="absolute -right-14 -top-14 size-40 rounded-full opacity-[0.16] blur-2xl transition-opacity group-hover:opacity-30"
                style={{ backgroundColor: role.accent }}
              />

              <div className="relative flex items-start justify-between">
                <span
                  className="grid size-11 place-items-center rounded-xl text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_18px_-8px_rgba(15,23,42,0.5)]"
                  style={{ backgroundColor: role.accent }}
                >
                  <Icon className="size-5" />
                </span>
                {isCurrent ? (
                  <Badge className="gap-1 border-transparent bg-emerald-500/15 text-emerald-700">
                    <Check className="size-3" /> Your goal
                  </Badge>
                ) : hasAttempts ? (
                  <Badge className="border-white/70 bg-white/70 text-slate-500">
                    {latestForRole ? `${latestForRole.overallPct}% best` : "Assessed"}
                  </Badge>
                ) : null}
              </div>

              <h2 className="relative mt-4 text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-700">
                {role.name}
              </h2>
              <p className="relative mt-0.5 text-sm font-medium text-slate-500">{role.tagline}</p>
              <p className="relative mt-2 line-clamp-3 text-[13px] leading-5 text-slate-500">
                {role.description}
              </p>

              <div className="relative mt-4 flex flex-wrap items-center gap-1.5">
                {role.roleSkills.slice(0, 3).map((rs) => (
                  <span
                    key={rs.skillId}
                    className="rounded-md bg-white/70 px-1.5 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-inset ring-white/80"
                  >
                    {getSkill(rs.skillId).name}
                  </span>
                ))}
                {role.roleSkills.length > 3 && (
                  <span className="rounded-md bg-white/70 px-1.5 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-inset ring-white/80">
                    +{role.roleSkills.length - 3} more
                  </span>
                )}
              </div>

              <div className="relative mt-5 flex items-center justify-between border-t border-white/70 pt-4">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Layers className="size-3.5" /> {role.roleSkills.length} skills · {coreCount} core
                  </span>
                  <span className="flex items-center gap-1">
                    <Timer className="size-3.5" /> ~{minutes} min
                  </span>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
                  View map
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
