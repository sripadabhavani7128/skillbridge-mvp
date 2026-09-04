import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

/** Friendly glass banner for the "no goal yet / no assessment yet" cases */
export function ActionBanner({
  icon: Icon,
  title,
  description,
  to,
  cta,
  secondary,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  to: string;
  cta: string;
  secondary?: { to: string; label: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-panel relative overflow-hidden rounded-3xl p-7 sm:p-9",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute -right-20 -top-20 size-64 rounded-full bg-indigo-300/20 blur-3xl"
      />
      <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-indigo-600/10 p-3.5 text-indigo-600 ring-1 ring-inset ring-indigo-500/20">
          <Icon className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">{title}</h2>
          <div className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
            {description}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {secondary && (
            <Button asChild variant="outline" className="rounded-full border-white/70 bg-white/60">
              <Link to={secondary.to}>{secondary.label}</Link>
            </Button>
          )}
          <Button asChild className="rounded-full shadow-[0_10px_22px_-10px_rgba(79,70,229,0.8)]">
            <Link to={to}>
              {cta}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
