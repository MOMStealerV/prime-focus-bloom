import {
  LONG_BREAK_EVERY,
  LONG_BREAK_MINUTES,
  MAX_MINUTES,
  MIN_MINUTES,
  PREPARE_MS,
  SHORT_BREAK_MINUTES,
  type EngineAction,
  type EngineState,
} from "@/types/focus";
import type { SessionDraft } from "@/types/session";

export const DEFAULT_ENGINE_STATE: EngineState = {
  phase: "idle",
  kind: "focus",
  pausedFrom: null,
  plannedMinutes: 45,
  focusMinutes: 45,
  startedAt: null,
  targetEndAt: null,
  prepareEndAt: null,
  pausedAt: null,
  pausedTotalMs: 0,
  pausedCount: 0,
  distractions: 0,
  cycleCount: 0,
  ambientSound: "rain",
  ambientVolume: 0.5,
  ambientPlaying: false,
  completedAt: null,
  completedKind: null,
};

export type MachineResult = {
  state: EngineState;
  session?: SessionDraft;
};

export const clampMinutes = (minutes: number) =>
  Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(minutes)));

export const isRunning = (phase: EngineState["phase"]) => phase === "focus" || phase === "break";

export const isActive = (phase: EngineState["phase"]) =>
  phase === "preparing" || phase === "focus" || phase === "break" || phase === "paused";

/** Remaining milliseconds for the running segment, always derived from timestamps. */
export function remainingMs(state: EngineState, now: number) {
  if (state.phase === "paused" && state.pausedAt && state.targetEndAt) {
    return Math.max(0, state.targetEndAt - state.pausedAt);
  }
  if (!state.targetEndAt) return state.plannedMinutes * 60_000;
  return Math.max(0, state.targetEndAt - now);
}

export function elapsedMs(state: EngineState, now: number) {
  const total = state.plannedMinutes * 60_000;
  return Math.min(total, total - remainingMs(state, now));
}

function finalize(
  state: EngineState,
  now: number,
  opts: { completed: boolean; manualEnded: boolean },
): SessionDraft | undefined {
  if (!state.startedAt) return undefined;
  const pauseDuration =
    state.pausedTotalMs + (state.pausedAt ? Math.max(0, now - state.pausedAt) : 0);
  const activeMs = opts.completed
    ? state.plannedMinutes * 60_000
    : Math.min(
        state.plannedMinutes * 60_000,
        Math.max(0, now - state.startedAt - pauseDuration),
      );
  return {
    kind: state.pausedFrom ?? state.kind,
    plannedMinutes: state.plannedMinutes,
    actualMinutes: Math.round((activeMs / 60_000) * 10) / 10,
    completed: opts.completed,
    manualEnded: opts.manualEnded,
    startedAt: state.startedAt,
    endedAt: now,
    ambientSound: state.ambientSound,
    pausedCount: state.pausedCount,
    pauseDuration,
    distractions: state.distractions,
  };
}

function toIdle(state: EngineState): EngineState {
  return {
    ...state,
    phase: "idle",
    kind: "focus",
    pausedFrom: null,
    plannedMinutes: state.focusMinutes,
    startedAt: null,
    targetEndAt: null,
    prepareEndAt: null,
    pausedAt: null,
    pausedTotalMs: 0,
    pausedCount: 0,
    distractions: 0,
    completedAt: null,
    completedKind: null,
  };
}

export function breakMinutesFor(cycleCount: number) {
  return cycleCount > 0 && cycleCount % LONG_BREAK_EVERY === 0
    ? LONG_BREAK_MINUTES
    : SHORT_BREAK_MINUTES;
}

