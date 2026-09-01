import { Link } from "@tanstack/react-router";
import { ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { SETTINGS_ITEMS } from "@/components/settings/items";
import { displayName, initials, useAuth } from "@/lib/auth";
import { galleryFlag } from "@/lib/ui-gallery-screens";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { user, profile, isGuest } = useAuth();
  const name = displayName(profile, user);

  useEffect(() => setMounted(true), []);

  // Documentation-only: the UI reference gallery opens this sheet via ?gallery=profile.
  // Inert on every normal visit.
  useEffect(() => {
    if (galleryFlag() === "profile") setOpen(true);
  }, []);

  // Escape to close + background scroll lock while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const sheet = (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <button
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-background/85 backdrop-blur-md"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="animate-rise relative mx-auto flex max-h-[85dvh] min-h-[60dvh] w-full max-w-md flex-col overflow-hidden rounded-t-[32px] border border-border/60 bg-card shadow-[0_-24px_60px_-20px_rgb(0_0_0/0.55)] outline-none"
      >
        <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-muted-foreground/30" />
        <div className="flex-1 overflow-y-auto p-5 pb-8">
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
              onClick={close}
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
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-label="Open profile and settings"
        aria-expanded={open}
        className="accent-gradient font-display grid size-10 shrink-0 place-items-center rounded-2xl text-sm font-semibold text-primary-foreground transition-transform duration-300 active:scale-95"
      >
        {profile?.avatar_url || initials(name)}
      </button>

      {open && mounted ? createPortal(sheet, document.body) : null}
    </>
  );
}
