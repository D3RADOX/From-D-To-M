import { SFX, onTap, setupCanvas, addSession, countdown, _ivs, goHome } from '../core.js';
import { hud, showRR } from '../game-base.js';

const SN_COLS = 20, SN_ROWS = 14, SN_CELL = 14;
const SN_PH = ["INHALE", "HOLD", "EXHALE"];
const SN_PH_DUR = [3000, 2000, 4000];

const sncv = document.getElementById("snake-cv");
const snctx = setupCanvas(sncv, SN_COLS * SN_CELL, SN_ROWS * SN_CELL);

let SN = {}, _snDir = { x: 1, y: 0 }, _snNextDir = { x: 1, y: 0 };
let _snBody = [], _snFood = null, _snPhIdx = 0, _snPhStart = 0;

function snRandFood() {
  let f;
  do {
    f = { x: Math.floor(Math.random() * SN_COLS), y: Math.floor(Math.random() * SN_ROWS),
      phase: SN_PH[Math.floor(Math.random() * 3)] };
  } while (_snBody.some(b => b.x === f.x && b.y === f.y));
  return f;
}

function snInit() {
  _snBody = [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }];
  _snFood = snRandFood();
  clearInterval(_ivs.snake);
  _ivs.snake = setInterval(snStep, SN.speed);
}

function snStep() {
  _snDir = _snNextDir;
  const head = { x: (_snBody[0].x + _snDir.x + SN_COLS) % SN_COLS, y: (_snBody[0].y + _snDir.y + SN_ROWS) % SN_ROWS };
  if (_snBody.some(b => b.x === head.x && b.y === head.y)) { snDie(); return; }
  _snBody.unshift(head); SN.time += SN.speed;
  if (Date.now() - _snPhStart >= SN_PH_DUR[_snPhIdx]) { _snPhIdx = (_snPhIdx + 1) % 3; _snPhStart = Date.now(); }
  if (_snFood && head.x === _snFood.x && head.y === _snFood.y) {
    const match = SN_PH[_snPhIdx] === _snFood.phase;
    const pts = match ? 150 : 50;
    SN.score += pts; SN.rs = (SN.rs || 0) + pts;
    hud("sn-s", "sn-r", "sn-l", SN.score, SN.round, SN.lives);
    document.getElementById("sn-speech").textContent = match ? "🐍 PHASE MATCH! +150" : "Ate it. +50";
    if (match) SFX.perf(); else SFX.good();
    _snFood = snRandFood();
    if (SN.speed > 200) SN.speed -= 15;
    clearInterval(_ivs.snake); _ivs.snake = setInterval(snStep, SN.speed);
  } else { _snBody.pop(); }
  if (SN.time >= 40000) { clearInterval(_ivs.snake); snRoundEnd(); return; }
  snDraw();
}

function snDie() {
  clearInterval(_ivs.snake); delete _ivs.snake;
  SN.lives--;
  document.getElementById("sn-speech").textContent = "Crashed! 😵"; SFX.fail();
  hud("sn-s", "sn-r", "sn-l", SN.score, SN.round, SN.lives);
  if (SN.lives <= 0) {
    addSession("snake", SN.score);
    showRR(false, SN.score, SN.rs, () => {
      SN.lives = 3; SN.rs = 0; SN.time = 0;
      hud("sn-s", "sn-r", "sn-l", SN.score, SN.round, SN.lives);
      countdown(() => snInit());
    });
    return;
  }
  setTimeout(() => { SN.speed = 450; countdown(() => snInit()); }, 800);
}

function snDraw() {
  const W = SN_COLS * SN_CELL, H = SN_ROWS * SN_CELL;
  snctx.clearRect(0, 0, W, H);
  const ph = SN_PH[_snPhIdx];
  const phCols = { INHALE: "#2de0d0", HOLD: "#ffc844", EXHALE: "#ff5f5f" };
  snctx.fillStyle = phCols[ph] + "33"; snctx.fillRect(0, H - SN_CELL * 2, W, SN_CELL * 2);
  snctx.font = `bold ${SN_CELL - 1}px sans-serif`; snctx.fillStyle = phCols[ph];
  snctx.textAlign = "center"; snctx.fillText(ph, W / 2, H - SN_CELL / 2); snctx.textAlign = "left";
  _snBody.forEach((b, i) => {
    snctx.fillStyle = i === 0 ? "#7ed321" : "#5a9900";
    snctx.beginPath(); snctx.roundRect(b.x * SN_CELL + 1, b.y * SN_CELL + 1, SN_CELL - 2, SN_CELL - 2, 3); snctx.fill();
  });
  if (_snFood) {
    const pc = { INHALE: "#2de0d0", HOLD: "#ffc844", EXHALE: "#ff5f5f" };
    snctx.fillStyle = pc[_snFood.phase];
    snctx.beginPath(); snctx.roundRect(_snFood.x * SN_CELL + 1, _snFood.y * SN_CELL + 1, SN_CELL - 2, SN_CELL - 2, 4); snctx.fill();
    snctx.font = `${SN_CELL - 4}px sans-serif`; snctx.textAlign = "center"; snctx.fillStyle = "#fff";
    snctx.fillText(_snFood.phase[0], _snFood.x * SN_CELL + SN_CELL / 2, _snFood.y * SN_CELL + SN_CELL - 3); snctx.textAlign = "left";
  }
}

function snRoundEnd() {
  if (SN.round >= 3) { addSession("snake", SN.score); showRR(true, SN.score, SN.rs, () => goHome()); return; }
  showRR(true, SN.score, SN.rs, () => {
    SN.round++; SN.rs = 0; SN.time = 0; SN.speed = 450;
    hud("sn-s", "sn-r", "sn-l", SN.score, SN.round, SN.lives);
    countdown(() => snInit());
  });
}

export function startSnake() {
  SN = { round: 1, score: 0, lives: 3, rs: 0, speed: 450, time: 0 };
  _snDir = { x: 1, y: 0 }; _snNextDir = { x: 1, y: 0 };
  _snPhIdx = 0; _snPhStart = Date.now();
  hud("sn-s", "sn-r", "sn-l", 0, 1, 3);
  snInit();
}

export function wireSnake() {
  const map = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  ["up", "down", "left", "right"].forEach(d => {
    onTap(document.getElementById("sn-" + d), () => {
      const nd = map[d];
      if (_snDir.x === 0 && nd.x !== 0) _snNextDir = nd;
      if (_snDir.y === 0 && nd.y !== 0) _snNextDir = nd;
    });
  });
}
