import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { questionsForRole } from "@/data/questions";
import { getRole } from "@/data/roles";
import { getSkill } from "@/data/skills";
import { QUESTION_TYPE_LABELS } from "@/lib/config";
import { useStudent } from "@/state/student";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Flag,
  Loader2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const DIFFICULTY_LABEL: Record<string, string> = {
  basic: "Fundamentals",
  intermediate: "Applied",
  advanced: "Advanced",
};

const DIFFICULTY_CHIP: Record<string, string> = {
  basic: "bg-sky-500/10 text-sky-700 ring-sky-500/25",
  intermediate: "bg-indigo-500/10 text-indigo-700 ring-indigo-500/25",
  advanced: "bg-violet-500/10 text-violet-700 ring-violet-500/25",
};

function draftKey(roleId: string) {
  return `skillbridge:draft:${roleId}`;
}

export default function AssessmentPage() {
  const { roleId = "" } = useParams();
  const navigate = useNavigate();
  const { recordAttempt } = useStudent();

  const role = getRole(roleId);
  const questions = useMemo(() => (role ? questionsForRole(role) : []), [role]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [restored, setRestored] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Restore an in-progress draft from session storage (survives refresh).
  useEffect(() => {
    if (!role) return;
    try {
      const raw = sessionStorage.getItem(draftKey(role.id));
      if (raw) {
        const parsed = JSON.parse(raw) as { answers?: Record<string, number>; index?: number };
        if (parsed.answers) {
          setAnswers(parsed.answers);
          if (typeof parsed.index === "number" && parsed.index < questions.length) {
            setIndex(parsed.index);
          }
        }
      }
    } catch {
      // ignore corrupt drafts
    }
    setRestored(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role?.id]);

  // Persist draft as the student works.
  useEffect(() => {
    if (!role || !restored) return;
    try {
      sessionStorage.setItem(draftKey(role.id), JSON.stringify({ answers, index }));
    } catch {
      // ignore quota issues
    }
  }, [answers, index, role, restored]);

  const total = questions.length;
  const question = questions[index];
  const answeredCount = useMemo(
    () => Object.values(answers).filter((v) => typeof v === "number").length,
    [answers],
  );
  const selected = question ? answers[question.id] : undefined;
  const isLast = index === total - 1;
  const allAnswered = total > 0 && answeredCount === total;

  const select = useCallback(
    (optionIndex: number) => {
      if (!question) return;
      setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
    },
    [question],
  );

  const next = useCallback(() => {
    if (question && answers[question.id] === undefined) return;
    if (isLast) {
      void finish();
    } else {
      setIndex((i) => Math.min(total - 1, i + 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, answers, isLast, total]);

  const finish = useCallback(() => {
    if (!role || submitting) return;
    setSubmitting(true);
    // allow the spinner to paint before navigating
    window.setTimeout(() => {
      const attempt = recordAttempt(role, answers);
      try {
        sessionStorage.removeItem(draftKey(role.id));
      } catch {
        // ignore
      }
      navigate(`/results/${attempt.attemptId}`, { replace: true });
    }, 60);
  }, [role, answers, recordAttempt, submitting, navigate]);

  const exit = () => {
    const hasProgress = answeredCount > 0;
    if (hasProgress) {
      const ok = window.confirm(
        "Leave the assessment? Your answers are saved as a draft and you can resume next time.",
      );
      if (!ok) return;
    }
    navigate(role ? `/roles/${role.id}` : "/roles");
  };

  // ── invalid role / empty bank ──────────────────────────────────────────
  if (!role || total === 0) {
    return (
      <div className="app-bg flex min-h-screen items-center justify-center px-4">
        <div className="glass-panel max-w-md rounded-3xl p-8 text-center">
          <h1 className="text-lg font-bold text-slate-900">No assessment available</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            We couldn't find an assessment for that role in the prototype catalog.
          </p>
          <Button asChild className="mt-5 rounded-full">
            <Link to="/roles">Browse career goals</Link>
          </Button>
        </div>
      </div>
    );
  }

  const skill = getSkill(question.skillId);
  const typeMeta = QUESTION_TYPE_LABELS[question.type] ?? { short: question.type };

  return (
    <div className="app-bg flex min-h-screen flex-col text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/50 bg-white/55 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between gap-3 px-4">
          <button
            onClick={exit}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-white/70 hover:text-slate-800"
          >
            <X className="size-4" /> Exit
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <Wordmark />
          </div>
          <div className="text-right text-xs text-slate-500">
            <p className="font-semibold text-slate-700">
              {Math.min(index + 1, total)} / {total}
            </p>
            <p className="text-[11px] text-slate-400">
              {answeredCount} answered
            </p>
          </div>
        </div>
        {/* progress */}
        <div className="mx-auto h-1 w-full max-w-4xl overflow-hidden rounded-full bg-slate-900/[0.05]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-300"
            style={{ width: `${total ? (answeredCount / total) * 100 : 0}%` }}
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:py-10">
        {/* Question meta chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-500/20">
            <Flag className="size-3.5" />
            {skill.name}
          </span>
          <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset", DIFFICULTY_CHIP[question.difficulty])}>
            {DIFFICULTY_LABEL[question.difficulty]}
          </span>
          <span className="rounded-full bg-white/60 px-2.5 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-inset ring-white/80">
            {typeMeta.short}
          </span>
        </div>

        <div key={question.id} className="mt-6 flex flex-1 flex-col">
          <h1 className="text-xl font-bold leading-8 tracking-tight text-slate-900 sm:text-2xl sm:leading-9">
            {question.prompt}
          </h1>

          {question.code && (
            <pre className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/95 p-4 font-mono text-[13px] leading-6 text-sky-100 shadow-[0_14px_30px_-16px_rgba(2,6,23,0.6)]">
              {question.code}
            </pre>
          )}

          {/* Options */}
          <div className="mt-6 grid gap-2.5" role="radiogroup" aria-label="Answers">
            {question.options.map((option, optionIndex) => {
              const isSelected = selected === optionIndex;
              return (
                <button
                  key={optionIndex}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => select(optionIndex)}
                  className={cn(
                    "group flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm leading-6 transition-all",
                    isSelected
                      ? "border-indigo-500/60 bg-indigo-500/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                      : "border-white/80 bg-white/60 hover:-translate-y-px hover:border-indigo-300/70 hover:bg-white/90 hover:shadow-sm",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border text-[11px] font-bold transition-colors",
                      isSelected
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 bg-white/80 text-slate-500 group-hover:border-indigo-400 group-hover:text-indigo-600",
                    )}
                  >
                    {isSelected ? <CheckCircle2 className="size-3.5" /> : String.fromCharCode(65 + optionIndex)}
                  </span>
                  <span className={cn("min-w-0 flex-1", isSelected ? "font-medium text-indigo-950" : "text-slate-700")}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer nav */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/60 pt-5">
          <Button
            variant="outline"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="rounded-full border-white/80 bg-white/60"
          >
            <ChevronLeft className="size-4" /> Previous
          </Button>

          <div className="hidden items-center gap-1 sm:flex" aria-hidden>
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setIndex(i)}
                className={cn(
                  "size-2 rounded-full transition-all",
                  i === index
                    ? "scale-125 bg-indigo-600"
                    : answers[q.id] !== undefined
                      ? "bg-indigo-300"
                      : "bg-slate-300/70",
                )}
                aria-label={`Go to question ${i + 1}`}
              />
            ))}
          </div>

          {isLast && !allAnswered ? (
            <span className="text-xs text-amber-600">
              {total - answeredCount} question{total - answeredCount > 1 ? "s" : ""} unanswered
            </span>
          ) : null}

          <Button
            onClick={next}
            disabled={!isLast && selected === undefined}
            className="rounded-full px-5 shadow-[0_10px_22px_-10px_rgba(79,70,229,0.85)]"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Scoring...
              </>
            ) : isLast ? (
              <>
                Finish & see results <ArrowRight className="size-4" />
              </>
            ) : (
              <>
                Next question <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-400">
          <ArrowLeft className="size-3.5" />
          {index > 0 ? "Use Previous to review and change answers." : "Select an answer to continue."}
          {restored && answeredCount > 0 && (
            <span className="ml-auto rounded-full bg-white/60 px-2 py-0.5 ring-1 ring-inset ring-white/80">
              Resumed from draft · {answeredCount} saved
            </span>
          )}
        </div>
      </main>
    </div>
  );
}
