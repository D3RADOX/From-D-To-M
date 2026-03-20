# Asset List

**Project:** From D to M — Mobile Web Respiratory Therapy Game
**Version:** 0.1
**Last Updated:** 2026-03-20

---

## 1. Graphics

| Asset | Type | Description | Status |
|-------|------|-------------|--------|
| Lung idle animation | Sprite/SVG | Breathing idle loop | Needed |
| Lung inflate animation | Sprite/SVG | Inhale response | Needed |
| Lung deflate animation | Sprite/SVG | Exhale response | Needed |
| Mucus burst animation | Sprite | Blockage clearing effect | Needed |
| Patient avatar | Sprite/SVG | Current patient display | Needed |
| UI buttons | SVG/PNG | INHALE, EXHALE, TREAT, BOOST | Needed |
| Meters | SVG | Oxygen, pressure, infection, stability | Needed |
| Icons | SVG | Score, combo, timer, status | Needed |
| Particles | Sprite | Tap effects, rewards, combos | Needed |

---

## 2. Sounds

| Asset | Format | Description | Status |
|-------|--------|-------------|--------|
| Tap sound | MP3/OGG | Plays on every button press | Needed |
| Success sound | MP3/OGG | Task completion | Needed |
| Failure sound | MP3/OGG | Task failure | Needed |
| Combo sound | MP3/OGG | Combo milestone reached | Needed |
| Reward sound | MP3/OGG | Reward given | Needed |
| Background loop | MP3/OGG | Ambient game music | Needed |

---

## 3. UI Animations

| Animation | Trigger | Description |
|-----------|---------|-------------|
| Button glow | On tap | Button lights up on press |
| Meter fill | On progress | Smooth meter advancement |
| Combo flash | On combo | Screen flash on combo milestone |
| Reward popup | On reward | Number/icon floats up from action |

---

## 4. Core JavaScript Systems

Developers must build the following modules:

| Module | File | Purpose |
|--------|------|---------|
| Input system | `input.js` | Handles all tap/touch events |
| UI system | `ui.js` | HUD rendering and updates |
| Animation system | `lungs.js` | Lung state and animation |
| Reward system | `game.js` | Scoring, combos, rewards |
| Task system | `tasks.js` | Mini-game logic |
| Game loop | `game.js` | Main `requestAnimationFrame` loop |

### Simplest Architecture

```
input.js  → handles taps
lungs.js  → lung animation logic
tasks.js  → mini-games
ui.js     → HUD
game.js   → main loop
```

---

## 5. Fonts & Typography

| Use | Recommendation |
|-----|---------------|
| Primary (UI, buttons) | Bold sans-serif (e.g., Nunito, Poppins) |
| Secondary (scores, popups) | Rounded display font |

---

## Related Documents

- [Game Design Document](./01-game-design-document.md)
- [Technical Design Document](./02-technical-design-document.md)
- [UI/UX Specification](./03-ui-ux-specification.md)
- [Mechanics Specification](./04-mechanics-specification.md)
