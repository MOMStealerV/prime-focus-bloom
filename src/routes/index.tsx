import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Flame, Palette, Shield, Sparkles, Timer } from "lucide-react";

import { GlassCard } from "@/components/primeflow/GlassCard";
import { ProgressRing } from "@/components/primeflow/ProgressRing";
import { AnimatedBar } from "@/components/primeflow/AnimatedBar";
import { Screen } from "@/components/primeflow/Screen";
import { ProfileMenu } from "@/components/primeflow/ProfileMenu";
import { HABIT_PROGRESS, QUICK_STATS, SCHEDULE } from "@/data/mock";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PrimeFlow — Today's flow dashboard" },
      {
        name: "description",
        content:
          "Your daily focus dashboard: flow score, focus hours, distractions avoided, schedule and AI insights.",
      },
      { property: "og:title", content: "PrimeFlow — Today's flow dashboard" },
      {
        property: "og:description",
        content: "Flow score, focus hours, distractions avoided and AI insights for your day.",
      },
    ],
  }),
  component: Home,
});

const STAT_ICONS = { timer: Timer, shield: Shield, flame: Flame, check: CheckCircle2 };

function Home() {
  const { cycleTheme, meta } = useTheme();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Screen>
      <header className="animate-rise mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-[26px] leading-tight font-semibold">
            Good evening, Nir
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cycleTheme}
            aria-label={`Switch theme, current ${meta.name}`}
            className="glass grid size-11 place-items-center rounded-2xl transition-transform duration-300 active:scale-95"
          >
            <Palette className="size-[18px] text-primary" />
          </button>
          <ProfileMenu />
        </div>
      </header>

      <GlassCard className="relative overflow-hidden p-6" delay={60}>
        <div
          className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full blur-3xl"
          style={{ background: "var(--backdrop-1)" }}
        />
        <div className="relative flex flex-col items-center">
          <ProgressRing value={82} label="82" caption="Flow score" />
          <p className="mt-5 text-center text-sm leading-relaxed text-muted-foreground">
            You're in your sharpest window. One clean 45-minute block puts today in your top 10%.
          </p>
          <button className="accent-gradient mt-5 w-full rounded-2xl py-3.5 font-display text-sm font-semibold text-primary-foreground shadow-[0_16px_40px_-16px_var(--primary)] transition-transform duration-300 active:scale-[0.98]">
            Start Focus Session
          </button>
        </div>
      </GlassCard>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {QUICK_STATS.map((stat, i) => {
          const Icon = STAT_ICONS[stat.icon];
          return (
            <GlassCard key={stat.label} delay={120 + i * 60} className="rounded-3xl p-4">
              <Icon className="size-[18px] text-primary" />
              <div className="mt-3 font-display text-2xl font-semibold">{stat.value}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{stat.label}</div>
              <div className="mt-2 text-[11px] font-medium text-primary">{stat.delta}</div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="mt-4" delay={360}>
        <h2 className="font-display text-base font-semibold">Today's schedule</h2>
        <ol className="mt-4 space-y-4">
          {SCHEDULE.map((item, i) => (
            <li key={item.title} className="relative flex gap-4 pl-1">
              <div className="flex flex-col items-center">
                <span
                  className={`size-2.5 rounded-full ${
                    item.state === "upcoming" ? "bg-muted-foreground/40" : "accent-gradient"
                  }`}
                />
                {i < SCHEDULE.length - 1 ? (
                  <span className="mt-1 w-px flex-1 bg-border" />
                ) : null}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-[11px] text-muted-foreground">{item.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
                {item.state === "active" ? (
                  <span className="mt-2 inline-block rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-medium tracking-wide text-primary uppercase">
                    In progress
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </GlassCard>

      <GlassCard className="mt-4 border-primary/30" delay={420}>
        <div className="flex gap-3">
          <div className="accent-gradient grid size-9 shrink-0 place-items-center rounded-2xl">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <div>
            <div className="text-[11px] font-medium tracking-[0.16em] text-primary uppercase">
              AI insight
            </div>
            <p className="mt-1.5 text-sm leading-relaxed">
              You usually focus best between 7:00 PM and 9:00 PM. Protect that window and your
              weekly flow score climbs about 11 points.
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="mt-4" delay={480}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Habit progress</h2>
          <Link to="/habits" className="text-xs font-medium text-primary">
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-4">
          {HABIT_PROGRESS.map((habit, i) => (
            <div key={habit.name}>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm font-medium">{habit.name}</span>
                <span className="text-[11px] text-muted-foreground">{habit.unit}</span>
              </div>
              <AnimatedBar value={habit.value} delay={i * 120} />
            </div>
          ))}
        </div>
      </GlassCard>
    </Screen>
  );
}
