/**
 * TEMPORARY documentation tool — sequential one-screen-at-a-time viewer.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  GALLERY_SCREENS,
  GALLERY_VIEWPORT,
  screenFileName,
  screenSrc,
} from "@/lib/ui-gallery-screens";
import { captureFrame, downloadBlob } from "@/lib/ui-gallery-export";

export const Route = createFileRoute("/ui-gallery/view")({
  head: () => ({
    meta: [
      { title: "PrimeFlow UI Reference — Sequential Viewer" },
      {
        name: "description",
        content: "Step through every PrimeFlow screen one at a time at a fixed mobile viewport.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "PrimeFlow UI Reference — Sequential Viewer" },
      {
        property: "og:description",
        content: "Step through every PrimeFlow screen at 393 x 852.",
      },
    ],
  }),
  component: ViewerPage,
});

function ViewerPage() {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const screen = GALLERY_SCREENS[index];

  const go = useCallback((delta: number) => {
    setIndex((i) => (i + delta + GALLERY_SCREENS.length) % GALLERY_SCREENS.length);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const exportCurrent = async () => {
    if (!frameRef.current) return;
    setStatus("Capturing…");
    try {
      const blob = await captureFrame(frameRef.current);
      downloadBlob(blob, screenFileName(screen, index));
      setStatus(null);
    } catch (error) {
      console.error(error);
      setStatus("Export failed — see console");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-5 py-8 text-foreground">
      <div className="w-full max-w-[520px]">
        <div className="flex items-center justify-between">
          <Link to="/ui-gallery" className="text-xs text-muted-foreground hover:underline">
            ← Full gallery
          </Link>
          <span className="text-xs text-muted-foreground">
            {index + 1} / {GALLERY_SCREENS.length}
          </span>
        </div>

        <h1 className="font-display mt-3 text-2xl font-semibold">{screen.name}</h1>
        <code className="text-[11px] text-muted-foreground">{screenSrc(screen)}</code>
        <p className="text-[11px] text-muted-foreground">{screen.note}</p>

        <div
          className="mt-4 overflow-hidden rounded-[28px] border border-border/60 shadow-[0_20px_50px_-30px_rgb(0_0_0/0.6)]"
          style={{ width: GALLERY_VIEWPORT.width, height: GALLERY_VIEWPORT.height }}
        >
          <iframe
            key={screenSrc(screen)}
            ref={frameRef}
            src={screenSrc(screen)}
            title={screen.name}
            width={GALLERY_VIEWPORT.width}
            height={GALLERY_VIEWPORT.height}
            className="block border-0"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => go(-1)}
            className="rounded-2xl border border-border/60 px-4 py-2 text-xs font-medium hover:bg-primary/8"
          >
            ← Previous
          </button>
          <button
            onClick={() => go(1)}
            className="rounded-2xl border border-border/60 px-4 py-2 text-xs font-medium hover:bg-primary/8"
          >
            Next →
          </button>
          <button
            onClick={() => void exportCurrent()}
            className="accent-gradient rounded-2xl px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            Export this screen (PNG)
          </button>
          {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
        </div>
      </div>
    </div>
  );
}
