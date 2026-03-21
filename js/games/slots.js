import { SFX, onTap, addSession, _ivs, burst, goHome } from '../core.js';
import { hud, showRR } from '../game-base.js';

const SL_SYMS = ["IN", "HLD", "EX"];
let SL = {}, _slStopped = [null, null, null], _slSpinning = [true, true, true], _slStopIdx = 0;

function slNewSpin() {
  _slStopped = [null, null, null]; _slSpinning = [true, true, true]; _slStopIdx = 0;
  document.getElementById("sl-result").textContent = "";
  document.getElementById("sl-speech").textContent = "Your lungs have entered the casino.";
  for (let i = 0; i < 3; i++) {
    document.getElementById("reel-" + i).classList.add("spinning");
    document.getElementById("reel-" + i).classList.remove("stopped");
  }
  clearInterval(_ivs.slSpin);
  _ivs.slSpin = setInterval(() => {
    for (let i = 0; i < 3; i++) {
      if (_slSpinning[i]) document.getElementById("rv-" + i).textContent = SL_SYMS[Math.floor(Math.random() * 3)];
    }
  }, 80);
}

function slScore() {
  const r = _slStopped;
  let pts = 0, msg = "";
  const match3 = r[0] === r[1] && r[1] === r[2];
  const match2 = r[0] === r[1] || r[1] === r[2] || r[0] === r[2];
  if (match3) { pts = 400; msg = "🎉 JACKPOT! +400"; SFX.win(); burst(window.innerWidth / 2, window.innerHeight / 2, "#ffd700"); }
  else if (match2) { pts = 100; msg = "✅ Match 2! +100"; SFX.good(); }
  else { pts = 20; msg = "Just 1... +20"; }
  SL.score += pts; SL.rs = (SL.rs || 0) + pts;
  document.getElementById("sl-result").textContent = msg;
  document.getElementById("sl-speech").textContent = SL.spin >= 5 ? "Final spin! Tap to cash out." : "Tap to spin again!";
  hud("sl-s", "sl-r", "sl-l", SL.score, SL.round, SL.lives);
}

export function startSlots() {
  SL = { round: 1, score: 0, lives: 3, rs: 0, spin: 1, done: false };
  hud("sl-s", "sl-r", "sl-l", 0, 1, 3);
  slNewSpin();
}

export function wireSlots() {
  onTap(document.getElementById("sl-tap"), () => {
    if (SL.done) return;
    if (_slStopIdx < 3) {
      const idx = _slStopIdx;
      const val = SL_SYMS[Math.floor(Math.random() * 3)];
      _slStopped[idx] = val; _slSpinning[idx] = false;
      document.getElementById("rv-" + idx).textContent = val;
      document.getElementById("reel-" + idx).classList.remove("spinning");
      document.getElementById("reel-" + idx).classList.add("stopped");
      SFX.tick(); _slStopIdx++;
      if (_slStopIdx === 3) { clearInterval(_ivs.slSpin); delete _ivs.slSpin; slScore(); }
    } else {
      if (SL.spin >= 5) {
        addSession("slots", SL.score);
        showRR(SL.lives > 0, SL.score, SL.rs, () => goHome());
        return;
      }
      SL.spin++;
      hud("sl-s", "sl-r", "sl-l", SL.score, SL.round, SL.lives);
      slNewSpin();
    }
  });
}
