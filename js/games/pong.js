import { SFX, onHold, setupCanvas, addSession, countdown, _rafs, goHome } from '../core.js';
import { hud, showRR } from '../game-base.js';

const PG_W = 340, PG_H = 245, PG_PH = 60, PG_PW = 10;
const pgcv = document.getElementById("pong-canvas");
const pgctx = setupCanvas(pgcv, PG_W, PG_H);

let PG = {}, _pgHolding = false, _pgPY = 0, _pgAIPY = 0, _pgBall = {}, _pgPts = [0, 0];

function pgStartRound() {
  _pgPts = [0, 0]; _pgPY = PG_H / 2 - PG_PH / 2; _pgAIPY = PG_H / 2 - PG_PH / 2;
  _pgBall = { x: PG_W / 2, y: PG_H / 2, vx: 4 * (Math.random() > 0.5 ? 1 : -1), vy: 3 * (Math.random() > 0.5 ? 1 : -1) };
  PG.done = false;
  cancelAnimationFrame(_rafs.pong);
  _rafs.pong = requestAnimationFrame(pgLoop);
}

function pgLoop() {
  if (PG.done) { cancelAnimationFrame(_rafs.pong); return; }
  if (_pgHolding) _pgPY = Math.max(0, _pgPY - 7); else _pgPY = Math.min(PG_H - PG_PH, _pgPY + 3);
  const aiCenter = _pgAIPY + PG_PH / 2;
  if (aiCenter < _pgBall.y - 5) _pgAIPY = Math.min(PG_H - PG_PH, _pgAIPY + 4);
  else if (aiCenter > _pgBall.y + 5) _pgAIPY = Math.max(0, _pgAIPY - 4);
  _pgBall.x += _pgBall.vx; _pgBall.y += _pgBall.vy;
  if (_pgBall.y < 8 || _pgBall.y > PG_H - 8) _pgBall.vy *= -1;
  if (_pgBall.x < 22 + PG_PW && _pgBall.x > 22 && _pgBall.y > _pgPY && _pgBall.y < _pgPY + PG_PH) {
    _pgBall.vx = Math.abs(_pgBall.vx) + 0.3; _pgBall.x = 22 + PG_PW + 1; SFX.good();
  }
  if (_pgBall.x > PG_W - 22 - PG_PW && _pgBall.x < PG_W - 22 && _pgBall.y > _pgAIPY && _pgBall.y < _pgAIPY + PG_PH) {
    _pgBall.vx = -(Math.abs(_pgBall.vx) + 0.2); _pgBall.x = PG_W - 22 - PG_PW - 1;
  }
  if (_pgBall.x < 0) {
    _pgPts[0]++; _pgBall = { x: PG_W / 2, y: PG_H / 2, vx: 4, vy: 3 * (Math.random() > 0.5 ? 1 : -1) };
    PG.score += 150; PG.rs = (PG.rs || 0) + 150; SFX.perf();
    hud("pg-s", "pg-r", "pg-l", PG.score, PG.round, PG.lives);
  }
  if (_pgBall.x > PG_W) {
    _pgPts[1]++; _pgBall = { x: PG_W / 2, y: PG_H / 2, vx: -4, vy: 3 * (Math.random() > 0.5 ? 1 : -1) }; SFX.fail();
  }
  if (_pgPts[0] >= 5) { cancelAnimationFrame(_rafs.pong); pgRoundEnd(true); return; }
  if (_pgPts[1] >= 5) {
    PG.lives--; hud("pg-s", "pg-r", "pg-l", PG.score, PG.round, PG.lives);
    if (PG.lives <= 0) {
      addSession("pong", PG.score);
      showRR(false, PG.score, PG.rs, () => {
        PG.lives = 3; PG.rs = 0; hud("pg-s", "pg-r", "pg-l", PG.score, PG.round, PG.lives);
        countdown(() => pgStartRound());
      });
      return;
    }
    _pgPts = [0, 0]; _pgBall = { x: PG_W / 2, y: PG_H / 2, vx: 4, vy: 3 };
  }
  pgDraw();
  _rafs.pong = requestAnimationFrame(pgLoop);
}

function pgDraw() {
  pgctx.clearRect(0, 0, PG_W, PG_H);
  for (let y = 0; y < PG_H; y += 18) { pgctx.fillStyle = "rgba(255,255,255,.1)"; pgctx.fillRect(PG_W / 2 - 1, y, 2, 10); }
  pgctx.font = "bold 28px 'Boogaloo'"; pgctx.fillStyle = "rgba(255,255,255,.5)"; pgctx.textAlign = "center";
  pgctx.fillText(_pgPts[0], PG_W / 2 - 50, 36); pgctx.fillText(_pgPts[1], PG_W / 2 + 50, 36); pgctx.textAlign = "left";
  pgctx.fillStyle = "#448aff"; pgctx.beginPath(); pgctx.roundRect(22, _pgPY, PG_PW, PG_PH, 4); pgctx.fill();
  pgctx.fillStyle = "#ff5f5f"; pgctx.beginPath(); pgctx.roundRect(PG_W - 22 - PG_PW, _pgAIPY, PG_PW, PG_PH, 4); pgctx.fill();
  pgctx.fillStyle = "#ffc844"; pgctx.shadowColor = "#ffc844"; pgctx.shadowBlur = 12;
  pgctx.beginPath(); pgctx.arc(_pgBall.x, _pgBall.y, 8, 0, Math.PI * 2); pgctx.fill(); pgctx.shadowBlur = 0;
}

function pgRoundEnd() {
  if (PG.round >= 3) { addSession("pong", PG.score); showRR(true, PG.score, PG.rs, () => goHome()); return; }
  showRR(true, PG.score, PG.rs, () => {
    PG.round++; PG.rs = 0; hud("pg-s", "pg-r", "pg-l", PG.score, PG.round, PG.lives);
    countdown(() => pgStartRound());
  });
}

export function startPong() {
  PG = { round: 1, score: 0, lives: 3, rs: 0, done: false };
  hud("pg-s", "pg-r", "pg-l", 0, 1, 3);
  pgStartRound();
}

export function wirePong() {
  onHold(document.getElementById("pg-btn"),
    () => { _pgHolding = true; document.getElementById("pg-btn").classList.add("pressed"); },
    () => { _pgHolding = false; document.getElementById("pg-btn").classList.remove("pressed"); }
  );
}
