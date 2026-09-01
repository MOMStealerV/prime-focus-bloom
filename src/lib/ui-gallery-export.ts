/**
 * TEMPORARY documentation tool — captures gallery iframes as PNGs.
 * Same-origin frames only; nothing here touches app state.
 */
import html2canvas from "html2canvas-pro";
import JSZip from "jszip";

import { GALLERY_VIEWPORT, type GalleryScreen } from "./ui-gallery-screens";

async function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("canvas encode failed"))), "image/png");
  });
}

export async function captureFrame(frame: HTMLIFrameElement, scale = 2): Promise<Blob> {
  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  if (!doc?.body || !win) throw new Error("frame not ready");

  const canvas = await html2canvas(doc.documentElement, {
    windowWidth: GALLERY_VIEWPORT.width,
    windowHeight: GALLERY_VIEWPORT.height,
    width: GALLERY_VIEWPORT.width,
    height: GALLERY_VIEWPORT.height,
    scale,
    useCORS: true,
    backgroundColor: win.getComputedStyle(doc.body).backgroundColor || "#000",
    logging: false,
  });

  return await toBlob(canvas);
}

export async function exportAllScreens(
  items: { screen: GalleryScreen; frame: HTMLIFrameElement | null; fileName: string }[],
  onProgress?: (done: number, total: number, name: string) => void,
): Promise<Blob> {
  const zip = new JSZip();
  let done = 0;

  for (const { screen, frame, fileName } of items) {
    onProgress?.(done, items.length, screen.name);
    if (frame) {
      // Lazy frames may not have loaded yet — force them into view and settle.
      frame.scrollIntoView({ block: "center" });
      await waitForFrame(frame);
      try {
        const blob = await captureFrame(frame);
        zip.file(fileName, blob);
      } catch (error) {
        console.error(`Capture failed for ${screen.name}`, error);
      }
    }
    done += 1;
    onProgress?.(done, items.length, screen.name);
  }

  return await zip.generateAsync({ type: "blob" });
}

function waitForFrame(frame: HTMLIFrameElement): Promise<void> {
  return new Promise((resolve) => {
    const ready = frame.contentDocument?.readyState === "complete";
    if (ready) {
      // Give animations / theme + engine hydration a moment to settle.
      window.setTimeout(resolve, 700);
      return;
    }
    const onLoad = () => {
      frame.removeEventListener("load", onLoad);
      window.setTimeout(resolve, 900);
    };
    frame.addEventListener("load", onLoad);
    window.setTimeout(resolve, 4000);
  });
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
