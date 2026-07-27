import { Timer } from "lucide-react";

import { useFocusEngine } from "@/hooks/useFocusEngine";
import { formatClock } from "@/lib/analytics";
import { remainingMs } from "@/lib/focus-machine";

export function MiniWidget({ onOpen }: { onOpen: () => void }) {
  const { state, now } = useFocusEngine();
  const kind = state.pausedFrom ?? state.kind;
  const label =
    state.phase === "preparing"
      ? "Starting"
      : state.phase === "paused"
        ? "Paused"
        : kind === "break"
          ? "Break"
          : "Deep Focus";

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Return to focus session, ${label}`}
      className="press glass-strong animate-rise fixed inset-x-0 bottom-28 z-40 mx-auto flex w-[min(430px,calc(100%-2rem))] items-center gap-3 rounded-[26px] px-4 py-3 shadow-[0_20px_50px_-24px_oklch(0_0_0/55%)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.99]"
    >
      <span className="accent-gradient grid size-9 shrink-0 place-items-center rounded-2xl">
        <Timer className="size-4 text-primary-foreground" aria-hidden />
      </span>
      <span className="flex-1 text-left">
        <span className="block font-display text-sm font-semibold">
          {formatClock(remainingMs(state, now))}
        </span>
        <span className="block text-[11px] text-muted-foreground">{label} · tap to return</span>
      </span>
    </button>
  );
}