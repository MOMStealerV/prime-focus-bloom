/**
 * Local-first sync architecture.
 *
 * Everything PrimeFlow stores lives in localStorage today. This module adds the
 * scaffolding a cloud driver will need later: a stable device id, versioned
 * envelopes with `updatedAt`, an outbox queue and last-write-wins conflict
 * resolution. The only driver shipped now is the local no-op driver.
 */

export const STORAGE_VERSION = 2;

const DEVICE_KEY = "primeflow-device-id";
const OUTBOX_KEY = "primeflow-outbox";
const SYNC_META_KEY = "primeflow-sync-meta";

export type SyncStatus = "local-only" | "offline" | "pending" | "synced";

export type Envelope<T> = {
  version: number;
  deviceId: string;
  updatedAt: number;
  data: T;
};

export type OutboxEntry = {
  id: string;
  collection: string;
  op: "upsert" | "delete";
  payload: unknown;
  updatedAt: number;
  deviceId: string;
};

export type SyncDriver = {
  id: string;
  push: (entries: OutboxEntry[]) => Promise<{ accepted: string[] }>;
  pull: (since: number) => Promise<OutboxEntry[]>;
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getDeviceId(): string {
  if (!isBrowser()) return "server";
  let id = window.localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `dev-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export function wrap<T>(data: T): Envelope<T> {
  return { version: STORAGE_VERSION, deviceId: getDeviceId(), updatedAt: Date.now(), data };
}

export function unwrap<T>(raw: unknown, fallback: T): T {
  if (raw && typeof raw === "object" && "data" in (raw as Record<string, unknown>)) {
    return ((raw as Envelope<T>).data ?? fallback) as T;
  }
  return (raw as T) ?? fallback;
}

/** Last-write-wins, with the device id as a deterministic tie-breaker. */
export function resolveConflict<T extends { updatedAt: number; deviceId?: string }>(
  local: T,
  remote: T,
): T {
  if (remote.updatedAt > local.updatedAt) return remote;
  if (remote.updatedAt < local.updatedAt) return local;
  return (remote.deviceId ?? "") > (local.deviceId ?? "") ? remote : local;
}

export function readOutbox(): OutboxEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(OUTBOX_KEY);
    const parsed = raw ? (JSON.parse(raw) as OutboxEntry[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function enqueue(collection: string, op: OutboxEntry["op"], payload: unknown) {
  if (!isBrowser()) return;
  const entry: OutboxEntry = {
    id: `${collection}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    collection,
    op,
    payload,
    updatedAt: Date.now(),
    deviceId: getDeviceId(),
  };
  const next = [...readOutbox(), entry].slice(-500);
  try {
    window.localStorage.setItem(OUTBOX_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function clearOutbox(ids?: string[]) {
  if (!isBrowser()) return;
  const next = ids ? readOutbox().filter((e) => !ids.includes(e.id)) : [];
  window.localStorage.setItem(OUTBOX_KEY, JSON.stringify(next));
}

/** No-op driver: keeps everything on the device until a cloud driver is added. */
export const localDriver: SyncDriver = {
  id: "local",
  push: async (entries) => ({ accepted: entries.map((e) => e.id) }),
  pull: async () => [],
};

let driver: SyncDriver = localDriver;
export function setSyncDriver(next: SyncDriver) {
  driver = next;
}
export function getSyncDriver() {
  return driver;
}

export function isOnline() {
  return !isBrowser() || window.navigator.onLine;
}

export function lastSyncedAt(): number | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(SYNC_META_KEY);
  return raw ? Number(raw) : null;
}

export async function runSync(): Promise<SyncStatus> {
  if (!isOnline()) return "offline";
  const pending = readOutbox();
  if (driver.id === "local") return "local-only";
  const { accepted } = await driver.push(pending);
  clearOutbox(accepted);
  if (isBrowser()) window.localStorage.setItem(SYNC_META_KEY, String(Date.now()));
  return readOutbox().length ? "pending" : "synced";
}

export function syncStatus(cloudSyncEnabled: boolean): SyncStatus {
  if (!cloudSyncEnabled || driver.id === "local") return "local-only";
  if (!isOnline()) return "offline";
  return readOutbox().length ? "pending" : "synced";
}
