# Profile Avatar placement refinement

Move the profile avatar from the shared `ScreenTitle` component so it appears only on the Home screen header.

## What will change

1. Remove `<ProfileMenu />` from `src/components/primeflow/Screen.tsx` (`ScreenTitle`).
   - The title and subtitle layout remains the same; only the avatar button is removed.
2. Keep Home (`src/routes/index.tsx`) unchanged — it already has its own header with `<ProfileMenu />`.

## Result

- The avatar is present on **Home** only.
- The avatar is removed from **Focus**, **Analytics**, **Study**, **Habits**, and **Settings** automatically because they all use `ScreenTitle`.
- No changes to layouts, themes, spacing, glassmorphism, typography, animations, or other UI elements.
