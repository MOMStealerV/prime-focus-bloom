export const QUICK_STATS = [
  { label: "Focus Hours", value: "4.2h", delta: "+18%", icon: "timer" },
  { label: "Distractions Avoided", value: "27", delta: "+6", icon: "shield" },
  { label: "Current Streak", value: "12d", delta: "best yet", icon: "flame" },
  { label: "Tasks Completed", value: "9/11", delta: "82%", icon: "check" },
] as const;

export const SCHEDULE = [
  { time: "07:00", title: "Morning Focus", detail: "Deep work · 90 min", state: "done" },
  { time: "09:00", title: "School / Work", detail: "Lectures & meetings", state: "done" },
  { time: "19:00", title: "Evening Study", detail: "Peak flow window", state: "active" },
  { time: "22:30", title: "Wind Down", detail: "No screens · reading", state: "upcoming" },
] as const;

export const HABIT_PROGRESS = [
  { name: "Reading", value: 82, unit: "41 / 50 pages" },
  { name: "Exercise", value: 60, unit: "30 / 50 min" },
  { name: "Sleep", value: 91, unit: "7h 18m" },
  { name: "Study", value: 45, unit: "1.8 / 4h" },
];

export const WEEKLY_FOCUS = [
  { day: "Mon", value: 3.2 },
  { day: "Tue", value: 4.6 },
  { day: "Wed", value: 2.8 },
  { day: "Thu", value: 5.1 },
  { day: "Fri", value: 4.2 },
  { day: "Sat", value: 6.0 },
  { day: "Sun", value: 4.9 },
];

export const SCREEN_TIME = [
  { week: "W1", value: 6.4 },
  { week: "W2", value: 5.8 },
  { week: "W3", value: 5.1 },
  { week: "W4", value: 4.3 },
  { week: "W5", value: 3.6 },
];

export const FLOW_TREND = [52, 58, 61, 57, 66, 72, 69, 78, 81, 76, 84, 88];

export const HEATMAP: number[][] = [
  [1, 2, 1, 0, 2, 3, 1],
  [2, 3, 2, 1, 3, 4, 2],
  [3, 4, 3, 2, 4, 4, 3],
  [1, 2, 4, 3, 2, 3, 4],
  [0, 1, 2, 4, 3, 2, 1],
];

export const DISTRACTING_APPS = [
  { name: "Instagram", minutes: 74, share: 92 },
  { name: "TikTok", minutes: 51, share: 68 },
  { name: "YouTube", minutes: 43, share: 56 },
  { name: "Messages", minutes: 28, share: 38 },
  { name: "Reddit", minutes: 17, share: 22 },
];

export const HABITS = [
  { id: "read", name: "Read 20 pages", streak: 12, schedule: "Daily", done: true },
  { id: "move", name: "Move 30 minutes", streak: 5, schedule: "Mon–Sat", done: false },
  { id: "sleep", name: "Lights out by 23:00", streak: 21, schedule: "Daily", done: true },
  { id: "study", name: "Deep study block", streak: 8, schedule: "Weekdays", done: false },
  { id: "water", name: "2L water", streak: 34, schedule: "Daily", done: true },
];

export const SESSION_PRESETS = [25, 45, 60, 90];

export const AMBIENT_SOUNDS = [
  { id: "rain", name: "Rain" },
  { id: "cafe", name: "Café" },
  { id: "waves", name: "Waves" },
  { id: "brown", name: "Brown Noise" },
  { id: "silence", name: "Silence" },
];