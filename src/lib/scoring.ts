import { questionsForRole } from "@/data/questions";
import type {
  AssessmentResult,
  CareerRole,
  QuestionId,
  RoleId,
  SkillId,
  SkillScore,
} from "./types";
import { classifyLevel, STRENGTH_MIN_PCT } from "./config";

/**
 * Assessment engine (pure functions, no I/O).
 *
 * Scoring model — deliberately NOT a single overall percentage:
 *  1. each question is tagged with the skill it measures;
 *  2. correctness is aggregated per skill → skill percentage;
 *  3. the skill percentage is classified into a competency band
 *     (thresholds live in `lib/config.ts`);
 *  4. overall readiness is the importance-weighted average of the skill
 *     percentages across the role's skill map.
 *
 * Replace this module with a server-side assessment engine later; the
 * contracts in `lib/types.ts` stay the same.
 */

/** Partial scoring outcome before attempt metadata is attached. */
export type AssessmentOutcome = Omit<AssessmentResult, "attemptId" | "finishedAt">;

function totalQuestionsForRole(role: CareerRole) {
  return questionsForRole(role);
}

/** Compute the full skill-level outcome from submitted answers. */
export function computeOutcome(
  role: CareerRole,
  answers: Record<QuestionId, number>,
): AssessmentOutcome {
  const questions = totalQuestionsForRole(role);
  const bySkill = new Map<SkillId, { correct: number; total: number }>();

  for (const question of questions) {
    const bucket = bySkill.get(question.skillId) ?? { correct: 0, total: 0 };
    bucket.total += 1;
    const selected = answers[question.id];
    if (typeof selected === "number" && selected === question.correctIndex) {
      bucket.correct += 1;
    }
    bySkill.set(question.skillId, bucket);
  }

  const skills: SkillScore[] = [];
  for (const rs of role.roleSkills) {
    const bucket = bySkill.get(rs.skillId);
    if (!bucket || bucket.total === 0) continue;
    const pct = Math.round((bucket.correct / bucket.total) * 100);
    skills.push({
      skillId: rs.skillId,
      correct: bucket.correct,
      total: bucket.total,
      pct,
      level: classifyLevel(pct),
    });
  }

  // Importance-weighted readiness across the role's skill map.
  let weighted = 0;
  let weightSum = 0;
  for (const skill of skills) {
    const importance = role.roleSkills.find((rs) => rs.skillId === skill.skillId)?.importance ?? 3;
    weighted += skill.pct * importance;
    weightSum += importance;
  }
  const overallPct = weightSum > 0 ? Math.round(weighted / weightSum) : 0;
  const answeredCount = questions.reduce(
    (sum, question) => (typeof answers[question.id] === "number" ? sum + 1 : sum),
    0,
  );

  return {
    roleId: role.id as RoleId,
    answers,
    skills,
    overallPct,
    overallLevel: classifyLevel(overallPct),
    answeredCount,
  };
}

/** Build a consistent result when only per-skill percentages are known (demo seeds). */
export function outcomeFromSkillPcts(
  role: CareerRole,
  pctBySkill: Record<SkillId, number>,
): AssessmentOutcome {
  const skills: SkillScore[] = role.roleSkills
    .map((rs) => {
      const pct = pctBySkill[rs.skillId];
      if (typeof pct !== "number") return null;
      const questionCount = totalQuestionsForRole(role).filter(
        (q) => q.skillId === rs.skillId,
      ).length;
      const total = Math.max(questionCount, 1);
      return {
        skillId: rs.skillId,
        correct: Math.round((total * pct) / 100),
        total,
        pct,
        level: classifyLevel(pct),
      };
    })
    .filter((s): s is SkillScore => s !== null);

  let weighted = 0;
  let weightSum = 0;
  for (const skill of skills) {
    const importance = role.roleSkills.find((rs) => rs.skillId === skill.skillId)?.importance ?? 3;
    weighted += skill.pct * importance;
    weightSum += importance;
  }
  const overallPct = weightSum > 0 ? Math.round(weighted / weightSum) : 0;
  const answeredCount = skills.reduce((sum, s) => sum + s.total, 0);

  return {
    roleId: role.id as RoleId,
    answers: {},
    skills,
    overallPct,
    overallLevel: classifyLevel(overallPct),
    answeredCount,
  };
}

/** Convenience map of skillId → score. */
export function scoreMap(result: Pick<AssessmentResult, "skills">): Map<SkillId, SkillScore> {
  return new Map(result.skills.map((s) => [s.skillId, s]));
}

/** Split scores into strengths vs. needs-improvement for narrative + cards. */
export function splitStrengths(skills: SkillScore[], minPct = STRENGTH_MIN_PCT) {
  const strengths = skills
    .filter((s) => s.pct >= minPct)
    .sort((a, b) => b.pct - a.pct);
  const improvements = skills
    .filter((s) => s.pct < minPct)
    .sort((a, b) => a.pct - b.pct);
  return { strengths, improvements };
}

/** Gap between a target band and a current band (in levels). */
export function levelGap(targetLevel: string, currentLevel: string): number {
  const order: Record<string, number> = {
    beginner: 0,
    developing: 1,
    proficient: 2,
    strong: 3,
  };
  return Math.max(0, (order[targetLevel] ?? 0) - (order[currentLevel] ?? 0));
}

/** Per-skill before/after deltas between two results (older → newer). */
export function skillDeltas(
  older: Pick<AssessmentResult, "skills">,
  newer: Pick<AssessmentResult, "skills">,
) {
  const before = scoreMap(older);
  const after = scoreMap(newer);
  const deltas = newer.skills.map((skill) => {
    const oldScore = before.get(skill.skillId);
    const beforePct = oldScore?.pct ?? 0;
    return {
      skillId: skill.skillId,
      beforePct,
      afterPct: skill.pct,
      delta: skill.pct - beforePct,
      beforeLevel: oldScore?.level ?? ("beginner" as const),
      afterLevel: skill.level,
    };
  });
  return deltas.sort((a, b) => b.delta - a.delta);
}

/** Which skills visibly improved between two attempts. */
export function improvedSkills(
  older: Pick<AssessmentResult, "skills">,
  newer: Pick<AssessmentResult, "skills">,
) {
  return skillDeltas(older, newer).filter((d) => d.delta > 0);
}
