import { SFX, onTap, goHome } from './core.js';

const WIN_Q = ["RT-certified! 🏆", "Peak lung performance.", "Your diaphragm slaps.", "Oxygen = secured.", "Breathing? Mastered."];
const FAIL_Q = ["Breathed wrong 💀", "That's not how lungs work!", "A goldfish could do better.", "Sir, this is a lung 🫁", "RT license: REVOKED."];
const rand = a => a[Math.floor(Math.random() * a.length)];

let _rrNext = null;

export function hud(sId, rId, lId, score, round, lives) {
  document.getElementById(sId).textContent = score;
  document.getElementById(rId).textContent = round;
  document.getElementById(lId).textContent = [0, 1, 2].map(i => i < lives ? "❤️" : "🖤").join("");
}

export function showRR(win, score, rs, onNext) {
  if (document.getElementById("rr").classList.contains("show")) return;
  const stars = rs >= 750 ? "⭐⭐⭐" : rs >= 400 ? "⭐⭐" : "⭐";
  document.getElementById("rr-char").textContent = win ? "🫁" : "💀";
  const t = document.getElementById("rr-title");
  t.textContent = win ? "ROUND CLEAR!" : "BUSTED!";
  t.className = "rr-title " + (win ? "win" : "fail");
  document.getElementById("rr-stars").textContent = stars;
  document.getElementById("rr-score").textContent = "Score: " + score;
  document.getElementById("rr-msg").textContent = rand(win ? WIN_Q : FAIL_Q);
  document.getElementById("rr-next").textContent = win ? "NEXT ROUND ▶" : "TRY AGAIN ▶";
  _rrNext = onNext;
  document.getElementById("rr").classList.add("show");
  if (win) SFX.win(); else SFX.fail();
}

export function hideRR() {
  document.getElementById("rr").classList.remove("show");
}

export function wireRR() {
  onTap(document.getElementById("rr-next"), () => { hideRR(); if (_rrNext) _rrNext(); });
  onTap(document.getElementById("rr-quit"), () => { hideRR(); goHome(); });
}
