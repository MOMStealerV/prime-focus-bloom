export type SettingsItemId =
  | "profile"
  | "account"
  | "notifications"
  | "appearance"
  | "focus"
  | "integrations"
  | "privacy"
  | "storage"
  | "premium"
  | "support"
  | "about";

export const SETTINGS_ITEMS: {
  id: SettingsItemId;
  label: string;
  detail: string;
  to: string;
}[] = [
  {
    id: "profile",
    label: "Profile",
    detail: "Name, avatar and study identity",
    to: "/settings/profile",
  },
  { id: "account", label: "Account", detail: "Sign-in, backup and data", to: "/settings/account" },
  {
    id: "notifications",
    label: "Notifications",
    detail: "Reminders, summaries and alerts",
    to: "/settings/notifications",
  },
  {
    id: "appearance",
    label: "Appearance",
    detail: "Themes, mode and typography",
    to: "/settings/appearance",
  },
  {
    id: "focus",
    label: "Focus Settings",
    detail: "Durations, breaks and music",
    to: "/settings/focus",
  },
  {
    id: "integrations",
    label: "Integrations",
    detail: "Calendars, tasks and music services",
    to: "/settings/integrations",
  },
  {
    id: "privacy",
    label: "Privacy & Security",
    detail: "Local data, locks and analytics",
    to: "/settings/privacy",
  },
  {
    id: "storage",
    label: "Storage",
    detail: "Usage by module, cache and backups",
    to: "/settings/storage",
  },
  { id: "premium", label: "Premium", detail: "Advanced insights and AI", to: "/settings/premium" },
  {
    id: "support",
    label: "Help & Support",
    detail: "FAQ, bugs and community",
    to: "/settings/support",
  },
  { id: "about", label: "About", detail: "Version, credits and licences", to: "/settings/about" },
];
