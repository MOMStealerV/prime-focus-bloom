import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { SettingsCard, SettingsPage, StatusPill } from "@/components/settings/ui";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/settings/premium")({
  ssr: false,
  head: pageHead(
    "Premium — PrimeFlow",
    "Preview PrimeFlow Premium: AI coaching, deep analytics, unlimited history and exclusive themes.",
  ),
  component: PremiumSettings,
});

const PERKS = [
  ["AI focus coach", "Personalised session plans and daily briefings"],
  ["Deep analytics", "Trends, comparisons and distraction breakdowns"],
  ["Unlimited history", "Keep every session forever"],
  ["Exclusive themes", "Seasonal palettes and animated backgrounds"],
  ["Priority support", "Answers within one working day"],
];

function PremiumSettings() {
  return (
    <SettingsPage title="Premium" subtitle="Your plan">
      <SettingsCard delay={40}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span className="font-display text-base font-semibold">Free plan</span>
          </div>
          <StatusPill tone="off">Active</StatusPill>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Everything in PrimeFlow today is free. Premium adds the AI and analytics layer.
        </p>
      </SettingsCard>

      <SettingsCard title="What Premium adds" delay={90}>
        {PERKS.map(([title, detail]) => (
          <div key={title}>
            <div className="text-sm font-medium">{title}</div>
            <div className="text-[11px] text-muted-foreground">{detail}</div>
          </div>
        ))}
      </SettingsCard>

      <button
        onClick={() => toast.info("Premium opens after the AI stage ships — you'll be first to know.")}
        className="accent-gradient font-display w-full rounded-3xl py-4 text-sm font-semibold text-primary-foreground transition-transform duration-300 active:scale-[0.98]"
      >
        Join the Premium waitlist
      </button>
    </SettingsPage>
  );
}
