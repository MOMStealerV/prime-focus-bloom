import { createFileRoute } from "@tanstack/react-router";

import { SettingsCard, SettingsPage, StatusPill, StepperRow, ToggleRow } from "@/components/settings/ui";
import { pageHead } from "@/lib/head";
import { setGroup, toggleGroupKey, usePrefs } from "@/lib/prefs";
import { syncStatus } from "@/lib/sync";

export const Route = createFileRoute("/settings/privacy")({
  ssr: false,
  head: pageHead(
    "Privacy & Security — PrimeFlow",
    "Control local-only storage, cloud sync, app lock, analytics and crash reporting in PrimeFlow.",
  ),
  component: PrivacySettings,
});

function PrivacySettings() {
  const { privacy } = usePrefs();
  const status = syncStatus(privacy.cloudSync);

  return (
    <SettingsPage title="Privacy & Security" subtitle="You decide what leaves this device">
      <SettingsCard title="Data" delay={40}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            PrimeFlow is local-first: focus, study and habit data live in this browser.
          </p>
          <StatusPill tone={status === "synced" ? "on" : "off"}>{status.replace("-", " ")}</StatusPill>
        </div>
        <ToggleRow title="Local-only mode" detail="Never send app data anywhere" on={privacy.localOnly} onToggle={() => toggleGroupKey("privacy", "localOnly")} />
        <ToggleRow title="Cloud sync" detail="Queue changes for your account" on={privacy.cloudSync} onToggle={() => toggleGroupKey("privacy", "cloudSync")} />
      </SettingsCard>

      <SettingsCard title="App lock" delay={90}>
        <ToggleRow title="PIN lock" detail="Ask for a PIN when reopening" on={privacy.pinLock} onToggle={() => toggleGroupKey("privacy", "pinLock")} />
        <ToggleRow title="Biometric unlock" detail="Use device biometrics when available" on={privacy.biometricLock} onToggle={() => toggleGroupKey("privacy", "biometricLock")} />
        <StepperRow title="Auto-lock after" suffix="min" min={1} max={60} value={privacy.autoLockMinutes} onChange={(autoLockMinutes) => setGroup("privacy", { autoLockMinutes })} />
        <ToggleRow title="Privacy mode" detail="Hide stats in screenshots and previews" on={privacy.privacyMode} onToggle={() => toggleGroupKey("privacy", "privacyMode")} />
      </SettingsCard>

      <SettingsCard title="Diagnostics" delay={140}>
        <ToggleRow title="Usage analytics" detail="Anonymous feature usage" on={privacy.usageAnalytics} onToggle={() => toggleGroupKey("privacy", "usageAnalytics")} />
        <ToggleRow title="Crash reports" detail="Help us fix errors faster" on={privacy.crashReports} onToggle={() => toggleGroupKey("privacy", "crashReports")} />
      </SettingsCard>
    </SettingsPage>
  );
}
