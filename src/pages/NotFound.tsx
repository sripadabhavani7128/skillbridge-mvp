import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Compass, Home } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="app-bg relative flex min-h-screen flex-col overflow-hidden text-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-[20%] size-[420px] rounded-full bg-sky-300/25 blur-3xl" />
        <div className="absolute -bottom-36 left-[10%] size-[420px] rounded-full bg-indigo-300/25 blur-3xl" />
      </div>

      <header className="relative z-10 px-5 py-6 sm:px-8">
        <Link to="/" className="inline-flex transition-opacity hover:opacity-80">
          <Wordmark subtitle="Assess · Improve" />
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16">
        <div className="glass-panel w-full max-w-md rounded-3xl p-10 text-center">
          <div className="dot-grid mx-auto grid size-24 place-items-center rounded-2xl">
            <span className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-400 text-2xl font-bold text-white shadow-[0_14px_28px_-10px_rgba(79,70,229,0.7)]">
              404
            </span>
          </div>
          <h1 className="mt-6 text-xl font-bold tracking-tight text-slate-900">
            This page isn't on the map
          </h1>
          <p className="mt-2 flex items-start justify-center gap-1.5 text-sm leading-6 text-slate-500">
            <Compass className="mt-1 size-4 shrink-0 text-indigo-500" />
            The route you followed doesn't exist — but your skill journey is still
            going.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild className="rounded-full shadow-[0_10px_22px_-10px_rgba(79,70,229,0.8)]">
              <Link to="/dashboard">
                <Home className="size-4" /> Go to dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/80 bg-white/60">
              <Link to="/">Back home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
