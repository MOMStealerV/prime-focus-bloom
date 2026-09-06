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

  // Kick a demo session shortly after mount, once local state has settled.
  // Retries a few times because the engine restores its stored state on load.
  useEffect(() => {
    const flag = galleryFlag();
    if (!flag || flag === "profile") return;
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      if (phaseRef.current !== "idle" || tries > 10) {
        window.clearInterval(id);
        return;
      }
      if (!started.current || phaseRef.current === "idle") {
        started.current = true;
        start(25);
      }
    }, 400);
    return () => window.clearInterval(id);
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
