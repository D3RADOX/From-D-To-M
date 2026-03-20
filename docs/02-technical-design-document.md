# Technical Design Document (TDD)

**Project:** From D to M — Mobile Web Respiratory Therapy Game
**Version:** 0.1
**Last Updated:** 2026-03-20

---

## 1. Technology Stack

### Frontend

- HTML
- CSS
- JavaScript

### Framework

- **Primary:** Phaser.js
- **Alternatives:** PixiJS, React + Canvas

### Backend (Optional)

- Node.js
- Firebase

---

## 2. Folder Structure

```
/game
│
├── index.html
│
├── /styles
│   └── ui.css
│
├── /scripts
│   ├── game.js       ← Main loop
│   ├── ui.js          ← HUD and UI elements
│   ├── input.js       ← Tap/touch handling
│   ├── lungs.js       ← Lung animation logic
│   └── tasks.js       ← Mini-game logic
│
└── /assets
    ├── /images
    └── /sounds
```

---

## 3. Core Game Loop

The game runs on a standard `requestAnimationFrame` loop:

```
Input → Update → Render
```

### Loop Structure

```javascript
function gameLoop() {
    handleInput();    // Detect tap
    updateState();    // Update meters
    playAnimations(); // Play animation
    giveReward();     // Give reward
    requestAnimationFrame(gameLoop);
}
```

---

## 4. Module Breakdown

### `input.js` — Input System

Handles all touch/tap events. Translates raw touch events into game actions (inhale, exhale, treat, boost).

### `lungs.js` — Lung Animation Logic

Manages lung state and animations. Responds to input events by inflating, deflating, or triggering status changes.

### `tasks.js` — Mini-Game Logic

Contains the logic for each mini-game (Mucus Burst, Oxygen Rush, Pressure Balance). Each task runs within the main game loop.

### `ui.js` — HUD

Renders meters, score, patient info, and button states. Updates every frame.

### `game.js` — Main Loop

Initializes the game, runs the `requestAnimationFrame` loop, coordinates all modules.

---

## 5. State Machine

```
Loading → Menu → MiniGame → Results → Menu
```

Each mini-game is a self-contained state that plugs into the main loop.

---

## 6. Performance Targets

- 60fps on mid-range mobile devices
- Minimal asset download size
- Fast first-load time
- Touch input response within 100ms

---

## Related Documents

- [Game Design Document](./01-game-design-document.md)
- [UI/UX Specification](./03-ui-ux-specification.md)
- [Mechanics Specification](./04-mechanics-specification.md)
- [Asset List](./05-asset-list.md)
