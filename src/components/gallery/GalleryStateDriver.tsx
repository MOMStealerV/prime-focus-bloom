/**
 * TEMPORARY documentation tool.
 *
 * Puts the focus engine into the state requested by the gallery-only `?gallery=` flag
 * so the UI reference can show the running / paused / mini-widget screens.
 * Does nothing at all when the flag is absent, which is every normal visit.
 */
import { useEffect, useRef } from "react";

import { useFocusEngine } from "@/hooks/useFocusEngine";
import { galleryFlag } from "@/lib/ui-gallery-screens";

export function GalleryStateDriver() {
  const { state, start, pause } = useFocusEngine();
  const started = useRef(false);
  const paused = useRef(false);
  const phaseRef = useRef(state.phase);
  phaseRef.current = state.phase;

  // Kick a demo session once, on mount only. Never touches a real session.
  useEffect(() => {
    const flag = galleryFlag();
    if (!flag || flag === "profile") return;
    if (started.current) return;
    if (phaseRef.current !== "idle") return;
    started.current = true;
    start(25);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (galleryFlag() !== "focus-paused") return;
    if (paused.current || state.phase !== "focus") return;
    paused.current = true;
    pause();
  }, [state.phase, pause]);

  return null;
}
