import type { GapSeverity, LevelKey } from "./types";

/**
 * Product configuration for the MVP assessment.
 *
 * Thresholds, role targets, and disclaimer copy live here so they can be
 * tuned in one place (and later moved to a server/DB) instead of being
 * hardcoded across components.
 */

/** Competency bands (percentage → level). Change here to retune everywhere. */
export const LEVEL_BANDS: ReadonlyArray<{
  key: LevelKey;
  min: number;
  max: number;
}> = [
  { key: "beginner", min: 0, max: 39 },
  { key: "developing", min: 40, max: 59 },
  { key: "proficient", min: 60, max: 79 },
  { key: "strong", min: 80, max: 100 },
];

export const LEVEL_ORDER: LevelKey[] = [
  "beginner",
  "developing",
  "proficient",
  "strong",
];

export function classifyLevel(pct: number): LevelKey {
  const band = LEVEL_BANDS.find((b) => pct >= b.min && pct <= b.max);
  return band?.key ?? (pct < 40 ? "beginner" : "strong");
}

/** Presentation metadata for each band */
export const LEVEL_META: Record<
  LevelKey,
  { label: string; chip: string; bar: string; hex: string; soft: string }
> = {
  beginner: {
    label: "Beginner",
    chip: "bg-rose-500/12 text-rose-600 ring-1 ring-inset ring-rose-500/25",
    bar: "bg-rose-500",
    hex: "#f43f5e",
    soft: "bg-rose-50",
  },
  developing: {
    label: "Developing",
    chip: "bg-amber-500/14 text-amber-700 ring-1 ring-inset ring-amber-500/30",
    bar: "bg-amber-500",
    hex: "#f59e0b",
    soft: "bg-amber-50",
  },
  proficient: {
    label: "Proficient",
    chip: "bg-sky-500/14 text-sky-700 ring-1 ring-inset ring-sky-500/30",
    bar: "bg-sky-500",
    hex: "#0ea5e9",
    soft: "bg-sky-50",
  },
  strong: {
    label: "Strong",
    chip: "bg-emerald-500/14 text-emerald-700 ring-1 ring-inset ring-emerald-500/30",
    bar: "bg-emerald-500",
    hex: "#10b981",
    soft: "bg-emerald-50",
  },
};

/** Target level per skill group inside a role */
export const ROLE_TARGETS: Record<
  "core" | "advanced",
  { label: string; minPct: number }
> = {
  core: { label: "Strong", minPct: 80 },
  advanced: { label: "Proficient", minPct: 60 },
};

/** Classify how far below target a skill is */
export function gapSeverity(targetPct: number, currentPct: number): GapSeverity {
  const diff = targetPct - currentPct;
  if (diff <= 0) return "met";
  if (diff < 25) return "low";
  if (diff < 50) return "medium";
  return "high";
}

export const GAP_META: Record<
  GapSeverity,
  { label: string; chip: string; bar: string; hex: string }
> = {
  met: {
    label: "On target",
    chip: "bg-emerald-500/12 text-emerald-700 ring-1 ring-inset ring-emerald-500/25",
    bar: "bg-emerald-500",
    hex: "#10b981",
  },
  low: {
    label: "Low gap",
    chip: "bg-sky-500/12 text-sky-700 ring-1 ring-inset ring-sky-500/25",
    bar: "bg-sky-500",
    hex: "#0ea5e9",
  },
  medium: {
    label: "Medium gap",
    chip: "bg-amber-500/14 text-amber-700 ring-1 ring-inset ring-amber-500/30",
    bar: "bg-amber-500",
    hex: "#f59e0b",
  },
  high: {
    label: "High gap",
    chip: "bg-rose-500/12 text-rose-600 ring-1 ring-inset ring-rose-500/25",
    bar: "bg-rose-500",
    hex: "#f43f5e",
  },
};

/** A score at or above this counts as a strength for the narrative copy */
export const STRENGTH_MIN_PCT = 60;

/** Assessment length / timing assumptions */
export const ASSESSMENT = {
  /** seconds roughly allowed per question, used only for the estimate label */
  secondsPerQuestion: 42,
  minMinutes: 5,
} as const;

/** Honest framing used across results screens (MVP disclaimer) */
export const MVP_DISCLAIMER =
  "Readiness is an estimate from this prototype assessment, not a guarantee of employability. Results reflect the skills and questions currently included in this MVP.";

/** Descriptive one-liners per question type (legend + skill map usage) */
export const QUESTION_TYPE_LABELS: Record<
  string,
  { short: string; description: string }
> = {
  concept: { short: "Concept", description: "Tests understanding of ideas, not recall." },
  scenario: { short: "Scenario", description: "Realistic situations you would meet on the job." },
  code: { short: "Code", description: "Read and predict small programs." },
  "problem-solving": {
    short: "Problem solving",
    description: "Apply knowledge to a small problem.",
  },
};

export const STORAGE_VERSION = 1;
