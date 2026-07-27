import { ProgressRing, type RingState } from "@/components/primeflow/ProgressRing";
import { useReducedMotion } from "@/hooks/useFocusEngine";

const CONFETTI = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  return {
    x: `${Math.cos(angle) * 120}px`,
    y: `${Math.sin(angle) * 120}px`,
    delay: `${i * 18}ms`,
  };
});

type Props = {
  value: number;
  label: string;
  caption: string;
  sublabel?: string;
  state: RingState;
  size?: number;
};

/** Stage 1 ring with focus-mode motion states and a completion celebration. */
export function FocusRing({ value, label, caption, sublabel, state, size = 260 }: Props) {
  const reduced = useReducedMotion();

  return (
    <div className="relative grid place-items-center">
      <ProgressRing
        value={value}
        size={size}
        stroke={16}
        label={label}
        caption={caption}
        sublabel={sublabel}
        state={reduced ? "paused" : state}
        transitionMs={state === "completed" ? 600 : 320}
      />
      {state === "completed" && !reduced ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          {CONFETTI.map((piece, i) => (
            <span
              key={i}
              className="absolute size-2 rounded-full"
              style={{
                background: i % 2 === 0 ? "var(--primary)" : "var(--glow)",
                ["--pf-x" as string]: piece.x,
                ["--pf-y" as string]: piece.y,
                animation: `pf-confetti 1.1s cubic-bezier(0.22,1,0.36,1) ${piece.delay} both`,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}