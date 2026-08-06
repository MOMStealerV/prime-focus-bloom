import { useSyncExternalStore } from "react";

export type MusicService = "none" | "spotify" | "youtube" | "apple" | "local";
export type ThemeMode = "system" | "light" | "dark";
export type FontSize = "sm" | "md" | "lg";
export type CountdownStyle = "ring" | "digits" | "minimal";
export type ReminderFrequency = "low" | "balanced" | "high";

export type NotificationPrefs = {
  focusReminders: boolean;
  studyReminders: boolean;
  assignmentReminders: boolean;
  habitReminders: boolean;
  dailySummary: boolean;
  weeklyReport: boolean;
  goalReminders: boolean;
  achievementAlerts: boolean;
  distractionAlerts: boolean;
  quietHours: boolean;
  quietFrom: string;
  quietTo: string;
  sound: "chime" | "soft" | "silent";
  frequency: ReminderFrequency;
};

export type AppearancePrefs = {
  mode: ThemeMode;
  fontSize: FontSize;
  animations: boolean;
  reduceMotion: boolean;
};

export type FocusPrefs = {
  focusMinutes: number;
  shortBreak: number;
  longBreak: number;
  longBreakEvery: number;
  autoStartBreak: boolean;
  autoStartFocus: boolean;
  dailyGoal: number;
  countdownStyle: CountdownStyle;
  completionSound: boolean;
  musicService: MusicService;
};

export type PrivacyPrefs = {
  localOnly: boolean;
  cloudSync: boolean;
  usageAnalytics: boolean;
  crashReports: boolean;
  pinLock: boolean;
  biometricLock: boolean;
  autoLockMinutes: number;
  privacyMode: boolean;
};

export type IntegrationState = { connected: boolean; lastSync: number | null };

export type AppPrefs = {
  notifications: NotificationPrefs;
  appearance: AppearancePrefs;
  focus: FocusPrefs;
  privacy: PrivacyPrefs;
  integrations: Record<string, IntegrationState>;
  guestBannerDismissed: boolean;
};

const STORAGE_KEY = "primeflow-prefs";
const LEGACY_KEY = "primeflow-prefs";

export const DEFAULT_PREFS: AppPrefs = {
  notifications: {
    focusReminders: true,
    studyReminders: true,
    assignmentReminders: true,
    habitReminders: true,
    dailySummary: true,
    weeklyReport: false,
    goalReminders: true,
    achievementAlerts: true,
    distractionAlerts: false,
    quietHours: false,
    quietFrom: "22:00",
    quietTo: "07:00",
    sound: "chime",
    frequency: "balanced",
  },
  appearance: {
    mode: "system",
    fontSize: "md",
    animations: true,
    reduceMotion: false,
  },
  focus: {
    focusMinutes: 45,
    shortBreak: 5,
    longBreak: 15,
    longBreakEvery: 4,
    autoStartBreak: true,
    autoStartFocus: false,
    dailyGoal: 120,
    countdownStyle: "ring",
    completionSound: true,
    musicService: "none",
  },
  privacy: {
    localOnly: true,
    cloudSync: false,
    usageAnalytics: false,
    crashReports: true,
    pinLock: false,
    biometricLock: false,
    autoLockMinutes: 5,
    privacyMode: true,
  },
  integrations: {},
  guestBannerDismissed: false,
};

let prefs: AppPrefs = DEFAULT_PREFS;
let hydrated = false;
const listeners = new Set<() => void>();

function merge(raw: unknown): AppPrefs {
  const partial = (raw ?? {}) as Partial<AppPrefs> & Record<string, unknown>;
  const legacyNotifications: Partial<NotificationPrefs> = {};
  // migrate the flat Stage-2 keys so nothing the user set is lost
  if (typeof partial["focusReminders"] === "boolean")
    legacyNotifications.focusReminders = partial["focusReminders"] as boolean;
  if (typeof partial["dailySummary"] === "boolean")
    legacyNotifications.dailySummary = partial["dailySummary"] as boolean;
  if (typeof partial["distractionAlerts"] === "boolean")
    legacyNotifications.distractionAlerts = partial["distractionAlerts"] as boolean;
  const legacyPrivacy: Partial<PrivacyPrefs> = {};
  if (typeof partial["privacyMode"] === "boolean")
    legacyPrivacy.privacyMode = partial["privacyMode"] as boolean;

  return {
    notifications: {
      ...DEFAULT_PREFS.notifications,
      ...legacyNotifications,
      ...(partial.notifications ?? {}),
    },
    appearance: { ...DEFAULT_PREFS.appearance, ...(partial.appearance ?? {}) },
    focus: { ...DEFAULT_PREFS.focus, ...(partial.focus ?? {}) },
    privacy: { ...DEFAULT_PREFS.privacy, ...legacyPrivacy, ...(partial.privacy ?? {}) },
    integrations: { ...(partial.integrations ?? {}) },
    guestBannerDismissed: Boolean(partial.guestBannerDismissed),
  };
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_KEY);
    if (raw) prefs = merge(JSON.parse(raw));
  } catch {
    /* ignore malformed storage */
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPrefs(): AppPrefs {
  hydrate();
  return prefs;
}

export function setGroup<K extends "notifications" | "appearance" | "focus" | "privacy">(
  group: K,
  patch: Partial<AppPrefs[K]>,
) {
  hydrate();
  prefs = { ...prefs, [group]: { ...prefs[group], ...patch } };
  persist();
}

export function toggleGroupKey<K extends "notifications" | "appearance" | "focus" | "privacy">(
  group: K,
  key: keyof AppPrefs[K],
) {
  hydrate();
  const current = prefs[group] as Record<string, unknown>;
  setGroup(group, { [key]: !current[key as string] } as Partial<AppPrefs[K]>);
}

export function setIntegration(id: string, state: IntegrationState) {
  hydrate();
  prefs = { ...prefs, integrations: { ...prefs.integrations, [id]: state } };
  persist();
}

export function setGuestBannerDismissed(value: boolean) {
  hydrate();
  prefs = { ...prefs, guestBannerDismissed: value };
  persist();
}

export function replacePrefs(next: AppPrefs) {
  hydrate();
  prefs = merge(next);
  persist();
}

export function resetPrefs() {
  prefs = DEFAULT_PREFS;
  persist();
}

export function usePrefs(): AppPrefs {
  return useSyncExternalStore(
    subscribe,
    () => {
      hydrate();
      return prefs;
    },
    () => DEFAULT_PREFS,
  );
}
