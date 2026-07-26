import { createFileRoute } from "@tanstack/react-router";

import { GlassCard } from "@/components/primeflow/GlassCard";
import { AnimatedBar } from "@/components/primeflow/AnimatedBar";
import { Screen, ScreenTitle } from "@/components/primeflow/Screen";
import {
  DISTRACTING_APPS,
  FLOW_TREND,
  HEATMAP,
  SCREEN_TIME,
  WEEKLY_FOCUS,
} from "@/data/mock";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — PrimeFlow" },
      {
        name: "description",
        content:
          "Weekly focus hours, screen time reduction, productivity heatmap and flow score trend.",
      },
      { property: "og:title", content: "Analytics — PrimeFlow" },
      {
        property: "og:description",
        content: "Weekly focus, screen time reduction, heatmap and flow score trend.",
      },
    ],
  }),
  component: Analytics,
});

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function Analytics() {
  const maxFocus = Math.max(...WEEKLY_FOCUS.map((d) => d.value));
  const maxScreen = Math.max(...SCREEN_TIME.map((d) => d.value));

  const trendPoints = FLOW_TREND.map((value, i) => {
    const x = (i / (FLOW_TREND.length - 1)) * 300;
    const y = 100 - ((value - 40) / 60) * 90;
    return `${x},${y}`;
  }).join(" ");

  return (
    <Screen>
      <ScreenTitle title="Analytics" subtitle="How your attention actually moved" />

      <GlassCard delay={60}>
        <h2 className="font-display text-base font-semibold">Weekly focus</h2>
        <p className="text-xs text-muted-foreground">30.8 hours · +14% vs last week</p>
        <div className="mt-5 flex h-40 items-end justify-between gap-2">
          {WEEKLY_FOCUS.map((d, i) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end">
                <div
                  className="accent-gradient w-full rounded-t-xl rounded-b-md"
                  style={{
                    height: `${(d.value / maxFocus) * 100}%`,
                    animation: `pf-rise 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 70}ms both`,
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="mt-4" delay={120}>
        <h2 className="font-display text-base font-semibold">Screen time reduction</h2>
        <p className="text-xs text-muted-foreground">Daily average, down 44% in five weeks</p>
        <div className="mt-4 space-y-3">
          {SCREEN_TIME.map((d, i) => (
            <div key={d.week} className="flex items-center gap-3">
              <span className="w-7 text-[11px] text-muted-foreground">{d.week}</span>
              <AnimatedBar value={(d.value / maxScreen) * 100} delay={i * 100} />
              <span className="w-10 text-right text-[11px] font-medium">{d.value}h</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="mt-4" delay={180}>
        <h2 className="font-display text-base font-semibold">Productivity heatmap</h2>
        <p className="text-xs text-muted-foreground">Last five weeks</p>
        <div className="mt-4 space-y-1.5">
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS.map((d, i) => (
              <span key={i} className="text-center text-[10px] text-muted-foreground">
                {d}
              </span>
            ))}
          </div>
          {HEATMAP.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1.5">
              {week.map((level, di) => (
                <div
                  key={di}
                  className="aspect-square rounded-lg"
                  style={{
                    background:
                      level === 0 ? "var(--muted)" : `color-mix(in oklab, var(--primary) ${level * 24}%, transparent)`,
                    animation: `pf-rise 0.5s ease ${(wi * 7 + di) * 12}ms both`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="mt-4" delay={240}>
        <h2 className="font-display text-base font-semibold">Flow score trend</h2>
        <p className="text-xs text-muted-foreground">12 weeks · now 88</p>
        <svg viewBox="0 0 300 110" className="mt-4 w-full overflow-visible">
          <defs>
            <linearGradient id="pf-trend-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--glow)" />
            </linearGradient>
            <linearGradient id="pf-trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,110 ${trendPoints} 300,110`} fill="url(#pf-trend-fill)" />
          <polyline
            points={trendPoints}
            fill="none"
            stroke="url(#pf-trend-line)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 700,
              animation: "pf-draw 1.6s cubic-bezier(0.22,1,0.36,1) both",
            }}
          />
        </svg>
      </GlassCard>

      <GlassCard className="mt-4" delay={300}>
        <h2 className="font-display text-base font-semibold">Most distracting apps</h2>
        <div className="mt-4 space-y-4">
          {DISTRACTING_APPS.map((app, i) => (
            <div key={app.name}>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm font-medium">{app.name}</span>
                <span className="text-[11px] text-muted-foreground">{app.minutes} min / day</span>
              </div>
              <AnimatedBar value={app.share} delay={i * 90} />
            </div>
          ))}
        </div>
      </GlassCard>
    </Screen>
  );
}