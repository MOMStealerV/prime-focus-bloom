import { createFileRoute } from "@tanstack/react-router";
import { Monitor, Moon, Sun } from "lucide-react";

import { OptionRow, SettingsCard, SettingsPage, ToggleRow } from "@/components/settings/ui";
import { pageHead } from "@/lib/head";
import { setGroup, toggleGroupKey, usePrefs, type FontSize, type ThemeMode } from "@/lib/prefs";
import { THEMES, useTheme } from "@/lib/theme";

export const Route = createFileRoute("/settings/appearance")({
  ssr: false,
  head: pageHead(
    "Appearance — PrimeFlow",
    "Pick a PrimeFlow theme, switch between light, dark and system mode, and tune typography and motion.",
  ),
  component: AppearanceSettings,
});

const MODE_ICONS = { system: Monitor, light: Sun, dark: Moon } as const;

function AppearanceSettings() {
  const { appearance } = usePrefs();
  const { theme, setTheme, meta } = useTheme();

  return (
    <SettingsPage title="Appearance" subtitle={`Currently ${meta.name}`}>
      <SettingsCard title="Mode" delay={40}>
        <div className="grid grid-cols-3 gap-2">
          {(["system", "light", "dark"] as ThemeMode[]).map((mode) => {
            const Icon = MODE_ICONS[mode];
            const active = appearance.mode === mode;
            return (
              <button
                key={mode}
                onClick={() => setGroup("appearance", { mode })}
                className={`flex flex-col items-center gap-2 rounded-2xl py-4 text-xs font-medium capitalize transition-all duration-300 active:scale-95 ${
                  active ? "accent-gradient text-primary-foreground" : "bg-primary/8 text-muted-foreground"
                }`}
              >
                <Icon className="size-[18px]" />
                {mode}
              </button>
            );
          })}
        </div>
      </SettingsCard>

      <SettingsCard title="Theme" delay={90}>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((t) => {
            const active = t.id === theme;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`overflow-hidden rounded-3xl border p-3 text-left transition-all duration-300 active:scale-95 ${
                  active ? "border-primary" : "border-border"
                }`}
                style={{ background: t.swatch[0] }}
              >
                <div className="flex h-14 items-end gap-1.5 rounded-2xl p-2">
                  <span
                    className="h-8 flex-1 rounded-lg"
                    style={{ background: `linear-gradient(135deg, ${t.swatch[1]}, ${t.swatch[2]})` }}
                  />
                  <span className="h-5 w-3 rounded-md" style={{ background: t.swatch[2], opacity: 0.6 }} />
                </div>
                <div
                  className="mt-2 text-xs font-semibold"
                  style={{ color: t.tone === "dark" ? "#fff" : "#1c1c22" }}
                >
                  {t.name}
                </div>
                <div
                  className="text-[10px]"
                  style={{ color: t.tone === "dark" ? "#ffffff99" : "#1c1c2299" }}
                >
                  {t.tagline}
                </div>
              </button>
            );
          })}
        </div>
      </SettingsCard>

      <SettingsCard title="Typography & motion" delay={140}>
        <OptionRow<FontSize>
          title="Font size"
          detail="Applies across the whole app"
          value={appearance.fontSize}
          onChange={(fontSize) => setGroup("appearance", { fontSize })}
          options={[
            { value: "sm", label: "Small" },
            { value: "md", label: "Default" },
            { value: "lg", label: "Large" },
          ]}
        />
        <ToggleRow
          title="Animations"
          detail="Fluid transitions and card entrances"
          on={appearance.animations}
          onToggle={() => toggleGroupKey("appearance", "animations")}
        />
        <ToggleRow
          title="Reduce motion"
          detail="Minimise movement for comfort"
          on={appearance.reduceMotion}
          onToggle={() => toggleGroupKey("appearance", "reduceMotion")}
        />
      </SettingsCard>
    </SettingsPage>
  );
}
