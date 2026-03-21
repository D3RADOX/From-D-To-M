import { SFX, onTap, setupCanvas, addSession, countdown, _rafs, burst, scorePop, rand, goHome } from '../core.js';
import { hud, showRR } from '../game-base.js';

const PH = [
  { n: "INHALE", d: 4, c: "#2de0d0", e: "😤" },
  { n: "HOLD",   d: 3, c: "#ffc844", e: "😶" },
  { n: "EXHALE", d: 5, c: "#ff5f5f", e: "😮‍💨" }
];
const RQ = {
  INHALE: ["Fill those lungs!", "Breathe it ALL in!", "Maximum capacity!"],
  HOLD:   ["Hold it... 😬", "Don't. You. Dare.", "Stay still..."],
  EXHALE: ["Let it gooo~", "Whoooosh!", "Empty the tanks!"]
};

const rcv = document.getElementById("ring-cv");
const rctx = setupCanvas(rcv, 218, 218);
let R = {};

function drawRing(prog, col, glow) {
  const W = 218, cx = W / 2, cy = W / 2, r = W / 2 - 13;
  rctx.clearRect(0, 0, W, W);
  rctx.beginPath(); rctx.arc(cx, cy, r, 0, Math.PI * 2);
  rctx.strokeStyle = "rgba(255,255,255,.06)"; rctx.lineWidth = 12; rctx.stroke();
  if (prog > 0.01) {
    const s = -Math.PI / 2, e = s + Math.PI * 2 * Math.min(prog, 1);
    if (glow) {
      rctx.beginPath(); rctx.arc(cx, cy, r, s, e);
      rctx.strokeStyle = col; rctx.lineWidth = 22; rctx.lineCap = "round";
      rctx.globalAlpha = 0.14; rctx.stroke(); rctx.globalAlpha = 1;
    }
    rctx.beginPath(); rctx.arc(cx, cy, r, s, e);
    rctx.strokeStyle = col; rctx.lineWidth = 12; rctx.lineCap = "round";
    rctx.shadowColor = col; rctx.shadowBlur = glow ? 20 : 12; rctx.stroke(); rctx.shadowBlur = 0;
    if (prog < 0.98) {
      const dx = cx + r * Math.cos(e), dy = cy + r * Math.sin(e);
      rctx.beginPath(); rctx.arc(dx, dy, 7, 0, Math.PI * 2);
      rctx.fillStyle = "#fff"; rctx.shadowColor = col; rctx.shadowBlur = 8; rctx.fill(); rctx.shadowBlur = 0;
    }
  }
}

function rLoop() {
  const p = PH[R.pi], dur = p.d * 1000;
  function tick(now) {
    const el = now - R.pStart, prog = Math.min(el / dur, 1);
    drawRing(prog, p.c, R.synced);
    document.getElementById("rtimer").textContent = Math.max(0, Math.ceil((dur - el) / 1000)) || "✓";
    if (prog >= 1) { rPhaseEnd(); return; }
    _rafs.ring = requestAnimationFrame(tick);
  }
  _rafs.ring = requestAnimationFrame(tick);
}

function rNextPhase() {
  const p = PH[R.pi];
  R.synced = false; R.syncT = null; R.pStart = performance.now();
  document.getElementById("rphase").textContent = p.n;
  document.getElementById("rtimer").textContent = p.d;
  document.getElementById("rchar").textContent = p.e;
  document.getElementById("rchar").className = "char a-" + p.n.toLowerCase();
  document.getElementById("rspeech").textContent = rand(RQ[p.n]);
  document.getElementById("rtap").classList.remove("pressed");
  cancelAnimationFrame(_rafs.ring);
  rLoop();
}

function rPhaseEnd() {
  cancelAnimationFrame(_rafs.ring);
  const p = PH[R.pi], dur = p.d * 1000;
  let pts = 0, msg = "";
  if (R.synced && R.syncT !== null) {
    const ratio = (R.syncT - R.pStart) / dur;
    if (ratio <= 0.25) { pts = 300; msg = "🎯 Perfect Sync!"; SFX.perf(); }
    else if (ratio <= 0.55) { pts = 200; msg = "✅ Good timing!"; SFX.good(); }
    else if (ratio <= 0.80) { pts = 100; msg = "👍 A lil late..."; }
    else { pts = 30; msg = "😬 Just barely."; }
  } else {
    msg = "😵 Missed sync!"; R.lives--;
    document.getElementById("rchar").textContent = "😵";
    document.getElementById("rchar").className = "char a-fail"; SFX.fail();
  }
  R.score += pts; R.rs = (R.rs || 0) + pts;
  if (pts > 0) {
    const rect = document.getElementById("rtap").getBoundingClientRect();
    scorePop("+" + pts, rect.left + rect.width / 2, rect.top - 10);
    if (pts === 300) burst(rect.left + rect.width / 2, rect.top, "#2de0d0");
  }
  document.getElementById("rspeech").textContent = msg;
  hud("rs", "rr2", "rl", R.score, R.round, R.lives);
  setTimeout(() => {
    if (R.lives <= 0) {
      addSession("ring", R.score);
      showRR(false, R.score, R.rs, () => { R.lives = 3; R.pi = 0; R.rs = 0; hud("rs", "rr2", "rl", R.score, R.round, R.lives); countdown(() => rNextPhase()); });
      return;
    }
    R.pi++;
    if (R.pi >= PH.length) rRoundEnd(); else rNextPhase();
  }, 950);
}

function rRoundEnd() {
  if (R.round >= 5) { addSession("ring", R.score); showRR(true, R.score, R.rs, () => goHome()); return; }
  showRR(true, R.score, R.rs, () => {
    R.round++; R.pi = 0; R.rs = 0;
    hud("rs", "rr2", "rl", R.score, R.round, R.lives);
    countdown(() => rNextPhase());
  });
}

export function startRing() {
  R = { round: 1, score: 0, lives: 3, pi: 0, rs: 0, synced: false, syncT: null, pStart: 0 };
  hud("rs", "rr2", "rl", 0, 1, 3);
  rNextPhase();
}

export function wireRing() {
  onTap(document.getElementById("rtap"), () => {
    if (!R.synced) {
      R.synced = true; R.syncT = performance.now();
      document.getElementById("rtap").classList.add("pressed"); SFX.good();
    }
  });
}

drawRing(0, "#2de0d0", false);
