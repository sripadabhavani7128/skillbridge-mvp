import { PageHeader, Panel, LevelChip, CompetencyBar } from "@/components/skill-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { questionsForRole } from "@/data/questions";
import { getRole, getRoleSkill } from "@/data/roles";
import { getSkill } from "@/data/skills";
import { ROLE_TARGETS } from "@/lib/config";
import { scoreMap } from "@/lib/scoring";
import { useStudent } from "@/state/student";
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  BrainCircuit,
  Check,
  ClipboardList,
  Code2,
  Database,
  Layers,
  Palette,
  Server,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

const ROLE_ICONS: Record<string, LucideIcon> = {
  "frontend-developer": Code2,
  "backend-developer": Server,
  "data-analyst": Database,
  "ai-ml-engineer": BrainCircuit,
  "ui-ux-designer": Palette,
  "cybersecurity-analyst": ShieldCheck,
};

export default function RoleDetailPage() {
  const { roleId = "" } = useParams();
  const role = getRole(roleId);
  const { role: currentRole, latestResult, setGoal } = useStudent();
  const navigate = useNavigate();

  if (!role) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Skill map" title="Role not found" />
        <Panel className="p-8 text-center">
          <p className="text-sm text-slate-500">
            We couldn't find that career role in the current catalog.
          </p>
          <Button asChild className="mt-4 rounded-full">
            <Link to="/roles">Browse career goals</Link>
          </Button>
        </Panel>
      </div>
    );
  }

  const Icon = ROLE_ICONS[role.id] ?? Layers;
  const count = questionsForRole(role).length;
  const minutes = Math.max(5, Math.round((count * 42) / 60));
  const isCurrent = currentRole?.id === role.id;
  const byId = latestResult ? scoreMap(latestResult) : null;
  const cores = role.roleSkills.filter((rs) => rs.group === "core");
  const advanced = role.roleSkills.filter((rs) => rs.group === "advanced");

  const grouped = [
    { label: "Core skills", sub: "Expected strong — assessed first", items: cores },
    { label: "Advanced / role-specific", sub: "Expected proficient — depth that sets you apart", items: advanced },
  ];

  const handleSetGoal = () => {
    setGoal(role.id);
    navigate("/dashboard");
  };

  return (
    <div className="space-y-6">
      <Link
        to="/roles"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-indigo-600"
      >
        <ArrowLeft className="size-3.5" /> All career goals
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span
            className="grid size-14 shrink-0 place-items-center rounded-2xl text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_22px_-10px_rgba(15,23,42,0.5)]"
            style={{ backgroundColor: role.accent }}
          >
            <Icon className="size-7" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {role.name}
              </h1>
              {isCurrent && (
                <Badge className="gap-1 border-transparent bg-emerald-500/15 text-emerald-700">
                  <Target className="size-3" /> Current goal
                </Badge>
              )}
            </div>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{role.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Layers className="size-4 text-indigo-500/70" />
                {role.roleSkills.length} skills on the map
              </span>
              <span className="flex items-center gap-1.5">
                <ClipboardList className="size-4 text-indigo-500/70" />
                {count} assessment questions
              </span>
              <span className="flex items-center gap-1.5">
                <Timer className="size-4 text-indigo-500/70" />
                ~{minutes} minute assessment
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {!isCurrent && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-white/70 bg-white/60"
              onClick={handleSetGoal}
            >
              <Check className="size-4 text-emerald-600" />
              Make this my goal
            </Button>
          )}
          <Button
            size="lg"
            className="h-11 rounded-full px-6 shadow-[0_12px_26px_-10px_rgba(79,70,229,0.8)]"
            asChild
          >
            <Link to={`/assessment/${role.id}`}>
              Start skill assessment
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-sky-500/15 bg-sky-500/[0.06] px-4 py-3 text-[13px] leading-5 text-slate-600">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-sky-600" />
        <p>
          This is the <b>role skill map</b>: the skills this career actually relies
          on, at the level it expects. Every assessment question maps to one of
          these skills — so your results tell you exactly which part of the map
          you've mastered and which still needs work.
        </p>
      </div>

      {grouped.map((group) => (
        <section key={group.label} className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                {group.label}
              </h2>
              <p className="text-xs text-slate-400">{group.sub}</p>
            </div>
            <span className="rounded-full bg-white/60 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-400 ring-1 ring-inset ring-white/70">
              Target: {ROLE_TARGETS[group.items[0]?.group ?? "advanced"].label}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((rs) => {
              const skill = getSkill(rs.skillId);
              const roleSkill = getRoleSkill(role, rs.skillId);
              const target = ROLE_TARGETS[rs.group];
              const score = byId?.get(rs.skillId) ?? null;
              return (
                <Panel key={rs.skillId} className="raise-hover flex flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-[15px] font-bold text-slate-900">{skill.name}</h3>
                      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-500/80">
                        {skill.category}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1" title={`Importance ${rs.importance}/5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < rs.importance
                              ? "size-1.5 rounded-full bg-indigo-400"
                              : "size-1.5 rounded-full bg-slate-200"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 flex-1 text-xs leading-5 text-slate-500">
                    {roleSkill?.note ?? skill.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-white/70 pt-3">
                    <span className="text-[11px] font-medium text-slate-400">
                      Required: <b className="text-slate-600">{target.label}</b>
                    </span>
                    {score ? (
                      <span className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-500">{score.pct}%</span>
                        <LevelChip level={score.level} />
                      </span>
                    ) : (
                      <LevelChip level={null} />
                    )}
                  </div>
                  {score && (
                    <CompetencyBar className="mt-2" pct={score.pct} level={score.level} />
                  )}
                </Panel>
              );
            })}
          </div>
        </section>
      ))}

      <Panel className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-600/10 text-indigo-600 ring-1 ring-inset ring-indigo-500/15">
            <BookMarked className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">
              Questions are connected to this map — not random trivia
            </p>
            <p className="mt-0.5 text-xs leading-5 text-slate-500">
              Answer {count} concept, code and scenario questions, one per skill
              area. Then see your readiness and your exact gap to {role.name}.
            </p>
          </div>
        </div>
        <Button asChild className="shrink-0 rounded-full shadow-[0_12px_26px_-10px_rgba(79,70,229,0.8)]">
          <Link to={`/assessment/${role.id}`}>
            <ClipboardList className="size-4" />
            Begin assessment
          </Link>
        </Button>
      </Panel>
    </div>
  );
}
