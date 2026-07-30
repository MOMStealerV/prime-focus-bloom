import { Bell, Info, Lock, Moon, ShieldCheck, Sun } from "lucide-react";
import type { ReactNode } from "react";

import { GlassCard } from "@/components/primeflow/GlassCard";
import { useAppPrefs, togglePref } from "@/lib/prefs";
import { THEMES, useTheme } from "@/lib/theme";

export function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`h-7 w-12 shrink-0 rounded-full p-1 transition-colors duration-300 ${
        on ? "accent-gradient" : "bg-muted"
      }`}
    >
      <span
        className="block size-5 rounded-full bg-background transition-transform duration-300"
        style={{ transform: on ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

export function AppearanceSection({ className, delay }: { className?: string; delay?: number }) {
  const { theme, setTheme, toggleTone, meta } = useTheme();

  return (
    <>
      <GlassCard className={className} delay={delay}>
        <h2 className="font-display text-base font-semibold">Theme</h2>
        <p className="text-xs text-muted-foreground">Currently {meta.name}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
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
                    style={{
                      background: `linear-gradient(135deg, ${t.swatch[1]}, ${t.swatch[2]})`,
                    }}
                  />
                  <span
                    className="h-5 w-3 rounded-md"
                    style={{ background: t.swatch[2], opacity: 0.6 }}
                  />
                </div>
                <div
                  className="mt-2 text-xs font-semibold"
                  style={{ color: t.tone === "dark" ? "#fff" : "#1c1c22" }}
                >
                  {t.name}
                </div>
                <div
                  className="text-[10px]"
                  style={{
                    color: t.tone === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)",
                  }}
                >
                  {t.tagline}
                </div>
              </button>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard className="mt-4" delay={(delay ?? 0) + 60}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {meta.tone === "dark" ? (
              <Moon className="size-[18px] text-primary" />
            ) : (
              <Sun className="size-[18px] text-primary" />
            )}
            <div>
              <div className="text-sm font-medium">Appearance</div>
              <div className="text-[11px] text-muted-foreground">
                {meta.tone === "dark" ? "Dark" : "Light"} palette
              </div>
            </div>
          </div>
          <Toggle on={meta.tone === "dark"} onClick={toggleTone} />
        </div>
      </GlassCard>
    </>
  );
}

export function NotificationSection({ className, delay }: { className?: string; delay?: number }) {
  const prefs = useAppPrefs();

  return (
    <GlassCard className={className} delay={delay}>
      <div className="flex items-center gap-2">
        <Bell className="size-[18px] text-primary" />
        <h2 className="font-display text-base font-semibold">Notifications</h2>
      </div>
      <div className="mt-4 space-y-4">
        {(
          [
            ["focusReminders", "Focus reminders", "Nudge me before my peak window"],
            ["dailySummary", "Daily summary", "Evening recap of the day"],
            ["distractionAlerts", "Distraction alerts", "Warn me after 10 min of scrolling"],
          ] as const
        ).map(([key, title, detail]) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium">{title}</div>
              <div className="text-[11px] text-muted-foreground">{detail}</div>
            </div>
            <Toggle on={prefs[key]} onClick={() => togglePref(key)} />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export function PrivacySection({ className, delay }: { className?: string; delay?: number }) {
  const prefs = useAppPrefs();

  return (
    <GlassCard className={className} delay={delay}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Lock className="size-[18px] text-primary" />
          <div>
            <div className="text-sm font-medium">Privacy mode</div>
            <div className="text-[11px] text-muted-foreground">Hide stats in app switcher</div>
          </div>
        </div>
        <Toggle on={prefs.privacyMode} onClick={() => togglePref("privacyMode")} />
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-primary/12 p-3">
        <ShieldCheck className="size-[18px] text-primary" />
        <div>
          <div className="text-sm font-medium text-primary">Local data only</div>
          <div className="text-[11px] text-muted-foreground">
            Nothing leaves this device. No account, no cloud sync.
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export function AboutSection({ className, delay }: { className?: string; delay?: number }) {
  return (
    <GlassCard className={className} delay={delay}>
      <div className="flex items-center gap-2">
        <Info className="size-[18px] text-primary" />
        <h2 className="font-display text-base font-semibold">About PrimeFlow</h2>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        PrimeFlow is a personal focus and digital wellbeing companion. It helps you notice where
        attention leaks, build habits that stick, and shape days that feel calmer.
      </p>
      <div className="mt-3 text-[11px] text-muted-foreground">Version 1.0 · Stage 2 preview</div>
    </GlassCard>
  );
}

export function InfoSection({
  title,
  description,
  items,
  icon,
  className,
  delay,
}: {
  title: string;
  description: string;
  items?: string[];
  icon?: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <GlassCard className={className} delay={delay}>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-display text-base font-semibold">{title}</h2>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {items?.length ? (
        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl bg-primary/8 px-3 py-2.5"
            >
              <span className="text-sm font-medium">{item}</span>
              <span className="text-[10px] tracking-wide text-muted-foreground uppercase">
                Planned
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </GlassCard>
  );
}