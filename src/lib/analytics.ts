import { DAILY_GOAL_MINUTES } from "@/types/focus";
import type { AnalyticsSummary, DayBucket } from "@/types/analytics";
import type { FocusSession } from "@/types/session";

const DAY_MS = 86_400_000;
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const isoDay = (ts: number) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const startOfDay = (ts: number) => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const focusOnly = (sessions: FocusSession[]) => sessions.filter((s) => s.kind === "focus");

export function minutesBetween(sessions: FocusSession[], from: number, to: number) {
  return focusOnly(sessions)
    .filter((s) => s.startedAt >= from && s.startedAt < to)
    .reduce((sum, s) => sum + s.actualMinutes, 0);
}

export function minutesByDay(sessions: FocusSession[]) {
  const map = new Map<string, { minutes: number; sessions: number }>();
  for (const s of focusOnly(sessions)) {
    const key = isoDay(s.startedAt);
    const entry = map.get(key) ?? { minutes: 0, sessions: 0 };
    entry.minutes += s.actualMinutes;
    entry.sessions += 1;
    map.set(key, entry);
  }
  return map;
}

function streaks(sessions: FocusSession[]) {
  const days = [...new Set(focusOnly(sessions).map((s) => startOfDay(s.startedAt)))].sort(
    (a, b) => a - b,
  );
  if (days.length === 0) return { current: 0, best: 0 };

  let best = 1;
  let run = 1;
  for (let i = 1; i < days.length; i += 1) {
    run = days[i] - days[i - 1] === DAY_MS ? run + 1 : 1;
    best = Math.max(best, run);
  }

  const today = startOfDay(Date.now());
  const last = days[days.length - 1];
  let current = 0;
  if (last === today || last === today - DAY_MS) {
    current = 1;
    for (let i = days.length - 1; i > 0; i -= 1) {
      if (days[i] - days[i - 1] === DAY_MS) current += 1;
      else break;
    }
  }
  return { current, best };
}

/**
 * Deterministic flow score.
 * 40% completion rate · 25% daily goal progress · 20% consistency · 15% low distractions.
 */
export function computeFlowScore(sessions: FocusSession[], now = Date.now()) {
  const focus = focusOnly(sessions);
  if (focus.length === 0) return 0;

  const recent = focus.filter((s) => s.startedAt >= now - 30 * DAY_MS);
  const pool = recent.length > 0 ? recent : focus;

  const completionRate = pool.filter((s) => s.completed).length / pool.length;

  const today = startOfDay(now);
  const todayMinutes = minutesBetween(focus, today, today + DAY_MS);
  const goalProgress = Math.min(1, todayMinutes / DAILY_GOAL_MINUTES);

  const activeDays = new Set(
    focus.filter((s) => s.startedAt >= now - 7 * DAY_MS).map((s) => startOfDay(s.startedAt)),
  ).size;
  const consistency = Math.min(1, activeDays / 7);

  const avgDistractions = pool.reduce((sum, s) => sum + s.distractions, 0) / pool.length;
  const lowDistractions = Math.max(0, 1 - avgDistractions / 5);

  const score =
    completionRate * 40 + goalProgress * 25 + consistency * 20 + lowDistractions * 15;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function computeAnalytics(sessions: FocusSession[], now = Date.now()): AnalyticsSummary {
  const focus = focusOnly(sessions);
  const today = startOfDay(now);
  const byDay = minutesByDay(sessions);

  const last7Days: DayBucket[] = Array.from({ length: 7 }, (_, i) => {
    const ts = today - (6 - i) * DAY_MS;
    const key = isoDay(ts);
    const entry = byDay.get(key);
    return {
      date: key,
      label: DAY_LABELS[new Date(ts).getDay()],
      minutes: Math.round(entry?.minutes ?? 0),
      sessions: entry?.sessions ?? 0,
    };
  });

  const weekMinutes = last7Days.reduce((sum, d) => sum + d.minutes, 0);
  const prevWeekMinutes = minutesBetween(focus, today - 13 * DAY_MS, today - 6 * DAY_MS);
  const monthMinutes = minutesBetween(focus, today - 29 * DAY_MS, today + DAY_MS);
  const prevMonthMinutes = minutesBetween(focus, today - 59 * DAY_MS, today - 29 * DAY_MS);

  const growth = (current: number, previous: number) =>
    previous > 0 ? Math.round(((current - previous) / previous) * 100) : current > 0 ? 100 : 0;

  const totalMinutes = focus.reduce((sum, s) => sum + s.actualMinutes, 0);
  const completed = focus.filter((s) => s.completed).length;

  const hourDistribution = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    minutes: Math.round(
      focus.filter((s) => s.hour === hour).reduce((sum, s) => sum + s.actualMinutes, 0),
    ),
  }));

  // Five weeks of daily intensity, oldest week first, Sunday-first columns.
  const heatmapStart = today - (34 + new Date(today).getDay()) * DAY_MS;
  const heatmap = Array.from({ length: 5 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const ts = heatmapStart + (week * 7 + day) * DAY_MS;
      const minutes = Math.round(byDay.get(isoDay(ts))?.minutes ?? 0);
      const level =
        minutes === 0 ? 0 : minutes < 25 ? 1 : minutes < 60 ? 2 : minutes < 120 ? 3 : 4;
      return { date: isoDay(ts), level, minutes };
    }),
  );

  const flowTrend = Array.from({ length: 8 }, (_, i) => {
    const weekEnd = today - (7 - i - 1) * 7 * DAY_MS + DAY_MS;
    const upTo = focus.filter((s) => s.startedAt < weekEnd);
    return {
      weekLabel: `W${i + 1}`,
      score: upTo.length ? computeFlowScore(upTo, weekEnd - 1) : 0,
    };
  });

  const { current, best } = streaks(sessions);

  return {
    hasData: focus.length > 0,
    totalSessions: focus.length,
    todayMinutes: Math.round(minutesBetween(focus, today, today + DAY_MS)),
    weekMinutes,
    last7Days,
    averageSessionMinutes: focus.length ? Math.round(totalMinutes / focus.length) : 0,
    completionRate: focus.length ? Math.round((completed / focus.length) * 100) : 0,
    interruptedSessions: focus.length - completed,
    currentStreak: current,
    bestStreak: best,
    weeklyGrowth: growth(weekMinutes, prevWeekMinutes),
    monthlyGrowth: growth(monthMinutes, prevMonthMinutes),
    hourDistribution,
    heatmap,
    flowTrend,
    flowScore: computeFlowScore(sessions, now),
    distractions: focus.reduce((sum, s) => sum + s.distractions, 0),
  };
}

export function formatMinutes(minutes: number) {
  const total = Math.round(minutes);
  if (total < 60) return `${total}m`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatClock(ms: number) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}