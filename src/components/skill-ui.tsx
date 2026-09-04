import { classifyLevel, LEVEL_META } from "@/lib/config";
import type { LevelKey } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Small pill showing a competency level (Strong/Proficient/…) */
export function LevelChip({
  level,
  className,
}: {
  level: LevelKey | null;
  className?: string;
}) {
  if (!level) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full bg-slate-400/10 px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-inset ring-slate-400/20",
          className,
        )}
      >
        Not assessed
      </span>
    );
  }
  const meta = LEVEL_META[level];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
        meta.chip,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}

/** Thin horizontal bar colored by level, with optional % label */
export function CompetencyBar({
  pct,
  level,
  className,
  trackClassName,
  delayMs = 0,
}: {
  pct: number;
  level?: LevelKey | null;
  className?: string;
  trackClassName?: string;
  delayMs?: number;
}) {
  const meta = level ? LEVEL_META[level] : null;
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-900/[0.06] ring-1 ring-inset ring-white/60", trackClassName)}>
      <div
        className={cn("h-full rounded-full", meta ? meta.bar : "bg-indigo-500")}
        style={{
          width: `${Math.min(100, Math.max(0, pct))}%`,
          transition: `width 0.7s cubic-bezier(0.22,1,0.36,1) ${delayMs}ms`,
        }}
      />
    </div>
  );
}

/** Circular readiness gauge */
export function ReadinessRing({
  pct,
  size = 156,
  stroke = 13,
  center,
  className,
}: {
  pct: number;
  size?: number;
  stroke?: number;
  center?: ReactNode;
  className?: string;
}) {
  const level = classifyLevel(pct);
  const hex = LEVEL_META[level].hex;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(100, Math.max(0, pct));

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${pct}% readiness`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-white/70"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          stroke={hex}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * clamped) / 100}
          style={{
            filter: `drop-shadow(0 2px 6px ${hex}44)`,
            transition: "stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {center ?? (
          <>
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {Math.round(pct)}
              <span className="text-base font-semibold text-slate-400">%</span>
            </span>
            <span className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
              readiness
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/** Consistent page heading used inside the app shell */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600/80">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.7rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Frosted glass card container used across the product */
export function Panel({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("glass-panel rounded-2xl", className)} {...rest}>
      {children}
    </div>
  );
}
