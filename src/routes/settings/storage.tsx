import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { ActionRow, SettingsCard, SettingsPage } from "@/components/settings/ui";
import {
  clearCache,
  clearLocalData,
  downloadBackup,
  formatBytes,
  storageBreakdown,
  totalStorage,
} from "@/lib/backup";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/settings/storage")({
  ssr: false,
  head: pageHead(
    "Storage — PrimeFlow",
    "See how much space PrimeFlow uses per module, clear cache, back up and reset local data.",
  ),
  component: StorageSettings,
});

function StorageSettings() {
  const [tick, setTick] = useState(0);
  const modules = storageBreakdown();
  const total = totalStorage() || 1;
  void tick;

  return (
    <SettingsPage title="Storage" subtitle={`${formatBytes(totalStorage())} used on this device`}>
      <SettingsCard title="By module" delay={40}>
        {modules.map((m) => (
          <div key={m.id}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{m.label}</span>
              <span className="text-[11px] text-muted-foreground">{formatBytes(m.bytes)}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-primary/10">
              <div
                className="accent-gradient h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(2, (m.bytes / total) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </SettingsCard>

      <SettingsCard title="Maintenance" delay={90}>
        <ActionRow title="Back up now" detail="Download everything as JSON" action="Export" onClick={downloadBackup} />
        <ActionRow
          title="Clear cache"
          detail="Sync queue and paused timer state"
          action="Clear"
          onClick={() => {
            clearCache();
            setTick((t) => t + 1);
            toast.success("Cache cleared");
          }}
        />
        <ActionRow
          title="Clear all local data"
          detail="Removes sessions, study data, habits and settings"
          action="Clear"
          tone="danger"
          onClick={() => {
            if (!window.confirm("Clear all PrimeFlow data on this device?")) return;
            clearLocalData();
            toast.success("Local data cleared");
            setTimeout(() => window.location.reload(), 600);
          }}
        />
      </SettingsCard>
    </SettingsPage>
  );
}
