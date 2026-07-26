import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Waves } from "lucide-react";

import { GlassCard } from "@/components/primeflow/GlassCard";
import { ProgressRing } from "@/components/primeflow/ProgressRing";
import { Screen, ScreenTitle } from "@/components/primeflow/Screen";
import { AMBIENT_SOUNDS, SESSION_PRESETS } from "@/data/mock";

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
  const [preset, setPreset] = useState(45);
  const [sound, setSound] = useState("rain");

  return (
    <Screen>
      <ScreenTitle title="Focus" subtitle="Design the next deep work block" />

      <GlassCard className="flex flex-col items-center p-7" delay={60}>
        <ProgressRing value={100} size={230} stroke={16} label={`${preset}:00`} caption="Minutes" />
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
                onClick={() => setPreset(value)}
                className={`rounded-2xl py-3 text-sm font-semibold transition-all duration-300 active:scale-95 ${
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
      </GlassCard>

      <GlassCard className="mt-4" delay={200}>
        <div className="flex items-center gap-2">
          <Waves className="size-[18px] text-primary" />
          <h2 className="font-display text-base font-semibold">Ambient sound</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {AMBIENT_SOUNDS.map((item) => {
            const active = item.id === sound;
            return (
              <button
                key={item.id}
                onClick={() => setSound(item.id)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 active:scale-95 ${
                  active
                    ? "accent-gradient text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </GlassCard>

      <button className="accent-gradient mt-5 flex w-full items-center justify-center gap-2 rounded-3xl py-4 font-display text-sm font-semibold text-primary-foreground shadow-[0_18px_44px_-18px_var(--primary)] transition-transform duration-300 active:scale-[0.98]">
        <Play className="size-4" />
        Start {preset} minute session
      </button>
    </Screen>
  );
}