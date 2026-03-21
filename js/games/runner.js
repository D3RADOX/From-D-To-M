import { SFX, onTap, setupCanvas, addSession, countdown, _rafs, _ivs, goHome } from '../core.js';
import { hud, showRR } from '../game-base.js';

const RN_W = 360, RN_H = 158, RN_GND = 118, RN_PX = 70;
const rncv = document.getElementById("run-canvas");
const rnctx = setupCanvas(rncv, RN_W, RN_H);

let RN = {}, _rnObstacles = [], _rnVY = 0, _rnY = RN_GND, _rnOnGround = true;

function rnSpawn() {
  if (RN.done) return;
  const type = Math.random() < 0.55 ? "jump" : "duck";
  _rnObstacles.push({ x: RN_W + 30, type, passed: false });
  clearTimeout(_ivs.rnSpawn);
  _ivs.rnSpawn = setTimeout(rnSpawn, 1400 + Math.random() * 800);
}

function rnStartRound() {
  _rnObstacles = []; _rnVY = 0; _rnY = RN_GND; _rnOnGround = true;
  RN.done = false; RN.cleared = 0;
  document.getElementById("rn-speech").textContent = "Jump over blocks. Duck under beams!";
  cancelAnimationFrame(_rafs.runner);
  rnSpawn();
  _rafs.runner = requestAnimationFrame(rnLoop);
}

function rnLoop() {
  if (RN.done) { cancelAnimationFrame(_rafs.runner); return; }
  _rnVY += 0.7; _rnY += _rnVY;
  if (_rnY >= RN_GND) { _rnY = RN_GND; _rnVY = 0; _rnOnGround = true; }
  _rnObstacles.forEach(o => o.x -= RN.speed);
  for (const o of _rnObstacles) {
    if (!o.passed && o.x < RN_PX - 20) {
      o.passed = true; RN.cleared++; RN.score += 100; RN.rs = (RN.rs || 0) + 100;
      document.getElementById("rn-speech").textContent = "Nice! +100";
      hud("rn-s", "rn-r", "rn-l", RN.score, RN.round, RN.lives);
      if (RN.cleared >= 15 && !RN.done) {
        RN.done = true; clearTimeout(_ivs.rnSpawn);
        cancelAnimationFrame(_rafs.runner); rnRoundEnd(); return;
      }
    }
    if (o.x < RN_PX + 22 && o.x > RN_PX - 22) {
      if (o.type === "jump" && _rnY > RN_GND - 30) { rnHit(); return; }
      if (o.type === "duck" && _rnY < RN_GND - 25) { rnHit(); return; }
    }
  }
  _rnObstacles = _rnObstacles.filter(o => o.x > -60);
  rnDraw();
  _rafs.runner = requestAnimationFrame(rnLoop);
}

function rnDraw() {
  rnctx.clearRect(0, 0, RN_W, RN_H);
  rnctx.fillStyle = "rgba(45,224,208,.15)"; rnctx.fillRect(0, RN_GND + 26, RN_W, 4);
  const pct = Math.min(RN.cleared / 15, 1);
  rnctx.fillStyle = "rgba(255,255,255,.08)"; rnctx.fillRect(0, 0, RN_W, 6);
  rnctx.fillStyle = "#40c4ff"; rnctx.fillRect(0, 0, RN_W * pct, 6);
  _rnObstacles.forEach(o => {
    if (o.type === "jump") {
      rnctx.fillStyle = "#ff5f5f"; rnctx.beginPath(); rnctx.roundRect(o.x - 15, RN_GND - 12, 30, 38, 4); rnctx.fill();
      rnctx.font = "11px sans-serif"; rnctx.fillStyle = "#fff"; rnctx.textAlign = "center";
      rnctx.fillText("JUMP", o.x, RN_GND - 18); rnctx.textAlign = "left";
    } else {
      rnctx.fillStyle = "#ff9a00"; rnctx.fillRect(o.x - 18, 20, 36, 16);
      rnctx.font = "11px sans-serif"; rnctx.fillStyle = "#fff"; rnctx.textAlign = "center";
      rnctx.fillText("DUCK", o.x, 16); rnctx.textAlign = "left";
    }
  });
  rnctx.font = "26px serif"; rnctx.textAlign = "center"; rnctx.fillText("🏃", RN_PX, _rnY + 26); rnctx.textAlign = "left";
}

function rnHit() {
  cancelAnimationFrame(_rafs.runner); clearTimeout(_ivs.rnSpawn);
  SFX.fail(); RN.lives--;
  document.getElementById("rn-speech").textContent = "Ouch! 💥 -1 life";
  hud("rn-s", "rn-r", "rn-l", RN.score, RN.round, RN.lives);
  if (RN.lives <= 0) {
    addSession("runner", RN.score);
    showRR(false, RN.score, RN.rs, () => {
      RN.lives = 3; RN.rs = 0; hud("rn-s", "rn-r", "rn-l", RN.score, RN.round, RN.lives);
      countdown(() => rnStartRound());
    });
    return;
  }
  setTimeout(() => countdown(() => rnStartRound()), 800);
}

function rnRoundEnd() {
  if (RN.round >= 3) { addSession("runner", RN.score); showRR(true, RN.score, RN.rs, () => goHome()); return; }
  showRR(true, RN.score, RN.rs, () => {
    RN.round++; RN.rs = 0; RN.speed += 0.5;
    hud("rn-s", "rn-r", "rn-l", RN.score, RN.round, RN.lives);
    countdown(() => rnStartRound());
  });
}

export function startRunner() {
  RN = { round: 1, score: 0, lives: 3, rs: 0, cleared: 0, speed: 3, done: false };
  hud("rn-s", "rn-r", "rn-l", 0, 1, 3);
  rnStartRound();
}

export function wireRunner() {
  onTap(document.getElementById("rn-tap"), () => {
    if (!_rnOnGround || RN.done) return;
    _rnVY = -11; _rnOnGround = false;
    document.getElementById("rn-tap").classList.add("pressed");
    setTimeout(() => document.getElementById("rn-tap").classList.remove("pressed"), 200);
    SFX.good();
  });
}
