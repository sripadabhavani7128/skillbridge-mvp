import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, UserRound } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      setError(
        `Failed to sign in as guest: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="app-bg relative flex min-h-screen flex-col overflow-hidden text-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-[18%] size-[480px] rounded-full bg-sky-300/25 blur-3xl" />
        <div className="absolute bottom-[-140px] left-[10%] size-[440px] rounded-full bg-indigo-300/25 blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <Wordmark subtitle="Assess · Improve" />
        </Link>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="rounded-full text-slate-500 hover:text-slate-800"
        >
          <Link to="/">Back to home</Link>
        </Button>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <div className="glass-panel w-full max-w-[400px] rounded-3xl p-7 sm:p-8">
          {step === "signIn" ? (
            <>
              <div className="mb-6 text-center">
                <div className="mb-4 inline-flex justify-center">
                  <Wordmark />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {redirect.includes("roles") ? "Choose your career goal" : "Welcome to SkillBridge"}
                </h1>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                  {redirect.includes("roles")
                    ? "Sign in to explore the skills each role demands."
                    : "Sign in or continue as a guest to start your skill journey."}
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    name="email"
                    placeholder="name@example.com"
                    type="email"
                    className="h-11 rounded-xl border-white/70 bg-white/70 pl-10 backdrop-blur-sm"
                    disabled={isLoading}
                    required
                  />
                </div>
                {error && <p className="text-sm text-rose-600">{error}</p>}
                <Button
                  type="submit"
                  size="lg"
                  className="h-11 w-full rounded-xl shadow-[0_10px_22px_-10px_rgba(79,70,229,0.8)]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      Continue with email
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                <span className="h-px flex-1 bg-slate-300/60" />
                or
                <span className="h-px flex-1 bg-slate-300/60" />
              </div>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-11 w-full rounded-xl border-white/80 bg-white/70 backdrop-blur-sm hover:bg-white"
                onClick={handleGuestLogin}
                disabled={isLoading}
              >
                <UserRound className="size-4 text-indigo-600" />
                Continue as guest — instant demo
              </Button>
            </>
          ) : (
            <>
              <div className="mb-6 text-center">
                <div className="mb-4 inline-flex justify-center">
                  <Wordmark />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Check your email</h1>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-slate-700">{step.email}</span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <input type="hidden" name="email" value={step.email} />
                <input type="hidden" name="code" value={otp} />

                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                        const form = (e.target as HTMLElement).closest("form");
                        if (form) form.requestSubmit();
                      }
                    }}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="size-11 rounded-lg border-white/70 bg-white/70 backdrop-blur-sm"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {error && <p className="text-center text-sm text-rose-600">{error}</p>}

                <Button
                  type="submit"
                  size="lg"
                  className="h-11 w-full rounded-xl shadow-[0_10px_22px_-10px_rgba(79,70,229,0.8)]"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & continue
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-slate-400">
                  Didn't receive it?{" "}
                  <button
                    type="button"
                    onClick={() => setStep("signIn")}
                    className="font-semibold text-indigo-600 hover:underline"
                  >
                    Try another email
                  </button>
                </p>
              </form>
            </>
          )}

          <p className="mt-6 border-t border-white/70 pt-4 text-center text-[11px] leading-5 text-slate-400">
            Guest mode stores data locally in your browser for the demo.{" "}
            <Link to="/" className="font-medium text-indigo-600 hover:underline">
              Learn more
            </Link>
          </p>
        </div>
      </main>

      <footer className="relative z-10 pb-6 text-center text-xs text-slate-400">
        SkillBridge — Smart India Hackathon prototype
      </footer>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
