import { useEffect } from "react";

import { usePrefs } from "./prefs";
import { THEMES, useTheme, type ThemeId } from "./theme";

/** Dark/light counterparts so a mode switch keeps the chosen palette family. */
const PAIRS: Record<ThemeId, ThemeId> = {
  midnight: "arctic",
  arctic: "midnight",
  emerald: "sakura",
  sakura: "emerald",
};

export function themeForTone(current: ThemeId, tone: "dark" | "light"): ThemeId {
  const meta = THEMES.find((t) => t.id === current)!;
  return meta.tone === tone ? current : PAIRS[current];
}

const FONT_SCALE = { sm: "15px", md: "16px", lg: "18px" } as const;

/** Applies appearance preferences (mode, font size, motion) to the document. */
export function useAppearanceSync() {
  const { appearance } = usePrefs();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SCALE[appearance.fontSize];
  }, [appearance.fontSize]);

  useEffect(() => {
    const off = appearance.reduceMotion || !appearance.animations;
    document.documentElement.dataset.motion = off ? "reduced" : "full";
  }, [appearance.reduceMotion, appearance.animations]);

  useEffect(() => {
    if (appearance.mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const apply = () => setTheme(themeForTone(theme, mq.matches ? "dark" : "light"));
      apply();
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
    setTheme(themeForTone(theme, appearance.mode === "dark" ? "dark" : "light"));
    return undefined;
    // `theme` is intentionally excluded: manual palette picks must not be undone.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appearance.mode, setTheme]);
}
