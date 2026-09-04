import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { Waypoints } from "lucide-react";

/** Gradient glass tile carrying the SkillBridge mark */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[11px]",
        "bg-gradient-to-br from-indigo-500 via-indigo-500 to-sky-400",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_6px_16px_-6px_rgba(79,70,229,0.55)]",
        className,
      )}
      aria-hidden
    >
      <Waypoints className="size-[18px] text-white" strokeWidth={2.4} />
    </span>
  );
}

export function Wordmark({
  subtitle,
  className,
  linkTo,
}: {
  subtitle?: string;
  className?: string;
  linkTo?: string;
}) {
  const content = (
    <span className={cn("flex flex-col leading-none", className)}>
      <span className="text-[17px] font-bold tracking-tight text-slate-900">
        SkillBridge
      </span>
      {subtitle && (
        <span className="mt-0.5 text-[10.5px] font-medium uppercase tracking-[0.16em] text-slate-400">
          {subtitle}
        </span>
      )}
    </span>
  );
  if (linkTo) {
    return (
      <Link to={linkTo} className="flex items-center gap-2.5">
        <LogoMark />
        {content}
      </Link>
    );
  }
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      {content}
    </span>
  );
}
