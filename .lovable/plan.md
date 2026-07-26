## PrimeFlow — Stage 1 Foundation

A premium mobile-first React app: theming system, bottom-tab navigation, and five fully designed screens with mock data. No backend, no timer logic, no Exam Mode, no payments.

### Theme system
- 4 complete themes as CSS variable sets in `src/styles.css`, applied via a `data-theme` attribute on `<html>`:
  - **Midnight Flow** (default) — charcoal/black, electric blue accent, dark glass cards, blue chart gradients
  - **Sakura Glow** — pink/lavender, rose accent, frosted light glass, pink-purple gradients
  - **Emerald Focus** — deep green/slate, emerald accent, translucent green glass
  - **Arctic White** — warm white/gray, indigo accent, subtle frosted white
- Every theme defines the same token names (background, surface, glass tint/border, foreground, muted, accent, accent-glow, chart-1..4, gradients, shadows) so switching updates cards, charts, nav, buttons and gradients instantly with a CSS transition.
- `ThemeProvider` context: current theme + light/dark preference, persisted to localStorage, no flash on load.

### Navigation
- Persistent bottom tab bar (Home, Focus, Analytics, Habits, Settings) as glass chrome in a shared layout, with an animated active indicator.
- Five routes: `/` (Home), `/focus`, `/analytics`, `/habits`, `/settings`. Each gets its own page metadata.
- Phone-width container centered on desktop so it reads as a real mobile app.

### Screens
**Home** — greeting "Good evening, Nir" + date + avatar + theme-preview button; hero glass card with animated circular Flow Score ring, AI motivational line and "Start Focus Session" button; 4 quick-stat cards (Focus Hours, Distractions Avoided, Streak, Tasks); timeline schedule card (Morning Focus, School/Work, Evening Study, Wind Down); AI insight highlight card; animated habit progress bars (Reading, Exercise, Sleep, Study).

**Focus** — UI shell only: large timer circle, 25/45/60/90 presets, ambient sound selector chips, start button. No countdown logic.

**Analytics** — weekly focus bar chart, screen-time reduction chart, productivity heatmap grid, Flow Score trend line, most-distracting-apps list. All mock data, animated on mount, colors driven by theme tokens.

**Habits** — habit cards with streak counters and completion toggles (local state), monthly calendar preview, floating add-habit button.

**Settings** — theme selector with live mini-previews of all 4 themes, light/dark toggle, notification preference switches, privacy mode, "Local data only" indicator, About PrimeFlow.

### Technical
- Reusable primitives: `GlassCard`, `SectionHeader`, `ProgressRing`, `StatTile`, `AnimatedBar`, `BottomNav`.
- Charts hand-built with SVG so they inherit theme tokens and animate smoothly (avoids library theming friction).
- Motion via CSS transitions/keyframes plus a light use of Framer Motion for tab and card entrance.
- Mock data centralized in `src/data/mock.ts`.
- Zero hardcoded colors in components — semantic tokens only.
