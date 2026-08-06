import { createFileRoute } from "@tanstack/react-router";

import { SettingsCard, SettingsPage } from "@/components/settings/ui";
import { pageHead } from "@/lib/head";
import { STORAGE_VERSION, getDeviceId } from "@/lib/sync";

export const Route = createFileRoute("/settings/about")({
  ssr: false,
  head: pageHead(
    "About PrimeFlow",
    "PrimeFlow version, storage format, credits and the principles behind the focus app.",
  ),
  component: AboutSettings,
});

function AboutSettings() {
  return (
    <SettingsPage title="About" subtitle="PrimeFlow">
      <SettingsCard delay={40}>
        <div className="text-center">
          <div className="accent-gradient font-display mx-auto grid size-16 place-items-center rounded-3xl text-2xl font-semibold text-primary-foreground">
            P
          </div>
          <h2 className="font-display mt-3 text-lg font-semibold">PrimeFlow</h2>
          <p className="text-[11px] text-muted-foreground">Version 1.0.0 · Storage v{STORAGE_VERSION}</p>
        </div>
      </SettingsCard>

      <SettingsCard title="Principles" delay={90}>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          PrimeFlow is a calm, local-first focus companion. Your attention data belongs to you: it
          stays on your device by default, and every feature is designed to end with you closing the
          app and getting back to work.
        </p>
      </SettingsCard>

      <SettingsCard title="Device" delay={140}>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Device ID</span>
          <span className="truncate text-[11px] text-muted-foreground">{getDeviceId().slice(0, 13)}…</span>
        </div>
      </SettingsCard>
    </SettingsPage>
  );
}
