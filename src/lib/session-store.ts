import type { FocusSession, SessionDraft } from "@/types/session";

const STORAGE_KEY = "primeflow-sessions";
const MAX_SESSIONS = 1000;

let cache: FocusSession[] | null = null;
const listeners = new Set<(sessions: FocusSession[]) => void>();

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadSessions(): FocusSession[] {
  if (cache) return cache;
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as FocusSession[]) : [];
    cache = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache = [];
  }
  return cache;
}

function persist(sessions: FocusSession[]) {
  cache = sessions;
  if (isBrowser()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(-MAX_SESSIONS)));
    } catch {
      /* storage full or unavailable — keep the in-memory cache */
    }
  }
  listeners.forEach((fn) => fn(sessions));
}

export function subscribeSessions(fn: (sessions: FocusSession[]) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function addSession(
  draft: SessionDraft,
  meta: { theme: string; flowScore: number },
): FocusSession {
  const started = new Date(draft.startedAt);
  const session: FocusSession = {
    ...draft,
    id:
      isBrowser() && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s-${draft.startedAt}-${Math.random().toString(36).slice(2, 8)}`,
    theme: meta.theme,
    flowScore: meta.flowScore,
    dayOfWeek: started.getDay(),
    hour: started.getHours(),
  };
  persist([...loadSessions(), session]);
  return session;
}

export function clearSessions() {
  persist([]);
}