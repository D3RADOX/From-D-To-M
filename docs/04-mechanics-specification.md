# Mechanics Specification

**Project:** From D to M — Mobile Web Respiratory Therapy Game
**Version:** 0.1
**Last Updated:** 2026-03-20

---

## 1. Lung System

The lung has four meters:

| Meter | Range | Description |
|-------|-------|-------------|
| **Oxygen** | 0–100 | Lung oxygen level |
| **Pressure** | 0–100 | Lung pressure level |
| **Infection** | 0–100 | Infection severity |
| **Stability** | 0–100 | Overall lung stability |

### Tap Effects

| Action | Effect |
|--------|--------|
| Tap INHALE | `oxygen += 5` |
| Tap EXHALE | `pressure -= 5` |
| Tap TREAT | `infection -= 5` |
| Mistakes | Meters destabilize |

### Thresholds

```
If oxygen > 80  → reward()
If pressure > 90 → fail()
```

---

## 2. Mini-Game: Mucus Burst

### Concept

Clear blockage from the airways.

### Gameplay

1. Tap rapidly
2. Meter fills with each tap
3. Burst animation plays when meter is full
4. Reward given

### Failure Condition

- Timer expires before meter fills
- Patient cough animation plays on failure

### Scoring

- Points per tap
- Bonus for speed
- Combo multiplier for sustained tapping

---

## 3. Mini-Game: Oxygen Rush

### Concept

Fill the oxygen bar to target level.

### Gameplay

1. Tap INHALE at a steady pace
2. **Too fast:** Penalty applied
3. **Perfect timing:** Combo activates

### Difficulty

- Target pace changes per level
- Tolerance window narrows as difficulty increases

### Scoring

- Base points for reaching target
- Combo multiplier for sustained perfect timing
- Penalty deductions for rushing

---

## 4. Mini-Game: Pressure Balance

### Concept

Keep the pressure needle centered in the target zone.

### Gameplay

1. Tap INHALE to raise needle
2. Tap EXHALE to lower needle
3. Keep needle in the center zone

### Difficulty

- Needle drift speed increases per level
- Target zone narrows as difficulty increases
- External disruptions (coughs, spasms) push the needle

### Scoring

- Points accumulate while needle is in zone
- Streak bonus for sustained balance
- Penalty for needle hitting extremes

---

## 5. Shared Mechanics

### Difficulty Scaling

All mini-games increase in difficulty across sessions:

- Faster timers
- Narrower success windows
- More simultaneous elements

### Combo System

- Sequential perfect actions build a combo counter
- Combo multiplier applies to all point gains
- Combo breaks on mistakes

---

## 6. Future Mini-Games

Additional mini-games (~15 total) are planned. Each will follow the same structure:

- Clear concept and goal
- Tap-based input
- Meter/progress mechanic
- Scoring with combos
- Difficulty progression

A separate mini-game task list will enumerate all planned games.

---

## Related Documents

- [Game Design Document](./01-game-design-document.md)
- [Technical Design Document](./02-technical-design-document.md)
- [UI/UX Specification](./03-ui-ux-specification.md)
- [Asset List](./05-asset-list.md)
