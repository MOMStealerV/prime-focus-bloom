import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { GlassCard } from "@/components/primeflow/GlassCard";
import { setOnboarding } from "@/lib/auth";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/welcome")({
  ssr: false,
  head: pageHead(
    "Welcome to PrimeFlow",
    "Start focusing with PrimeFlow — create an account to sync across devices, or continue as a guest.",
  ),
  component: Welcome,
});

const HIGHLIGHTS = [
  ["Focus that sticks", "Pomodoro sessions that survive refreshes and app switches"],
  ["Study that adds up", "Subjects, planner, notes and assignments in one hub"],
  ["Insight you trust", "Flow Score, streaks and honest distraction tracking"],
];

function Welcome() {
  const navigate = useNavigate();
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col justify-center px-5 py-10">
      <div className="animate-rise text-center">
        <div className="accent-gradient mx-auto grid size-16 place-items-center rounded-3xl">
          <Sparkles className="size-7 text-primary-foreground" />
        </div>
        <h1 className="font-display mt-5 text-[30px] leading-tight font-semibold">PrimeFlow</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your calm, AI-ready focus and study companion.
        </p>
      </div>

      <div className="mt-7 space-y-3">
        {HIGHLIGHTS.map(([title, detail], i) => (
          <GlassCard key={title} delay={60 + i * 60}>
            <div className="text-sm font-medium">{title}</div>
            <div className="text-[11px] text-muted-foreground">{detail}</div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <Link
          to="/auth"
          search={{ next: "/" }}
          onClick={() => setOnboarding("account")}
          className="accent-gradient font-display block rounded-3xl py-4 text-center text-sm font-semibold text-primary-foreground transition-transform duration-300 active:scale-[0.98]"
        >
          Create an account
        </Link>
        <button
          onClick={() => {
            setOnboarding("guest");
            void navigate({ to: "/" });
          }}
          className="glass w-full rounded-3xl py-4 text-center text-sm font-medium transition-transform duration-300 active:scale-[0.98]"
        >
          Continue as guest
        </button>
        <p className="text-center text-[11px] text-muted-foreground">
          Guest mode keeps everything on this device. You can create an account later without losing
          data.
        </p>
      </div>
    </main>
  );
}
