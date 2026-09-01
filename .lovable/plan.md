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
