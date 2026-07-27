import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { syncAchievements } from "./achievements";
import { computeAnalytics, computeFlowScore, formatClock } from "./analytics";
import { getAmbientEngine, type AmbientId } from "./ambient-sound";
import { DEFAULT_ENGINE_STATE, focusReducer, isActive, isRunning } from "./focus-machine";
import { addSession, loadSessions, subscribeSessions } from "./session-store";
import { useTheme } from "./theme";
import type { EngineAction, EngineState } from "@/types/focus";
import type { FocusSession, SessionDraft } from "@/types/session";
import type { AnalyticsSummary } from "@/types/analytics";

const STATE_KEY = "primeflow-engine";
const COMPLETION_HOLD_MS = 2600;

export type FocusEngineValue = {
  state: EngineState;
  now: number;
  sessions: FocusSession[];
  analytics: AnalyticsSummary;
  start: (minutes?: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  end: () => void;
  skipBreak: () => void;
  queueMinutes: (minutes: number) => void;
  setSound: (sound: AmbientId) => void;
  setVolume: (volume: number) => void;
  setPlaying: (playing: boolean) => void;
};

export const FocusEngineContext = createContext<FocusEngineValue | null>(null);

function readPersistedState(): EngineState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<EngineState>;
    return { ...DEFAULT_ENGINE_STATE, ...parsed };
  } catch {
    return null;
  }
}

export function FocusEngineProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const [state, setState] = useState<EngineState>(DEFAULT_ENGINE_STATE);
  const stateRef = useRef(state);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [hydrated, setHydrated] = useState(false);

  const persistSession = useCallback((draft: SessionDraft) => {
    const existing = loadSessions();
    const flowScore = computeFlowScore([
      ...existing,
      { ...draft, id: "pending", theme: themeRef.current, flowScore: 0, dayOfWeek: 0, hour: 0 },
    ]);
    addSession(draft, { theme: themeRef.current, flowScore });

    if (draft.kind === "focus") {
      const unlocked = syncAchievements(loadSessions());
      unlocked.forEach((achievement) => {
        toast.success(`Achievement unlocked · ${achievement.name}`, {
          description: achievement.description,
        });
      });
    }
  }, []);

  const dispatch = useCallback(
    (action: EngineAction) => {
      const result = focusReducer(stateRef.current, action);
      if (result.state !== stateRef.current) {
        stateRef.current = result.state;
        setState(result.state);
      }
      if (result.session) persistSession(result.session);
    },
    [persistSession],
  );

  // --- hydrate -----------------------------------------------------------
  useEffect(() => {
    setSessions(loadSessions());
    const unsubscribe = subscribeSessions((next) => setSessions([...next]));
    const persisted = readPersistedState();
    if (persisted) {
      stateRef.current = persisted;
      setState(persisted);
    }
    setHydrated(true);
    return () => {
      unsubscribe();
    };
  }, []);

  // --- persist engine snapshot -------------------------------------------
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  // --- clock: re-reads Date.now(), never counts ticks ---------------------
  useEffect(() => {
    if (!hydrated) return;
    const tick = () => setNow(Date.now());
    tick();
    if (!isActive(state.phase) && state.phase !== "completed") return;
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [hydrated, state.phase]);

  // --- transitions driven by the clock ------------------------------------
  useEffect(() => {
    if (!hydrated) return;
    const current = stateRef.current;
    if (current.phase === "preparing" && current.prepareEndAt && now >= current.prepareEndAt) {
      dispatch({ type: "prepareDone", now: Date.now() });
    } else if (isRunning(current.phase) && current.targetEndAt && now >= current.targetEndAt) {
      dispatch({ type: "complete", now: Date.now() });
    } else if (
      current.phase === "completed" &&
      current.completedAt &&
      now - current.completedAt >= COMPLETION_HOLD_MS
    ) {
      dispatch({ type: "dismissCompletion" });
    }
  }, [now, hydrated, dispatch]);

  // --- completion feedback -------------------------------------------------
  const lastCelebrated = useRef<number | null>(null);
  useEffect(() => {
    if (state.phase !== "completed" || !state.completedAt) return;
    if (lastCelebrated.current === state.completedAt) return;
    lastCelebrated.current = state.completedAt;

    getAmbientEngine().chime();
    const isFocus = state.completedKind === "focus";
    const title = isFocus ? "Focus session complete" : "Break finished";
    const body = isFocus
      ? `${state.plannedMinutes} minutes logged. Time for a break.`
      : "Ready for the next focus block.";
    toast.success(title, { description: body });

    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        new Notification(`PrimeFlow · ${title}`, { body });
      } catch {
        /* notifications unavailable */
      }
    }
  }, [state.phase, state.completedAt, state.completedKind, state.plannedMinutes]);

  // --- distraction detection ----------------------------------------------
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden" && stateRef.current.phase === "focus") {
        dispatch({ type: "distraction" });
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [dispatch]);

  // --- browser title -------------------------------------------------------
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!isActive(state.phase)) return;
    const label =
      state.phase === "preparing"
        ? "Get ready"
        : (state.pausedFrom ?? state.kind) === "break"
          ? "Break"
          : "Focus";
    const remaining =
      state.phase === "paused" && state.pausedAt && state.targetEndAt
        ? state.targetEndAt - state.pausedAt
        : (state.targetEndAt ?? 0) - now;
    const clock = state.phase === "preparing" ? "" : `${formatClock(Math.max(0, remaining))} • `;
    const previous = document.title;
    document.title = `${clock}${label} — PrimeFlow`;
    return () => {
      document.title = previous;
    };
  }, [state.phase, state.kind, state.pausedFrom, state.pausedAt, state.targetEndAt, now]);

  // --- ambient audio -------------------------------------------------------
  useEffect(() => {
    const audio = getAmbientEngine();
    audio.setSound(state.ambientSound as AmbientId);
    audio.setVolume(state.ambientVolume);
    const shouldPlay = state.ambientPlaying && isRunning(state.phase);
    if (shouldPlay) audio.play();
    else audio.pause();
  }, [state.ambientSound, state.ambientVolume, state.ambientPlaying, state.phase]);

  const analytics = useMemo(() => computeAnalytics(sessions, now - (now % 60_000)), [sessions, now]);

  const value = useMemo<FocusEngineValue>(
    () => ({
      state,
      now,
      sessions,
      analytics,
      start: (minutes?: number) => {
        if (typeof Notification !== "undefined" && Notification.permission === "default") {
          void Notification.requestPermission().catch(() => undefined);
        }
        getAmbientEngine().play();
        dispatch({ type: "start", minutes, now: Date.now() });
      },
      pause: () => dispatch({ type: "pause", now: Date.now() }),
      resume: () => dispatch({ type: "resume", now: Date.now() }),
      reset: () => dispatch({ type: "reset", now: Date.now() }),
      end: () => dispatch({ type: "end", now: Date.now() }),
      skipBreak: () => dispatch({ type: "skip", now: Date.now() }),
      queueMinutes: (minutes: number) => dispatch({ type: "queueMinutes", minutes }),
      setSound: (sound: AmbientId) => dispatch({ type: "setSound", sound }),
      setVolume: (volume: number) => dispatch({ type: "setVolume", volume }),
      setPlaying: (playing: boolean) => dispatch({ type: "setPlaying", playing }),
    }),
    [state, now, sessions, analytics, dispatch],
  );

  return <FocusEngineContext.Provider value={value}>{children}</FocusEngineContext.Provider>;
}