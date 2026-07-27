import type { SessionKind } from "./focus";

export type FocusSession = {
  id: string;
  kind: SessionKind;
  plannedMinutes: number;
  actualMinutes: number;
  completed: boolean;
  manualEnded: boolean;
  startedAt: number;
  endedAt: number;
  theme: string;
  ambientSound: string;
  pausedCount: number;
  pauseDuration: number;
  distractions: number;
  flowScore: number;
  dayOfWeek: number;
  hour: number;
};

/** Everything the engine knows at the moment a session ends. */
export type SessionDraft = Omit<FocusSession, "id" | "theme" | "flowScore" | "dayOfWeek" | "hour">;