import { useEffect, useState } from "react";

export type RingState = "idle" | "focus" | "break" | "paused" | "completed";

type Props = {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  caption?: string;
  sublabel?: string;
  state?: RingState;
  /** Stroke transition duration, ms. Short values keep a live countdown smooth. */
  transitionMs?: number;
};

const RING_ANIMATION: Record<RingState, string> = {
  idle: "animate-glow-soft",
  focus: "animate-breathe",
  break: "animate-breathe",
  paused: "",
  completed: "animate-burst",
};

export function ProgressRing({
  value,
  size = 180,
  stroke = 14,
  label,
  caption,
  sublabel,
  state = "idle",
  transitionMs = 1400,
}: Props) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = window.setTimeout(() => setProgress(value), 120);
    return () => window.clearTimeout(id);
  }, [value]);

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className={`-rotate-90 ${RING_ANIMATION[state]}`}>
        <defs>
          <linearGradient id="pf-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--glow)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#pf-ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: `stroke-dashoffset ${transitionMs}ms cubic-bezier(0.22,1,0.36,1)` }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-4xl font-semibold tracking-tight text-foreground">
          {label}
        </div>
        {caption ? (
          <div className="mt-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {caption}
          </div>
        ) : null}
        {sublabel ? (
          <div className="mt-1 text-[11px] text-muted-foreground">{sublabel}</div>
        ) : null}
      </div>
    </div>
  );
}