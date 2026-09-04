/**
 * Core SkillBridge domain types.
 *
 * These types describe the *shapes* the product works with. Today the data
 * comes from deterministic mock modules under `src/data/`; each of those
 * modules is the seam where a real API/backend can be swapped in later
 * without touching UI or logic layers.
 */

export type SkillId = string;
export type RoleId = string;
export type QuestionId = string;

export type QuestionType =
  | "concept"
  | "scenario"
  | "code"
  | "problem-solving";

export type QuestionDifficulty = "basic" | "intermediate" | "advanced";

export type SkillGroup = "core" | "advanced";

/** A skill inside a role's requirements */
export interface RoleSkill {
  skillId: SkillId;
  /** core = expected strong, advanced = role-specific depth */
  group: SkillGroup;
  /** 1 (nice-to-have) → 5 (non-negotiable) weight used by scoring */
  importance: 1 | 2 | 3 | 4 | 5;
  /** why this skill matters for this role */
  note: string;
}

/** A career goal a student can pursue */
export interface CareerRole {
  id: RoleId;
  name: string;
  /** one-line positioning used on cards */
  tagline: string;
  description: string;
  /** small accent hex for card art */
  accent: string;
  roleSkills: RoleSkill[];
}

/** A skill definition in the global catalog */
export interface SkillDef {
  id: SkillId;
  name: string;
  category: string;
  /** one-line description of what the skill covers */
  description: string;
}

/** One multiple-choice assessment question */
export interface Question {
  id: QuestionId;
  skillId: SkillId;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  prompt: string;
  /** optional snippet shown in a code block */
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/** Competency band keys — config in `lib/config.ts` maps these to ranges */
export type LevelKey =
  | "beginner"
  | "developing"
  | "proficient"
  | "strong";

/** How far below the role's target a skill currently sits */
export type GapSeverity = "met" | "low" | "medium" | "high";

/** Per-skill score produced by the assessment engine */
export interface SkillScore {
  skillId: SkillId;
  correct: number;
  total: number;
  /** 0–100 */
  pct: number;
  /** threshold band key */
  level: LevelKey;
}

/** Complete, persisted outcome of one finished assessment */
export interface AssessmentResult {
  attemptId: string;
  roleId: RoleId;
  finishedAt: number;
  /** questionId → selected option index, in case review/replay is added later */
  answers: Record<QuestionId, number>;
  /** per-skill outcomes */
  skills: SkillScore[];
  /** weighted across the role's skills */
  overallPct: number;
  overallLevel: LevelKey;
  answeredCount: number;
}

/** A learning plan topic the student can tick off */
export interface PlanTopic {
  id: string;
  label: string;
}

export interface LearningResource {
  label: string;
  kind: "course" | "docs" | "video" | "practice";
  href?: string;
}

/** One week of the generated learning plan */
export interface LearningWeek {
  week: number;
  title: string;
  skillId: SkillId;
  why: string;
  outcome: string;
  topics: PlanTopic[];
  resources: LearningResource[];
}

/** Focus item surfaced on dashboard + plan */
export interface FocusArea {
  skillId: SkillId;
  pct: number;
  gapPct: number;
  severity: GapSeverity;
}

/** Student state persisted per account */
export interface StudentState {
  version: number;
  /** chosen career goal */
  goalRoleId: RoleId | null;
  /** finished assessments, newest last */
  attempts: AssessmentResult[];
  /** completed learning-plan topic ids */
  completedTopicIds: string[];
}
