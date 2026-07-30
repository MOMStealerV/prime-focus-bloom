import { useSyncExternalStore } from "react";

export type AppPrefs = {
  focusReminders: boolean;
  dailySummary: boolean;
  distractionAlerts: boolean;
  privacyMode: boolean;
};

const STORAGE_KEY = "primeflow-prefs";

const DEFAULTS: AppPrefs = {
  focusReminders: true,
  dailySummary: true,
  distractionAlerts: false,
  privacyMode: true,
};

let prefs: AppPrefs = DEFAULTS;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) prefs = { ...DEFAULTS, ...(JSON.parse(raw) as Partial<AppPrefs>) };
  } catch {
    /* ignore malformed storage */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function togglePref(key: keyof AppPrefs) {
  hydrate();
  prefs = { ...prefs, [key]: !prefs[key] };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* storage unavailable */
  }
  emit();
}

export function useAppPrefs() {
  return useSyncExternalStore(
    subscribe,
    () => {
      hydrate();
      return prefs;
    },
    () => DEFAULTS,
  );
}