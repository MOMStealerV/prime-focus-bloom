import { STORAGE_VERSION, getDeviceId } from "./sync";

export type StorageModule = {
  id: string;
  label: string;
  key: string;
  bytes: number;
};

/** Every localStorage key PrimeFlow owns, grouped by module. */
export const MODULES: { id: string; label: string; key: string }[] = [
  { id: "focus", label: "Focus sessions", key: "primeflow-sessions" },
  { id: "engine", label: "Focus engine state", key: "primeflow-engine" },
  { id: "study", label: "Study data", key: "primeflow-study" },
  { id: "achievements", label: "Achievements", key: "primeflow-achievements" },
  { id: "habits", label: "Habits", key: "primeflow-habits" },
  { id: "prefs", label: "Settings", key: "primeflow-prefs" },
  { id: "theme", label: "Theme", key: "primeflow-theme" },
  { id: "cache", label: "Cache & queue", key: "primeflow-outbox" },
];

function isBrowser() {
  return typeof window !== "undefined";
}

function sizeOf(key: string) {
  if (!isBrowser()) return 0;
  const raw = window.localStorage.getItem(key);
  return raw ? new Blob([raw]).size : 0;
}

export function storageBreakdown(): StorageModule[] {
  return MODULES.map((m) => ({ ...m, bytes: sizeOf(m.key) }));
}

export function totalStorage() {
  return storageBreakdown().reduce((sum, m) => sum + m.bytes, 0);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export type Backup = {
  app: "primeflow";
  version: number;
  deviceId: string;
  exportedAt: number;
  data: Record<string, string>;
};

export function buildBackup(): Backup {
  const data: Record<string, string> = {};
  MODULES.forEach((m) => {
    if (m.id === "cache") return;
    const raw = isBrowser() ? window.localStorage.getItem(m.key) : null;
    if (raw) data[m.key] = raw;
  });
  return {
    app: "primeflow",
    version: STORAGE_VERSION,
    deviceId: getDeviceId(),
    exportedAt: Date.now(),
    data,
  };
}

export function downloadBackup() {
  const backup = buildBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `primeflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function restoreBackup(json: string) {
  const parsed = JSON.parse(json) as Backup;
  if (parsed.app !== "primeflow" || !parsed.data) throw new Error("Not a PrimeFlow backup file");
  Object.entries(parsed.data).forEach(([key, value]) => {
    window.localStorage.setItem(key, value);
  });
}

export function clearCache() {
  window.localStorage.removeItem("primeflow-outbox");
  window.localStorage.removeItem("primeflow-engine");
}

export function clearLocalData() {
  MODULES.forEach((m) => window.localStorage.removeItem(m.key));
}

export function factoryReset() {
  clearLocalData();
  window.localStorage.removeItem("primeflow-onboarding");
  window.localStorage.removeItem("primeflow-device-id");
}
