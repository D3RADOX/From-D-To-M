import { SFX, onTap, setupCanvas, addSession, countdown, _ivs, burst, goHome } from '../core.js';
import { hud, showRR } from '../game-base.js';

const DA_W = 340, DA_H = 270, DA_ROWS = 7, DA_RH = DA_H / DA_ROWS;
const DA_PH = ["INHALE", "HOLD", "EXHALE"];
const DA_PH_DUR = [3500, 2500, 4000];

const dacv = document.getElementById("dash-canvas");
const dactx = setupCanvas(dacv, DA_W, DA_H);

let DA = {}, _daPlayerRow = 0, _daHazards = [], _daPhIdx = 0, _daPhStart = 0;

function daStartRound() {
  _daPlayerRow = 0; DA.done = false; _daPhIdx = 0; _daPhStart = Date.now();
  _daHazards = [];
  for (let r = 1; r <= 5; r++) {
    _daHazards.push({
      row: r, x: Math.random() < 0.5 ? DA_W : -60,
      vx: Math.random() < 0.5 ? 2 : -2,
      color: ["#ff5f5f", "#ff9a00", "#e040fb", "#40c4ff", "#ffd700"][r - 1]
    });
  }
  document.getElementById("da-speech").textContent = "Tap INHALE to hop forward!";
  clearInterval(_ivs.dash);
  _ivs.dash = setInterval(daTick, 50);
}

function daTick() {
  if (DA.done) return;
  if (Date.now() - _daPhStart >= DA_PH_DUR[_daPhIdx]) { _daPhIdx = (_daPhIdx + 1) % 3; _daPhStart = Date.now(); }
  const ph = DA_PH[_daPhIdx];
  document.getElementById("da-tap").textContent =
    ph === "INHALE" ? "TAP TO HOP FORWARD ⬆️" :
    ph === "EXHALE" ? "TAP = SLIDE BACK ⬇️" : "HOLD BREATH — WAIT...";

  _daHazards.forEach(h => { h.x += h.vx; if (h.x > DA_W + 40) h.x = -50; if (h.x < -50) h.x = DA_W + 40; });

  const px = DA_W / 2;
  for (const h of _daHazards) {
    if (h.row === _daPlayerRow && Math.abs(h.x - px) < 32) {
      DA.lives--;
      document.getElementById("da-speech").textContent = "Hit! 💥 Back to start!";
      SFX.fail(); _daPlayerRow = 0;
      hud("da-s", "da-r", "da-l", DA.score, DA.round, DA.lives);
      if (DA.lives <= 0) {
        DA.done = true; clearInterval(_ivs.dash);
        addSession("dash", DA.score);
        showRR(false, DA.score, DA.rs, () => {
          DA.lives = 3; DA.rs = 0; hud("da-s", "da-r", "da-l", DA.score, DA.round, DA.lives);
          countdown(() => daStartRound());
        });
        return;
      }
      break;
    }
  }
  daDraw();
}

function daDraw() {
  dactx.clearRect(0, 0, DA_W, DA_H);
  const phC = ["rgba(45,224,208,.08)", "rgba(255,200,68,.06)", "rgba(255,95,95,.08)"];
  dactx.fillStyle = phC[_daPhIdx]; dactx.fillRect(0, 0, DA_W, DA_H);
  for (let r = 0; r < DA_ROWS; r++) {
    const y = DA_H - ((r + 1) * DA_RH);
    if (r === 0) dactx.fillStyle = "rgba(0,229,160,.15)";
    else if (r === 6) dactx.fillStyle = "rgba(255,200,68,.2)";
    else dactx.fillStyle = r % 2 === 0 ? "rgba(255,255,255,.02)" : "rgba(255,255,255,.04)";
    dactx.fillRect(0, y, DA_W, DA_RH);
  }
  dactx.fillStyle = "#ffd700"; dactx.font = "bold 13px sans-serif"; dactx.textAlign = "center";
  dactx.fillText("🏁 FINISH", DA_W / 2, DA_H - 6 * DA_RH + 16); dactx.textAlign = "left";
  const phN = DA_PH[_daPhIdx];
  const phLC = ["#2de0d0", "#ffc844", "#ff5f5f"];
  dactx.font = "bold 12px 'Boogaloo'"; dactx.fillStyle = phLC[_daPhIdx];
  dactx.textAlign = "right"; dactx.fillText(phN, DA_W - 8, 14); dactx.textAlign = "left";

  _daHazards.forEach(h => {
    const y = DA_H - ((h.row + 1) * DA_RH) + 4;
    dactx.fillStyle = h.color;
    dactx.beginPath(); dactx.roundRect(h.x - 22, y, 44, DA_RH - 8, 6); dactx.fill();
    dactx.font = "14px serif"; dactx.textAlign = "center";
    dactx.fillText(h.vx > 0 ? "🚗" : "🚙", h.x, y + DA_RH - 12); dactx.textAlign = "left";
  });

  const fy = DA_H - ((_daPlayerRow + 1) * DA_RH) + 4;
  dactx.font = "22px serif"; dactx.textAlign = "center";
  dactx.fillText("🐸", DA_W / 2, fy + DA_RH - 10); dactx.textAlign = "left";
}

function daRoundClear() {
  DA.score += 500; DA.rs = (DA.rs || 0) + 500;
  hud("da-s", "da-r", "da-l", DA.score, DA.round, DA.lives);
  burst(DA_W / 2, DA_H / 2, "#ff4081");
  if (DA.round >= 3) { addSession("dash", DA.score); showRR(true, DA.score, DA.rs, () => goHome()); return; }
  showRR(true, DA.score, DA.rs, () => {
    DA.round++; DA.rs = 0; hud("da-s", "da-r", "da-l", DA.score, DA.round, DA.lives);
    countdown(() => daStartRound());
  });
}

export function startDash() {
  DA = { round: 1, score: 0, lives: 3, rs: 0, done: false };
  hud("da-s", "da-r", "da-l", 0, 1, 3);
  daStartRound();
}

export function wireDash() {
  onTap(document.getElementById("da-tap"), () => {
    if (DA.done) return;
    const ph = DA_PH[_daPhIdx];
    if (ph === "INHALE") {
      _daPlayerRow = Math.min(_daPlayerRow + 1, 6); SFX.good();
      if (_daPlayerRow === 6) { clearInterval(_ivs.dash); daRoundClear(); return; }
    } else if (ph === "EXHALE") {
      _daPlayerRow = Math.max(_daPlayerRow - 1, 0); SFX.tick();
    } else {
      document.getElementById("da-speech").textContent = "Wait for INHALE phase!";
    }
    daDraw();
  });
}
