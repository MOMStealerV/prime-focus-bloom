/**
 * TEMPORARY documentation tool.
 *
 * Manifest of every real PrimeFlow screen shown in the /ui-gallery reference area.
 * Nothing here changes app behaviour — it only lists routes that already exist.
 * Delete this file plus src/routes/ui-gallery/* and the gallery is gone.
 */

export const GALLERY_VIEWPORT = { width: 393, height: 852 } as const;

export type GalleryFlag = "profile" | "focus-running" | "focus-paused" | "focus-mini";

export type GalleryScreen = {
  /** Human label used for the section title and the exported filename. */
  name: string;
  /** Real route the frame renders. */
  path: string;
  /** Group heading in the gallery. */
  group: "Core" | "Study" | "Settings" | "Onboarding & Auth" | "States";
  /** One-line purpose note. */
  note: string;
  /** Gallery-only state flag appended as ?gallery=… */
  flag?: GalleryFlag;
};

export const GALLERY_SCREENS: GalleryScreen[] = [
  // --- Core -----------------------------------------------------------------
  { name: "Home", path: "/", group: "Core", note: "Dashboard: flow score, schedule, profile avatar" },
  { name: "Focus", path: "/focus", group: "Core", note: "Timer presets and session launcher" },
  { name: "Analytics", path: "/analytics", group: "Core", note: "Charts, heatmap and streaks" },
  { name: "Habits", path: "/habits", group: "Core", note: "Habit grid and streak counters" },

  // --- Study ----------------------------------------------------------------
  { name: "Study Hub", path: "/study", group: "Study", note: "Study dashboard and module entries" },
  { name: "Subjects", path: "/study/subjects", group: "Study", note: "Subjects, targets and logging" },
  { name: "Planner", path: "/study/planner", group: "Study", note: "Study block scheduling" },
  { name: "Notes", path: "/study/notes", group: "Study", note: "Notes with tags" },
  { name: "Assignments", path: "/study/assignments", group: "Study", note: "Deadlines and status" },

  // --- Settings -------------------------------------------------------------
  { name: "Settings", path: "/settings", group: "Settings", note: "Settings hub list" },
  { name: "Settings Profile", path: "/settings/profile", group: "Settings", note: "Name, avatar, identity" },
  { name: "Settings Account", path: "/settings/account", group: "Settings", note: "Sign-in, backup and data" },
  { name: "Settings Notifications", path: "/settings/notifications", group: "Settings", note: "Reminders and alerts" },
  { name: "Settings Appearance", path: "/settings/appearance", group: "Settings", note: "Themes, mode, typography" },
  { name: "Settings Focus", path: "/settings/focus", group: "Settings", note: "Durations, breaks, music" },
  { name: "Settings Integrations", path: "/settings/integrations", group: "Settings", note: "Calendars, tasks, music" },
  { name: "Settings Privacy", path: "/settings/privacy", group: "Settings", note: "Local data and analytics" },
  { name: "Settings Storage", path: "/settings/storage", group: "Settings", note: "Usage, cache, backups" },
  { name: "Settings Premium", path: "/settings/premium", group: "Settings", note: "Premium plan overview" },
  { name: "Settings Support", path: "/settings/support", group: "Settings", note: "FAQ, bugs, community" },
  { name: "Settings About", path: "/settings/about", group: "Settings", note: "Version and credits" },

  // --- Onboarding & auth ----------------------------------------------------
  { name: "Welcome Onboarding", path: "/welcome", group: "Onboarding & Auth", note: "First-launch welcome flow" },
  { name: "Login Signup", path: "/auth", group: "Onboarding & Auth", note: "Sign in, sign up, guest mode" },
  {
    name: "OAuth Consent",
    path: "/.lovable/oauth/consent",
    group: "Onboarding & Auth",
    note: "Agent integration consent screen",
  },

  // --- Important states -----------------------------------------------------
  {
    name: "Profile Settings Sheet",
    path: "/",
    flag: "profile",
    group: "States",
    note: "Home with the glass profile/settings sheet open",
  },
  {
    name: "Focus Session Running",
    path: "/focus",
    flag: "focus-running",
    group: "States",
    note: "Full-screen immersive focus overlay",
  },
  {
    name: "Focus Session Paused",
    path: "/focus",
    flag: "focus-paused",
    group: "States",
    note: "Immersive overlay in paused state",
  },
  {
    name: "Focus Mini Widget",
    path: "/analytics",
    flag: "focus-mini",
    group: "States",
    note: "Active session collapsed while browsing another tab",
  },
];

export function screenSrc(screen: GalleryScreen): string {
  return screen.flag ? `${screen.path}?gallery=${screen.flag}` : screen.path;
}

export function screenFileName(screen: GalleryScreen, index: number): string {
  const slug = screen.name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return `${String(index + 1).padStart(2, "0")}-${slug}.png`;
}

/** Reads the gallery-only state flag from the current URL. Inert on normal visits. */
export function galleryFlag(): GalleryFlag | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("gallery");
  return value === "profile" ||
    value === "focus-running" ||
    value === "focus-paused" ||
    value === "focus-mini"
    ? value
    : null;
}
