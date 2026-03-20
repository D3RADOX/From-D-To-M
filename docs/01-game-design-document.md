# Game Design Document (GDD)

**Project:** From D to M — Mobile Web Respiratory Therapy Game
**Version:** 0.1
**Last Updated:** 2026-03-20

---

## 1. Game Concept

A fast dopamine mobile web game where players complete respiratory therapy actions through tapping and breathing mini-games.

**One-line pitch:** A ridiculous respiratory therapy arcade game.

### Tone

- Funny
- Fast
- Bright
- Reward-heavy

### Session Length

30 seconds to 3 minutes.

### Platform

Mobile browser (hyper-casual mobile web game).

### Design Inspiration

| Category | Examples |
|----------|----------|
| Hyper-casual medical game | Mobile tap games, idle games, skill tap games |
| Feedback style | Candy Crush feedback, Subway Surfers speed |
| Theme | Hospital / respiratory therapy |

**Important rule:** The game must feel like a mobile tap game, not simulation software. Fast, bright, immediate, rewarding.

---

## 2. Core Gameplay

Player sees lungs on screen. Player taps buttons. Player performs tasks:

- Clear mucus
- Increase oxygen
- Balance pressure
- Treat patient

Each task is a mini-game.

---

## 3. Core Loop

```
Start game
    ↓
Patient appears
    ↓
Task appears
    ↓
Player taps controls
    ↓
Meter fills
    ↓
Reward given
    ↓
Next patient
    ↓
Repeat
```

---

## 4. Mini-Games Overview

| Mini-Game | Mechanic | Goal |
|-----------|----------|------|
| Mucus Burst | Rapid tapping | Clear blockage |
| Oxygen Rush | Timed inhale taps | Fill oxygen bar |
| Pressure Balance | Inhale/exhale taps | Keep needle centered |

Full mini-game details are in the [Mechanics Specification](./04-mechanics-specification.md).

---

## 5. Reward Structure

- Every tap produces visible feedback
- Completing tasks gives rewards
- Combos for perfect timing
- No dead taps allowed — every input matters

---

## 6. Tone Guide

- Positive reinforcement, never punishing
- Bright colors, exaggerated animations
- Quick dopamine bursts on every action
- Hospital theme played for fun, not realism

---

## Related Documents

- [Technical Design Document](./02-technical-design-document.md)
- [UI/UX Specification](./03-ui-ux-specification.md)
- [Mechanics Specification](./04-mechanics-specification.md)
- [Asset List](./05-asset-list.md)
