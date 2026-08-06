import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  SettingsCard,
  SettingsPage,
  TextField,
} from "@/components/settings/ui";
import { displayName, initials, useAuth } from "@/lib/auth";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/settings/profile")({
  ssr: false,
  head: pageHead(
    "Profile — PrimeFlow",
    "Edit your PrimeFlow display name, username, avatar, bio, school and time zone.",
  ),
  component: ProfileSettings,
});

const AVATARS = ["🌙", "🌸", "🌿", "❄️", "⚡", "🎯", "📚", "🪐"];

function ProfileSettings() {
  const { user, profile, isGuest, updateProfile } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    avatar_url: "",
    bio: "",
    school: "",
    grade: "",
    country: "",
    time_zone: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name ?? "",
      username: profile.username ?? "",
      avatar_url: profile.avatar_url ?? "",
      bio: profile.bio ?? "",
      school: profile.school ?? "",
      grade: profile.grade ?? "",
      country: profile.country ?? "",
      time_zone: profile.time_zone ?? "",
    });
  }, [profile]);

  const name = form.full_name || displayName(profile, user);
  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function save() {
    setSaving(true);
    const { error } = await updateProfile({
      ...form,
      username: form.username.trim().toLowerCase() || null,
    });
    setSaving(false);
    toast[error ? "error" : "success"](error ?? "Profile saved");
  }

  return (
    <SettingsPage title="Profile" subtitle="How PrimeFlow greets you">
      <SettingsCard delay={40}>
        <div className="flex items-center gap-4">
          <div className="accent-gradient font-display grid size-16 place-items-center rounded-3xl text-2xl text-primary-foreground">
            {form.avatar_url || initials(name)}
          </div>
          <div className="min-w-0">
            <div className="font-display truncate text-lg font-semibold">{name}</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {isGuest ? "Guest profile — sign in to save it" : user?.email}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => set("avatar_url")(a)}
              className={`grid size-11 place-items-center rounded-2xl text-lg transition-all duration-300 active:scale-90 ${
                form.avatar_url === a ? "bg-primary/20 ring-1 ring-primary" : "bg-primary/8"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Details" delay={90}>
        <TextField label="Display name" value={form.full_name} onChange={set("full_name")} placeholder="Your name" />
        <TextField label="Username" value={form.username} onChange={set("username")} placeholder="primeflow" />
        <TextField label="Bio" value={form.bio} onChange={set("bio")} placeholder="What are you working towards?" multiline />
      </SettingsCard>

      <SettingsCard title="Study identity" delay={140}>
        <TextField label="School / University" value={form.school} onChange={set("school")} placeholder="Optional" />
        <TextField label="Grade / Year" value={form.grade} onChange={set("grade")} placeholder="Optional" />
        <TextField label="Country" value={form.country} onChange={set("country")} placeholder="Optional" />
        <TextField
          label="Time zone"
          value={form.time_zone}
          onChange={set("time_zone")}
          placeholder={Intl.DateTimeFormat().resolvedOptions().timeZone}
        />
      </SettingsCard>

      <button
        onClick={() => void save()}
        disabled={saving || isGuest}
        className="accent-gradient font-display w-full rounded-3xl py-4 text-sm font-semibold text-primary-foreground transition-transform duration-300 active:scale-[0.98] disabled:opacity-50"
      >
        {isGuest ? "Sign in to save your profile" : saving ? "Saving…" : "Save changes"}
      </button>
    </SettingsPage>
  );
}
