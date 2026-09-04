import { ActionBanner } from "@/components/empty-states";
import { Panel, LevelChip, CompetencyBar, ReadinessRing } from "@/components/skill-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRole } from "@/data/roles";
import { getSkill } from "@/data/skills";
import { LEVEL_META, MVP_DISCLAIMER, ROLE_TARGETS } from "@/lib/config";
import { formatDate } from "@/lib/format";
import { buildLearningPlan, focusAreasFor, recommendationNotes } from "@/lib/recommendations";
import { scoreMap, splitStrengths } from "@/lib/scoring";
import { useStudent } from "@/state/student";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Gauge,
  ListChecks,
  MessageSquareText,
  RotateCcw,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { Link, useParams } from "react-router";

export default function ResultsPage() {
  const { attemptId } = useParams();
  const { state } = useStudent();

  const attempt =
    (attemptId ? state.attempts.find((a) => a.attemptId === attemptId) : null) ??
    (attemptId ? null : state.attempts[state.attempts.length - 1]) ??
    null;

  if (!attempt) {
    return (
      <div className="space-y-6">
        <ActionBanner
          icon={ClipboardList}
          title={attemptId ? "Result not found" : "No results yet"}
          description={
            attemptId
              ? "That assessment result isn't in your history anymore. Head to your latest results instead."
              : "Complete an assessment to see your skill breakdown, strengths and recommended focus areas."
          }
          to={attemptId ? "/results" : "/roles"}
          cta={attemptId ? "See latest results" : "Choose a career goal"}
        />
      </div>
    );
  }

  const role = getRole(attempt.roleId);
  if (!role) {
    return (
      <ActionBanner
        icon={Target}
        title="Goal no longer in the catalog"
        description="The role for this result was removed. Pick a new goal to continue."
        to="/roles"
        cta="Browse career goals"
      />
    );
  }

  const { strengths, improvements } = splitStrengths(attempt.skills);
  const byId = scoreMap(attempt);
  const plan = buildLearningPlan(role, attempt);
  const notes = recommendationNotes(role, attempt);
  const levelMeta = LEVEL_META[attempt.overallLevel];

  const narrative = [
    strengths.length > 0
      ? `Strong in ${strengths.map((s) => getSkill(s.skillId).name).join(", ")}.`
      : "",
    improvements.length > 0
      ? `Focus next on ${improvements
          .slice(0, 2)
          .map((s) => getSkill(s.skillId).name)
          .join(" and ")} — these gaps pull your readiness down most.`
      : "Every skill on this role's map is at or above target — excellent work.",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600/80">
            Assessment complete
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Your {role.name} results
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <CalendarDays className="size-3.5" /> {formatDate(attempt.finishedAt)} ·{" "}
            {attempt.answeredCount} questions · {attempt.skills.length} skills scored
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-full border-white/70 bg-white/60">
            <Link to={`/assessment/${role.id}`}>
              <RotateCcw className="size-4" /> Retake
            </Link>
          </Button>
          <Button asChild size="sm" className="rounded-full shadow-[0_10px_22px_-10px_rgba(79,70,229,0.85)]">
            <Link to="/skill-gap">
              View skill gap <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero: readiness + narrative */}
      <Panel className="relative overflow-hidden p-6 sm:p-8">
        <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full opacity-40 blur-3xl" style={{ backgroundColor: levelMeta.hex }} />
        <div className="relative grid items-center gap-6 lg:grid-cols-[auto_1fr]">
          <ReadinessRing pct={attempt.overallPct} size={176} stroke={15} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="gap-1.5 border-transparent px-3 py-1 text-xs font-bold" style={{ backgroundColor: `${levelMeta.hex}1f`, color: levelMeta.hex }}>
                <Gauge className="size-3.5" />
                {levelMeta.label} readiness
              </Badge>
              <span className="text-xs text-slate-400">vs. the {role.name} skill map</span>
            </div>
            <h2 className="mt-3 max-w-2xl text-balance text-xl font-bold leading-8 text-slate-900 sm:text-2xl">
              Your current readiness for this role is estimated at{" "}
              {attempt.overallPct}%, based on this assessment.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{narrative}</p>
            <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-slate-400">
              <MessageSquareText className="mt-0.5 size-3.5 shrink-0" />
              {MVP_DISCLAIMER}
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Skill breakdown */}
        <Panel className="p-5 sm:p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <ListChecks className="size-4 text-indigo-600" /> Skill breakdown
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Score per skill — the map your results are measured against
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {role.roleSkills.map((rs) => {
              const skill = getSkill(rs.skillId);
              const score = byId.get(rs.skillId);
              const target = ROLE_TARGETS[rs.group];
              const meets = score ? score.pct >= target.minPct : false;
              return (
                <div key={rs.skillId}>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      {skill.name}
                      <span className="rounded bg-white/70 px-1.5 py-px text-[10px] font-medium text-slate-400 ring-1 ring-inset ring-white/80">
                        target {target.label}
                      </span>
                    </span>
                    {score ? (
                      <span className="flex items-center gap-2">
                        {meets && (
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                        )}
                        <span className="font-bold text-slate-800">{score.pct}%</span>
                        <LevelChip level={score.level} />
                      </span>
                    ) : (
                      <LevelChip level={null} />
                    )}
                  </div>
                  <CompetencyBar className="mt-1.5" pct={score?.pct ?? 0} level={score?.level ?? null} />
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Right column */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          {/* Strengths */}
          <Panel className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Trophy className="size-4 text-emerald-500" /> Your strengths
            </h2>
            <div className="mt-3 space-y-2">
              {strengths.length > 0 ? (
                strengths.map((s) => (
                  <div key={s.skillId} className="flex items-center gap-2.5 rounded-xl border border-white/70 bg-emerald-500/[0.05] px-3 py-2.5">
                    <span className="flex h-7 w-14 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-xs font-bold text-emerald-700">
                      {s.pct}%
                    </span>
                    <span className="flex-1 text-sm font-semibold text-slate-800">
                      {getSkill(s.skillId).name}
                    </span>
                    <LevelChip level={s.level} />
                  </div>
                ))
              ) : (
                <p className="text-xs leading-5 text-slate-400">
                  No strengths yet — your highest-scoring skills will appear here
                  after your next round of practice.
                </p>
              )}
            </div>
          </Panel>

          {/* Needs improvement */}
          <Panel className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <TrendingUp className="size-4 text-amber-500" /> Needs improvement
            </h2>
            <div className="mt-3 space-y-2">
              {improvements.length > 0 ? (
                improvements.map((s) => (
                  <div key={s.skillId} className="flex items-center gap-2.5 rounded-xl border border-white/70 bg-amber-500/[0.06] px-3 py-2.5">
                    <span className="flex h-7 w-14 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-xs font-bold text-amber-700">
                      {s.pct}%
                    </span>
                    <span className="flex-1 text-sm font-semibold text-slate-800">
                      {getSkill(s.skillId).name}
                    </span>
                    <LevelChip level={s.level} />
                  </div>
                ))
              ) : (
                <p className="text-xs leading-5 text-slate-400">
                  Nothing below target — you're meeting this role's map. 🎉
                </p>
              )}
            </div>
          </Panel>
        </div>
      </div>

      {/* Recommended focus */}
      <Panel className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Target className="size-4 text-indigo-600" /> Recommended focus
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Ordered by how much each gap costs your readiness
            </p>
          </div>
          <Button asChild size="sm" className="rounded-full shadow-[0_8px_18px_-8px_rgba(79,70,229,0.8)]">
            <Link to="/learning-plan">
              <BookOpen className="size-4" /> Open learning plan
            </Link>
          </Button>
        </div>

        {notes.length > 0 ? (
          <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {notes.map((note, i) => (
              <li
                key={note}
                className="flex items-start gap-3 rounded-xl border border-white/80 bg-white/45 px-4 py-3"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm leading-6 text-slate-600">{note}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm leading-6 text-slate-500">
            You're meeting every target in this role's map. Consider retaking after
            new learning, or picking a more advanced goal.
          </p>
        )}

        {plan && !plan.onTrack && plan.weeks.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-500/15 bg-indigo-500/[0.06] px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600/80">
                Next step
              </span>
              <p className="text-sm text-slate-700">
                <b>{plan.weeks[0].title}</b> — a {plan.weeks.length}-week plan is
                ready for you.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="rounded-full border-indigo-500/30 bg-white/70">
              <Link to="/learning-plan">See the plan</Link>
            </Button>
          </div>
        )}
      </Panel>

      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/70 bg-white/40 px-5 py-4 backdrop-blur-md sm:flex-row sm:items-center">
        <p className="text-sm leading-6 text-slate-500">
          Want to see how your scores compare to the role's requirements? Or watch
          this readiness grow over time?
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-full border-white/80 bg-white/60">
            <Link to="/progress">
              <TrendingUp className="size-4 text-emerald-600" /> Progress history
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full border-white/80 bg-white/60">
            <Link to="/skill-gap">
              <Target className="size-4 text-indigo-600" /> Detailed skill gap
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
