# Fix: profile/settings sheet is see-through

## Problem

The profile sheet opened from the Home avatar uses the `glass` surface, which is highly translucent. The dashboard behind it ("Good evening, Nir", the focus ring) shows straight through the panel, so the settings list is hard to read. On short viewports the sheet also renders as a thin strip with an awkward scrollbar instead of a comfortable sheet.

## Fix (presentation only, no logic changes)

In `src/components/primeflow/ProfileMenu.tsx`:

- Give the sheet panel an opaque themed surface (solid `bg-card`/popover token plus a subtle border and shadow) layered over the existing glass blur, so nothing behind it reads through. No hardcoded colors — design tokens only.
- Strengthen the backdrop scrim (darker overlay + stronger blur) so the dashboard recedes.
- Set a sensible sheet height on short screens: min height so it never collapses to a strip, keep `max-h-[85dvh]`, and add a grab handle plus sticky header row so the profile row and close button stay visible while the list scrolls.
- Keep the exact same layout, spacing, typography, rounded corners and animation.

Nothing else changes: same items, same links, same auth behaviour.
