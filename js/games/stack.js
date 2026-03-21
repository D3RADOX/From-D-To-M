import { SFX, onTap, setupCanvas, addSession, countdown, _ivs, goHome } from '../core.js';
import { hud, showRR } from '../game-base.js';

const SK_W = 270, SK_H = 300, SK_COLS = 3, SK_ROWS = 8, SK_CW = 90, SK_RH = 34;
const SK_LABELS = ["IN", "HLD", "EX"];
const COLS_C = ["#2de0d0", "#ffc844", "#ff5f5f"];
const colMap = { IN: 0, HLD: 1, EX: 2 };

const skcv = document.getElementById("stack-canvas");
const skctx = setupCanvas(skcv, SK_W, SK_H);

let SK = {}, _skBlock = null, _skGrid = [], _skSlots = [];

function skNewBlock() {
  _skBlock = { label: SK_LABELS[Math.floor(Math.random() * 3)], col: 1, row: 0, falling: true };
}

function skStartRound() {
  _skGrid = Array.from({ length: SK_COLS }, () => []);
  _skSlots = SK_LABELS.map(() => SK_LABELS[Math.floor(Math.random() * 3)]);
  SK.done = false;
  skNewBlock();
  clearInterval(_ivs.stack);
  _ivs.stack = setInterval(skTick, 900);
}

function skTick() {
  if (SK.done || !_skBlock) return;
  _skBlock.row++;
  const col = _skBlock.col;
  const stackH = _skGrid[col].length;
  if (_skBlock.row >= SK_ROWS - stackH) {
    _skGrid[col].push({ label: _skBlock.label });
    if (_skGrid[col].length >= SK_ROWS) {
      SK.lives--;
      document.getElementById("sk-speech").textContent = "Column full! 💀";
      SFX.fail(); hud("sk-s", "sk-r", "sk-l", SK.score, SK.round, SK.lives);
      if (SK.lives <= 0) {
        SK.done = true; clearInterval(_ivs.stack);
        addSession("stack", SK.score);
        showRR(false, SK.score, SK.rs, () => {
          SK.lives = 3; SK.rs = 0; hud("sk-s", "sk-r", "sk-l", SK.score, SK.round, SK.lives);
          countdown(() => skStartRound());
        });
        return;
      }
      _skGrid[col] = [];
    }
    const bot = _skGrid[col][0];
    if (bot && bot.label === _skSlots[col]) {
      SK.score += 200; SK.rs = (SK.rs || 0) + 200;
      document.getElementById("sk-speech").textContent = "✅ MATCH! +200";
      SFX.perf(); _skSlots[col] = SK_LABELS[Math.floor(Math.random() * 3)];
      _skGrid[col].shift();
      hud("sk-s", "sk-r", "sk-l", SK.score, SK.round, SK.lives);
      if (SK.score >= SK.round * 1000) { clearInterval(_ivs.stack); skRoundEnd(); return; }
    } else {
      document.getElementById("sk-speech").textContent = "No match. Keep stacking!";
    }
    skNewBlock();
  }
  skDraw();
}

function skDraw() {
  skctx.clearRect(0, 0, SK_W, SK_H);
  for (let c = 0; c < SK_COLS; c++) {
    const sx = c * SK_CW, sy = SK_H - SK_RH;
    skctx.fillStyle = "rgba(255,255,255,.08)";
    skctx.beginPath(); skctx.roundRect(sx + 2, sy, SK_CW - 4, SK_RH - 2, 6); skctx.fill();
    skctx.fillStyle = COLS_C[colMap[_skSlots[c]]];
    skctx.font = "bold 14px 'Boogaloo'"; skctx.textAlign = "center";
    skctx.fillText(_skSlots[c], sx + SK_CW / 2, sy + SK_RH - 10); skctx.textAlign = "left";
  }
  for (let c = 0; c < SK_COLS; c++) {
    _skGrid[c].forEach((b, i) => {
      const sx = c * SK_CW + 2, sy = SK_H - SK_RH - (i + 1) * SK_RH;
      const ci = colMap[b.label];
      skctx.fillStyle = COLS_C[ci] + "88";
      skctx.beginPath(); skctx.roundRect(sx, sy, SK_CW - 4, SK_RH - 3, 5); skctx.fill();
      skctx.strokeStyle = COLS_C[ci]; skctx.lineWidth = 1.5; skctx.stroke();
      skctx.fillStyle = "#fff"; skctx.font = "bold 13px 'Boogaloo'"; skctx.textAlign = "center";
      skctx.fillText(b.label, sx + SK_CW / 2 - 2, sy + SK_RH - 12); skctx.textAlign = "left";
    });
  }
  if (_skBlock) {
    const sx = _skBlock.col * SK_CW + 2, sy = _skBlock.row * SK_RH;
    const ci = colMap[_skBlock.label];
    skctx.fillStyle = COLS_C[ci] + "cc"; skctx.shadowColor = COLS_C[ci]; skctx.shadowBlur = 12;
    skctx.beginPath(); skctx.roundRect(sx, sy, SK_CW - 4, SK_RH - 3, 5); skctx.fill(); skctx.shadowBlur = 0;
    skctx.fillStyle = "#fff"; skctx.font = "bold 14px 'Boogaloo'"; skctx.textAlign = "center";
    skctx.fillText(_skBlock.label, sx + SK_CW / 2 - 2, sy + SK_RH - 10); skctx.textAlign = "left";
  }
  skctx.strokeStyle = "rgba(255,255,255,.07)"; skctx.lineWidth = 1;
  [1, 2].forEach(c => { skctx.beginPath(); skctx.moveTo(c * SK_CW, 0); skctx.lineTo(c * SK_CW, SK_H); skctx.stroke(); });
}

function skRoundEnd() {
  if (SK.round >= 3) { addSession("stack", SK.score); showRR(true, SK.score, SK.rs, () => goHome()); return; }
  showRR(true, SK.score, SK.rs, () => {
    SK.round++; SK.rs = 0; hud("sk-s", "sk-r", "sk-l", SK.score, SK.round, SK.lives);
    countdown(() => skStartRound());
  });
}

export function startStack() {
  SK = { round: 1, score: 0, lives: 3, rs: 0, done: false };
  hud("sk-s", "sk-r", "sk-l", 0, 1, 3);
  skStartRound();
}

export function wireStack() {
  const dirs = { "sk-left": "l", "sk-center": "c", "sk-right": "r" };
  Object.entries(dirs).forEach(([id, dir]) => {
    onTap(document.getElementById(id), () => {
      if (SK.done || !_skBlock) return;
      if (dir === "l" && _skBlock.col > 0) _skBlock.col--;
      if (dir === "c") _skBlock.col = 1;
      if (dir === "r" && _skBlock.col < 2) _skBlock.col++;
      skDraw();
    });
  });
}
