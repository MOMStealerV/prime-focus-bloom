import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  CircleUser,
  CreditCard,
  Database,
  HelpCircle,
  Info,
  KeyRound,
  LogOut,
  Palette,
  Plug,
  ShieldCheck,
  Timer,
} from "lucide-react";

import { GlassCard } from "@/components/primeflow/GlassCard";
import { Screen, ScreenTitle } from "@/components/primeflow/Screen";
import { SETTINGS_ITEMS } from "@/components/settings/items";
import { displayName, initials, useAuth } from "@/lib/auth";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/settings/")({
  ssr: false,
  head: pageHead(
    "Settings — PrimeFlow",
    "Manage your PrimeFlow profile, account, notifications, appearance, focus defaults, integrations, privacy and storage.",
  ),
  component: SettingsIndex,
});

const ICONS = {
  profile: CircleUser,
  account: KeyRound,
  notifications: Bell,
  appearance: Palette,
  focus: Timer,
  integrations: Plug,
  privacy: ShieldCheck,
  storage: Database,
  premium: CreditCard,
  support: HelpCircle,
  about: Info,
} as const;

function SettingsIndex() {
  const { user, profile, isGuest, signOut } = useAuth();
  const navigate = useNavigate();
  const name = displayName(profile, user);

  return (
    <Screen>
      <ScreenTitle title="Settings" subtitle="Everything about your PrimeFlow" />

      <GlassCard delay={40}>
        <div className="flex items-center gap-3">
          <div className="accent-gradient font-display grid size-12 place-items-center rounded-2xl text-base font-semibold text-primary-foreground">
            {initials(name)}
          </div>
          <div className="min-w-0">
            <div className="font-display truncate text-[18px] leading-tight font-semibold">
              {name}
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              {isGuest ? "Guest · data stays on this device" : user?.email}
            </div>
          </div>
        </div>
        {isGuest ? (
          <Link
            to="/auth"
            search={{ next: "/settings" }}
            className="accent-gradient font-display mt-4 block rounded-2xl py-3 text-center text-sm font-semibold text-primary-foreground transition-transform duration-300 active:scale-[0.98]"
          >
            Sign in to sync
          </Link>
        ) : null}
      </GlassCard>

      <div className="glass animate-rise mt-4 space-y-1 rounded-3xl p-2">
        {SETTINGS_ITEMS.map(({ id, label, detail, to }) => {
          const Icon = ICONS[id];
          return (
            <Link
              key={id}
              to={to}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors duration-200 hover:bg-primary/8 active:scale-[0.99]"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/12">
                <Icon className="size-[17px] text-primary" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{label}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{detail}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
        {!isGuest ? (
          <button
            onClick={() => {
              void signOut().then(() => navigate({ to: "/welcome" }));
            }}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors duration-200 hover:bg-destructive/10 active:scale-[0.99]"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-destructive/12">
              <LogOut className="size-[17px] text-destructive" />
            </span>
            <span className="text-sm font-medium text-destructive">Sign out</span>
          </button>
        ) : null}
      </div>
    </Screen>
  );
}
