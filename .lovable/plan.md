# PrimeFlow Navigation & Architecture Refinement

## Objective

This task is a navigation and architecture refinement only.

The current PrimeFlow UI and design system are fully approved.

Do not redesign the application.

Do not modify the existing visual style.

Preserve:

- Layouts

- Themes

- Glassmorphism

- Colors

- Typography

- Icons

- Spacing

- Shadows

- Animations

- Cards

- Components

- Navigation style

Everything should look identical after this update.

Only implement the structural changes described below.

---

# 1. Move Settings into the Profile Menu

Remove the dedicated Settings tab from the bottom navigation.

Use the existing profile avatar located in the top-right corner as the global entry point for account management and settings.

The avatar already exists on the Home screen. Reuse this exact component and place it in the headers of:

- Home

- Focus

- Analytics

- Study

- Habits

The avatar should always open the same reusable Profile Menu component.

Do not duplicate this menu.

---

# 2. Profile Menu

Tapping the profile avatar should open a premium glassmorphic bottom sheet that matches the existing PrimeFlow design language.

The menu should contain:

- Profile

- Account

- Notifications

- Appearance

- Focus Settings

- Integrations

- Privacy & Security

- Premium

- Help & Support

- About

Maintain the existing animation style and visual consistency.

---

# 3. Migrate Existing Settings

Move the existing Settings content into the Profile Menu.

Do not redesign these sections.

Reuse the existing components exactly.

Existing functional sections include:

Appearance

- Theme picker

- Theme selection

- Dark / Light toggle

Notifications

- Existing notification preferences

Privacy & Security

- Existing privacy controls

- Local Data Only information

About

- Existing About PrimeFlow section

Extract these into reusable shared components.

Both the Profile Menu and the existing /settings route must use these shared components.

Do not duplicate code.

---

# 4. Placeholder Sections

Create placeholder panels for sections that do not yet have functionality.

These include:

- Profile

- Account

- Focus Settings

- Integrations

- Premium

- Help & Support

Do not display "Coming Soon."

Instead, use short descriptive text explaining the future purpose of each section while matching the existing card design.

Example:

Integrations

Connect Google Calendar, Google Tasks, cloud backup and additional productivity services in future updates.

---

# 5. Update Bottom Navigation

Update the bottom navigation order to:

1. Home

2. Focus

3. Analytics

4. Study

5. Habits

Remove the Settings tab completely.

Reuse the existing Bottom Navigation component.

Do not modify:

- Height

- Width

- Padding

- Floating behavior

- Glass styling

- Animations

- Corner radius

- Active indicator

Only update the navigation items.

Use an icon from the existing icon library that best represents Study and matches the current visual style.

---

# 6. Study Screen

Create a new Study screen.

Reuse the existing Screen, ScreenTitle and GlassCard components.

Do not introduce a new design language.

The page should include four placeholder cards.

Card 1

Title: Subjects

Description:

Manage and organize your study subjects.

Card 2

Title: Planner

Description:

Plan study sessions, exams and revision schedules.

Card 3

Title: Notes

Description:

Keep all study notes organized in one place.

Card 4

Title: Assignments

Description:

Track homework, deadlines and upcoming work.

These cards are placeholders for future functionality but should feel like a finished part of the application.

---

# 7. Keep the Existing Settings Route

Do not delete the existing /settings route.

Keep it available for compatibility.

Internally, it should reuse the same shared components extracted for the Profile Menu.

No duplicated markup.

---

# 8. Shared Components

Create reusable components where appropriate.

Examples include:

- ProfileAvatar

- ProfileMenu

- AppearanceSection

- NotificationSection

- PrivacySection

- AboutSection

Create shared state where necessary so both the Profile Menu and the /settings route always stay synchronized.

---

# 9. Future-Ready Architecture

Prepare the application for future integrations without implementing them yet.

Design the architecture so the Integrations section can later support:

- Google Sign-In

- Google Calendar

- Google Tasks

- Google Drive Backup

- Google Classroom

- Microsoft Outlook

- Apple Calendar

These should remain placeholders only.

No backend integration is required in this task.

---

# 10. Preserve Existing Functionality

Do not modify:

- Home page functionality

- Focus engine

- Analytics engine

- Habits page

- Existing state management

- Business logic

Apart from adding the reusable Profile Avatar to page headers and updating navigation, every existing screen should remain visually and functionally unchanged.

---

## Success Criteria

The final application should feel like a polished refinement of the existing PrimeFlow project.

The only visible changes should be:

- Settings is now accessed through the Profile Avatar.

- Bottom navigation becomes:

  - Home

  - Focus

  - Analytics

  - Study

  - Habits

- A new Study Hub placeholder screen is available.

- The Profile Menu becomes the central place for account management, settings and future integrations.

Everything else should remain exactly as it is.