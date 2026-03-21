import { SFX, onHold, setupCanvas, addSession, countdown, _ivs, burst, goHome } from '../core.js';
import { hud, showRR } from '../game-base.js';

const IV_W = 360, IV_H = 220, IV_COLS = 6, IV_ROWS = 3;
const ivcv = document.getElementById("inv-canvas");
const ivctx = setupCanvas(ivcv, IV_W, IV_H);

let IV = {}, _ivCharging = false, _ivBullet = null, _ivGrid = [], _ivDir = 1, _ivMoveTimer = 0;

function ivInitGrid() {
  _ivGrid = [];
  for (let r = 0; r < IV_ROWS; r++)
    for (let c = 0; c < IV_COLS; c++)
      _ivGrid.push({ r, c, alive: true, x: 50 + c * 46, y: 25 + r * 36 });
}

function ivStartLoop() {
  clearInterval(_ivs.inv);
  _ivs.inv = setInterval(ivTick, 50);
}

function ivTick() {
  if (IV.done) return;
  if (_ivCharging) IV.charge = Math.min(IV.charge + 2, 100);
  document.getElementById("iv-charge").style.width = IV.charge + "%";

  if (_ivBullet) {
    _ivBullet.y += _ivBullet.vy;
    if (_ivBullet.y < 0) { _ivBullet = null; }
    else {
      const alive = _ivGrid.filter(g => g.alive);
      for (const g of alive) {
        if (Math.abs(_ivBullet.x - g.x) < 18 && Math.abs(_ivBullet.y - g.y) < 14) {
          g.alive = false; _ivBullet = null;
          IV.score += 100; IV.rs = (IV.rs || 0) + 100;
          document.getElementById("iv-speech").textContent = "💥 GOT ONE! +100";
          SFX.perf(); hud("iv-s", "iv-r", "iv-l", IV.score, IV.round, IV.lives);
          burst(g.x, g.y, "#e040fb"); break;
        }
      }
    }
  }

  _ivMoveTimer += 50;
  const speed = Math.max(200, 600 - IV.round * 100);
  if (_ivMoveTimer >= speed) {
    _ivMoveTimer = 0;
    const alive = _ivGrid.filter(g => g.alive);
    if (!alive.length) { ivWave(); return; }
    let edgeHit = false;
    alive.forEach(g => { g.x += _ivDir * 18; if (g.x > IV_W - 30 || g.x < 30) edgeHit = true; });
    if (edgeHit) {
      _ivDir *= -1;
      alive.forEach(g => { g.y += 18; g.x += _ivDir * 18; });
      const lowY = Math.max(...alive.map(g => g.y));
      if (lowY > IV_H - 50) {
        IV.lives--;
        document.getElementById("iv-speech").textContent = "Invaded! 💀";
        SFX.fail(); hud("iv-s", "iv-r", "iv-l", IV.score, IV.round, IV.lives);
        ivInitGrid();
        if (IV.lives <= 0) {
          IV.done = true; clearInterval(_ivs.inv);
          addSession("invaders", IV.score);
          showRR(false, IV.score, IV.rs, () => {
            IV.lives = 3; IV.rs = 0; hud("iv-s", "iv-r", "iv-l", IV.score, IV.round, IV.lives);
            countdown(() => { ivInitGrid(); ivStartLoop(); });
          });
          return;
        }
      }
    }
  }
  ivDraw();
}

function ivDraw() {
  ivctx.clearRect(0, 0, IV_W, IV_H);
  _ivGrid.filter(g => g.alive).forEach(g => {
    ivctx.font = "22px serif"; ivctx.textAlign = "center"; ivctx.fillText("👾", g.x, g.y + 8);
  });
  ivctx.font = "22px serif"; ivctx.fillText("🚀", IV_W / 2, IV_H - 15);
  if (_ivBullet) {
    ivctx.fillStyle = "#e040fb"; ivctx.shadowColor = "#e040fb"; ivctx.shadowBlur = 10;
    ivctx.fillRect(_ivBullet.x - 3, _ivBullet.y - 10, 5, 14); ivctx.shadowBlur = 0;
  }
  if (_ivCharging && IV.charge > 0) {
    ivctx.fillStyle = `rgba(64,196,255,${IV.charge / 300})`;
    ivctx.fillRect(IV_W / 2 - 20, IV_H - 35, 40, 20);
  }
  ivctx.textAlign = "left";
}

function ivWave() { clearInterval(_ivs.inv); ivRoundEnd(); }

function ivRoundEnd() {
  if (IV.round >= 3) { addSession("invaders", IV.score); showRR(true, IV.score, IV.rs, () => goHome()); return; }
  showRR(true, IV.score, IV.rs, () => {
    IV.round++; IV.rs = 0; hud("iv-s", "iv-r", "iv-l", IV.score, IV.round, IV.lives);
    countdown(() => { ivInitGrid(); ivStartLoop(); });
  });
}

export function startInvaders() {
  IV = { round: 1, score: 0, lives: 3, rs: 0, charge: 0, done: false };
  hud("iv-s", "iv-r", "iv-l", 0, 1, 3);
  ivInitGrid(); ivStartLoop();
}

export function wireInvaders() {
  onHold(document.getElementById("iv-btn"),
    () => { if (IV.done) return; _ivCharging = true; document.getElementById("iv-btn").classList.add("pressed"); },
    () => {
      if (IV.done) return; _ivCharging = false; document.getElementById("iv-btn").classList.remove("pressed");
      if (IV.charge > 20 && !_ivBullet) {
        _ivBullet = { x: IV_W / 2, y: IV_H - 25, vy: -8 };
        document.getElementById("iv-speech").textContent = "🚀 FIRED!"; SFX.good();
      }
      IV.charge = 0;
    }
  );
}
