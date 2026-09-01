# PrimeFlow UI Reference Gallery

A temporary, self-contained "UI Reference" area that shows every real screen of PrimeFlow at one consistent mobile viewport. No existing page, component, style or behaviour is changed — the gallery only embeds and labels what already exists.

## What gets captured

Routes found in the project (all real, nothing invented):

- Home / Dashboard — `/`
- Focus — `/focus`
- Analytics — `/analytics`
- Habits — `/habits`
- Study Hub — `/study`, plus Subjects, Planner, Notes, Assignments
- Settings hub — `/settings`, plus Profile, Account, Appearance, Notifications, Focus, Integrations, Privacy, Storage, Premium, Support, About
- Welcome / Onboarding — `/welcome`
- Login / Sign Up — `/auth`
- OAuth consent screen — `/.lovable/oauth/consent`

Important states, shown as their own labelled frames:

- Profile settings sheet open (from the Home avatar)
- Focus session running — full-screen immersive overlay
- Focus session paused / break phase
- Mini focus widget visible while on another tab
- Empty states for Study modules (no subjects / notes / assignments yet)
- Signed-out vs signed-in variants of Settings > Account

## How it works

- New route `/ui-gallery` (plus `/ui-gallery/view` for the sequential one-at-a-time viewer). These are additive files; nothing else is touched.
- Each screen renders inside a fixed 393 x 852 iframe pointing at the real route, so the styling, spacing, typography, cards and navigation are the genuine implementation rather than a copy.
- Each frame sits in a labelled card: page name, route path, and a one-line purpose note.
- State-specific frames use a gallery-only URL query flag read by the iframe (e.g. open the profile sheet, start a demo focus session). The flag is inert on normal visits, so app behaviour is unchanged.
- Gallery pages exclude themselves from the bottom nav and from onboarding redirects.

## Viewing and exporting

- `/ui-gallery` — the full gallery: every screen as a separate clearly labelled section in a responsive grid, ideal for scrolling through or capturing the whole set.
- `/ui-gallery/view` — sequential viewer: one screen at a time at the exact same viewport, with Previous / Next, keyboard arrows, and a screen index (e.g. "7 / 28").
- A theme switcher at the top of the gallery so the whole reference can be captured in any of the four themes.

## Technical notes

- Files added: `src/routes/ui-gallery/index.tsx`, `src/routes/ui-gallery/view.tsx`, and a shared `src/lib/ui-gallery-screens.ts` manifest listing every screen (label, route, state flag).
- Iframes are same-origin and lazy-loaded so the gallery stays responsive with ~28 frames.
- The state flags are read where the state already lives (profile sheet, focus engine) via a small guarded check — read-only, no logic changes.
- Marked as temporary: deleting the three files removes the feature entirely.
- &nbsp;
- &nbsp;
- EXPORT THE PRIMEFLOW UI REFERENCE SCREENS
  The /ui-gallery and /ui-gallery/view are working correctly.
  Now add an export function to the temporary UI Gallery.
  I need every one of the 28 UI reference screens exported as an individual PNG image.
  Requirements:
  - Export all 28 screens.
  - Use the same 393 x 852 mobile viewport used by the gallery.
  - Render the actual PrimeFlow screens, not approximations.
  - Preserve the exact current styling, typography, spacing, colors and components.
  - Include the screen name in the exported filename.
  - Include important state screens listed in the gallery.
  - Do not modify the original PrimeFlow pages or their functionality.
  Create an "Export All Screens" button on /ui-gallery.
  When clicked:
  1. Render each gallery screen.
  2. Capture it at 393 x 852.
  3. Generate an individual PNG for each screen.
  4. Package all PNGs into one ZIP.
  5. Provide the ZIP for download.
  Use filenames such as:
  01-Home.png
  02-Focus.png
  03-Analytics.png
  04-Habits.png
  05-Study.png
  06-Subjects.png
  07-Planner.png
  08-Notes.png
  09-Assignments.png
  10-Settings.png
  Continue for every actual screen in the existing gallery.
  Also provide an option to export the current screen individually.
  IMPORTANT:
  This is a temporary documentation/export tool only.
  Do not redesign PrimeFlow.
  Do not change existing routes.
  Do not change existing functionality.
  Do not change the actual UI.
  Do not invent additional screens.
  The exported images must represent the actual current PrimeFlow UI.
  &nbsp;