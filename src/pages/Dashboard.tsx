import { ActionBanner } from "@/components/empty-states";
import { Panel, PageHeader, LevelChip, CompetencyBar, ReadinessRing } from "@/components/skill-ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSkill } from "@/data/skills";
import { LEVEL_META } from "@/lib/config";
import { timeAgo } from "@/lib/format";
import { buildLearningPlan, focusAreasFor } from "@/lib/recommendations";
import { scoreMap, splitStrengths } from "@/lib/scoring";
import { useAuth } from "@/hooks/use-auth";
import { useStudent, displayName } from "@/state/student";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarCheck2,
  ClipboardList,
  Compass,
  Gauge,
  ListChecks,
  RefreshCcw,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router";

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  to,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  hint?: string;
  to?: string;
}) {
  const body = (
    <Panel className="raise-hover flex h-full flex-col gap-1.5 p-4">
      <div className="flex items-center justify-between">
        <span className="grid size-8 place-items-center rounded-lg bg-indigo-600/[0.08] text-indigo-600 ring-1 ring-inset ring-indigo-500/15">
          <Icon className="size-4" />
        </span>
        {to && <ArrowUpRight className="size-4 text-slate-300" />}
      </div>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      {hint && <p className="text-[11px] leading-4 text-slate-400">{hint}</p>}
    </Panel>
  );
  return to ? (
    <Link to={to} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}

function WelcomeSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-4">
        <Skeleton className="h-64 rounded-2xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const {
    role,
    state,
    latestResult,
    attemptsForGoal,
    seededDemo,
    ready,
    resetData,
  } = useStudent();
  const navigate = useNavigate();

  const name = displayName(user?.name ?? null, user?.email ?? null);
  const fullName = user?.name?.trim() || user?.email || name;

  const overview = useMemo(() => {
    if (!role || !latestResult) return null;
    const byId = scoreMap(latestResult);
    const rows = role.roleSkills.map((rs) => {
      const score = byId.get(rs.skillId);
      return { skillId: rs.skillId, score: score ?? null, group: rs.group };
    });
    const { strengths, improvements } = splitStrengths(latestResult.skills);
    return { rows, strengths, improvements };
  }, [role, latestResult]);

  const plan = useMemo(
    () => (role && latestResult ? buildLearningPlan(role, latestResult) : null),
    [role, latestResult],
  );

  const nextFocus = useMemo(
    () => (role && latestResult ? focusAreasFor(role, latestResult)[0] : null),
    [role, latestResult],
  );

  if (!ready) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-72" />
        </div>
        <WelcomeSkeleton />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Student dashboard"
          title={`Welcome, ${name}`}
          description="SkillBridge turns your skills into a clear picture: what you know, what a career role needs, and what to learn next."
        />
        <ActionBanner
          icon={Compass}
          title="Choose the career role you're preparing for"
          description={
            <>
              Every journey starts with a target. Pick a role and SkillBridge will
              show its skill map, run a short assessment against it, and build your
              personal learning plan from the gaps it finds.
            </>
          }
          to="/roles"
          cta="Browse career goals"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: ClipboardList, t: "1 · Assess", d: "10–16 scenario-based questions mapped to role skills." },
            { icon: TrendingUp, t: "2 · Identify gaps", d: "See per-skill strengths and weaknesses, not one number." },
            { icon: BookOpen, t: "3 · Improve", d: "Follow a focused weekly plan and retake to track growth." },
          ].map((s) => (
            <Panel key={s.t} className="p-5">
              <s.icon className="size-5 text-indigo-600" />
              <p className="mt-3 text-sm font-bold text-slate-900">{s.t}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{s.d}</p>
            </Panel>
          ))}
        </div>
      </div>
    );
  }

  const latestLevelMeta = latestResult ? LEVEL_META[latestResult.overallLevel] : null;
  const lastAssessed = latestResult ? timeAgo(latestResult.finishedAt) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student dashboard"
        title={`Welcome back, ${name}`}
        description={
          role
            ? `Your goal is ${role.name}. Here's where you stand and what to do next.`
            : undefined
        }
        actions={
          <>
            {role && (
              <>
                <Button asChild size="sm" className="rounded-full">
                  <Link to={`/roles`} className="gap-1.5">
                    <Target className="size-4" />
                    Change goal
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="rounded-full shadow-[0_10px_22px_-10px_rgba(79,70,229,0.85)]"
                >
                  <Link to={`/assessment/${role.id}`}>
                    {latestResult ? "Retake assessment" : "Start assessment"}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </>
            )}
          </>
        }
      />

      {seededDemo && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.07] px-4 py-3 text-xs leading-5 text-slate-600">
          <Sparkles className="size-4 shrink-0 text-indigo-600" />
          <span>
            You're viewing <b>sample demo data</b> (student goal + two past assessments) so you can explore every screen. Take your own assessment any time to replace it.
          </span>
          <button
            onClick={() => {
              resetData();
              navigate("/roles");
            }}
            className="ml-1 inline-flex items-center gap-1 font-semibold text-indigo-700 underline-offset-2 hover:underline"
          >
            <RotateCcw className="size-3.5" /> Start fresh
          </button>
        </div>
      )}

      {!overview || !latestResult ? (
        <ActionBanner
          icon={ClipboardList}
          title={`No assessment yet for ${role.name}`}
          description={
            <>
              We've mapped the {role.roleSkills.length} skills {role.name} roles
              rely on. Answer a short set of questions and SkillBridge will score
              you per skill, then show your gap to the role.
            </>
          }
          to={`/assessment/${role.id}`}
          cta="Start the skill assessment"
          secondary={{ to: `/roles/${role.id}`, label: "See the skill map" }}
        />
      ) : (
        <>
          {/* Top row: profile + readiness */}
          <div className="grid gap-4 lg:grid-cols-12">
            <Panel className="flex flex-col p-5 lg:col-span-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-11 ring-2 ring-white shadow-sm">
                  {user?.image ? <AvatarImage src={user.image} alt="" /> : null}
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-sky-400 text-sm font-bold text-white">
                    {fullName
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{fullName}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <Badge className="gap-1 border-transparent bg-indigo-600/10 text-indigo-700">
                      <Target className="size-3" />
                      {role.name}
                    </Badge>
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center py-2">
                <ReadinessRing pct={latestResult.overallPct} />
              </div>

              <p className="text-center text-xs leading-5 text-slate-500">
                {latestResult.overallLevel === "strong" || latestResult.overallLevel === "proficient"
                  ? `Solid progress toward ${role.name}.`
                  : `Getting there — focus on the gaps below to move the needle.`}{" "}
                Last assessed {lastAssessed}.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button asChild size="sm" variant="outline" className="rounded-xl border-white/70 bg-white/60">
                  <Link to="/skill-gap">Skill gap</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="rounded-xl border-white/70 bg-white/60">
                  <Link to="/progress">Full progress</Link>
                </Button>
              </div>
            </Panel>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              <StatTile
                icon={Gauge}
                label="Overall readiness"
                value={`${latestResult.overallPct}%`}
                hint={
                  latestLevelMeta
                    ? `Classified ${latestLevelMeta.label.toLowerCase()} for ${role.name}`
                    : "Estimate from this assessment"
                }
                to="/skill-gap"
              />
              <StatTile
                icon={ListChecks}
                label="Skills assessed"
                value={`${overview.rows.length}`}
                hint={`across ${latestResult.answeredCount} questions`}
                to={`/roles/${role.id}`}
              />
              <StatTile
                icon={TrendingUp}
                label="Needs improvement"
                value={`${overview.improvements.length}`}
                hint={
                  nextFocus
                    ? `Focus: ${getSkill(nextFocus.skillId).name}`
                    : "All skills at target 🎉"
                }
                to="/learning-plan"
              />
              <StatTile
                icon={CalendarCheck2}
                label="Assessments completed"
                value={`${attemptsForGoal.length}`}
                hint={attemptsForGoal.length > 1 ? "View trend in Progress" : "Take another to see a trend"}
                to="/progress"
              />
            </div>
          </div>

          {/* Bottom row: skill overview + continue learning */}
          <div className="grid gap-4 lg:grid-cols-12">
            <Panel className="p-5 lg:col-span-7">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Trophy className="size-4 text-indigo-600" /> Skill overview
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Per-skill score from your latest {role.name} assessment
                  </p>
                </div>
                <Button asChild size="sm" variant="ghost" className="rounded-full text-xs text-indigo-600 hover:text-indigo-800">
                  <Link to={`/results`}>View results</Link>
                </Button>
              </div>

              <div className="mt-4 space-y-3.5">
                {overview.rows.map((row) => {
                  const skill = getSkill(row.skillId);
                  const score = row.score;
                  return (
                    <div key={row.skillId}>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                          {skill.name}
                          {row.group === "core" && (
                            <span className="rounded bg-sky-500/10 px-1 py-px text-[9px] font-bold uppercase tracking-wide text-sky-700">
                              core
                            </span>
                          )}
                        </span>
                        {score ? (
                          <span className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">{score.pct}%</span>
                            <LevelChip level={score.level} />
                          </span>
                        ) : (
                          <span className="text-slate-400">not scored</span>
                        )}
                      </div>
                      <CompetencyBar
                        className="mt-1.5"
                        pct={score?.pct ?? 0}
                        level={score?.level ?? null}
                      />
                    </div>
                  );
                })}
              </div>
            </Panel>

            <div className="flex flex-col gap-4 lg:col-span-5">
              {/* Continue learning */}
              <Panel className="flex-1 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <BookOpen className="size-4 text-indigo-600" /> Continue learning
                  </h2>
                  <Button asChild size="sm" variant="ghost" className="rounded-full text-xs text-indigo-600 hover:text-indigo-800">
                    <Link to="/learning-plan">Open plan</Link>
                  </Button>
                </div>

                {plan && !plan.onTrack && plan.weeks.length > 0 ? (
                  <div className="mt-3 space-y-2.5">
                    {plan.weeks.slice(0, 3).map((week) => {
                      const skill = getSkill(week.skillId);
                      const done = week.topics.filter((t) =>
                        state.completedTopicIds.includes(t.id),
                      ).length;
                      return (
                        <Link
                          key={week.week}
                          to="/learning-plan"
                          className="group flex items-center gap-3 rounded-xl border border-white/70 bg-white/45 px-3 py-2.5 transition-all hover:-translate-y-px hover:bg-white/80 hover:shadow-sm"
                        >
                          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-indigo-500/15 to-sky-400/15 text-sm font-bold text-indigo-700 ring-1 ring-inset ring-indigo-500/15">
                            {week.week}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-semibold text-slate-800 group-hover:text-indigo-700">
                              {skill.name} ·{" "}
                              {week.title.slice(skill.name.length).replace(/^\s*—\s*/, "") || "close the gap"}
                            </span>
                            <span className="block text-[11px] text-slate-400">
                              {done}/{week.topics.length} topics done this week
                            </span>
                          </span>
                          <ArrowUpRight className="size-4 shrink-0 text-slate-300 transition-colors group-hover:text-indigo-600" />
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-sm leading-6 text-slate-600">
                    <RefreshCcw className="mb-2 size-4 text-emerald-600" />
                    You're meeting every target in this skill map. Retake the
                    assessment or pick a stretch goal to keep growing.
                  </div>
                )}
              </Panel>

              {/* Strengths summary */}
              <Panel className="p-5">
                <h2 className="text-sm font-bold text-slate-900">Where you're strong</h2>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {overview.strengths.slice(0, 4).map((s) => (
                    <Badge
                      key={s.skillId}
                      className="gap-1 border-transparent bg-emerald-500/10 text-emerald-700"
                    >
                      <Trophy className="size-3" />
                      {getSkill(s.skillId).name}
                    </Badge>
                  ))}
                  {overview.strengths.length === 0 && (
                    <span className="text-xs text-slate-400">
                      No strengths yet — your top skills will appear here after
                      improvement.
                    </span>
                  )}
                </div>
              </Panel>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