export function focusReducer(state: EngineState, action: EngineAction): MachineResult {
  switch (action.type) {
    case "hydrate":
      return { state: action.state };

    case "queueMinutes": {
      const minutes = clampMinutes(action.minutes);
      if (state.phase !== "idle") return { state: { ...state, focusMinutes: minutes } };
      return { state: { ...state, focusMinutes: minutes, plannedMinutes: minutes } };
    }

    case "start": {
      if (state.phase !== "idle" && state.phase !== "completed") return { state };
      const minutes = clampMinutes(action.minutes ?? state.focusMinutes);
      return {
        state: {
          ...state,
          phase: "preparing",
          kind: "focus",
          pausedFrom: null,
          plannedMinutes: minutes,
          focusMinutes: minutes,
          startedAt: null,
          targetEndAt: null,
          prepareEndAt: action.now + PREPARE_MS,
          pausedAt: null,
          pausedTotalMs: 0,
          pausedCount: 0,
          distractions: 0,
          completedAt: null,
          completedKind: null,
          ambientPlaying: state.ambientSound !== "silence",
        },
      };
    }

    case "prepareDone": {
      if (state.phase !== "preparing") return { state };
      return {
        state: {
          ...state,
          phase: "focus",
          kind: "focus",
          prepareEndAt: null,
          startedAt: action.now,
          targetEndAt: action.now + state.plannedMinutes * 60_000,
        },
      };
    }

    case "pause": {
      if (!isRunning(state.phase)) return { state };
      return {
        state: {
          ...state,
          phase: "paused",
          pausedFrom: state.kind,
          pausedAt: action.now,
          pausedCount: state.pausedCount + 1,
        },
      };
    }

    case "resume": {
      if (state.phase !== "paused" || !state.pausedAt || !state.pausedFrom) return { state };
      const pausedFor = Math.max(0, action.now - state.pausedAt);
      return {
        state: {
          ...state,
          phase: state.pausedFrom,
          kind: state.pausedFrom,
          pausedFrom: null,
          pausedAt: null,
          pausedTotalMs: state.pausedTotalMs + pausedFor,
          targetEndAt: (state.targetEndAt ?? action.now) + pausedFor,
        },
      };
    }

    case "complete": {
      if (!isRunning(state.phase)) return { state };
      const session = finalize(state, action.now, { completed: true, manualEnded: false });
      return {
        state: {
          ...state,
          phase: "completed",
          completedAt: action.now,
          completedKind: state.kind,
          pausedAt: null,
        },
        session,
      };
    }

    case "dismissCompletion": {
      if (state.phase !== "completed") return { state };
      if (state.completedKind === "focus") {
        const cycleCount = state.cycleCount + 1;
        const minutes = breakMinutesFor(cycleCount);
        const now = Date.now();
        return {
          state: {
            ...state,
            phase: "break",
            kind: "break",
            pausedFrom: null,
            cycleCount: minutes === LONG_BREAK_MINUTES ? 0 : cycleCount,
            plannedMinutes: minutes,
            startedAt: now,
            targetEndAt: now + minutes * 60_000,
            pausedAt: null,
            pausedTotalMs: 0,
            pausedCount: 0,
            distractions: 0,
            completedAt: null,
            completedKind: null,
          },
        };
      }
      return { state: toIdle(state) };
    }

    case "end":
    case "reset": {
      if (state.phase === "idle") return { state };
      if (state.phase === "preparing" || state.phase === "completed") {
        return { state: toIdle(state) };
      }
      const session = finalize(state, action.now, { completed: false, manualEnded: true });
      return { state: { ...toIdle(state), ambientPlaying: false }, session };
    }

    case "skip": {
      const runningKind = state.pausedFrom ?? state.kind;
      if (runningKind !== "break" || state.phase === "idle") return { state };
      const session = finalize(state, action.now, { completed: false, manualEnded: true });
      return { state: toIdle(state), session };
    }

    case "distraction": {
      if (state.phase !== "focus") return { state };
      return { state: { ...state, distractions: state.distractions + 1 } };
    }

    case "setSound":
      return { state: { ...state, ambientSound: action.sound } };

    case "setVolume":
      return { state: { ...state, ambientVolume: Math.min(1, Math.max(0, action.volume)) } };

    case "setPlaying":
      return { state: { ...state, ambientPlaying: action.playing } };

    default:
      return { state };
  }
}