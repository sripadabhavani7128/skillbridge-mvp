import { ActionBanner } from "@/components/empty-states";
import { PageHeader, Panel } from "@/components/skill-ui";
import { Button } from "@/components/ui/button";
import { getSkill } from "@/data/skills";
import { LEVEL_META } from "@/lib/config";
import { formatDate, timeAgo } from "@/lib/format";
import { focusAreasFor } from "@/lib/recommendations";
import { improvedSkills, skillDeltas } from "@/lib/scoring";
import { useStudent } from "@/state/student";
import { cn } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  ClipboardList,
  Compass,
  Flame,
  Gauge,
  History,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";

export default function ProgressPage() {
  const { role, attemptsForGoal, state } = useStudent();

  if (!role) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Progress" title="Your growth over time" />
        <ActionBanner
          icon={Compass}
          title="Progress starts with a goal"
          description="Once you pick a role and finish an assessment, this page tracks your readiness across every attempt."
          to="/roles"
          cta="Choose a career role"
        />
      </div>
    );
  }

  if (attemptsForGoal.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Progress" title={`Your ${role.name} progress`} />
        <ActionBanner
          icon={ClipboardList}
          title="No assessments for this goal yet"
          description="Your first attempt establishes the baseline. Later attempts will show up here as a growth trend."
          to={`/assessment/${role.id}`}
          cta="Take your first assessment"
          secondary={{ to: `/roles/${role.id}`, label: "Review the skill map" }}
        />
      </div>
    );
  }

  const sorted = [...attemptsForGoal];
  const previous = sorted.length >= 2 ? sorted[sorted.length - 2] : null;
  const current = sorted[sorted.length - 1];
  const deltaOverall =
    previous !== null && previous.roleId === current.roleId
      ? current.overallPct - previous.overallPct
      : null;

  const deltas = previous ? skillDeltas(previous, current) : [];
  const changed = deltas.filter((d) => d.delta !== 0);
  const improved = previous ? improvedSkills(previous, current) : [];
  const firstFocus = focusAreasFor(role, current)[0];

  const currentMeta = LEVEL_META[current.overallLevel];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Progress"
        title={`Your ${role.name} progress`}
        description="Every assessment adds a point to your readiness trend. Retake after each learning sprint to watch the line move."
        actions={
          <Button asChild size="sm" className="rounded-full shadow-[0_8px_18px_-8px_rgba(79,70,229,0.8)]">
            <Link to={`/assessment/${role.id}`}>
              New assessment <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Panel className="p-4">
          <Gauge className="size-4 text-indigo-600" />
          <p className="mt-2 text-2xl font-bold text-slate-900">{current.overallPct}%</p>
          <p className="text-xs font-medium text-slate-500">Current readiness</p>
          {deltaOverall !== null && deltaOverall !== 0 && (
            <p
              className={cn(
                "mt-1 flex items-center gap-1 text-[11px] font-bold",
                deltaOverall > 0 ? "text-emerald-600" : "text-rose-500",
              )}
            >
              {deltaOverall > 0 ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {deltaOverall > 0 ? "+" : ""}
              {deltaOverall} vs previous
            </p>
          )}
        </Panel>

        <Panel className="p-4">
          <CalendarCheck2 className="size-4 text-indigo-600" />
          <p className="mt-2 text-2xl font-bold text-slate-900">{attemptsForGoal.length}</p>
          <p className="text-xs font-medium text-slate-500">Assessments completed</p>
          <p className="mt-1 text-[11px] text-slate-400">
            last one {timeAgo(current.finishedAt)}
          </p>
        </Panel>

        <Panel className="p-4">
          <Target className="size-4 text-indigo-600" />
          {firstFocus ? (
            <>
              <p className="mt-2 text-[15px] font-bold leading-6 text-slate-900">
                {getSkill(firstFocus.skillId).name}
              </p>
              <p className="text-xs font-medium text-slate-500">Current learning focus</p>
              <p className="mt-1 text-[11px] text-slate-400">
                {firstFocus.pct}% → target closes {firstFocus.gapPct}pts
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-[15px] font-bold leading-6 text-emerald-600">On target</p>
              <p className="text-xs font-medium text-slate-500">All skills meet the map</p>
            </>
          )}
        </Panel>

        <Panel className="p-4">
          <Flame className="size-4 text-orange-500" />
          <p className="mt-2 text-2xl font-bold text-slate-900">{improved.length}</p>
          <p className="text-xs font-medium text-slate-500">Recently improved skills</p>
          <p className="mt-1 text-[11px] text-slate-400">
            {improved.length > 0
              ? improved.slice(0, 3).map((d) => getSkill(d.skillId).name).join(", ")
              : previous
                ? "no change since last attempt"
                : "one more attempt shows the trend"}
          </p>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Timeline */}
        <Panel className="p-5 lg:col-span-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <History className="size-4 text-indigo-600" /> Readiness over time
            </h2>
            <span className="text-xs text-slate-400">{sorted.length} attempt{sorted.length > 1 ? "s" : ""}</span>
          </div>

          <div className="mt-5 space-y-3">
            {sorted.map((attempt, i) => {
              const isLatest = i === sorted.length - 1;
              const prevOverall = i > 0 ? sorted[i - 1].overallPct : null;
              const step = prevOverall !== null ? attempt.overallPct - prevOverall : null;
              const meta = LEVEL_META[attempt.overallLevel];
              return (
                <Link
                  key={attempt.attemptId}
                  to={`/results/${attempt.attemptId}`}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition-all hover:-translate-y-px hover:shadow-sm",
                    isLatest
                      ? "border-indigo-500/25 bg-indigo-500/[0.06]"
                      : "border-white/80 bg-white/45 hover:bg-white/75",
                  )}
                >
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: meta.hex, boxShadow: `0 8px 16px -8px ${meta.hex}` }}
                  >
                    {attempt.overallPct}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-slate-800">
                      {isLatest ? "Latest assessment" : `Attempt #${i + 1}`}
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      {formatDate(attempt.finishedAt)} · {attempt.answeredCount} questions
                    </span>
                  </span>
                  {step !== null && step !== 0 && (
                    <span
                      className={cn(
                        "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold",
                        step > 0 ? "bg-emerald-500/12 text-emerald-700" : "bg-rose-500/10 text-rose-600",
                      )}
                    >
                      {step > 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                      {step > 0 ? "+" : ""}
                      {step}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </Panel>

        {/* Skill progress */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          {previous ? (
            <Panel className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <TrendingUp className="size-4 text-indigo-600" /> Skill progress, latest vs previous
                </h2>
                <span className="rounded-full bg-white/60 px-2 py-1 text-[10px] font-semibold text-slate-400 ring-1 ring-inset ring-white/80">
                  previous → current
                </span>
              </div>

              {changed.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {changed.map((d) => {
                    const skill = getSkill(d.skillId);
                    const improvedRow = d.delta > 0;
                    const beforeHex = LEVEL_META[d.beforeLevel].hex;
                    const afterHex = LEVEL_META[d.afterLevel].hex;
                    return (
                      <div key={d.skillId}>
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-semibold text-slate-700">{skill.name}</span>
                          <span
                            className={cn(
                              "flex items-center gap-1 font-bold",
                              improvedRow ? "text-emerald-600" : "text-rose-500",
                            )}
                          >
                            {d.beforePct}% → {d.afterPct}%
                            {improvedRow ? (
                              <ArrowUpRight className="size-3.5" />
                            ) : (
                              <ArrowDownRight className="size-3.5" />
                            )}
                          </span>
                        </div>
                        {/* before bar */}
                        <div className="mt-1.5 space-y-1">
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-900/[0.05] ring-1 ring-inset ring-white/60">
                            <div className="h-full rounded-full opacity-70" style={{ width: `${d.beforePct}%`, backgroundColor: beforeHex }} />
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-900/[0.05] ring-1 ring-inset ring-white/60">
                            <div className="h-full rounded-full" style={{ width: `${d.afterPct}%`, backgroundColor: afterHex }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Your scores are identical to the previous attempt. Learn a few
                  topics, then retake to push the bars forward.
                </p>
              )}
            </Panel>
          ) : (
            <Panel className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
              <History className="size-8 text-slate-300" />
              <p className="max-w-sm text-sm leading-6 text-slate-500">
                Your first assessment just set the baseline. Finish another one and
                per-skill before/after bars appear here.
              </p>
            </Panel>
          )}

          {/* Recently improved + current focus */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Panel className="p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Flame className="size-4 text-orange-500" /> Recently improved
              </h2>
              <div className="mt-3 space-y-2">
                {improved.length > 0 ? (
                  improved.map((d) => (
                    <div key={d.skillId} className="flex items-center gap-2.5 rounded-xl border border-white/80 bg-emerald-500/[0.05] px-3 py-2">
                      <span className="text-[11px] font-bold text-slate-400">
                        {d.beforePct}%
                      </span>
                      <ArrowRight className="size-3 text-slate-300" />
                      <span className="flex-1 text-[13px] font-semibold text-slate-800">
                        {getSkill(d.skillId).name}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600">+{d.delta}%</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs leading-5 text-slate-400">
                    Nothing moved since the last attempt yet.
                  </p>
                )}
              </div>
            </Panel>

            <Panel className="flex flex-col justify-between p-5">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Target className="size-4 text-indigo-600" /> Current focus
                </h2>
                {firstFocus ? (
                  <>
                    <p className="mt-3 text-[15px] font-bold text-slate-900">
                      {getSkill(firstFocus.skillId).name}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your biggest open gap ({firstFocus.gapPct}pts under target).
                      It's week 1 of your learning plan.
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Every skill on the map is at or above target — great position to
                    stretch further.
                  </p>
                )}
              </div>
              <Button asChild size="sm" variant="outline" className="mt-4 w-fit rounded-full border-white/80 bg-white/60">
                <Link to="/learning-plan">Open learning plan</Link>
              </Button>
            </Panel>
          </div>
        </div>
      </div>

      {/* Plan completion strip */}
      <Panel className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-600/10 text-indigo-600 ring-1 ring-inset ring-indigo-500/15">
            <ClipboardList className="size-4" />
          </span>
          <p className="text-sm text-slate-600">
            <b className="text-slate-800">{state.completedTopicIds.length}</b> learning
            topics completed across your plan — keep ticking them off and retake the
            assessment to see the readiness line rise.
          </p>
        </div>
        <Button asChild size="sm" className="rounded-full shadow-[0_8px_18px_-8px_rgba(79,70,229,0.8)]">
          <Link to="/learning-plan">
            Go to plan <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Panel>
    </div>
  );
}
