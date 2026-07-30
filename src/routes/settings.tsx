import { createFileRoute } from "@tanstack/react-router";

import { Screen, ScreenTitle } from "@/components/primeflow/Screen";
import {
  AboutSection,
  AppearanceSection,
  NotificationSection,
  PrivacySection,
} from "@/components/settings/sections";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — PrimeFlow" },
      {
        name: "description",
        content: "Switch themes, tune notifications and keep every byte of data on your device.",
      },
      { property: "og:title", content: "Settings — PrimeFlow" },
      {
        property: "og:description",
        content: "Switch themes, tune notifications and keep all data on your device.",
      },
    ],
  }),
  component: Settings,
});

function Settings() {
  return (
    <Screen>
      <ScreenTitle title="Settings" subtitle="Make PrimeFlow feel like yours" />
      <AppearanceSection delay={60} />
      <NotificationSection className="mt-4" delay={180} />
      <PrivacySection className="mt-4" delay={240} />
      <AboutSection className="mt-4" delay={300} />
    </Screen>
  );
}