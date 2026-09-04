import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { ROLES } from "@/data/roles";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Compass,
  GraduationCap,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const STEPS = [
  {
    n: "01",
    icon: ClipboardList,
    title: "Assess",
    text: "Answer short, scenario-based questions mapped to the exact skills a career role needs.",
  },
  {
    n: "02",
    icon: Activity,
    title: "Identify gaps",
    text: "See per-skill strengths and weaknesses — not one vague percentage.",
  },
  {
    n: "03",
    icon: TrendingUp,
    title: "Improve & track",
    text: "Follow a focused weekly plan, then retake to watch your readiness grow.",
  },
] as const;

const DEMO_SKILLS = [
  { name: "HTML", level: "Strong", pct: 100, chip: "bg-emerald-500/14 text-emerald-700 ring-emerald-500/30", bar: "bg-emerald-500" },
  { name: "CSS", level: "Strong", pct: 100, chip: "bg-emerald-500/14 text-emerald-700 ring-emerald-500/30", bar: "bg-emerald-500" },
  { name: "JavaScript", level: "Developing", pct: 50, chip: "bg-amber-500/14 text-amber-700 ring-amber-500/30", bar: "bg-amber-500" },
  { name: "React", level: "Beginner", pct: 0, chip: "bg-rose-500/12 text-rose-600 ring-rose-500/25", bar: "bg-rose-500" },
] as const;

export default function Landing() {
  const startPath = "/auth?returnTo=%2Fdashboard";
  return (
    <div className="app-bg relative min-h-screen overflow-x-clip text-slate-900">
      {/* ambient wash */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-[10%] size-[560px] rounded-full bg-sky-300/25 blur-3xl" />
        <div className="absolute top-[28%] -left-48 size-[520px] rounded-full bg-indigo-300/25 blur-3xl" />
        <div className="absolute bottom-[-160px] left-[38%] size-[440px] rounded-full bg-teal-200/30 blur-3xl" />
      </div>

      {/* Nav */}
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Wordmark subtitle="Assess · Improve" />
        <nav className="hidden items-center gap-1 sm:flex">
          <a href="#how" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
            How it works
          </a>
          <a href="#roles" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
            Career goals
          </a>
          <Link
            to="/auth?returnTo=%2Fdashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
          >
            Sign in
          </Link>
        </nav>
        <Button asChild size="sm" className="h-9 rounded-full px-4 shadow-[0_8px_20px_-8px_rgba(79,70,229,0.7)]">
          <Link to={startPath}>
            Get started
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-16">
        <motion.div initial="initial" animate="animate" transition={{ staggerChildren: 0.08 }}>
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/55 py-1.5 pl-2 pr-3.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-md"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600/10 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
              <GraduationCap className="size-3.5" /> For students
            </span>
            Certificates show completion. SkillBridge shows capability.
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            Know what you actually know —{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
              then close the gap
            </span>{" "}
            to your dream role.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-5 max-w-xl text-base leading-7 text-slate-500 sm:text-lg"
          >
            Finish a course and get a certificate — but are you ready for the
            job? SkillBridge assesses the skills a role actually requires,
            shows your strengths and gaps per skill, and builds a learning plan
            around what you're missing.
          </motion.p>

          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-11 rounded-full px-6 text-[15px] shadow-[0_12px_28px_-10px_rgba(79,70,229,0.75)]">
              <Link to={startPath}>
                Start your assessment
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 rounded-full border-white/70 bg-white/60 px-6 text-[15px] backdrop-blur-md hover:bg-white/90">
              <a href="#how">
                <Compass className="size-4 text-indigo-600" />
                How it works
              </a>
            </Button>
          </motion.div>

          <motion.ul variants={fadeUp} transition={{ duration: 0.5 }} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            {["~10 minute assessment", "6 career roles", "Free learning resources"].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500" />
                {item}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Product visual */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="dot-grid absolute -inset-6 rounded-[2rem] opacity-70" aria-hidden />
          <div className="glass-panel relative rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-600/80">
                  Frontend Developer · Readiness
                </p>
                <p className="mt-0.5 text-sm font-medium text-slate-700">Skill check summary</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/25">
                <Sparkles className="size-3" /> Plan ready
              </span>
            </div>

            <div className="mt-5 flex items-center gap-5">
              {/* mini ring */}
              <div className="relative grid size-24 shrink-0 place-items-center rounded-full">
                <svg viewBox="0 0 96 96" className="size-24 -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" strokeWidth="10" className="stroke-white/80" />
                  <circle
                    cx="48" cy="48" r="40" fill="none" strokeWidth="10"
                    stroke="#10b981" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - 0.63)}
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-xl font-bold text-slate-900">63%</p>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">ready</p>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {DEMO_SKILLS.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600">{s.name}</span>
                      <span className={`rounded-full px-1.5 py-px text-[10px] font-semibold ring-1 ring-inset ${s.chip}`}>
                        {s.level}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-900/[0.05] ring-1 ring-inset ring-white/60">
                      <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.07] px-3 py-2.5 text-xs text-slate-600">
              <Activity className="size-4 shrink-0 text-amber-600" />
              Focus next: <span className="font-semibold text-slate-800">JavaScript & React</span> — 4-week plan generated
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600/80">How SkillBridge works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Assess → Identify gaps → Improve
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500">
            A student journey that answers three questions: what do I know, what am I
            missing, and what should I learn next?
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="glass-panel raise-hover group relative overflow-hidden rounded-2xl p-5"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-indigo-600/10 text-indigo-600 ring-1 ring-inset ring-indigo-500/20 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <step.icon className="size-5" />
                </span>
                <span className="text-3xl font-bold text-slate-200/90 transition-colors group-hover:text-indigo-200">
                  {step.n}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-500">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roles strip */}
      <section id="roles" className="relative z-10 mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="glass-panel relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10">
          <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-sky-300/20 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600/80">
                <BarChart3 className="size-4" /> Role-oriented skill maps
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Pick the role you're aiming for
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Every role comes with a skill map, a tailored assessment, and a
                plan built from the gaps it finds. Pick a direction to see what's
                required — no sign-up needed to look around.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {ROLES.map((role) => (
                  <Link
                    key={role.id}
                    to={`/auth?returnTo=${encodeURIComponent("/roles")}`}
                    className="rounded-full border border-white/80 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:text-indigo-700 hover:shadow-md"
                  >
                    {role.name}
                  </Link>
                ))}
              </div>
            </div>
            <Button asChild size="lg" className="h-12 rounded-full px-7 text-[15px] shadow-[0_12px_28px_-10px_rgba(79,70,229,0.75)]">
              <Link to="/auth?returnTo=%2Froles">
                Explore goals
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-3xl border border-indigo-500/15 bg-gradient-to-br from-indigo-600/[0.12] via-white/70 to-sky-400/[0.1] p-8 text-center backdrop-blur-xl sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Stop guessing what to learn next.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Your first assessment takes about ten minutes and ends with a clear
            answer: what you're good at, what's missing, and exactly what to study.
          </p>
          <Button asChild size="lg" className="mt-7 h-12 rounded-full px-8 text-[15px] shadow-[0_12px_28px_-10px_rgba(79,70,229,0.75)]">
            <Link to={startPath}>
              Get started — it's free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/60 bg-white/40 py-8 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <Wordmark />
          <p className="text-xs text-slate-400">
            SkillBridge MVP — a prototype demonstrating skill assessment, gap
            analysis and learning plans. Not a guarantee of employability.
          </p>
        </div>
      </footer>
    </div>
  );
}
