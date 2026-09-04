import { LEARNING_CONTENT } from "@/data/learningContent";
import { getSkill } from "@/data/skills";
import { gapSeverity, ROLE_TARGETS } from "./config";
import { scoreMap } from "./scoring";
import type {
  AssessmentResult,
  CareerRole,
  FocusArea,
  LearningWeek,
  RoleSkill,
  SkillId,
} from "./types";

/**
 * Recommendation engine (MVP = deterministic logic).
 *
 * Rule-based today:
 *  - every role skill below its target becomes a focus area;
 *  - focus areas are ranked by gap size (tie-broken by importance);
 *  - the top areas become a weekly plan assembled from the learning
 *    content knowledge base.
 *
 * This module is the seam where an actual AI/LLM recommendation service
 * plugs in later — callers only depend on `buildLearningPlan` /
 * `focusAreasFor`.
 */

export interface TargetInfo {
  label: string;
  minPct: number;
  /** importance of the skill within the role (1–5) */
  importance: number;
}

export function targetForSkill(role: CareerRole, skillId: SkillId): TargetInfo {
  const rs = role.roleSkills.find((r) => r.skillId === skillId);
  const fallback: RoleSkill = { skillId, group: "core", importance: 3, note: "" };
  const { group, importance } = rs ?? fallback;
  const target = ROLE_TARGETS[group];
  return { label: target.label, minPct: target.minPct, importance };
}

/** Skills below target, ranked by severity of the gap. */
export function focusAreasFor(
  role: CareerRole,
  result: Pick<AssessmentResult, "skills">,
): FocusArea[] {
  const byId = scoreMap(result);
  const areas: FocusArea[] = [];
  for (const rs of role.roleSkills) {
    const score = byId.get(rs.skillId);
    if (!score) continue;
    const target = ROLE_TARGETS[rs.group].minPct;
    const gapPct = Math.max(0, target - score.pct);
    if (gapPct <= 0) continue;
    areas.push({
      skillId: rs.skillId,
      pct: score.pct,
      gapPct,
      severity: gapSeverity(target, score.pct),
    });
  }
  return areas.sort(
    (a, b) => b.gapPct - a.gapPct || targetForSkill(role, b.skillId).importance - targetForSkill(role, a.skillId).importance,
  );
}

export interface LearningPlan {
  weeks: LearningWeek[];
  focusAreas: FocusArea[];
  /** true when the student already meets every role target */
  onTrack: boolean;
}

/**
 * Generate a mock personalized learning plan from the current skill gaps.
 * Weeks are ordered by gap severity; resources/topics come from the KB.
 */
export function buildLearningPlan(
  role: CareerRole,
  result: Pick<AssessmentResult, "skills">,
  maxWeeks = 4,
): LearningPlan {
  const areas = focusAreasFor(role, result);
  if (areas.length === 0) {
    return { weeks: [], focusAreas: [], onTrack: true };
  }

  const weeks: LearningWeek[] = areas.slice(0, maxWeeks).map((area, index) => {
    const kb = LEARNING_CONTENT[area.skillId];
    const skill = getSkill(area.skillId);
    const topics = (kb?.topics ?? []).map((label, topicIndex) => ({
      id: `${area.skillId}:${topicIndex}`,
      label,
    }));
    const target = targetForSkill(role, area.skillId);
    return {
      week: index + 1,
      title: `${skill.name} — close the ${target.label} gap`,
      skillId: area.skillId,
      why:
        kb?.why ??
        `This skill is part of the ${skill.name} requirement for ${role.name}.`,
      outcome:
        kb?.outcome ??
        `Confidence in ${skill.name} at the level ${role.name} needs.`,
      topics,
      resources: kb?.resources ?? [],
    };
  });

  return { weeks, focusAreas: areas, onTrack: false };
}

/** One-line, human reasons used on results/plan screens. */
export function recommendationNotes(
  role: CareerRole,
  result: Pick<AssessmentResult, "skills">,
): string[] {
  return focusAreasFor(role, result)
    .slice(0, 4)
    .map((area) => {
      const skill = getSkill(area.skillId);
      const target = targetForSkill(role, area.skillId);
      return `${skill.name} is at ${area.pct}% (${target.label} needed) — ${area.severity === "high" ? "prioritize this first" : "add focused practice here"}.`;
    });
}
