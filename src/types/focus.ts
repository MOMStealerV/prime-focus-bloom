export type FocusPhase = "idle" | "preparing" | "focus" | "paused" | "break" | "completed";

export type SessionKind = "focus" | "break";

export type EngineState = {
  phase: FocusPhase;
  kind: SessionKind;
  /** Which running kind the pause came from, so resume returns to it. */
  pausedFrom: SessionKind | null;
  /** Duration of the currently running (or last) segment. */
  plannedMinutes: number;
  /** Focus duration queued for the next focus block. */
  focusMinutes: number;
  startedAt: number | null;
  targetEndAt: number | null;
  prepareEndAt: number | null;
  pausedAt: number | null;
  pausedTotalMs: number;
  pausedCount: number;
  distractions: number;
  /** Completed focus blocks in the running pomodoro cycle (resets after long break). */
  cycleCount: number;
  ambientSound: string;
  ambientVolume: number;
  ambientPlaying: boolean;
  /** Timestamp of the last completion, used for the success animation. */
  completedAt: number | null;
  completedKind: SessionKind | null;
};

export type EngineAction =
  | { type: "hydrate"; state: EngineState; now: number }
  | { type: "queueMinutes"; minutes: number }
  | { type: "start"; minutes?: number; now: number }
  | { type: "prepareDone"; now: number }
  | { type: "pause"; now: number }
  | { type: "resume"; now: number }
  | { type: "reset"; now: number }
  | { type: "end"; now: number }
  | { type: "skip"; now: number }
  | { type: "complete"; now: number }
  | { type: "distraction" }
  | { type: "setSound"; sound: string }
  | { type: "setVolume"; volume: number }
  | { type: "setPlaying"; playing: boolean }
  | { type: "dismissCompletion" };

export const PREPARE_MS = 3000;
export const SHORT_BREAK_MINUTES = 5;
export const LONG_BREAK_MINUTES = 15;
export const LONG_BREAK_EVERY = 4;
export const MIN_MINUTES = 5;
export const MAX_MINUTES = 180;
export const DAILY_GOAL_MINUTES = 120;