import { SFX, onHold, addSession, countdown, _ivs, burst, scorePop, rand, goHome } from '../core.js';
import { hud, showRR } from '../game-base.js';

const IGOOD = ["Sweet spot! 🎯", "Perfect inflation!", "Lungs of steel!", "Chef's kiss 🎈"];
const IPOP = ["💥 POP! TOO MUCH!", "You blew it... literally.", "That balloon had a family."];
const ILOW = ["That's it? Seriously?", "Bigger! BIGGER!", "My grandma exhales harder."];

let I = {}, _iHold = false, _iRel = false;

function setBalloon(p) {
  const body = document.getElementById("bal-body"), str = document.getElementById("bal-string");
  if (!body) return;
  const rx = 28 + p / 100 * 24, ry = 38 + p / 100 * 36, cy = 70 - (p / 100 * 16);
  body.setAttribute("rx", rx); body.setAttribute("ry", ry); body.setAttribute("cy", cy);
  if (str) str.setAttribute("y1", cy + ry);
}

function iStartRound() {
  I.pressure = 0; I.phase = "go"; _iHold = false; _iRel = false;
  document.getElementById("ispeech").textContent = "Hold to inflate. Release at 60–80%!";
  document.getElementById("ichar").textContent = "😤";
  document.getElementById("ichar").className = "char";
  setBalloon(0);
  document.getElementById("pbar").style.width = "0%";
  document.getElementById("pbar").style.background = "linear-gradient(90deg,var(--teal),var(--coral))";
  document.getElementById("dzone").classList.remove("show");
  document.getElementById("ibtn").classList.remove("pressed");
  clearInterval(_ivs.inf);
  _ivs.inf = setInterval(iTick, 40);
}

function iTick() {
  if (I.phase !== "go") return;
  if (_iHold) I.pressure = Math.min(I.pressure + 1.1, 100);
  const p = I.pressure;
  document.getElementById("pbar").style.width = p + "%";
  setBalloon(p);
  if (p >= 72) {
    document.getElementById("dzone").classList.add("show");
    document.getElementById("ichar").textContent = "😰";
    document.getElementById("pbar").style.background = "linear-gradient(90deg,#ff9900,#ff1111)";
  }
  if (p >= 100) {
    clearInterval(_ivs.inf); delete _ivs.inf;
    I.phase = "pop"; I.lives--;
    setBalloon(0);
    document.getElementById("ispeech").textContent = rand(IPOP);
    document.getElementById("ichar").textContent = "💥";
    document.getElementById("ichar").className = "char a-fail";
    SFX.pop();
    const stage = document.querySelector("#game-inflate .bal-stage");
    if (stage) { const rr = stage.getBoundingClientRect(); burst(rr.left + rr.width / 2, rr.top + 80, "#ff5f5f"); }
    hud("is", "ir", "il", I.score, I.round, I.lives);
    setTimeout(() => {
      if (I.lives <= 0) {
        addSession("inflate", I.score);
        showRR(false, I.score, I.rs, () => { I.lives = 3; I.rs = 0; hud("is", "ir", "il", I.score, I.round, I.lives); countdown(() => iStartRound()); });
      } else iStartRound();
    }, 1200);
  }
}

function iCheck() {
  if (I.phase !== "go") return;
  I.phase = "scored"; clearInterval(_ivs.inf); delete _ivs.inf;
  const p = I.pressure;
  let pts = 0, msg = "";
  if (p >= 60 && p <= 80) { pts = 300; msg = rand(IGOOD); SFX.perf(); }
  else if (p >= 50 && p < 60) { pts = 150; msg = "Close! A bit more."; SFX.good(); }
  else if (p > 80 && p < 95) { pts = 100; msg = "A lil too much..."; SFX.good(); }
  else if (p < 50) { pts = 50; msg = rand(ILOW); }
  else { pts = 20; msg = "Risky!"; }
  I.score += pts; I.rs = (I.rs || 0) + pts;
  document.getElementById("ispeech").textContent = msg;
  document.getElementById("ichar").textContent = "😌";
  if (pts > 0) {
    const rect = document.getElementById("ibtn").getBoundingClientRect();
    scorePop("+" + pts, rect.left + rect.width / 2, rect.top - 10);
    if (pts === 300) burst(rect.left + rect.width / 2, rect.top, "#2de0d0");
  }
  hud("is", "ir", "il", I.score, I.round, I.lives);
  setTimeout(() => {
    if (I.round >= 5) { addSession("inflate", I.score); showRR(true, I.score, I.rs, () => goHome()); return; }
    showRR(true, I.score, I.rs, () => {
      I.round++; I.rs = 0; hud("is", "ir", "il", I.score, I.round, I.lives);
      countdown(() => iStartRound());
    });
  }, 900);
}

export function startInflate() {
  I = { round: 1, score: 0, lives: 3, pressure: 0, phase: "idle", rs: 0 };
  _iHold = false; _iRel = false;
  hud("is", "ir", "il", 0, 1, 3);
  iStartRound();
}

export function wireInflate() {
  onHold(document.getElementById("ibtn"),
    () => { if (I.phase !== "go") return; _iHold = true; document.getElementById("ibtn").classList.add("pressed"); },
    () => { if (I.phase !== "go") return; _iHold = false; document.getElementById("ibtn").classList.remove("pressed"); if (!_iRel && I.pressure > 2) { _iRel = true; iCheck(); } }
  );
}
