import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Waves } from "lucide-react";

import { GlassCard } from "@/components/primeflow/GlassCard";
import { ProgressRing } from "@/components/primeflow/ProgressRing";
import { Screen, ScreenTitle } from "@/components/primeflow/Screen";
import { AmbientPlayer } from "@/components/focus/AmbientPlayer";
import { useFocusEngine } from "@/hooks/useFocusEngine";
import { clampMinutes } from "@/lib/focus-machine";
import { formatMinutes } from "@/lib/analytics";
import { SESSION_PRESETS } from "@/data/mock";
import { MAX_MINUTES, MIN_MINUTES } from "@/types/focus";

export const Route = createFileRoute("/focus")({
  head: () => ({
    meta: [
      { title: "Focus session — PrimeFlow" },
      {
        name: "description",
        content: "Set a focus block, pick an ambient soundscape and drop into deep work.",
      },
      { property: "og:title", content: "Focus session — PrimeFlow" },
      {
        property: "og:description",
        content: "Set a focus block, pick an ambient soundscape and drop into deep work.",
      },
    ],
  }),
  component: Focus,
});

function Focus() {
  const { state, analytics, start, queueMinutes } = useFocusEngine();
  const preset = state.focusMinutes;
  const [custom, setCustom] = useState("");

  return (
    <Screen>
      <ScreenTitle title="Focus" subtitle="Design the next deep work block" />

      <GlassCard className="flex flex-col items-center p-7" delay={60}>
        <ProgressRing
          value={100}
          size={230}
          stroke={16}
          label={`${preset}:00`}
          caption="Minutes"
          sublabel={`${formatMinutes(analytics.todayMinutes)} focused today`}
        />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Silent mode on · notifications paused for the session
        </p>
      </GlassCard>

      <GlassCard className="mt-4" delay={140}>
        <h2 className="font-display text-base font-semibold">Session length</h2>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {SESSION_PRESETS.map((value) => {
            const active = value === preset;
            return (
              <button
                key={value}
                onClick={() => queueMinutes(value)}
                aria-pressed={active}
                className={`press rounded-2xl py-3 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95 ${
                  active
                    ? "accent-gradient text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <label htmlFor="pf-custom" className="text-xs text-muted-foreground">
            Custom
          </label>
          <input
            id="pf-custom"
            type="number"
            inputMode="numeric"
            min={MIN_MINUTES}
            max={MAX_MINUTES}
            placeholder={`${MIN_MINUTES}–${MAX_MINUTES} min`}
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
            onBlur={() => {
              if (custom.trim() !== "") queueMinutes(clampMinutes(Number(custom)));
            }}
            className="min-h-11 flex-1 rounded-2xl bg-muted/50 px-4 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          />
        </div>
      </GlassCard>

      <GlassCard className="mt-4" delay={200}>
        <div className="flex items-center gap-2">
          <Waves className="size-[18px] text-primary" />
          <h2 className="font-display text-base font-semibold">Ambient sound</h2>
        </div>
        <div className="mt-4">
          <AmbientPlayer />
        </div>
      </GlassCard>

      <button
        onClick={() => start(preset)}
        className="accent-gradient press mt-5 flex w-full items-center justify-center gap-2 rounded-3xl py-4 font-display text-sm font-semibold text-primary-foreground shadow-[0_18px_44px_-18px_var(--primary)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98]"
      >
        <Play className="size-4" />
        Start {preset} minute session
      </button>
    </Screen>
  );
}