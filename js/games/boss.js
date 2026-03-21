import { SFX, onTap, addSession, countdown, _ivs, burst, scorePop, rand, goHome } from '../core.js';
import { hud, showRR } from '../game-base.js';

const BOSS_FAIL = ["Missed!", "Wrong breath!", "A goldfish could do better.", "Are you even breathing?"];
const NT = [{ t: "inhale", l: "IN" }, { t: "hold", l: "HL" }, { t: "exhale", l: "EX" }];

let BO = {}, _bnodes = [];

function boStartRound() {
  _bnodes = []; BO.time = 0; BO.spawnT = 0; BO.combo = 0; BO.done = false;
  document.getElementById("bosspeech").textContent = "Hit nodes as they cross the line!";
  document.getElementById("boschar").textContent = "😤";
  document.getElementById("combo").textContent = "";
  document.querySelectorAll(".bnode").forEach(n => n.remove());
  document.getElementById("boss-tbar").style.width = "100%";
  clearInterval(_ivs.boss);
  _ivs.boss = setInterval(boTick, 50);
}

function boLoseLife() {
  if (BO.done) return false;
  BO.lives--; BO.combo = 0;
  document.getElementById("boschar").textContent = "😵";
  document.getElementById("combo").textContent = "";
  SFX.fail();
  hud("bos", "bor", "bol", BO.score, BO.round, BO.lives);
  if (BO.lives <= 0) {
    BO.done = true; clearInterval(_ivs.boss); delete _ivs.boss;
    addSession("boss", BO.score);
    showRR(false, BO.score, BO.rs, () => {
      BO.lives = 3; BO.rs = 0; hud("bos", "bor", "bol", BO.score, BO.round, BO.lives);
      countdown(() => boStartRound());
    });
    return false;
  }
  return true;
}

function boTick() {
  if (BO.done) return;
  BO.time += 50; BO.spawnT += 50;
  document.getElementById("boss-tbar").style.width = (Math.max(0, 1 - BO.time / 15000) * 100) + "%";
  if (BO.spawnT >= 1100) {
    BO.spawnT = 0;
    const t = NT[Math.floor(Math.random() * 3)];
    const n = document.createElement("div");
    n.className = "bnode " + t.t; n.textContent = t.l;
    n.dataset.x = "100"; n.dataset.hit = "0";
    document.getElementById("track").appendChild(n);
    _bnodes.push(n);
  }
  let miss = 0;
  _bnodes = _bnodes.filter(n => {
    let x = parseFloat(n.dataset.x) - 1.6;
    n.dataset.x = x; n.style.left = x + "%";
    if (x < 5 && n.dataset.hit === "0") { n.remove(); miss++; return false; }
    if (x < -5) { n.remove(); return false; }
    return true;
  });
  if (miss > 0) {
    document.getElementById("bosspeech").textContent = rand(BOSS_FAIL);
    for (let i = 0; i < miss; i++) if (!boLoseLife()) return;
  }
  if (BO.time >= 15000 && !BO.done) {
    BO.done = true; clearInterval(_ivs.boss); delete _ivs.boss;
    boRoundEnd();
  }
}

function boRoundEnd() {
  if (BO.round >= 5) { addSession("boss", BO.score); showRR(true, BO.score, BO.rs, () => goHome()); return; }
  showRR(true, BO.score, BO.rs, () => {
    BO.round++; BO.rs = 0; hud("bos", "bor", "bol", BO.score, BO.round, BO.lives);
    countdown(() => boStartRound());
  });
}

export function startBoss() {
  BO = { round: 1, score: 0, lives: 3, combo: 0, rs: 0, time: 0, spawnT: 0, done: false };
  _bnodes = [];
  hud("bos", "bor", "bol", 0, 1, 3);
  boStartRound();
}

export function wireBoss() {
  onTap(document.getElementById("bosstap"), () => {
    if (BO.done) return;
    let best = null, bd = 999;
    _bnodes.forEach(n => {
      if (n.dataset.hit === "1") return;
      const x = parseFloat(n.dataset.x), d = Math.abs(x - 25);
      if (d < bd) { bd = d; best = n; }
    });
    if (best && bd < 13) {
      best.dataset.hit = "1"; best.classList.add("hit");
      BO.combo++;
      const pts = bd < 4 ? 300 : bd < 9 ? 200 : 100;
      BO.score += pts; BO.rs = (BO.rs || 0) + pts;
      document.getElementById("combo").textContent = BO.combo >= 6 ? `🔥 ${BO.combo}x COMBO!` : BO.combo >= 3 ? `⚡ ${BO.combo}x` : "";
      document.getElementById("bosspeech").textContent = bd < 4 ? "🎯 PERFECT!" : bd < 9 ? "✅ GOOD!" : "👍 OK!";
      document.getElementById("boschar").textContent = "😤";
      if (bd < 4) SFX.perf(); else SFX.good();
      hud("bos", "bor", "bol", BO.score, BO.round, BO.lives);
      const rect = document.getElementById("bosstap").getBoundingClientRect();
      scorePop("+" + pts, rect.left + rect.width / 2, rect.top - 10);
      if (pts === 300) burst(rect.left + rect.width / 2, rect.top, "#be7fff");
      setTimeout(() => { if (best.parentNode) best.remove(); }, 220);
    } else {
      BO.combo = 0; document.getElementById("combo").textContent = "";
      document.getElementById("bosspeech").textContent = "😬 Too early!";
    }
  });
}
