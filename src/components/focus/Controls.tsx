import { Pause, Play, RotateCcw, SkipForward, Square } from "lucide-react";
import type { ComponentType } from "react";

type Variant = "primary" | "ghost";

function ControlButton({
  icon: Icon,
  label,
  onClick,
  variant = "ghost",
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: Variant;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`press flex min-h-11 items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95 ${
        variant === "primary"
          ? "accent-gradient text-primary-foreground shadow-[0_18px_44px_-20px_var(--primary)]"
          : "glass text-foreground"
      }`}
    >
      <Icon className="size-4" />
      <span>{label}</span>
    </button>
  );
}

type Props = {
  phase: "preparing" | "focus" | "break" | "paused" | "completed";
  isBreak: boolean;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
  onSkip: () => void;
  onReset: () => void;
};

export function Controls({ phase, isBreak, onPause, onResume, onEnd, onSkip, onReset }: Props) {
  if (phase === "completed") {
    return <p className="text-sm text-muted-foreground">Wrapping up…</p>;
  }

  if (phase === "preparing") {
    return <ControlButton icon={RotateCcw} label="Cancel" onClick={onReset} />;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {phase === "paused" ? (
        <ControlButton icon={Play} label="Resume" onClick={onResume} variant="primary" />
      ) : (
        <ControlButton icon={Pause} label="Pause" onClick={onPause} variant="primary" />
      )}
      {isBreak ? <ControlButton icon={SkipForward} label="Skip break" onClick={onSkip} /> : null}
      <ControlButton icon={Square} label="End session" onClick={onEnd} />
    </div>
  );
}