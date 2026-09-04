import { ActionBanner } from "@/components/empty-states";
import { PageHeader, Panel, LevelChip } from "@/components/skill-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRole } from "@/data/roles";
import { getSkill } from "@/data/skills";
import { GAP_META, gapSeverity, LEVEL_META, MVP_DISCLAIMER, ROLE_TARGETS } from "@/lib/config";
import { scoreMap } from "@/lib/scoring";
import { useStudent } from "@/state/student";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ClipboardList,
  Compass,
  Crosshair,
  Info,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";

export default function SkillGapPage() {
  const { role, latestResult } = useStudent();

  if (!role) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Skill gap"
          title="Your skill gap"
          description="Compare where you are against what your target role requires."
        />
        <ActionBanner
          icon={Compass}
          title="Pick a career goal first"
          description="Skill gaps only make sense against a target. Choose a role and we'll build your required-vs-current comparison."
          to="/roles"
          cta="Choose a career role"
        />
      </div>
    );
  }

  if (!latestResult) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Skill gap"
          title={`Your ${role.name} skill gap`}
          description="We know what this role requires. Now we need your scores to compare."
        />
        <ActionBanner
          icon={ClipboardList}
          title={`No ${role.name} assessment yet`}
          description={`Answer ${role.roleSkills.length * 2} short questions and every skill on the map gets a score — then the gap analysis writes itself.`}
          to={`/assessment/${role.id}`}
          cta="Start the assessment"
          secondary={{ to: `/roles/${role.id}`, label: "Review the skill map" }}
        />
      </div>
    );
  }

  const byId = scoreMap(latestResult);
  const rows = role.roleSkills.map((rs) => {
    const target = ROLE_TARGETS[rs.group];
    const score = byId.get(rs.skillId) ?? null;
    const currentPct = score?.pct ?? 0;
    const severity = score ? gapSeverity(target.minPct, currentPct) : "high";
    return {
      rs,
      skill: getSkill(rs.skillId),
      target,
      score,
      currentPct,
      gapPct: Math.max(0, target.minPct - currentPct),
      severity,
    };
  });

  const counts = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.severity] = (acc[row.severity] ?? 0) + 1;
    return acc;
  }, {});
  const highCount = counts.high ?? 0;
  const mediumCount = counts.medium ?? 0;
  const metCount = counts.met ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Skill gap"
        title={`Your ${role.name} skill gap`}
        description={
          <>
            Target requirements vs. your current competency from the latest
            assessment ({latestResult.overallPct}% readiness overall).
          </>
        }
        actions={
          <Button asChild size="sm" className="rounded-full shadow-[0_8px_18px_-8px_rgba(79,70,229,0.8)]">
            <Link to={`/assessment/${role.id}`}>
              Retake assessment <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <Badge className="gap-1.5 border-transparent bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-700">
          <Sparkles className="size-3.5" /> On target · {metCount}
        </Badge>
        <Badge className="gap-1.5 border-transparent bg-amber-500/10 px-3 py-1.5 text-xs text-amber-700">
          <ShieldAlert className="size-3.5" /> Medium gap · {mediumCount}
        </Badge>
        <Badge className="gap-1.5 border-transparent bg-rose-500/10 px-3 py-1.5 text-xs text-rose-600">
          <Crosshair className="size-3.5" /> High gap · {highCount}
        </Badge>
      </div>

      <Panel className="overflow-hidden p-0">
        {/* Table header */}
        <div className="hidden grid-cols-12 gap-3 border-b border-white/70 bg-white/40 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 md:grid">
          <span className="col-span-4">Skill</span>
          <span className="col-span-2">Required</span>
          <span className="col-span-2">Current</span>
          <span className="col-span-4">Gap to target</span>
        </div>

        {rows.map((row, i) => {
          const meta = GAP_META[row.severity];
          const currentLevelChip = row.score?.level ?? null;
          return (
            <div
              key={row.rs.skillId}
              className={cn(
                "grid grid-cols-12 items-center gap-x-3 gap-y-3 px-5 py-4 md:py-3.5",
                i !== rows.length - 1 && "border-b border-white/60",
              )}
            >
              {/* Skill */}
              <div className="col-span-12 md:col-span-4">
                <p className="text-sm font-bold text-slate-800">{row.skill.name}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                  <span className="rounded bg-white/70 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-slate-400 ring-1 ring-inset ring-white/80">
                    {row.rs.group}
                  </span>
                  <span className="hidden text-[11px] text-slate-400 sm:inline">
                    {row.skill.category}
                  </span>
                </div>
              </div>

              {/* Required */}
              <div className="col-span-6 md:col-span-2">
                <span className="md:hidden text-[10px] font-bold uppercase text-slate-400">Required</span>
                <span className="ml-1.5 rounded-full bg-slate-900/[0.05] px-2 py-0.5 text-xs font-bold text-slate-600 ring-1 ring-inset ring-slate-900/[0.04]">
                  {row.target.label}
                </span>
              </div>

              {/* Current */}
              <div className="col-span-6 md:col-span-2">
                <span className="md:hidden text-[10px] font-bold uppercase text-slate-400">Current</span>
                {row.score ? (
                  <span className="ml-1.5 flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">{row.currentPct}%</span>
                    <LevelChip level={currentLevelChip} />
                  </span>
                ) : (
                  <span className="ml-1.5 text-xs text-slate-400">—</span>
                )}
              </div>

              {/* Gap bar */}
              <div className="col-span-12 md:col-span-4">
                <div className="flex items-center gap-2">
                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-900/[0.06] ring-1 ring-inset ring-white/70">
                    {/* current bar in level color */}
                    {row.score && row.score.pct > 0 && (
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${row.currentPct}%`,
                          backgroundColor: LEVEL_META[row.score.level].hex,
                        }}
                      />
                    )}
                    {/* missing segment (gap) */}
                    {row.gapPct > 0 && (
                      <div
                        className="absolute inset-y-0 rounded-r-full opacity-60"
                        style={{
                          left: `${row.currentPct}%`,
                          width: `${Math.min(100 - row.currentPct, row.gapPct)}%`,
                          backgroundColor: meta.hex,
                        }}
                      />
                    )}
                    {/* target tick */}
                    <div
                      className="absolute inset-y-0 w-px bg-slate-700/70"
                      style={{ left: `${row.target.minPct}%` }}
                      title={`Target ${row.target.minPct}%`}
                    />
                  </div>
                  <span
                    className={cn(
                      "w-[74px] shrink-0 rounded-full px-2 py-0.5 text-center text-[10.5px] font-bold ring-1 ring-inset",
                      meta.chip,
                    )}
                  >
                    {row.severity === "met" ? "On target" : `${row.gapPct}% gap`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Info className="size-4 text-indigo-600" /> How to read this
          </h2>
          <ul className="mt-3 space-y-2 text-[13px] leading-6 text-slate-500">
            <li>• <b className="text-slate-700">Core skills</b> are targeted at <b className="text-slate-700">Strong</b> (80%+); advanced/role-specific skills at <b className="text-slate-700">Proficient</b> (60%+).</li>
            <li>• The dark tick marks the required score. The lighter segment after your bar is the remaining gap.</li>
            <li>• Gaps are ranked by size — the biggest gaps drive your learning plan.</li>
          </ul>
        </Panel>
        <Panel className="flex flex-col justify-center gap-3 bg-gradient-to-br from-indigo-500/[0.07] to-transparent p-5">
          <p className="text-sm leading-6 text-slate-600">
            <b className="text-slate-800">
              {highCount + mediumCount === 0
                ? "You're meeting this role's skill targets."
                : `Your top priority: ${rows
                    .filter((r) => r.severity === "high" || r.severity === "medium")
                    .slice(0, 2)
                    .map((r) => r.skill.name)
                    .join(" and ")}.`}
            </b>{" "}
            {highCount + mediumCount > 0
              ? "Close these gaps first — they move your readiness the most."
              : "Retake the assessment or explore a more ambitious goal to keep growing."}
          </p>
          <Button asChild variant="outline" className="w-fit rounded-full border-white/80 bg-white/70">
            <Link to="/learning-plan">
              <Sparkles className="size-4 text-indigo-600" /> See your learning plan
            </Link>
          </Button>
          <p className="text-[11px] leading-5 text-slate-400">{MVP_DISCLAIMER}</p>
        </Panel>
      </div>
    </div>
  );
}
