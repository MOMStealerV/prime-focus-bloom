# PrimeFlow: Focus and Wellbeing

PrimeFlow — Stage 1 Foundation Prompt for Lovable

Build a modern mobile app called PrimeFlow.

PrimeFlow is an AI-powered focus and digital wellbeing app that helps users reduce distractions, build focus habits, manage their day, and improve productivity.

Important scope

DO NOT implement Exam Mode, subscriptions, payments, or business features. This is a personal learning project focused on helping people and learning app development.

Goal of this stage

Create only the foundation, navigation, theming system, and premium dashboard UI. The app should look like a real flagship mobile app, not a prototype.

Design requirements

Use a premium Apple + Linear + Notion inspired design language.

Visual style

Glassmorphism cards

Soft blur backgrounds

Rounded corners (24–32px)

Smooth shadows

Minimal icons

Elegant typography

Fluid animations

Clean spacing

No clutter

Theme system (very important)

Create a multi-theme system with at least 4 fully designed themes that can be switched from Settings.

Theme 1 — Midnight Flow (default)

Target: neutral / masculine

Background: deep black / charcoal

Accent: electric blue

Cards: dark glass

Charts: blue gradients

Theme 2 — Sakura Glow

Target: feminine

Background: soft pink / lavender

Accent: rose pink

Cards: frosted light glass

Charts: pink-purple gradients

Theme 3 — Emerald Focus

Target: gender-neutral productivity

Background: deep green + dark slate

Accent: emerald

Cards: translucent green glass

Charts: green gradients

Theme 4 — Arctic White

Target: clean professional

Background: warm white / light gray

Accent: indigo

Cards: subtle frosted white

Charts: indigo gradients

The theme switch should update the entire app instantly, including cards, charts, navigation, buttons, and gradients.

App structure

Create a bottom navigation bar with 5 tabs:

Home

Focus

Analytics

Habits

Settings

Home screen (main dashboard)

Design a visually stunning dashboard containing:

Top section

Greeting: “Good evening, Nir”

Current date

Profile avatar

Theme preview button

Hero card

Large animated glass card showing:

Today’s Flow Score (0–100)

Circular progress ring

Motivational message from AI

“Start Focus Session” primary button

Quick stats row

Four compact cards:

Focus Hours

Distractions Avoided

Current Streak

Tasks Completed

Today’s schedule

Timeline-style card with:

Morning Focus

School / Work

Evening Study

Wind Down

AI insight card

Beautiful highlighted card with an AI-generated insight such as:
“You usually focus best between 7:00 PM and 9:00 PM.”

Habit progress

Animated progress bars for:

Reading

Exercise

Sleep

Study

Focus tab

Create only the UI shell for now:

Large timer circle

Session presets (25, 45, 60, 90 min)

Ambient sound selector

Start button

Do not implement timer logic yet.

Analytics tab

Create a beautiful analytics dashboard with mock data:

Weekly focus chart

Screen time reduction chart

Productivity heatmap

Flow Score trend

Most distracting apps list

Use animated charts and premium data visualization.

Habits tab

Create a habit tracker UI with:

Habit cards

Streak counters

Completion toggles

Monthly calendar preview

Add habit floating button

Settings tab

Include:

Theme selector with live previews

Dark/light toggle

Notification preferences

Privacy mode

Local data only indicator

About PrimeFlow section

Technical expectations

Use modern component architecture

Reusable glass card component

Centralized theme provider

Responsive layout

Smooth transitions between screens

60fps-style animation quality

Clean, maintainable code structure

Output quality

This should look like a premium app that could be showcased on the App Store or Google Play design gallery. Prioritize visual quality, theming, animation polish, and component architecture over backend functionality in this stage.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c2726596-bb6e-48ef-a8dc-782998d9a328).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
