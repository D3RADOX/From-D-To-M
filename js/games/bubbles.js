import { SFX, onHold, setupCanvas, addSession, countdown, _rafs, goHome } from '../core.js';
import { hud, showRR } from '../game-base.js';

const bcv = document.getElementById("bub-canvas");
const bctx = setupCanvas(bcv, 390, 182);
const BW = 390, BH = 182;

let B = {}, _bEx = false, _bubs = [];

function bStartRound() {
  _bubs = []; B.power = 0; _bEx = false; B.startT = performance.now();
  document.getElementById("bspeech").textContent = "Blow steady — float bubbles to stars!";
  document.getElementById("bbtn").classList.remove("pressed");
  cancelAnimationFrame(_rafs.bub);
  _rafs.bub = requestAnimationFrame(bLoop);
}

function bLoop(now) {
  const el = now - B.startT, tl = Math.max(0, 10000 - el);
  document.getElementById("bub-tbar").style.width = (tl / 10000 * 100) + "%";
  if (_bEx) B.power = Math.min(B.power + 2.8, 100);
  else B.power = Math.max(B.power - 3.5, 0);
  document.getElementById("ebar").style.width = B.power + "%";

  if (_bEx && Math.random() < 0.055)
    _bubs.push({ x: 15 + Math.random() * 55, y: BH - 10, r: 5 + B.power / 100 * 20,
      vy: -(0.45 + B.power / 100 * 1.7), vx: (Math.random() - 0.5) * 0.9,
      alpha: 1, scored: false, hue: Math.floor(Math.random() * 360), w: Math.random() * Math.PI * 2 });

  let pts = 0;
  _bubs = _bubs.filter(b => {
    b.w += 0.05; b.x += Math.sin(b.w) * 0.4; b.y += b.vy; b.alpha -= 0.0033;
    if (!b.scored && b.y < 22) { b.scored = true; pts += Math.floor(b.r * 9); SFX.tick(); }
    return b.alpha > 0 && b.y > -25 && b.x > -30 && b.x < BW + 30;
  });

  if (pts > 0) { B.score += pts; B.rs = (B.rs || 0) + pts; hud("bs", "br", "bl", B.score, B.round, B.lives); }

  bctx.clearRect(0, 0, BW, BH);
  bctx.fillStyle = "rgba(255,200,68,.06)"; bctx.fillRect(0, 0, BW, 24);
  for (let i = 0; i < 10; i++) { bctx.font = "11px serif"; bctx.fillText("⭐", i / 10 * BW + 16, 11 + Math.sin(now / 900 + i) * 5); }

  _bubs.forEach(b => {
    const g = bctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.35, 0, b.x, b.y, b.r);
    g.addColorStop(0, `hsla(${b.hue},70%,80%,${b.alpha * 0.4})`);
    g.addColorStop(1, `hsla(${b.hue},80%,60%,${b.alpha * 0.07})`);
    bctx.beginPath(); bctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); bctx.fillStyle = g; bctx.fill();
    bctx.strokeStyle = `hsla(${b.hue},80%,72%,${b.alpha})`; bctx.lineWidth = 1.5; bctx.stroke();
    bctx.beginPath(); bctx.arc(b.x - b.r * 0.28, b.y - b.r * 0.3, b.r * 0.2, 0, Math.PI * 2);
    bctx.fillStyle = `rgba(255,255,255,${b.alpha * 0.5})`; bctx.fill();
  });

  if (el >= 10000) { cancelAnimationFrame(_rafs.bub); bRoundEnd(); return; }
  _rafs.bub = requestAnimationFrame(bLoop);
}

function bRoundEnd() {
  if (B.round >= 5) { addSession("bubbles", B.score); showRR(true, B.score, B.rs, () => goHome()); return; }
  showRR(true, B.score, B.rs, () => {
    B.round++; B.rs = 0; hud("bs", "br", "bl", B.score, B.round, B.lives);
    countdown(() => bStartRound());
  });
}

export function startBubbles() {
  B = { round: 1, score: 0, lives: 3, power: 0, rs: 0 };
  _bEx = false; _bubs = [];
  hud("bs", "br", "bl", 0, 1, 3);
  bStartRound();
}

export function wireBubbles() {
  onHold(document.getElementById("bbtn"),
    () => { _bEx = true; document.getElementById("bbtn").classList.add("pressed"); },
    () => { _bEx = false; document.getElementById("bbtn").classList.remove("pressed"); }
  );
}
