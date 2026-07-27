import { computeAnalytics } from "./analytics";
import type { FocusSession } from "@/types/session";

export type Achievement = {
  id: string;
  name: string;
  description: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-focus", name: "First Focus", description: "Complete your first focus session" },
  { id: "sessions-5", name: "5 Sessions", description: "Finish five focus sessions" },
  { id: "sessions-10", name: "10 Sessions", description: "Finish ten focus sessions" },
  { id: "hours-10", name: "10 Hours", description: "Log ten hours of focus" },
  { id: "hours-25", name: "25 Hours", description: "Log twenty-five hours of focus" },
  { id: "streak-7", name: "7 Day Streak", description: "Focus seven days in a row" },
  { id: "streak-30", name: "30 Day Streak", description: "Focus thirty days in a row" },
  { id: "deep-worker", name: "Deep Worker", description: "Complete a 90 minute session" },
  {
    id: "consistency-master",
    name: "Consistency Master",
    description: "Reach a 90% completion rate over 10+ sessions",
  },
];

const STORAGE_KEY = "primeflow-achievements";

export function loadUnlocked(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUnlocked(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function earnedAchievements(sessions: FocusSession[]): string[] {
  const focus = sessions.filter((s) => s.kind === "focus");
  const completed = focus.filter((s) => s.completed);
  const hours = focus.reduce((sum, s) => sum + s.actualMinutes, 0) / 60;
  const { currentStreak, completionRate } = computeAnalytics(sessions);

  const ids: string[] = [];
  if (completed.length >= 1) ids.push("first-focus");
  if (completed.length >= 5) ids.push("sessions-5");
  if (completed.length >= 10) ids.push("sessions-10");
  if (hours >= 10) ids.push("hours-10");
  if (hours >= 25) ids.push("hours-25");
  if (currentStreak >= 7) ids.push("streak-7");
  if (currentStreak >= 30) ids.push("streak-30");
  if (completed.some((s) => s.plannedMinutes >= 90)) ids.push("deep-worker");
  if (focus.length >= 10 && completionRate >= 90) ids.push("consistency-master");
  return ids;
}

/** Persists newly earned achievements and returns only the ones unlocked just now. */
export function syncAchievements(sessions: FocusSession[]): Achievement[] {
  const known = loadUnlocked();
  const earned = earnedAchievements(sessions);
  const fresh = earned.filter((id) => !known.includes(id));
  if (fresh.length) saveUnlocked([...known, ...fresh]);
  return fresh
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
    .filter((a): a is Achievement => Boolean(a));
}