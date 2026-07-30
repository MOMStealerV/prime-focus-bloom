import { useState } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  CreditCard,
  HelpCircle,
  Info,
  KeyRound,
  Palette,
  Plug,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";

import {
  AboutSection,
  AppearanceSection,
  InfoSection,
  NotificationSection,
  PrivacySection,
} from "@/components/settings/sections";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

type SectionId =
  | "profile"
  | "account"
  | "notifications"
  | "appearance"
  | "focus"
  | "integrations"
  | "privacy"
  | "premium"
  | "support"
  | "about";

const ITEMS: { id: SectionId; label: string; detail: string; icon: typeof Bell }[] = [
  { id: "profile", label: "Profile", detail: "Your name, avatar and focus identity", icon: CircleUser },
  { id: "account", label: "Account", detail: "Sign-in and device management", icon: KeyRound },
  { id: "notifications", label: "Notifications", detail: "Reminders, summaries and alerts", icon: Bell },
  { id: "appearance", label: "Appearance", detail: "Themes and light / dark palette", icon: Palette },
  { id: "focus", label: "Focus Settings", detail: "Presets, breaks and ambient sound", icon: Timer },
  { id: "integrations", label: "Integrations", detail: "Calendars, tasks and backup", icon: Plug },
  { id: "privacy", label: "Privacy & Security", detail: "Local data and privacy mode", icon: ShieldCheck },
  { id: "premium", label: "Premium", detail: "Advanced insights and coaching", icon: CreditCard },
  { id: "support", label: "Help & Support", detail: "Guides, tips and contact", icon: HelpCircle },
  { id: "about", label: "About", detail: "Version and product story", icon: Info },
];

function SectionBody({ id }: { id: SectionId }) {
  switch (id) {
    case "appearance":
      return <AppearanceSection delay={40} />;
    case "notifications":
      return <NotificationSection delay={40} />;
    case "privacy":
      return <PrivacySection delay={40} />;
    case "about":
      return <AboutSection delay={40} />;
    case "profile":
      return (
        <InfoSection
          delay={40}
          icon={<CircleUser className="size-[18px] text-primary" />}
          title="Profile"
          description="Personalise your display name, avatar and focus identity so PrimeFlow can tailor greetings, streaks and coaching to you."
        />
      );
    case "account":
      return (
        <InfoSection
          delay={40}
          icon={<KeyRound className="size-[18px] text-primary" />}
          title="Account"
          description="Sign in to sync your focus history across devices, manage trusted devices and export your data. Everything stays local until you opt in."
        />
      );
    case "focus":
      return (
        <InfoSection
          delay={40}
          icon={<Timer className="size-[18px] text-primary" />}
          title="Focus Settings"
          description="Fine-tune default session lengths, automatic break transitions, ambient sound defaults and distraction sensitivity in a future update."
        />
      );
    case "integrations":
      return (
        <InfoSection
          delay={40}
          icon={<Plug className="size-[18px] text-primary" />}
          title="Integrations"
          description="Connect calendars, tasks and cloud backup so PrimeFlow can plan focus blocks around your real schedule."
          items={[
            "Google Sign-In",
            "Google Calendar",
            "Google Tasks",
            "Google Drive Backup",
            "Google Classroom",
            "Microsoft Outlook",
            "Apple Calendar",
          ]}
        />
      );
    case "premium":
      return (
        <InfoSection
          delay={40}
          icon={<CreditCard className="size-[18px] text-primary" />}
          title="Premium"
          description="Unlock deeper analytics, adaptive focus coaching, unlimited history and advanced habit automations when Premium arrives."
        />
      );
    case "support":
      return (
        <InfoSection
          delay={40}
          icon={<HelpCircle className="size-[18px] text-primary" />}
          title="Help & Support"
          description="Browse focus guides, troubleshooting tips and reach the PrimeFlow team directly from inside the app."
        />
      );
  }
}

export function ProfileMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<SectionId | null>(null);
  const current = ITEMS.find((i) => i.id === section);

  return (
    <>
      <button
        onClick={() => {
          setSection(null);
          setOpen(true);
        }}
        aria-label="Open profile and settings"
        className={`accent-gradient font-display grid size-11 place-items-center rounded-2xl text-sm font-semibold text-primary-foreground transition-transform duration-300 active:scale-95 ${className ?? ""}`}
      >
        N
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="glass-strong mx-auto max-h-[86vh] w-full max-w-[430px] overflow-y-auto rounded-t-[32px] border-t-0 p-0 shadow-[0_-20px_60px_-24px_oklch(0_0_0/55%)]"
        >
          <SheetTitle className="sr-only">Profile and settings</SheetTitle>
          <div className="px-5 pt-4 pb-8">
            <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-muted" />

            {current ? (
              <>
                <div className="animate-rise mb-4 flex items-center gap-3">
                  <button
                    onClick={() => setSection(null)}
                    aria-label="Back to profile menu"
                    className="glass grid size-10 place-items-center rounded-2xl transition-transform duration-300 active:scale-95"
                  >
                    <ChevronLeft className="size-[18px] text-primary" />
                  </button>
                  <h2 className="font-display text-[20px] font-semibold">{current.label}</h2>
                </div>
                <SectionBody id={current.id} />
              </>
            ) : (
              <>
                <div className="animate-rise mb-4 flex items-center gap-3">
                  <div className="accent-gradient font-display grid size-12 place-items-center rounded-2xl text-base font-semibold text-primary-foreground">
                    N
                  </div>
                  <div>
                    <div className="font-display text-[18px] leading-tight font-semibold">Nir</div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Sparkles className="size-3 text-primary" />
                      Local account · Stage 2 preview
                    </div>
                  </div>
                </div>

                <div className="glass animate-rise space-y-1 rounded-3xl p-2">
                  {ITEMS.map(({ id, label, detail, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setSection(id)}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors duration-200 active:scale-[0.99] hover:bg-primary/8"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/12">
                        <Icon className="size-[17px] text-primary" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{label}</span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {detail}
                        </span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}