import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeId = "midnight" | "sakura" | "emerald" | "arctic";

export type ThemeMeta = {
  id: ThemeId;
  name: string;
  tagline: string;
  tone: "dark" | "light";
  swatch: [string, string, string];
};

export const THEMES: ThemeMeta[] = [
  {
    id: "midnight",
    name: "Midnight Flow",
    tagline: "Deep charcoal, electric blue",
    tone: "dark",
    swatch: ["oklch(0.16 0.018 265)", "oklch(0.68 0.19 255)", "oklch(0.75 0.17 220)"],
  },
  {
    id: "sakura",
    name: "Sakura Glow",
    tagline: "Soft petals, rose accent",
    tone: "light",
    swatch: ["oklch(0.97 0.02 340)", "oklch(0.66 0.19 350)", "oklch(0.7 0.16 315)"],
  },
  {
    id: "emerald",
    name: "Emerald Focus",
    tagline: "Forest slate, emerald light",
    tone: "dark",
    swatch: ["oklch(0.19 0.03 165)", "oklch(0.75 0.17 163)", "oklch(0.82 0.15 175)"],
  },
  {
    id: "arctic",
    name: "Arctic White",
    tagline: "Warm white, indigo accent",
    tone: "light",
    swatch: ["oklch(0.97 0.006 95)", "oklch(0.51 0.21 274)", "oklch(0.65 0.17 280)"],
  },
];

const STORAGE_KEY = "primeflow-theme";
const DEFAULT_THEME: ThemeId = "midnight";

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
  cycleTheme: () => void;
  toggleTone: () => void;
  meta: ThemeMeta;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (stored && THEMES.some((t) => t.id === stored)) setThemeState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const meta = THEMES.find((t) => t.id === theme)!;
    document.documentElement.style.colorScheme = meta.tone;
  }, [theme]);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = THEMES[(THEMES.findIndex((t) => t.id === current) + 1) % THEMES.length].id;
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  // Light/dark toggle jumps between the paired dark and light themes.
  const toggleTone = useCallback(() => {
    setThemeState((current) => {
      const isDark = THEMES.find((t) => t.id === current)!.tone === "dark";
      const next: ThemeId = isDark
        ? current === "midnight"
          ? "arctic"
          : "sakura"
        : current === "arctic"
          ? "midnight"
          : "emerald";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const meta = THEMES.find((t) => t.id === theme)!;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, toggleTone, meta }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}