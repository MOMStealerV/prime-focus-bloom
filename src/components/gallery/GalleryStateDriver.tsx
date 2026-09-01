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
  const { state, start, pause, reset } = useFocusEngine();
  const started = useRef(false);
  const paused = useRef(false);

  useEffect(() => {
    const flag = galleryFlag();
    if (!flag || flag === "profile") return;
    if (started.current) return;
    // Never hijack a real session that is already running.
    if (state.phase !== "idle") return;
    started.current = true;
    start(25);
    return () => {
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  useEffect(() => {
    if (galleryFlag() !== "focus-paused") return;
    if (paused.current || state.phase !== "focus") return;
    paused.current = true;
    pause();
  }, [state.phase, pause]);

  return null;
}
