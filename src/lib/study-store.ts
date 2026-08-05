import { useSyncExternalStore } from "react";

export type Subject = { id: string; name: string; color: string; targetHours: number; loggedHours: number };
export type PlannerItem = { id: string; title: string; subject: string; date: string; minutes: number; done: boolean };
export type Note = { id: string; title: string; subject: string; body: string; updated: number };
export type Assignment = { id: string; title: string; subject: string; due: string; done: boolean };

export type StudyState = {
  subjects: Subject[];
  planner: PlannerItem[];
  notes: Note[];
  assignments: Assignment[];
};

const STORAGE_KEY = "primeflow-study";

function iso(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const DEFAULTS: StudyState = {
  subjects: [
    { id: "s1", name: "Mathematics", color: "var(--primary)", targetHours: 6, loggedHours: 3.5 },
    { id: "s2", name: "Physics", color: "var(--primary)", targetHours: 5, loggedHours: 2 },
    { id: "s3", name: "Literature", color: "var(--primary)", targetHours: 4, loggedHours: 3.2 },
  ],
  planner: [
    { id: "p1", title: "Integrals revision", subject: "Mathematics", date: iso(0), minutes: 90, done: false },
    { id: "p2", title: "Optics problem set", subject: "Physics", date: iso(0), minutes: 45, done: true },
    { id: "p3", title: "Essay outline", subject: "Literature", date: iso(1), minutes: 60, done: false },
  ],
  notes: [
    { id: "n1", title: "Chain rule cheatsheet", subject: "Mathematics", body: "d/dx f(g(x)) = f'(g(x))·g'(x). Practice with nested trig.", updated: Date.now() - 3600_000 },
    { id: "n2", title: "Lens formula", subject: "Physics", body: "1/f = 1/v - 1/u. Sign conventions matter for concave lenses.", updated: Date.now() - 86_400_000 },
  ],
  assignments: [
    { id: "a1", title: "Problem set 7", subject: "Mathematics", due: iso(1), done: false },
    { id: "a2", title: "Lab report", subject: "Physics", due: iso(3), done: false },
    { id: "a3", title: "Reading response", subject: "Literature", due: iso(-1), done: true },
  ],
};

let state: StudyState = DEFAULTS;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...DEFAULTS, ...(JSON.parse(raw) as Partial<StudyState>) };
  } catch {
    /* ignore malformed storage */
  }
}

function commit(next: StudyState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

export function useStudy() {
  return useSyncExternalStore(
    subscribe,
    () => {
      hydrate();
      return state;
    },
    () => DEFAULTS,
  );
}

const uid = () => Math.random().toString(36).slice(2, 9);

export function addSubject(name: string, targetHours = 4) {
  hydrate();
  if (!name.trim()) return;
  commit({
    ...state,
    subjects: [...state.subjects, { id: uid(), name: name.trim(), color: "var(--primary)", targetHours, loggedHours: 0 }],
  });
}

export function removeSubject(id: string) {
  hydrate();
  commit({ ...state, subjects: state.subjects.filter((s) => s.id !== id) });
}

export function logSubjectHours(id: string, hours: number) {
  hydrate();
  commit({
    ...state,
    subjects: state.subjects.map((s) =>
      s.id === id ? { ...s, loggedHours: Math.max(0, Math.round((s.loggedHours + hours) * 10) / 10) } : s,
    ),
  });
}

export function addPlannerItem(item: Omit<PlannerItem, "id" | "done">) {
  hydrate();
  if (!item.title.trim()) return;
  commit({ ...state, planner: [...state.planner, { ...item, id: uid(), done: false }] });
}

export function togglePlannerItem(id: string) {
  hydrate();
  commit({ ...state, planner: state.planner.map((p) => (p.id === id ? { ...p, done: !p.done } : p)) });
}

export function removePlannerItem(id: string) {
  hydrate();
  commit({ ...state, planner: state.planner.filter((p) => p.id !== id) });
}

export function saveNote(note: { id?: string; title: string; subject: string; body: string }) {
  hydrate();
  if (!note.title.trim()) return;
  if (note.id) {
    commit({
      ...state,
      notes: state.notes.map((n) => (n.id === note.id ? { ...n, ...note, updated: Date.now() } : n)),
    });
    return;
  }
  commit({
    ...state,
    notes: [{ id: uid(), title: note.title.trim(), subject: note.subject, body: note.body, updated: Date.now() }, ...state.notes],
  });
}

export function removeNote(id: string) {
  hydrate();
  commit({ ...state, notes: state.notes.filter((n) => n.id !== id) });
}

export function addAssignment(item: Omit<Assignment, "id" | "done">) {
  hydrate();
  if (!item.title.trim()) return;
  commit({ ...state, assignments: [...state.assignments, { ...item, id: uid(), done: false }] });
}

export function toggleAssignment(id: string) {
  hydrate();
  commit({
    ...state,
    assignments: state.assignments.map((a) => (a.id === id ? { ...a, done: !a.done } : a)),
  });
}

export function removeAssignment(id: string) {
  hydrate();
  commit({ ...state, assignments: state.assignments.filter((a) => a.id !== id) });
}

export function studySummary(s: StudyState) {
  const today = new Date().toISOString().slice(0, 10);
  const todayPlanned = s.planner.filter((p) => p.date === today);
  const plannedMinutes = todayPlanned.reduce((t, p) => t + p.minutes, 0);
  const doneMinutes = todayPlanned.filter((p) => p.done).reduce((t, p) => t + p.minutes, 0);
  const openAssignments = s.assignments.filter((a) => !a.done);
  const dueSoon = openAssignments.filter((a) => a.due <= iso(2)).length;
  const target = s.subjects.reduce((t, x) => t + x.targetHours, 0) || 1;
  const logged = s.subjects.reduce((t, x) => t + x.loggedHours, 0);
  return {
    plannedMinutes,
    doneMinutes,
    progress: plannedMinutes ? Math.round((doneMinutes / plannedMinutes) * 100) : 0,
    weekProgress: Math.min(100, Math.round((logged / target) * 100)),
    loggedHours: Math.round(logged * 10) / 10,
    targetHours: Math.round(target * 10) / 10,
    openAssignments: openAssignments.length,
    dueSoon,
    nextUp: todayPlanned.find((p) => !p.done) ?? s.planner.find((p) => !p.done) ?? null,
    notes: s.notes.length,
    subjects: s.subjects.length,
  };
}
