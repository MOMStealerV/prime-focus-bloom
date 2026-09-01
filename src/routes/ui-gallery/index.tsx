/**
 * TEMPORARY documentation tool — complete visual reference of the PrimeFlow UI.
 * Every frame embeds a real route; nothing here reimplements or restyles the app.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";

import {
  GALLERY_SCREENS,
  GALLERY_VIEWPORT,
  screenFileName,
  screenSrc,
  type GalleryScreen,
} from "@/lib/ui-gallery-screens";
import { THEMES, useTheme } from "@/lib/theme";
import { captureFrame, downloadBlob, exportAllScreens } from "@/lib/ui-gallery-export";

export const Route = createFileRoute("/ui-gallery/")({
  head: () => ({
    meta: [
      { title: "PrimeFlow UI Reference Gallery" },
      {
        name: "description",
        content: "Temporary visual reference of every PrimeFlow screen at a mobile viewport.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "PrimeFlow UI Reference Gallery" },
      {
        property: "og:description",
        content: "Every PrimeFlow screen and key state, captured at 393 x 852.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { theme, setTheme } = useTheme();
  const frames = useRef(new Map<string, HTMLIFrameElement>());
  const [progress, setProgress] = useState<string | null>(null);

  const register = (key: string) => (el: HTMLIFrameElement | null) => {
    if (el) frames.current.set(key, el);
    else frames.current.delete(key);
  };

  const onExportAll = async () => {
    setProgress("Preparing…");
    try {
      const blob = await exportAllScreens(
        GALLERY_SCREENS.map((s, i) => ({
          screen: s,
          frame: frames.current.get(`${s.name}-${i}`) ?? null,
          fileName: screenFileName(s, i),
        })),
        (done, total, name) => setProgress(`Capturing ${done}/${total} · ${name}`),
      );
      downloadBlob(blob, "primeflow-ui-reference.zip");
      setProgress(null);
    } catch (error) {
      console.error(error);
      setProgress("Export failed — see console");
    }
  };

  const onExportOne = async (screen: GalleryScreen, index: number) => {
    const frame = frames.current.get(`${screen.name}-${index}`);
    if (!frame) return;
    setProgress(`Capturing ${screen.name}…`);
    try {
      const blob = await captureFrame(frame);
      downloadBlob(blob, screenFileName(screen, index));
      setProgress(null);
    } catch (error) {
      console.error(error);
      setProgress("Export failed — see console");
    }
  };

  const groups = Array.from(new Set(GALLERY_SCREENS.map((s) => s.group)));

  return (
    <div className="min-h-screen bg-background px-5 py-8 text-foreground">
      <header className="mx-auto max-w-[1400px]">
        <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
          Temporary reference
        </p>
        <h1 className="font-display mt-1 text-3xl font-semibold">PrimeFlow UI Gallery</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {GALLERY_SCREENS.length} screens rendered live at {GALLERY_VIEWPORT.width}×
          {GALLERY_VIEWPORT.height}. Each frame is the real route — styling, spacing and components
          are untouched.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`rounded-2xl border px-3 py-2 text-xs font-medium transition-colors ${
                theme === t.id
                  ? "border-primary/60 bg-primary/15 text-foreground"
                  : "border-border/60 text-muted-foreground hover:bg-primary/8"
              }`}
            >
              {t.name}
            </button>
          ))}
          <span className="mx-1 h-6 w-px bg-border/60" />
          <Link
            to="/ui-gallery/view"
            className="rounded-2xl border border-border/60 px-3 py-2 text-xs font-medium hover:bg-primary/8"
          >
            Sequential viewer →
          </Link>
          <button
            onClick={onExportAll}
            className="accent-gradient rounded-2xl px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            Export All Screens (ZIP)
          </button>
          {progress ? (
            <span className="text-xs text-muted-foreground" role="status">
              {progress}
            </span>
          ) : null}
        </div>
      </header>

      <main className="mx-auto mt-10 max-w-[1400px] space-y-12">
        {groups.map((group) => (
          <section key={group}>
            <h2 className="font-display mb-4 text-lg font-semibold">{group}</h2>
            <div className="flex flex-wrap gap-8">
              {GALLERY_SCREENS.map((screen, index) =>
                screen.group === group ? (
                  <figure key={`${screen.name}-${index}`} className="w-[393px]">
                    <figcaption className="mb-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-semibold">
                          {String(index + 1).padStart(2, "0")} · {screen.name}
                        </span>
                        <button
                          onClick={() => void onExportOne(screen, index)}
                          className="text-[11px] text-muted-foreground underline-offset-2 hover:underline"
                        >
                          PNG
                        </button>
                      </div>
                      <code className="text-[11px] text-muted-foreground">
                        {screenSrc(screen)}
                      </code>
                      <p className="text-[11px] text-muted-foreground">{screen.note}</p>
                    </figcaption>
                    <div
                      className="overflow-hidden rounded-[28px] border border-border/60 shadow-[0_20px_50px_-30px_rgb(0_0_0/0.6)]"
                      style={{ width: GALLERY_VIEWPORT.width, height: GALLERY_VIEWPORT.height }}
                    >
                      <iframe
                        ref={register(`${screen.name}-${index}`)}
                        src={screenSrc(screen)}
                        title={screen.name}
                        loading="lazy"
                        width={GALLERY_VIEWPORT.width}
                        height={GALLERY_VIEWPORT.height}
                        className="block border-0"
                      />
                    </div>
                  </figure>
                ) : null,
              )}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
