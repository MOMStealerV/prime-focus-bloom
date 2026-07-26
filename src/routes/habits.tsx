import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Flame, Plus } from "lucide-react";

import { GlassCard } from "@/components/primeflow/GlassCard";
import { Screen, ScreenTitle } from "@/components/primeflow/Screen";
import { HABITS } from "@/data/mock";

export const Route = createFileRoute("/habits")({
  head: () => ({
    meta: [
      { title: "Habits — PrimeFlow" },
      {
        name: "description",
        content: "Track daily habits, keep streaks alive and see the month at a glance.",
      },
      { property: "og:title", content: "Habits — PrimeFlow" },
      {
        property: "og:description",
        content: "Track daily habits, keep streaks alive and see the month at a glance.",
      },
    ],
  }),
  component: Habits,
});

function Habits() {
  const [done, setDone] = useState<Record<string, boolean>>(
    Object.fromEntries(HABITS.map((h) => [h.id, h.done])),
  );
  const completed = Object.values(done).filter(Boolean).length;
  const monthDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <Screen>
      <ScreenTitle title="Habits" subtitle={`${completed} of ${HABITS.length} done today`} />

      <div className="space-y-3">
        {HABITS.map((habit, i) => {
          const isDone = done[habit.id];
          return (
            <GlassCard key={habit.id} delay={60 + i * 60} className="rounded-3xl p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDone((d) => ({ ...d, [habit.id]: !d[habit.id] }))}
                  aria-label={`Toggle ${habit.name}`}
                  className={`grid size-11 shrink-0 place-items-center rounded-2xl transition-all duration-300 active:scale-90 ${
                    isDone ? "accent-gradient" : "bg-muted/60"
                  }`}
                >
                  <Check
                    className={`size-5 transition-opacity duration-300 ${
                      isDone ? "text-primary-foreground opacity-100" : "text-muted-foreground opacity-40"
                    }`}
                  />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{habit.name}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{habit.schedule}</div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-primary/12 px-3 py-1.5 text-primary">
                  <Flame className="size-3.5" />
                  <span className="text-xs font-semibold">{habit.streak}</span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="mt-4" delay={420}>
        <h2 className="font-display text-base font-semibold">This month</h2>
        <p className="text-xs text-muted-foreground">24 of 30 days on track</p>
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {monthDays.map((day) => {
            const hit = day % 7 !== 3 && day % 11 !== 5;
            return (
              <div
                key={day}
                className={`grid aspect-square place-items-center rounded-[10px] text-[10px] font-medium ${
                  hit ? "text-primary" : "text-muted-foreground"
                }`}
                style={{
                  background: hit
                    ? "color-mix(in oklab, var(--primary) 18%, transparent)"
                    : "var(--muted)",
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </GlassCard>

      <button
        aria-label="Add habit"
        className="accent-gradient fixed bottom-28 left-1/2 z-40 ml-[125px] grid size-14 -translate-x-1/2 place-items-center rounded-3xl text-primary-foreground shadow-[0_18px_40px_-14px_var(--primary)] transition-transform duration-300 active:scale-90"
      >
        <Plus className="size-6" />
      </button>
    </Screen>
  );
}