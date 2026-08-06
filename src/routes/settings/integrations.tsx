import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { SettingsCard, SettingsPage, StatusPill } from "@/components/settings/ui";
import { pageHead } from "@/lib/head";
import { setIntegration, usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/settings/integrations")({
  ssr: false,
  head: pageHead(
    "Integrations — PrimeFlow",
    "Connect calendars, task managers, music services and learning tools to your PrimeFlow workflow.",
  ),
  component: IntegrationsSettings,
});

const GROUPS = [
  {
    title: "Calendar & tasks",
    items: [
      { id: "google-calendar", label: "Google Calendar", detail: "Pull events into your planner" },
      { id: "outlook", label: "Microsoft Outlook", detail: "Sync meetings and deadlines" },
      { id: "todoist", label: "Todoist", detail: "Import tasks as study blocks" },
    ],
  },
  {
    title: "Music",
    items: [
      { id: "spotify", label: "Spotify", detail: "Start a focus playlist with a session" },
      { id: "apple-music", label: "Apple Music", detail: "Play focus albums" },
      { id: "youtube-music", label: "YouTube Music", detail: "Ambient and lo-fi mixes" },
    ],
  },
  {
    title: "Learning",
    items: [
      { id: "notion", label: "Notion", detail: "Link notes to subjects" },
      { id: "google-classroom", label: "Google Classroom", detail: "Import assignments" },
    ],
  },
];

function IntegrationsSettings() {
  const { integrations } = usePrefs();

  return (
    <SettingsPage title="Integrations" subtitle="Connect the tools you already use">
      {GROUPS.map((group, i) => (
        <SettingsCard key={group.title} title={group.title} delay={40 + i * 50}>
          {group.items.map((item) => {
            const state = integrations[item.id];
            const connected = Boolean(state?.connected);
            return (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-[11px] text-muted-foreground">{item.detail}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusPill tone={connected ? "on" : "off"}>
                    {connected ? "Connected" : "Not connected"}
                  </StatusPill>
                  <button
                    onClick={() => {
                      if (connected) {
                        setIntegration(item.id, { connected: false, lastSync: null });
                        toast.success(`${item.label} disconnected`);
                      } else {
                        toast.info(`${item.label} sign-in is coming in a later release.`);
                      }
                    }}
                    className="rounded-xl bg-primary/12 px-3 py-1.5 text-[11px] font-medium text-primary transition-transform active:scale-95"
                  >
                    {connected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </div>
            );
          })}
        </SettingsCard>
      ))}
    </SettingsPage>
  );
}
