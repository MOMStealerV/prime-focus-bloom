# Fix: settings sheet glitches when opening from the profile icon

## What's wrong

The profile sheet is rendered inline, right where the avatar button lives — inside the Home header. That header runs the `animate-rise` entrance animation with a fill mode that keeps a transform applied permanently, and the screen wrapper around it uses `overflow-hidden`.

A CSS transform on an ancestor makes `position: fixed` resolve against that ancestor instead of the viewport. So the "full screen" sheet is actually anchored to (and clipped by) the header: it can appear offset, cut off, mis-sized, or jump/flicker as the animation settles. The page behind also keeps scrolling under the open sheet.

## Fix (presentation only)

In `src/components/primeflow/ProfileMenu.tsx`:

- Render the overlay + sheet through a React portal into `document.body`, mounted client-side only so SSR/hydration stays clean. This takes it out of the transformed, clipped header and makes the fixed positioning behave.
- Lock background scroll while the sheet is open, and restore it on close.
- Close on `Escape`, and move focus into the sheet on open / back to the avatar on close.
- Keep the panel's own entrance animation, but make sure it's the panel animating, not an ancestor.

Everything else stays identical: same solid card surface, same scrim, grab handle, header row, settings items, links and auth behaviour. No logic or data changes.

## Verification

Open the sheet on the mobile viewport, confirm it fills the screen from the bottom with no clipping or jump, the list scrolls while the profile row stays put, the page behind doesn't scroll, and Escape / tapping the scrim closes it.
