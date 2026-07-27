import { useContext, useEffect, useState } from "react";

import { FocusEngineContext } from "@/lib/focus-engine";

export function useFocusEngine() {
  const ctx = useContext(FocusEngineContext);
  if (!ctx) throw new Error("useFocusEngine must be used inside FocusEngineProvider");
  return ctx;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
}