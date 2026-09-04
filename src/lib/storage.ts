import { getRole } from "@/data/roles";
import { outcomeFromSkillPcts } from "./scoring";
import { STORAGE_VERSION } from "./config";
import type { AssessmentResult, StudentState } from "./types";

/**
 * Persistence adapter (MVP: localStorage per signed-in user).
 *
 * Everything the UI reads goes through `StudentState`; swapping this module
 * for Convex/API calls later leaves the rest of the app untouched.
 *
 * First-run accounts are seeded with realistic demo data so the dashboard,
 * gap analysis and progress story can be demonstrated immediately.
 */

const PREFIX = "skillbridge:v1:";

export function storageKeyForUser(userId: string): string {
  return `${PREFIX}${userId}`;
}

export function emptyState(): StudentState {
  return { version: STORAGE_VERSION, goalRoleId: null, attempts: [], completedTopicIds: [] };
}

export function newAttemptId(): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `att_${Date.now().toString(36)}_${rand}`;
}

function daysAgo(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

/**
 * Demo seed for the hackathon story:
 *  goal = Frontend Developer, latest readiness ≈ 63% with HTML/CSS/Git
 *  strong while JavaScript/React/State are the clear gaps — mirroring the
 *  product's example narrative. Older attempt lets Progress show deltas.
 */
function demoState(): StudentState {
  const role = getRole("frontend-developer");
  if (!role) return emptyState();

  const older = outcomeFromSkillPcts(role, {
    html: 100,
    css: 100,
    javascript: 0,
    git: 50,
    "responsive-design": 100,
    react: 0,
    "rest-api": 0,
    "state-management": 0,
  });

  const recent = outcomeFromSkillPcts(role, {
    html: 100,
    css: 100,
    javascript: 50,
    git: 100,
    "responsive-design": 100,
    react: 0,
    "rest-api": 50,
    "state-management": 0,
  });

  const toAttempt = (outcome: ReturnType<typeof outcomeFromSkillPcts>, id: string, finishedAt: number): AssessmentResult => ({
    attemptId: id,
    roleId: outcome.roleId,
    finishedAt,
    answers: outcome.answers,
    skills: outcome.skills,
    overallPct: outcome.overallPct,
    overallLevel: outcome.overallLevel,
    answeredCount: outcome.answeredCount,
  });

  return {
    version: STORAGE_VERSION,
    goalRoleId: "frontend-developer",
    attempts: [
      toAttempt(older, "seed_1", daysAgo(16)),
      toAttempt(recent, "seed_2", daysAgo(2)),
    ],
    completedTopicIds: [],
  };
}

export interface LoadedState {
  state: StudentState;
  /** true when nothing was stored and demo data was freshly seeded */
  seeded: boolean;
}

export function loadForUser(userId: string): LoadedState {
  try {
    const raw = localStorage.getItem(storageKeyForUser(userId));
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StudentState>;
      if (
        parsed &&
        parsed.version === STORAGE_VERSION &&
        Array.isArray(parsed.attempts) &&
        Array.isArray(parsed.completedTopicIds)
      ) {
        return { state: parsed as StudentState, seeded: false };
      }
    }
  } catch {
    // corrupt store → fall through to fresh seed
  }
  const state = demoState();
  return { state, seeded: true };
}

export function saveForUser(userId: string, state: StudentState): void {
  try {
    localStorage.setItem(storageKeyForUser(userId), JSON.stringify(state));
  } catch {
    // storage unavailable (private mode / quota) — app keeps working in memory
  }
}

export function resetForUser(userId: string): void {
  try {
    localStorage.removeItem(storageKeyForUser(userId));
  } catch {
    // ignore
  }
}
