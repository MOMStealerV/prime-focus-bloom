import { ChevronDown, Flame, Timer, Zap } from "lucide-react";

import { AmbientPlayer } from "./AmbientPlayer";
import { Controls } from "./Controls";
import { FocusRing } from "./ProgressRing";
import { QuoteCard } from "./QuoteCard";
import { useFocusEngine } from "@/hooks/useFocusEngine";
import { formatClock, formatMinutes } from "@/lib/analytics";
import { elapsedMs, remainingMs } from "@/lib/focus-machine";

export function FocusOverlay({ onMinimize }: { onMinimize: () => void }) {
  const { state, now, analytics, pause, resume, end, skipBreak, reset } = useFocusEngine();
  const kind = state.pausedFrom ?? state.kind;
  const isBreak = kind === "break";

  const remaining = remainingMs(state, now);
  const elapsed = elapsedMs(state, now);
  const total = state.plannedMinutes * 60_000;
  const progress = total > 0 ? Math.min(100, (elapsed / total) * 100) : 0;

  const prepareLeft = state.prepareEndAt ? Math.max(0, state.prepareEndAt - now) : 0;
  const ringState =
    state.phase === "completed"
      ? "completed"
      : state.phase === "paused"
        ? "paused"
        : isBreak
          ? "break"
          : "focus";

  const modeLabel =
    state.phase === "preparing"
      ? "Get ready"
      : state.phase === "completed"
        ? isBreak
          ? "Break complete"
          : "Session complete"
        : state.phase === "paused"
          ? "Paused"
          : isBreak
            ? "Break"
            : "Deep Focus";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Focus session"
      className="animate-rise fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-background/95 backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="animate-float-slow absolute -top-28 -left-20 size-[420px] rounded-full blur-[120px]"
          style={{ background: "var(--backdrop-1)" }}
        />
        <div
          className="animate-float-slow absolute -right-24 bottom-0 size-[380px] rounded-full blur-[130px]"
          style={{ background: "var(--backdrop-2)", animationDelay: "-6s" }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col items-center px-6 py-8">
        <div className="flex w-full items-center justify-between">
          <span className="text-[11px] font-medium tracking-[0.22em] text-primary uppercase">
            {modeLabel}
          </span>
          <button
            type="button"
            onClick={onMinimize}
            aria-label="Minimise focus mode"
            className="press glass grid size-11 place-items-center rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95"
          >
            <ChevronDown className="size-4 text-primary" />
          </button>
        </div>

        <div className="mt-10" aria-live="polite">
          {state.phase === "preparing" ? (
            <FocusRing
              value={100}
              label={String(Math.ceil(prepareLeft / 1000))}
              caption="Starting"
              state="focus"
            />
          ) : (
            <FocusRing
              value={progress}
              label={formatClock(remaining)}
              caption={isBreak ? "Break remaining" : "Remaining"}
              sublabel={`${formatClock(elapsed)} elapsed`}
              state={ringState}
            />
          )}
        </div>

        <div className="mt-8 grid w-full grid-cols-3 gap-3">
          {[
            { icon: Flame, value: `${analytics.currentStreak}d`, label: "Streak" },
            { icon: Timer, value: formatMinutes(analytics.todayMinutes), label: "Today" },
            { icon: Zap, value: String(state.distractions), label: "Distractions" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="glass rounded-3xl px-3 py-4 text-center">
              <Icon className="mx-auto size-4 text-primary" aria-hidden />
              <div className="mt-2 font-display text-lg font-semibold">{value}</div>
              <div className="text-[10px] text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-8">
          <QuoteCard />
          <AmbientPlayer compact />
        </div>

        <div className="mt-8 w-full">
          <div className="flex justify-center">
            <Controls
              phase={state.phase === "idle" ? "preparing" : state.phase}
              isBreak={isBreak}
              onPause={pause}
              onResume={resume}
              onEnd={end}
              onSkip={skipBreak}
              onReset={reset}
            />
          </div>
        </div>
      </div>
    </div>
  );
}