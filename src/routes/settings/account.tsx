import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import { toast } from "sonner";

import { ActionRow, SettingsCard, SettingsPage, StatusPill } from "@/components/settings/ui";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { downloadBackup, factoryReset, restoreBackup } from "@/lib/backup";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/settings/account")({
  ssr: false,
  head: pageHead(
    "Account — PrimeFlow",
    "Manage your PrimeFlow sign-in, password, data export, backup restore and account deletion.",
  ),
  component: AccountSettings,
});

function AccountSettings() {
  const { user, isGuest, signOut } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  async function resetPassword() {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    toast[error ? "error" : "success"](error?.message ?? "Password reset email sent");
  }

  return (
    <SettingsPage title="Account" subtitle={isGuest ? "Guest mode" : (user?.email ?? "")}>
      <SettingsCard title="Sign-in" delay={40}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            {isGuest
              ? "You are using PrimeFlow as a guest. Everything is stored on this device only."
              : "Your account keeps your profile available on any device."}
          </p>
          <StatusPill tone={isGuest ? "off" : "on"}>{isGuest ? "Guest" : "Signed in"}</StatusPill>
        </div>
        {isGuest ? (
          <Link
            to="/auth"
            search={{ next: "/settings/account" }}
            className="accent-gradient block rounded-2xl py-3 text-center text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            Create an account
          </Link>
        ) : (
          <>
            <ActionRow title="Change password" detail="We email you a secure link" action="Send" onClick={() => void resetPassword()} />
            <ActionRow title="Sign out" detail="Keep local data on this device" action="Sign out" onClick={() => void signOut().then(() => navigate({ to: "/welcome" }))} />
          </>
        )}
      </SettingsCard>

      <SettingsCard title="Your data" delay={90}>
        <ActionRow title="Export data" detail="Download a JSON backup" action="Export" onClick={downloadBackup} />
        <ActionRow title="Restore backup" detail="Load a PrimeFlow backup file" action="Restore" onClick={() => fileRef.current?.click()} />
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              restoreBackup(await file.text());
              toast.success("Backup restored — reloading");
              setTimeout(() => window.location.reload(), 600);
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Could not restore backup");
            }
          }}
        />
      </SettingsCard>

      <SettingsCard title="Danger zone" delay={140}>
        <ActionRow
          title="Delete all local data"
          detail="Sessions, study data, habits and settings"
          action="Delete"
          tone="danger"
          onClick={() => {
            if (!window.confirm("Delete all PrimeFlow data on this device?")) return;
            factoryReset();
            toast.success("Local data deleted");
            setTimeout(() => window.location.assign("/welcome"), 500);
          }}
        />
      </SettingsCard>
    </SettingsPage>
  );
}
