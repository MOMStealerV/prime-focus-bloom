import { useEffect, useState } from "react";

import { FocusOverlay } from "./Overlay";
import { MiniWidget } from "./MiniWidget";
import { BottomNav } from "@/components/primeflow/BottomNav";
import { useFocusEngine } from "@/hooks/useFocusEngine";
import { isActive } from "@/lib/focus-machine";

export function FocusLayer() {
  const { state } = useFocusEngine();
  const [minimized, setMinimized] = useState(false);
  const active = isActive(state.phase) || state.phase === "completed";

  useEffect(() => {
    if (state.phase === "preparing" || state.phase === "idle") setMinimized(false);
  }, [state.phase]);

  return (
    <>
      {active && !minimized ? <FocusOverlay onMinimize={() => setMinimized(true)} /> : null}
      {active && minimized ? <MiniWidget onOpen={() => setMinimized(false)} /> : null}
      {active && !minimized ? null : <BottomNav />}
    </>
  );
}