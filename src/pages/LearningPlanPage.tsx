import { ActionBanner } from "@/components/empty-states";
import { PageHeader, Panel } from "@/components/skill-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getRole } from "@/data/roles";
import { getSkill } from "@/data/skills";
import { MVP_DISCLAIMER } from "@/lib/config";
import { formatDate } from "@/lib/format";
import { buildLearningPlan } from "@/lib/recommendations";
import { useStudent } from "@/state/student";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  CircleDashed,
  Compass,
  ExternalLink,
  GraduationCap,
  Lightbulb,
  ListTodo,
  Medal,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { Link } from "react-router";

export default function LearningPlanPage() {
  const { role, latestResult, state, toggleTopic } = useStudent();

  if (!role) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Learning plan" title="Your learning plan" />
        <ActionBanner
          icon={Compass}
          title="Pick a career goal to generate a plan"
          description="Your plan is built from the gap between your current scores and the skills your target role requires."
          to="/roles"
          cta="Choose a career role"
        />
      </div>
    );
  }

  if (!latestResult) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Learning plan" title={`Plan for ${role.name}`} />
        <ActionBanner
          icon={ListTodo}
          title="An assessment unlocks your plan"
          description="Finish one assessment for this role and SkillBridge will turn your biggest gaps into a week-by-week learning path."
          to={`/assessment/${role.id}`}
          cta="Take the assessment"
          secondary={{ to: `/roles/${role.id}`, label: "See the skill map" }}
        />
      </div>
    );
  }

  const plan = buildLearningPlan(role, latestResult);
  const completedCount = state.completedTopicIds.length;
  const totalTopics = plan.weeks.reduce((n, w) => n + w.topics.length, 0);
  const pctDone = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Personalized learning plan"
        title={`Your path to ${role.name}`}
        description={
          <>
            Built from your latest assessment (
            {formatDate(latestResult.finishedAt)}) — each week closes the gaps
            that cost you the most readiness. Tick topics off as you complete
            them.
          </>
        }
        actions={
          <Button asChild size="sm" variant="outline" className="rounded-full border-white/70 bg-white/60">
            <Link to={`/assessment/${role.id}`}>
              <RotateCcw className="size-4" /> Retake & refresh plan
            </Link>
          </Button>
        }
      />

      {plan.onTrack ? (
        <Panel className="relative overflow-hidden p-8 text-center">
          <div aria-hidden className="absolute -top-20 left-1/2 h-64 w-[480px] -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative mx-auto max-w-lg">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 ring-1 ring-inset ring-emerald-500/25">
              <Trophy className="size-7" />
            </span>
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              You're meeting every target on the {role.name} map
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              There are no open gaps to plan around right now. Keep the momentum —
              retake the assessment after new learning, or stretch toward a more
              ambitious goal.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <Button asChild className="rounded-full shadow-[0_10px_22px_-10px_rgba(79,70,229,0.8)]">
                <Link to={`/assessment/${role.id}`}>Retake assessment</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/80 bg-white/60">
                <Link to="/roles">Explore other roles</Link>
              </Button>
            </div>
          </div>
        </Panel>
      ) : (
        <>
          {/* Progress strip */}
          <Panel className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-indigo-600/10 text-indigo-600 ring-1 ring-inset ring-indigo-500/20">
                  <CalendarRange className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {plan.weeks.length}-week plan · {plan.focusAreas.length} focus{" "}
                    {plan.focusAreas.length === 1 ? "area" : "areas"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {completedCount} of {totalTopics} topics completed
                  </p>
                </div>
              </div>
              <div className="w-full max-w-[220px]">
                <div className="h-2 overflow-hidden rounded-full bg-slate-900/[0.06] ring-1 ring-inset ring-white/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-500"
                    style={{ width: `${pctDone}%` }}
                  />
                </div>
              </div>
            </div>
          </Panel>

          {/* Weeks */}
          <div className="space-y-4">
            {plan.weeks.map((week) => {
              const skill = getSkill(week.skillId);
              const done = week.topics.filter((t) => state.completedTopicIds.includes(t.id)).length;
              const weekComplete = done === week.topics.length;
              return (
                <Panel key={week.week} className={cn("overflow-hidden p-0", weekComplete && "ring-1 ring-emerald-500/25")}>
                  <div className="flex flex-wrap items-center gap-3 border-b border-white/70 bg-white/35 px-5 py-4">
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_16px_-8px_rgba(15,23,42,0.4)]",
                        weekComplete ? "bg-emerald-500" : "bg-gradient-to-br from-indigo-500 to-sky-500",
                      )}
                    >
                      {weekComplete ? <CheckCircle2 className="size-5" /> : week.week}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[15px] font-bold text-slate-900">
                          Week {week.week}: {week.title}
                        </h2>
                        {weekComplete && (
                          <span className="rounded-full bg-emerald-500/12 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-500/25">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                        <GraduationCap className="size-3.5" /> {skill.name} ·{" "}
                        {done}/{week.topics.length} topics done
                      </p>
                    </div>
                    <Badge className="border-white/70 bg-white/60 px-2 py-1 text-[11px] text-slate-500">
                      {skill.category}
                    </Badge>
                  </div>

                  <div className="grid gap-5 p-5 lg:grid-cols-[1.4fr_1fr]">
                    <div>
                      <p className="flex items-start gap-2 text-[13px] leading-6 text-slate-600">
                        <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />
                        <span>
                          <b className="text-slate-800">Why it matters: </b>
                          {week.why}
                        </span>
                      </p>
                      <p className="mt-2.5 flex items-start gap-2 text-[13px] leading-6 text-slate-600">
                        <Target className="mt-0.5 size-4 shrink-0 text-indigo-500" />
                        <span>
                          <b className="text-slate-800">Expected outcome: </b>
                          {week.outcome}
                        </span>
                      </p>

                      <div className="mt-4 space-y-1.5">
                        {week.topics.map((topic) => {
                          const checked = state.completedTopicIds.includes(topic.id);
                          return (
                            <label
                              key={topic.id}
                              className={cn(
                                "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors",
                                checked
                                  ? "border-emerald-500/20 bg-emerald-500/[0.05]"
                                  : "border-white/80 bg-white/45 hover:bg-white/80",
                              )}
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={() => toggleTopic(topic.id)}
                                className="border-slate-300 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
                              />
                              <span
                                className={cn(
                                  "flex-1 leading-5",
                                  checked ? "text-slate-400 line-through decoration-slate-300" : "text-slate-700",
                                )}
                              >
                                {topic.label}
                              </span>
                              {checked && <CheckCircle2 className="size-4 text-emerald-500" />}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Free starting resources
                      </p>
                      <div className="mt-2 space-y-2">
                        {week.resources.map((res) => (
                          <a
                            key={res.label}
                            href={res.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-3 rounded-xl border border-white/80 bg-white/45 px-3 py-2.5 transition-all hover:-translate-y-px hover:bg-white/80 hover:shadow-sm"
                          >
                            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-indigo-600/[0.08] text-indigo-600 ring-1 ring-inset ring-indigo-500/15">
                              {res.kind === "video" ? (
                                <ExternalLink className="size-4" />
                              ) : res.kind === "course" ? (
                                <BookOpen className="size-4" />
                              ) : res.kind === "practice" ? (
                                <CircleDashed className="size-4" />
                              ) : (
                                <Sparkles className="size-4" />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-semibold text-slate-700 group-hover:text-indigo-700">
                                {res.label}
                              </span>
                              <span className="text-[11px] capitalize text-slate-400">
                                {res.kind}
                              </span>
                            </span>
                            <ExternalLink className="size-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-indigo-500" />
                          </a>
                        ))}
                      </div>

                      {weekComplete && (
                        <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-3 py-2.5 text-xs font-semibold text-emerald-700">
                          <Medal className="size-4" /> Week complete — nice work!
                        </div>
                      )}
                    </div>
                  </div>
                </Panel>
              );
            })}
          </div>

          {plan.focusAreas.length > plan.weeks.length && (
            <Panel className="flex items-center gap-3 px-5 py-4 text-sm text-slate-500">
              <Sparkles className="size-4 shrink-0 text-indigo-500" />
              {plan.focusAreas.length - plan.weeks.length} more focus{" "}
              {plan.focusAreas.length - plan.weeks.length === 1 ? "area remains" : "areas remain"} —
              finish these weeks, then retake the assessment to refresh your plan.
            </Panel>
          )}

          <div className="flex items-start gap-2 rounded-2xl border border-white/70 bg-white/40 px-4 py-3 text-[11px] leading-5 text-slate-400 backdrop-blur-md">
            <CircleDashed className="mt-0.5 size-3.5 shrink-0" />
            {MVP_DISCLAIMER} Resources shown are free public starting points
            curated for this prototype.
          </div>
        </>
      )}
    </div>
  );
}
