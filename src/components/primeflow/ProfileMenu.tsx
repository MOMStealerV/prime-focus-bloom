import { Link } from "@tanstack/react-router";
import { ChevronRight, X } from "lucide-react";
import { useState } from "react";

import { SETTINGS_ITEMS } from "@/components/settings/items";
import { displayName, initials, useAuth } from "@/lib/auth";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { user, profile, isGuest } = useAuth();
  const name = displayName(profile, user);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open profile and settings"
        className="accent-gradient font-display grid size-10 shrink-0 place-items-center rounded-2xl text-sm font-semibold text-primary-foreground transition-transform duration-300 active:scale-95"
      >
        {profile?.avatar_url || initials(name)}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          />
          <div className="glass animate-rise relative mx-auto max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-[32px] p-5 pb-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="accent-gradient font-display grid size-12 place-items-center rounded-2xl text-base font-semibold text-primary-foreground">
                {profile?.avatar_url || initials(name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display truncate text-[17px] leading-tight font-semibold">
                  {name}
                </div>
                <div className="truncate text-[11px] text-muted-foreground">
                  {isGuest ? "Guest · data stays on this device" : user?.email}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close profile menu"
                className="grid size-9 place-items-center rounded-2xl bg-primary/10 transition-transform active:scale-90"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>

            {isGuest ? (
              <Link
                to="/auth"
                search={{ next: "/" }}
                onClick={() => setOpen(false)}
                className="accent-gradient font-display mb-4 block rounded-2xl py-3 text-center text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
              >
                Sign in to sync your flow
              </Link>
            ) : null}

            <div className="space-y-1">
              {SETTINGS_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors duration-200 hover:bg-primary/8 active:scale-[0.99]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {item.detail}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
