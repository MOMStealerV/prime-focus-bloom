import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { toast } from "sonner";

import {
  OptionRow,
  SettingsCard,
  SettingsPage,
  StatusPill,
  TextField,
  ToggleRow,
} from "@/components/settings/ui";
import { pageHead } from "@/lib/head";
import { setGroup, toggleGroupKey, usePrefs, type ReminderFrequency } from "@/lib/prefs";

export const Route = createFileRoute("/settings/notifications")({
  ssr: false,
  head: pageHead(
    "Notifications — PrimeFlow",
    "Choose focus, study, habit and assignment reminders, summaries, quiet hours and alert sounds.",
  ),
  component: NotificationSettings,
});

function NotificationSettings() {
  const { notifications: n } = usePrefs();
  const permission =
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default";

  async function requestPermission() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("This device does not support notifications");
      return;
    }
    const result = await Notification.requestPermission();
    toast[result === "granted" ? "success" : "error"](
      result === "granted" ? "Notifications enabled" : "Permission not granted",
    );
  }

  return (
    <SettingsPage title="Notifications" subtitle="Nudges that respect your focus">
      <SettingsCard delay={40} icon={<Bell className="size-4 text-primary" />} title="Permission">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            System permission is required for reminders to appear outside the app.
          </p>
          <StatusPill tone={permission === "granted" ? "on" : "off"}>{permission}</StatusPill>
        </div>
        {permission !== "granted" ? (
          <button
            onClick={() => void requestPermission()}
            className="accent-gradient w-full rounded-2xl py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            Enable notifications
          </button>
        ) : null}
      </SettingsCard>

      <SettingsCard title="Reminders" delay={90}>
        <ToggleRow title="Focus reminders" detail="Nudge me to start a session" on={n.focusReminders} onToggle={() => toggleGroupKey("notifications", "focusReminders")} />
        <ToggleRow title="Study reminders" detail="Planned study blocks" on={n.studyReminders} onToggle={() => toggleGroupKey("notifications", "studyReminders")} />
        <ToggleRow title="Assignment deadlines" detail="Alert before due dates" on={n.assignmentReminders} onToggle={() => toggleGroupKey("notifications", "assignmentReminders")} />
        <ToggleRow title="Habit reminders" detail="Keep streaks alive" on={n.habitReminders} onToggle={() => toggleGroupKey("notifications", "habitReminders")} />
        <ToggleRow title="Goal reminders" detail="When the daily goal is at risk" on={n.goalReminders} onToggle={() => toggleGroupKey("notifications", "goalReminders")} />
      </SettingsCard>

      <SettingsCard title="Reports & alerts" delay={140}>
        <ToggleRow title="Daily summary" detail="Evening recap of your day" on={n.dailySummary} onToggle={() => toggleGroupKey("notifications", "dailySummary")} />
        <ToggleRow title="Weekly report" detail="Sunday performance review" on={n.weeklyReport} onToggle={() => toggleGroupKey("notifications", "weeklyReport")} />
        <ToggleRow title="Achievement alerts" detail="Celebrate new milestones" on={n.achievementAlerts} onToggle={() => toggleGroupKey("notifications", "achievementAlerts")} />
        <ToggleRow title="Distraction alerts" detail="Warn when I leave a session" on={n.distractionAlerts} onToggle={() => toggleGroupKey("notifications", "distractionAlerts")} />
      </SettingsCard>

      <SettingsCard title="Delivery" delay={190}>
        <OptionRow<ReminderFrequency>
          title="Frequency"
          detail="How often PrimeFlow may interrupt you"
          value={n.frequency}
          onChange={(frequency) => setGroup("notifications", { frequency })}
          options={[
            { value: "low", label: "Low" },
            { value: "balanced", label: "Balanced" },
            { value: "high", label: "High" },
          ]}
        />
        <OptionRow
          title="Sound"
          value={n.sound}
          onChange={(sound) => setGroup("notifications", { sound })}
          options={[
            { value: "chime", label: "Chime" },
            { value: "soft", label: "Soft" },
            { value: "silent", label: "Silent" },
          ]}
        />
        <ToggleRow title="Quiet hours" detail="Mute everything overnight" on={n.quietHours} onToggle={() => toggleGroupKey("notifications", "quietHours")} />
        {n.quietHours ? (
          <div className="grid grid-cols-2 gap-3">
            <TextField label="From" type="time" value={n.quietFrom} onChange={(quietFrom) => setGroup("notifications", { quietFrom })} />
            <TextField label="To" type="time" value={n.quietTo} onChange={(quietTo) => setGroup("notifications", { quietTo })} />
          </div>
        ) : null}
      </SettingsCard>
    </SettingsPage>
  );
}
