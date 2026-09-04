import { useAuth } from "@/hooks/use-auth";
import { getRole } from "@/data/roles";
import { computeOutcome } from "@/lib/scoring";
import {
  emptyState,
  loadForUser,
  newAttemptId,
  saveForUser,
  type LoadedState,
} from "@/lib/storage";
import type {
  AssessmentResult,
  CareerRole,
  QuestionId,
  RoleId,
  StudentState,
} from "@/lib/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Student state provider.
 *
 * Owns the per-user SkillBridge state (goal, assessment attempts, plan
 * progress) and persists it through `lib/storage.ts`. All pages read
 * derived data from `useStudent()` — no page mutates storage directly.
 */

interface StudentContextValue {
  /** stable id of the signed-in user (storage namespace) */
  userId: string | null;
  /** true once stored state has hydrated for the current user */
  ready: boolean;
  state: StudentState;
  /** true when nothing was stored and the demo seed was created */
  seededDemo: boolean;
  /** the chosen career goal, if any */
  role: CareerRole | null;
  /** finished attempts for the current goal, oldest → newest */
  attemptsForGoal: AssessmentResult[];
  /** latest finished attempt for the current goal */
  latestResult: AssessmentResult | null;
  /** latest attempt across any role (used right after an assessment) */
  mostRecentResult: AssessmentResult | null;
  setGoal: (roleId: RoleId) => void;
  /** score + persist an assessment for a role (also sets it as the goal) */
  recordAttempt: (
    role: CareerRole,
    answers: Record<QuestionId, number>,
  ) => AssessmentResult;
  toggleTopic: (topicId: string) => void;
  /** wipe stored data and start fresh (no demo seed) */
  resetData: () => void;
}

const StudentContext = createContext<StudentContextValue | null>(null);

interface Hydrated {
  userId: string;
  loaded: LoadedState;
}

export function StudentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?._id ?? null;

  // Hydration is keyed to the exact user id so a fast account switch can
  // never write one user's state into another user's storage slot.
  const [hydrated, setHydrated] = useState<Hydrated | null>(null);

  useEffect(() => {
    if (!userId) {
      setHydrated(null);
      return;
    }
    const loaded = loadForUser(userId);
    setHydrated({ userId, loaded });
  }, [userId]);

  const current = hydrated && hydrated.userId === userId ? hydrated.loaded : null;
  const state: StudentState = current?.state ?? emptyState();

  // Persist whenever the hydrated state changes (and only for the matching user).
  useEffect(() => {
    if (!userId || !current) return;
    saveForUser(userId, current.state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, current]);

  const setGoal = useCallback((roleId: RoleId) => {
    setHydrated((h) => {
      if (!h) return h;
      return {
        ...h,
        loaded: { ...h.loaded, state: { ...h.loaded.state, goalRoleId: roleId } },
      };
    });
  }, []);

  const recordAttempt = useCallback(
    (role: CareerRole, answers: Record<QuestionId, number>) => {
      const outcome = computeOutcome(role, answers);
      const attempt: AssessmentResult = {
        ...outcome,
        attemptId: newAttemptId(),
        finishedAt: Date.now(),
      };
      setHydrated((h) => {
        if (!h) return h;
        const attempts = [...h.loaded.state.attempts, attempt].slice(-30);
        return {
          ...h,
          loaded: {
            ...h.loaded,
            state: {
              ...h.loaded.state,
              goalRoleId: role.id as RoleId,
              attempts,
            },
          },
        };
      });
      return attempt;
    },
    [],
  );

  const toggleTopic = useCallback((topicId: string) => {
    setHydrated((h) => {
      if (!h) return h;
      const has = h.loaded.state.completedTopicIds.includes(topicId);
      return {
        ...h,
        loaded: {
          ...h.loaded,
          state: {
            ...h.loaded.state,
            completedTopicIds: has
              ? h.loaded.state.completedTopicIds.filter((id) => id !== topicId)
              : [...h.loaded.state.completedTopicIds, topicId],
          },
        },
      };
    });
  }, []);

  const resetData = useCallback(() => {
    const fresh = emptyState();
    if (userId) saveForUser(userId, fresh);
    setHydrated((h) =>
      h
        ? { ...h, loaded: { state: fresh, seeded: false } }
        : h,
    );
  }, [userId]);

  const value = useMemo<StudentContextValue>(() => {
    const goalRoleId = state.goalRoleId;
    const role = getRole(goalRoleId) ?? null;
    const attemptsForGoal = role
      ? state.attempts
          .filter((attempt) => attempt.roleId === role.id)
          .sort((a, b) => a.finishedAt - b.finishedAt)
      : [];
    const latestResult =
      attemptsForGoal.length > 0 ? attemptsForGoal[attemptsForGoal.length - 1] : null;
    const sortedAll = [...state.attempts].sort((a, b) => a.finishedAt - b.finishedAt);
    const mostRecentResult = sortedAll.length > 0 ? sortedAll[sortedAll.length - 1] : null;

    return {
      userId,
      ready: userId === null || current !== null,
      state,
      seededDemo: current?.seeded ?? false,
      role,
      attemptsForGoal,
      latestResult,
      mostRecentResult,
      setGoal,
      recordAttempt,
      toggleTopic,
      resetData,
    };
  }, [
    userId,
    state,
    current,
    setGoal,
    recordAttempt,
    toggleTopic,
    resetData,
  ]);

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent(): StudentContextValue {
  const ctx = useContext(StudentContext);
  if (!ctx) {
    throw new Error("useStudent must be used inside <StudentProvider>");
  }
  return ctx;
}

/** First name / initial fallbacks for display. */
export function displayName(userName?: string | null, email?: string | null): string {
  if (userName && userName.trim()) return userName.trim().split(" ")[0];
  if (email) {
    const prefix = email.split("@")[0] ?? "";
    if (prefix) return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }
  return "Student";
}
