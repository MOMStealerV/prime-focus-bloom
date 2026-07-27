## Stage 2 — Focus Engine

Stage 1 visuals stay exactly as they are: themes, `GlassCard`, `ProgressRing`, `AnimatedBar`, `Screen`, `BottomNav` and all layouts are reused, not redesigned. This stage adds the engine underneath them.

## Architecture

```text
src/lib/focus-engine.tsx   context + state machine + timers (UI-facing)
src/lib/focus-machine.ts   pure reducer + transitions (no React)
src/lib/session-store.ts   localStorage session persistence + queries
src/lib/analytics.ts       derived metrics + flow score (pure, memoized)
src/lib/achievements.ts    achievement definitions + unlock evaluation
src/lib/ambient-sound.ts   WebAudio noise + looped sound playback
src/lib/quotes.ts          quote list + non-repeating rotation
src/components/focus/*     overlay, ring states, controls, mini widget
```

UI never touches localStorage directly; everything goes through the engine and store.

## 1. State machine (`focus-machine.ts`)

States: `idle → preparing (3s) → focus ⇄ paused → completed → break ⇄ paused → idle`. A pure reducer handles every transition; invalid transitions are no-ops, so the engine can't reach a bad state.

Persisted snapshot: `{ state, kind, targetEndAt, startedAt, plannedMinutes, pausedAt, pausedTotalMs, pausedCount, distractions, cycleCount, ambientSound }`.

Timestamp-based only: `remaining = targetEndAt - Date.now() - pausedTotalMs`. A 250ms `requestAnimationFrame`/interval only re-reads the clock; it never counts down. On mount, a persisted in-flight session is rehydrated, and if its end time already passed while the app was closed it is finalized as completed.

## 2. Controls & durations

Start, Pause, Resume, Reset, Skip Break, End Session — all wired to the reducer, all with 100ms press animation. Presets 25/45/60/90 plus a custom input validated to 5–180 minutes; last selected duration is persisted and preselected.

## 3. Breaks

Focus completion auto-starts a 5-minute break; every 4th completed focus block starts a 15-minute break instead. Break end returns to idle with the previous focus duration re-queued.

## 4. Immersive overlay

A full-screen portal above everything (bottom nav and page content hidden behind it). Shows only: mode label, remaining time, elapsed time, animated ring, current streak, today's focus time, distraction counter, rotating quote, ambient controls, and Pause/Resume/End (plus Skip during break). Enter/exit use fade + scale, no layout jumps.

## 5. Ring states

Same Stage 1 ring, extended with a `state` prop: idle soft glow, focus slow breathing pulse, break green pulse, paused frozen animation, completed glow + scale + lightweight CSS confetti burst. All colors from theme tokens.

## 6. Ambient sound

Rain, Forest, Ocean, Cafe, Fireplace, White/Brown/Pink Noise. The three noise types are generated with WebAudio (no assets, no licensing risk); the five naturalistic sounds also use layered WebAudio synthesis so they work offline and loop seamlessly. Play/pause, volume slider, looping, and persisted selection.

## 7. Quotes

Curated calm quotes, rotating every few minutes with a fade transition and no immediate repeat.

## 8. Session tracking

`session-store.ts` persists each session with the exact requested model (`id, kind, plannedMinutes, actualMinutes, completed, manualEnded, startedAt, endedAt, theme, ambientSound, pausedCount, pauseDuration, distractions, flowScore, dayOfWeek, hour`). Written on complete, early end, skip, and interruption (including recovery of a stale in-flight session on next load).

## 9. Distractions

`visibilitychange` during focus increments `distractions`; the overlay shows it live.

## 10. Browser integration

Document title shows `23:15 • Focus — PrimeFlow` while running and restores on idle. Notification permission is requested on first session start. On completion: WebAudio chime, in-app toast, and a browser notification when permission is granted.

## 11. Analytics screen

All charts fed by real sessions: today's focus, week hours, last 7 days bar chart, average session, completion rate, interrupted sessions, current/best streak, weekly + monthly growth, focus distribution by hour, daily heatmap, and flow-score trend. "Most distracting apps" keeps sample values with a visible "Sample Data" badge. With zero sessions, charts are replaced by the premium empty state ("Your journey starts today." / "Every great achievement begins with one focused session." / Start First Session).

## 12. Flow score

Deterministic: `40% completion rate + 25% daily goal progress + 20% consistency + 15% low-distraction factor`, clamped 0–100. Same inputs always give the same number.

## 13. Dashboard

Home keeps its exact layout; the values become live — flow score ring, today's focus, current streak, weekly progress — plus recent sessions in place of one mock block, and the existing "Start Focus Session" button becomes a real quick start.

## 14. Mini widget

When a timer runs and the user is off the Focus screen, a floating glass mini timer sits above the bottom nav showing remaining time and mode; tapping returns to the overlay. It never affects the timer.

## 15. Achievements

Local unlocks: First Focus, 5 / 10 Sessions, 10h, 25h, 7-day and 30-day streak, Deep Worker, Consistency Master. Evaluated after each session, celebrated with a subtle toast/animation, listed on Settings.

## 16. Motion, performance, a11y

Count-up numbers, animated chart loads, smooth digit transitions, GPU-friendly transforms for 60fps. Heavy analytics are memoized and computed once per session change. `prefers-reduced-motion` disables pulses/confetti, controls are keyboard reachable with visible focus rings and ARIA labels, and the timer exposes a polite live region.

## Out of scope

No AI, no cloud sync, no Exam Mode, no navigation or visual redesign.

CRITICAL REQUIREMENTS

This is an implementation stage, NOT a redesign.

The current Stage 1 UI is approved.

Do NOT redesign any existing screens.

Do NOT replace existing components.

Do NOT rename existing components.

Do NOT modify spacing, colors, typography, navigation, layout, themes or animations unless explicitly requested.

Reuse every existing component wherever possible.

Only extend functionality underneath the existing UI.

If a new component is required, it must follow the existing design language exactly.

Existing components must remain the single source of truth.

Reuse:

GlassCard

ProgressRing

AnimatedBar

BottomNav

Screen

Button

Statistic Cards

Charts

Theme Provider

Do not duplicate these components.

Only extend them through props when additional functionality is needed.

src/

components/

focus/

Overlay.tsx

ProgressRing.tsx

MiniWidget.tsx

Controls.tsx

AmbientPlayer.tsx

QuoteCard.tsx

lib/

focus-engine.tsx

focus-machine.ts

session-store.ts

analytics.ts

ambient-sound.ts

quotes.ts

achievements.ts

hooks/

useFocusEngine.ts

types/

focus.ts

session.ts

analytics.ts