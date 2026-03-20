# UI/UX Specification

**Project:** From D to M — Mobile Web Respiratory Therapy Game
**Version:** 0.1
**Last Updated:** 2026-03-20

---

## 1. Design Goal

Mobile dopamine UI. Every interaction must feel immediate and rewarding.

---

## 2. Screen Layout

```
┌─────────────────────────┐
│      PATIENT INFO       │  ← TOP
│                         │
├─────────────────────────┤
│                         │
│    ANIMATED LUNGS       │  ← CENTER
│                         │
├─────────────────────────┤
│                         │
│     TAP BUTTONS         │  ← BOTTOM
│                         │
└─────────────────────────┘
```

### TOP — Patient Info
- Current patient name/avatar
- Score and progress indicators

### CENTER — Animated Lungs
- Main visual focus
- Responds to player input in real-time
- Inflate, deflate, and status animations

### BOTTOM — Tap Buttons
- Primary interaction area
- Thumb-reachable zone

---

## 3. Buttons

Four primary action buttons:

| Button | Action |
|--------|--------|
| **INHALE** | Increases oxygen |
| **EXHALE** | Reduces pressure |
| **TREAT** | Reduces infection |
| **BOOST** | Special ability |

### Button Requirements

- **Large** — easy to hit with thumbs
- **Thumb-reachable** — positioned in bottom third of screen
- **Bright** — high contrast, immediately visible
- **Animated** — visual response on every press

---

## 4. Feedback Rules

**Every single tap must produce:**

| Feedback | Description |
|----------|-------------|
| Sound | Tap audio plays immediately |
| Glow | Button glows on press |
| Number popup | +5, +10, etc. floats up from tap point |
| Micro vibration | Haptic feedback via Vibration API |
| Progress increase | Meter visibly advances |

### Zero Dead Taps Policy

No tap should ever feel like nothing happened. Every input produces visible, audible, and tactile feedback.

---

## 5. Screen Flow

```
Splash → Home → Game Select → [Mini-Game] → Results → Home
```

---

## 6. Accessibility

- Large touch targets (minimum 48x48px)
- High contrast colors
- Single-hand operation
- Reduced-motion support via `prefers-reduced-motion` media query

---

## Related Documents

- [Game Design Document](./01-game-design-document.md)
- [Technical Design Document](./02-technical-design-document.md)
- [Mechanics Specification](./04-mechanics-specification.md)
- [Asset List](./05-asset-list.md)
