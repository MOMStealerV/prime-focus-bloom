import { useContext } from "react";

import { FocusEngineContext } from "@/lib/focus-engine";

export function useFocusEngine() {
  const ctx = useContext(FocusEngineContext);
  if (!ctx) throw new Error("useFocusEngine must be used inside FocusEngineProvider");
  return ctx;
}

export function useReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}