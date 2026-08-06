# PrimeFlow — Complete Profile, Authentication, Settings & Integrations Upgrade

A functionality-only upgrade: a real account system, a complete settings architecture, a deeper Study Hub, real analytics, and future-ready integration/AI/sync extension points. No visual redesign — every new screen reuses the existing glass cards, theme tokens, typography, icons, spacing, animations and navigation, and all current Home, Focus, Analytics, Habits and Study layouts stay as they are.

Also in scope, built on the same components: Study Hub modules (Subjects with colour coding, calendar Planner with revision and exam countdown, rich Notes with search/categories/pinning, Assignments, Flashcards with spaced-repetition architecture, Goals, Exams, Resources); Analytics rebuilt on live focus/habit/study/productivity/wellbeing data with no mock charts; and typed extension points for future AI modules (study planner, revision generator, focus coach, insights, habit suggestions, exam prep, schedule optimisation) without implementing them.

## 1. Authentication

- **Welcome screen** at `/welcome`: PrimeFlow mark, tagline, Sign In, Create Account, Continue as Guest. Shown on first launch; the choice is remembered locally so returning users go straight to Home. Guest and signed-in users can always reach it again from Profile.
- **Sign in** (`/auth`, rebuilt in PrimeFlow styling): email + password, show/hide password, Remember me, Forgot password opening a dedicated reset flow (`/forgot-password` → emailed link → `/reset-password`). Continue with Google works for real; Apple and Microsoft render as clearly-labelled "coming soon" buttons.
- **Sign up**: Full name, username (optional), email, password, confirm password. Live validation for email format, password strength meter, matching passwords, and required Privacy Policy + Terms acceptance. A profile is created automatically on signup.
- **Guest mode**: full app access with no account. A slim dismissible glass banner on Home invites signing in for cloud sync.

Accounts use the app's backend. A `profiles` table stores name, username, avatar, bio, school, grade/class, country, time zone and created date, readable and writable only by their owner.

## 2. Settings as real pages

The Profile button stays exactly where it is and looks unchanged; tapping it opens the same glass bottom sheet, which becomes a launcher. Rows: Profile, Account, Notifications, Appearance, Focus Settings, Integrations, Privacy & Security, Storage, Premium, Help & Support, About, Sign Out. Each navigates to a full settings route with a matching back header.

| Route | Contents |
| --- | --- |
| `/settings` | Overview list |
| `/settings/profile` | Avatar, name, username, email, bio, school, academic level, country, time zone; Connected Devices placeholder card |
| `/settings/account` | Email, change password, connected accounts, backup + sync status, export/import data, delete account (confirm dialog) |
| `/settings/notifications` | Study, focus, habit, assignment, daily summary, weekly report, goal and achievement toggles; quiet hours, notification sound, reminder frequency |
| `/settings/appearance` | Existing 4-theme selector, Light/Dark/System mode, font size, animation toggle, reduced motion |
| `/settings/focus` | Default focus / break / long break, auto-start break, auto-start focus, countdown style, daily session goal; Ambient Sounds replaced by Preferred Music Service (Spotify, YouTube Music, Apple Music, Local) |
| `/settings/integrations` | Google Calendar/Tasks/Drive, Outlook Calendar, Microsoft To Do, Spotify, YouTube Music, Apple Music, Google Classroom — each with status, last sync and Connect button (placeholder auth) |
| `/settings/privacy` | Local data only, cloud sync, analytics, crash reports, biometric lock, PIN lock, auto lock, privacy mode; clear cache, clear local data, export, delete |
| `/settings/premium` | Benefit cards, plan tiers, Upgrade button (placeholder checkout) |
| `/settings/support` | FAQ accordion, contact, report bug, feature request, Discord/community, policy links |
| `/settings/about` | Version, build, developer, open-source libraries, licences, credits, policy links |
| `/settings/storage` | Per-domain size breakdown (focus, study, analytics, notes, habits, assignments, cache), total used, clear cache, export/import backup |
| `/privacy`, `/terms` | Real policy pages the auth and settings screens link to |

Focus settings actually drive the timer: default durations, auto-start and session goal are read by the existing focus engine, and the ambient sound player is replaced by the music-service preference.

## 3. Sync architecture (no backend sync yet)

A local-first layer wrapping the existing stores: every record carries `updatedAt` and a device id, writes queue into an outbox, and a sync adapter interface with a no-op local driver plus last-write-wins conflict resolution is defined and ready for a cloud driver. Offline state is detected and surfaced in Account's sync status.

## Technical notes

- New `profiles` table with owner-only access policies and a signup trigger.
- Settings state moves into an expanded `src/lib/prefs.ts` (typed groups: notifications, appearance, focus, privacy, integrations, music) persisted to localStorage, with a migration from the current keys so nothing existing is lost.
- Welcome/auth routes stay public and SSR-safe; profile-editing calls go through authenticated server functions. Guest data stays in the browser.
- Export/import produce and consume a single versioned JSON backup covering all local stores.
