import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ActionRow, SettingsCard, SettingsPage } from "@/components/settings/ui";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/settings/support")({
  ssr: false,
  head: pageHead(
    "Help & Support — PrimeFlow",
    "Read PrimeFlow FAQs, learn how focus scoring works, report a bug or send feedback.",
  ),
  component: SupportSettings,
});

const FAQ = [
  ["Does the timer keep running if I close the app?", "Yes. Sessions are timestamp-based, so reopening PrimeFlow restores the exact remaining time."],
  ["Where is my data stored?", "On this device, in your browser. Nothing is uploaded unless you turn on cloud sync."],
  ["How is my Flow Score calculated?", "It blends completed focus minutes, session completion rate and distraction count for the day."],
  ["Can I use PrimeFlow without an account?", "Yes — guest mode gives you every feature locally. An account only adds cross-device sync."],
];

function SupportSettings() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SettingsPage title="Help & Support" subtitle="Answers and a way to reach us">
      <SettingsCard title="FAQ" delay={40}>
        {FAQ.map(([q, a], i) => (
          <button key={q} onClick={() => setOpen(open === i ? null : i)} className="block w-full text-left">
            <div className="text-sm font-medium">{q}</div>
            {open === i ? <div className="mt-1 text-[11px] text-muted-foreground">{a}</div> : null}
          </button>
        ))}
      </SettingsCard>

      <SettingsCard title="Contact" delay={90}>
        <ActionRow title="Report a bug" detail="Send details by email" action="Email" onClick={() => window.open("mailto:support@primeflow.app?subject=Bug%20report")} />
        <ActionRow title="Send feedback" detail="Tell us what to build next" action="Email" onClick={() => window.open("mailto:support@primeflow.app?subject=Feedback")} />
      </SettingsCard>
    </SettingsPage>
  );
}
