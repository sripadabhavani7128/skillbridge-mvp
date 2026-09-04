import { useAuth } from "@/hooks/use-auth";
import { Wordmark } from "@/components/brand";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useStudent, displayName } from "@/state/student";
import {
  Activity,
  ArrowRight,
  BookOpen,
  ChevronDown,
  Home,
  LogOut,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/roles", label: "Career goals", icon: Target },
  { to: "/skill-gap", label: "Skill gap", icon: Activity },
  { to: "/learning-plan", label: "Learning plan", icon: BookOpen },
  { to: "/progress", label: "Progress", icon: TrendingUp },
] as const;

function navClass({ isActive }: { isActive: boolean }) {
  return cn(
    "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all",
    isActive
      ? "bg-white/80 text-indigo-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_-6px_rgba(79,70,229,0.35)] ring-1 ring-indigo-500/10"
      : "text-slate-500 hover:bg-white/60 hover:text-slate-800",
  );
}

function UserMenu({ compact }: { compact?: boolean }) {
  const { user, signOut } = useAuth();
  const { resetData } = useStudent();
  const navigate = useNavigate();
  const name = displayName(user?.name ?? null, user?.email ?? null);
  const fullName = user?.name?.trim() || user?.email || "Student";
  const initials = fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const reset = () => {
    resetData();
  };

  const button = (
    <Button variant="ghost" className="h-9 gap-2 rounded-full px-2 pr-3 hover:bg-white/70">
      <Avatar className="size-7">
        {user?.image ? <AvatarImage src={user.image} alt="" /> : null}
        <AvatarFallback className="bg-indigo-500/15 text-[11px] font-semibold text-indigo-700">
          {initials}
        </AvatarFallback>
      </Avatar>
      {!compact && (
        <>
          <span className="max-w-[120px] truncate text-sm font-medium text-slate-700">
            {name}
          </span>
          <ChevronDown className="size-3.5 text-slate-400" />
        </>
      )}
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{button}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xl border-white/60 bg-white/85 backdrop-blur-xl">
        <DropdownMenuLabel>
          <p className="truncate text-sm font-semibold text-slate-800">{fullName}</p>
          {user?.email && <p className="truncate text-xs font-normal text-slate-400">{user.email}</p>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={reset} className="cursor-pointer">
          <RotateCcw className="size-4 text-slate-400" />
          Reset demo data
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="size-4 text-slate-400" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function GoalCard() {
  const { role, latestResult } = useStudent();
  if (!role) return null;
  const readiness = latestResult?.overallPct;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.09] via-sky-400/[0.06] to-transparent p-3.5">
      <div className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-indigo-600/80">
        <Sparkles className="size-3" />
        Current goal
      </div>
      <p className="mt-1 text-sm font-semibold text-slate-800">{role.name}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        {readiness !== undefined && readiness !== null ? (
          <span className="text-xs text-slate-500">
            Readiness <span className="font-semibold text-slate-800">{readiness}%</span>
          </span>
        ) : (
          <span className="text-xs text-slate-500">Not assessed yet</span>
        )}
        <Button asChild size="sm" className="h-7 gap-1 rounded-lg px-2.5 text-xs">
          <Link to={`/assessment/${role.id}`}>
            {latestResult ? "Retake" : "Assess"}
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function SideNav() {
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map((item) => (
        <NavLink key={item.to} to={item.to} className={navClass}>
          <item.icon className="size-[17px] opacity-70" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AppLayout() {
  const { role } = useStudent();

  return (
    <div className="app-bg min-h-screen text-slate-900">
      {/* ambient light blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 right-[8%] size-[420px] rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-40 left-[4%] size-[460px] rounded-full bg-indigo-300/20 blur-3xl" />
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col gap-3 border-r border-white/50 bg-white/45 p-4 backdrop-blur-2xl lg:flex">
        <div className="flex h-12 items-center px-1">
          <Wordmark linkTo="/dashboard" subtitle="Assess · Improve" />
        </div>
        <div className="mt-1 flex flex-1 flex-col gap-6 overflow-y-auto pb-2 pr-0.5">
          <GoalCard />
          <SideNav />
          <div className="mt-auto">
            <div className="rounded-2xl border border-white/60 bg-white/40 p-3 text-xs leading-5 text-slate-500">
              <span className="font-semibold text-slate-700">How it works:</span>{" "}
              Assess skills → see your gaps → follow a plan → retake to track
              growth.
            </div>
          </div>
        </div>
        <div className="border-t border-white/50 pt-3">
          <UserMenu />
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 border-b border-white/50 bg-white/55 backdrop-blur-2xl lg:hidden">
        <div className="flex h-14 items-center justify-between gap-2 px-4">
          <Wordmark linkTo="/dashboard" />
          <UserMenu compact />
        </div>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-2.5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  isActive
                    ? "bg-indigo-600 text-white shadow-[0_6px_14px_-6px_rgba(79,70,229,0.6)]"
                    : "bg-white/70 text-slate-600 ring-1 ring-white/70",
                )
              }
            >
              <item.icon className="size-3.5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:pl-[20.5rem] lg:pr-8 lg:pt-10">
        <Outlet />
      </main>
    </div>
  );
}
