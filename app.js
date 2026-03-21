import { onTap, go, goHome, killAll, countdown, initBgBubbles, setRefreshHome, ALL_GAMES } from './js/core.js';
import { wireRR } from './js/game-base.js';
import { refreshHome, wireHub } from './js/hub.js';

// Games
import { startRing, wireRing } from './js/games/ring.js';
import { startInflate, wireInflate } from './js/games/inflate.js';
import { startBubbles, wireBubbles } from './js/games/bubbles.js';
import { startBoss, wireBoss } from './js/games/boss.js';
import { startWhack, wireWhack } from './js/games/whack.js';
import { startSnake, wireSnake } from './js/games/snake.js';
import { startInvaders, wireInvaders } from './js/games/invaders.js';
import { startRunner, wireRunner } from './js/games/runner.js';
import { startSlots, wireSlots } from './js/games/slots.js';
import { startPong, wirePong } from './js/games/pong.js';
import { startStack, wireStack } from './js/games/stack.js';
import { startDash, wireDash } from './js/games/dash.js';

const STARTERS = {
  ring: startRing, inflate: startInflate, bubbles: startBubbles, boss: startBoss,
  whack: startWhack, snake: startSnake, invaders: startInvaders, runner: startRunner,
  slots: startSlots, pong: startPong, stack: startStack, dash: startDash
};

function launch(g) {
  killAll();
  go("game-" + g);
  if (STARTERS[g]) countdown(() => STARTERS[g]());
}

// Wire game card taps + back buttons
ALL_GAMES.forEach(g => {
  onTap(document.getElementById("gc-" + g), () => launch(g));
  const bk = document.getElementById("back-" + g);
  if (bk) onTap(bk, () => goHome());
});

// Wire all subsystems
setRefreshHome(refreshHome);
wireRR();
wireHub();
wireRing();
wireInflate();
wireBubbles();
wireBoss();
wireWhack();
wireSnake();
wireInvaders();
wireRunner();
wireSlots();
wirePong();
wireStack();
wireDash();

// Init
initBgBubbles();
refreshHome();
