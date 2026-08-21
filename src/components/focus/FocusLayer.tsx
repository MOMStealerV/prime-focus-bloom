import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";


import { FocusOverlay } from "./Overlay";
import { MiniWidget } from "./MiniWidget";
import { BottomNav } from "@/components/primeflow/BottomNav";
import { useFocusEngine } from "@/hooks/useFocusEngine";
import { isActive } from "@/lib/focus-machine";

export function FocusLayer() {
  const { state } = useFocusEngine();
  const { pathname } = useLocation();
  const [minimized, setMinimized] = useState(false);
  const active = isActive(state.phase) || state.phase === "completed";
  const onFocusRoute = pathname === "/focus";

  useEffect(() => {
    if (state.phase === "preparing" || state.phase === "idle") setMinimized(false);
  }, [state.phase]);

  // Leaving the focus screen collapses the session into the mini widget;
  // returning to /focus brings the immersive overlay back.
  useEffect(() => {
    setMinimized(!onFocusRoute);
  }, [onFocusRoute]);

  const showOverlay = active && !minimized;

  return (
    <>
      {showOverlay ? <FocusOverlay onMinimize={() => setMinimized(true)} /> : null}
      {active && !showOverlay ? <MiniWidget onOpen={() => setMinimized(false)} /> : null}
      {showOverlay ? null : <BottomNav />}
    </>
  );
}
