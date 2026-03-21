import { SFX, onTap, addSession, countdown, _ivs, burst, scorePop, goHome } from '../core.js';
import { hud, showRR } from '../game-base.js';

const WH_PH = [{ n: "INHALE", c: "var(--teal)", d: 3 }, { n: "HOLD", c: "var(--yellow)", d: 2 }, { n: "EXHALE", c: "var(--coral)", d: 4 }];
let WH = {}, _whSlots = new Array(6).fill(null), _whPhaseIdx = 0, _whPhaseStart = 0;

function whClearHole(i) {
  if (_whSlots[i]) { clearTimeout(_whSlots[i].to); _whSlots[i] = null; }
  document.getElementById("mole-" + i).textContent = "";
  document.getElementById("hole-" + i).classList.remove("active");
}

function whSpawn() {
  if (WH.done) return;
  const empties = [];
  for (let i = 0; i < 6; i++) if (!_whSlots[i]) empties.push(i);
  if (!empties.length) return;
  const idx = empties[Math.floor(Math.random() * empties.length)];
  const phase = WH_PH[Math.floor(Math.random() * 3)].n;
  document.getElementById("mole-" + idx).textContent = "🦠";
  document.getElementById("hole-" + idx).classList.add("active");
  const to = setTimeout(() => {
    if (!_whSlots[idx]) return;
    _whSlots[idx] = null;
    document.getElementById("mole-" + idx).textContent = "";
    document.getElementById("hole-" + idx).classList.remove("active");
  }, 1250);
  _whSlots[idx] = { phase, to };
}

function whStartRound() {
  WH.done = false; WH.roundTime = 30; _whPhaseIdx = 0; _whPhaseStart = Date.now();
  for (let i = 0; i < 6; i++) whClearHole(i);
  document.getElementById("wh-speech").textContent = "Whack wheezers that match your breath!";
  document.getElementById("wh-timer").textContent = "30";
  clearInterval(_ivs.whP); clearInterval(_ivs.whM); clearInterval(_ivs.whT);
  _ivs.whP = setInterval(() => {
    const el = Date.now() - _whPhaseStart;
    if (el >= WH_PH[_whPhaseIdx].d * 1000) { _whPhaseIdx = (_whPhaseIdx + 1) % 3; _whPhaseStart = Date.now(); }
    document.getElementById("wh-phase").textContent = WH_PH[_whPhaseIdx].n;
    document.getElementById("wh-phase").style.color = WH_PH[_whPhaseIdx].c;
  }, 80);
  _ivs.whM = setInterval(whSpawn, 1100);
  _ivs.whT = setInterval(() => {
    if (WH.done) return;
    WH.roundTime--; document.getElementById("wh-timer").textContent = WH.roundTime;
    if (WH.roundTime <= 0) {
      WH.done = true; clearInterval(_ivs.whP); clearInterval(_ivs.whM); clearInterval(_ivs.whT);
      for (let i = 0; i < 6; i++) whClearHole(i);
      whRoundEnd();
    }
  }, 1000);
}

function whRoundEnd() {
  if (WH.round >= 3) { addSession("whack", WH.score); showRR(true, WH.score, WH.rs, () => goHome()); return; }
  showRR(true, WH.score, WH.rs, () => {
    WH.round++; WH.rs = 0; hud("wh-s", "wh-r", "wh-l", WH.score, WH.round, WH.lives);
    countdown(() => whStartRound());
  });
}

function whackHole(i) {
  if (WH.done || !_whSlots[i]) return;
  const curPhase = WH_PH[_whPhaseIdx].n;
  whClearHole(i);
  if (_whSlots[i] === null) {
    // already cleared
  }
  // We need to check before clearing - restructure:
}

export function startWhack() {
  WH = { round: 1, score: 0, lives: 3, rs: 0, done: false };
  hud("wh-s", "wh-r", "wh-l", 0, 1, 3);
  whStartRound();
}

export function wireWhack() {
  for (let i = 0; i < 6; i++) {
    onTap(document.getElementById("hole-" + i), () => {
      if (WH.done || !_whSlots[i]) return;
      const mPhase = _whSlots[i].phase;
      const curPhase = WH_PH[_whPhaseIdx].n;
      whClearHole(i);
      if (mPhase === curPhase) {
        const pts = 200;
        WH.score += pts; WH.rs = (WH.rs || 0) + pts;
        document.getElementById("wh-speech").textContent = "💨 PERFECT MATCH! +200";
        SFX.perf();
        const h = document.getElementById("hole-" + i);
        const rect = h.getBoundingClientRect();
        scorePop("+" + pts, rect.left + rect.width / 2, rect.top);
        burst(rect.left + rect.width / 2, rect.top + rect.height / 2, "#ff9a00");
        hud("wh-s", "wh-r", "wh-l", WH.score, WH.round, WH.lives);
      } else {
        WH.lives--;
        document.getElementById("wh-speech").textContent = "Wrong phase! 💀 -1 life";
        SFX.fail();
        hud("wh-s", "wh-r", "wh-l", WH.score, WH.round, WH.lives);
        if (WH.lives <= 0) {
          WH.done = true; clearInterval(_ivs.whP); clearInterval(_ivs.whM); clearInterval(_ivs.whT);
          addSession("whack", WH.score);
          showRR(false, WH.score, WH.rs, () => {
            WH.lives = 3; WH.rs = 0; hud("wh-s", "wh-r", "wh-l", WH.score, WH.round, WH.lives);
            countdown(() => whStartRound());
          });
        }
      }
    });
  }
}
