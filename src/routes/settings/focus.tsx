import { createFileRoute } from "@tanstack/react-router";

import { OptionRow, SettingsCard, SettingsPage, StepperRow, ToggleRow } from "@/components/settings/ui";
import { pageHead } from "@/lib/head";
import {
  setGroup,
  toggleGroupKey,
  usePrefs,
  type CountdownStyle,
  type MusicService,
} from "@/lib/prefs";

export const Route = createFileRoute("/settings/focus")({
  ssr: false,
  head: pageHead(
    "Focus Settings — PrimeFlow",
    "Set default focus and break lengths, auto-start rules, daily goals, countdown style and music service.",
  ),
  component: FocusSettings,
});

function FocusSettings() {
  const { focus } = usePrefs();

  return (
    <SettingsPage title="Focus Settings" subtitle="Defaults for every new session">
      <SettingsCard title="Durations" delay={40}>
        <StepperRow title="Focus length" suffix="min" min={5} max={180} step={5} value={focus.focusMinutes} onChange={(focusMinutes) => setGroup("focus", { focusMinutes })} />
        <StepperRow title="Short break" suffix="min" min={1} max={30} value={focus.shortBreak} onChange={(shortBreak) => setGroup("focus", { shortBreak })} />
        <StepperRow title="Long break" suffix="min" min={5} max={60} step={5} value={focus.longBreak} onChange={(longBreak) => setGroup("focus", { longBreak })} />
        <StepperRow title="Long break every" suffix="sessions" min={2} max={8} value={focus.longBreakEvery} onChange={(longBreakEvery) => setGroup("focus", { longBreakEvery })} />
      </SettingsCard>

      <SettingsCard title="Flow" delay={90}>
        <ToggleRow title="Auto-start breaks" detail="Roll straight into the break" on={focus.autoStartBreak} onToggle={() => toggleGroupKey("focus", "autoStartBreak")} />
        <ToggleRow title="Auto-start next focus" detail="Continue after a break ends" on={focus.autoStartFocus} onToggle={() => toggleGroupKey("focus", "autoStartFocus")} />
        <ToggleRow title="Completion sound" detail="Play a chime when a block ends" on={focus.completionSound} onToggle={() => toggleGroupKey("focus", "completionSound")} />
        <StepperRow title="Daily focus goal" suffix="min" min={15} max={600} step={15} value={focus.dailyGoal} onChange={(dailyGoal) => setGroup("focus", { dailyGoal })} />
      </SettingsCard>

      <SettingsCard title="Session look & sound" delay={140}>
        <OptionRow<CountdownStyle>
          title="Countdown style"
          value={focus.countdownStyle}
          onChange={(countdownStyle) => setGroup("focus", { countdownStyle })}
          options={[
            { value: "ring", label: "Breathing ring" },
            { value: "digits", label: "Large digits" },
            { value: "minimal", label: "Minimal" },
          ]}
        />
        <OptionRow<MusicService>
          title="Music service"
          detail="Used for the focus soundscape shortcut"
          value={focus.musicService}
          onChange={(musicService) => setGroup("focus", { musicService })}
          options={[
            { value: "none", label: "Built-in ambient" },
            { value: "spotify", label: "Spotify" },
            { value: "youtube", label: "YouTube" },
            { value: "apple", label: "Apple Music" },
            { value: "local", label: "Device audio" },
          ]}
        />
      </SettingsCard>
    </SettingsPage>
  );
}
