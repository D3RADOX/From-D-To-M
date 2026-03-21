// ═══════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════
const ST = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
};

export const getSessions = () => ST.get("bob_s") || [];
export const saveSessions = v => ST.set("bob_s", v);
export const getBests = () => ST.get("bob_b") || {};
export const saveBests = v => ST.set("bob_b", v);

export function addSession(game, score) {
  const s = getSessions();
  s.unshift({ game, score, date: new Date().toISOString() });
  if (s.length > 80) s.length = 80;
  saveSessions(s);
  const b = getBests();
  if (!b[game] || score > b[game]) b[game] = score;
  if (!b.all || score > b.all) b.all = score;
  saveBests(b);
  const today = new Date().toDateString();
  const last = ST.get("bob_day");
  let str = ST.get("bob_str") || 0;
  if (last !== today) {
    str = (last === new Date(Date.now() - 86400000).toDateString()) ? str + 1 : 1;
    ST.set("bob_day", today);
    ST.set("bob_str", str);
  }
}

export function getStreak() { return ST.get("bob_str") || 0; }

// ═══════════════════════════════════════
// AUDIO
// ═══════════════════════════════════════
let _ac = null;
function getAC() {
  if (!_ac) { try { _ac = new (window.AudioContext || window.webkitAudioContext)(); } catch {} }
  return _ac;
}

function beep(hz, dur, vol = 0.1, type = "sine") {
  try {
    const c = getAC(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = type; o.frequency.value = hz;
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.start(c.currentTime); o.stop(c.currentTime + dur);
  } catch {}
}

export const SFX = {
  tick: () => beep(900, 0.06, 0.07, "square"),
  good: () => beep(660, 0.13, 0.11),
  perf: () => { beep(660, 0.07, 0.16); setTimeout(() => beep(880, 0.13, 0.16), 70); },
  fail: () => beep(140, 0.28, 0.16, "sawtooth"),
  pop:  () => { beep(200, 0.08, 0.18, "square"); setTimeout(() => beep(100, 0.25, 0.15, "sawtooth"), 50); },
  win:  () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.16, 0.12), i * 70)); },
};

// ═══════════════════════════════════════
// FX (particles + score popups)
// ═══════════════════════════════════════
export function burst(x, y, col) {
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const a = Math.random() * Math.PI * 2;
    const d = 38 + Math.random() * 60;
    const sz = 3 + Math.random() * 6;
    p.style.cssText = `width:${sz}px;height:${sz}px;background:${col};left:${x}px;top:${y}px;--tx:translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px);animation-duration:${0.45 + Math.random() * 0.25}s;`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 850);
  }
}

export function scorePop(txt, x, y) {
  const el = document.createElement("div");
  el.className = "score-pop";
  el.textContent = txt;
  el.style.cssText = `left:${x - 22}px;top:${y}px;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

// ═══════════════════════════════════════
// TOUCH HELPERS
// ═══════════════════════════════════════
export function onTap(el, fn) {
  if (!el) return;
  let touched = false;
  el.addEventListener("touchstart", e => { e.preventDefault(); touched = true; fn(e); }, { passive: false });
  el.addEventListener("click", e => { if (touched) { touched = false; return; } fn(e); });
}

export function onHold(el, pressFn, relFn) {
  if (!el) return;
  let active = false;
  const press = e => { e.preventDefault(); if (active) return; active = true; pressFn(); };
  const rel = () => { if (!active) return; active = false; relFn(); };
  el.addEventListener("touchstart", press, { passive: false });
  el.addEventListener("touchend", rel, { passive: false });
  el.addEventListener("touchcancel", rel, { passive: false });
  el.addEventListener("mousedown", press);
  el.addEventListener("mouseup", rel);
  el.addEventListener("mouseleave", rel);
}

// ═══════════════════════════════════════
// CANVAS DPI
// ═══════════════════════════════════════
export function setupCanvas(cv, w, h) {
  const dpr = window.devicePixelRatio || 1;
  cv.width = w * dpr; cv.height = h * dpr;
  cv.style.width = w + "px"; cv.style.height = h + "px";
  const ctx = cv.getContext("2d");
  ctx.scale(dpr, dpr);
  return ctx;
}

// ═══════════════════════════════════════
// TIMER/LOOP MANAGEMENT
// ═══════════════════════════════════════
export const _rafs = {};
export const _ivs = {};

export function killAll() {
  Object.values(_rafs).forEach(r => cancelAnimationFrame(r));
  for (const k in _rafs) delete _rafs[k];
  Object.values(_ivs).forEach(i => clearInterval(i));
  for (const k in _ivs) delete _ivs[k];
  document.getElementById("countdown").classList.remove("show");
}

export function countdown(cb) {
  const el = document.getElementById("countdown");
  const num = document.getElementById("cd-num");
  let n = 3;
  el.classList.add("show");
  num.textContent = n;
  num.style.animation = "none"; void num.offsetWidth; num.style.animation = "cdpop .85s ease";
  SFX.tick();
  clearInterval(_ivs.cd);
  _ivs.cd = setInterval(() => {
    n--;
    if (n <= 0) { clearInterval(_ivs.cd); delete _ivs.cd; el.classList.remove("show"); cb(); return; }
    num.textContent = n;
    num.style.animation = "none"; void num.offsetWidth; num.style.animation = "cdpop .85s ease";
    SFX.tick();
  }, 900);
}

// ═══════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════
export const ALL_GAMES = ["ring", "inflate", "bubbles", "boss", "whack", "snake", "invaders", "runner", "slots", "pong", "stack", "dash"];

export const ICONS = {
  ring: "⭕", inflate: "🎈", bubbles: "🫧", boss: "🥊",
  whack: "🔨", snake: "🐍", invaders: "👾", runner: "🏃",
  slots: "🎰", pong: "🏓", stack: "🧱", dash: "🐸"
};

export const GCOLS = {
  ring: "var(--teal)", inflate: "var(--coral)", bubbles: "var(--purple)", boss: "var(--green)",
  whack: "var(--orange)", snake: "var(--lime)", invaders: "var(--magenta)", runner: "var(--sky)",
  slots: "var(--gold)", pong: "var(--blue)", stack: "var(--cyan)", dash: "var(--pink)"
};

let _refreshHomeFn = null;
export function setRefreshHome(fn) { _refreshHomeFn = fn; }

export function go(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  el.classList.add("active");
  el.scrollTop = 0;
  if (id === "home" && _refreshHomeFn) _refreshHomeFn();
}

export function goHome() { killAll(); go("home"); }

// ═══════════════════════════════════════
// BG BUBBLES
// ═══════════════════════════════════════
export function initBgBubbles() {
  const c = document.getElementById("bgb");
  for (let i = 0; i < 14; i++) {
    const b = document.createElement("div");
    b.className = "fbub";
    const sz = 20 + Math.random() * 85;
    b.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;animation-duration:${10 + Math.random() * 15}s;animation-delay:${Math.random() * 13}s;`;
    c.appendChild(b);
  }
}

// ═══════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════
export const rand = a => a[Math.floor(Math.random() * a.length)];
