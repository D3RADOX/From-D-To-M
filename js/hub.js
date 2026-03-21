import { getSessions, getBests, saveSessions, saveBests, getStreak, ALL_GAMES, ICONS, GCOLS, onTap, go } from './core.js';

export function refreshHome() {
  const b = getBests(), s = getSessions(), str = getStreak();
  document.getElementById("hs-best").textContent = b.all || 0;
  document.getElementById("hs-sess").textContent = s.length;
  document.getElementById("hs-streak").textContent = (str || 0) + "🔥";
  ALL_GAMES.forEach(g => {
    const el = document.getElementById("gb-" + g);
    if (el) el.textContent = b[g] ? "Best: " + b[g] : "Best: —";
  });
}

export function renderLB(f) {
  const s = getSessions();
  const rows = (f === "all" ? s : s.filter(x => x.game === f))
    .slice().sort((a, b) => b.score - a.score).slice(0, 12);
  const el = document.getElementById("lb-list");
  if (!rows.length) { el.innerHTML = '<div class="empty">No scores yet. Go play!</div>'; return; }
  el.innerHTML = rows.map((r, i) => {
    const rc = i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";
    const m = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "#" + (i + 1);
    return `<div class="lb-row"><div class="lb-rank ${rc}">${m}</div><div class="lb-name">${ICONS[r.game] || "🎮"} ${r.game.toUpperCase()}</div><div><div class="lb-sc">${r.score}</div><div class="lb-date">${new Date(r.date).toLocaleDateString()}</div></div></div>`;
  }).join("");
}

export function renderProg() {
  const s = getSessions(), str = getStreak();
  document.getElementById("pstreak").textContent = str;
  document.getElementById("pg-s2").textContent = s.length;
  const best = s.length ? Math.max(...s.map(x => x.score)) : 0;
  const avg = s.length ? Math.round(s.reduce((a, x) => a + x.score, 0) / s.length) : 0;
  const tot = s.reduce((a, x) => a + x.score, 0);
  document.getElementById("pg-b").textContent = best;
  document.getElementById("pg-a").textContent = avg;
  document.getElementById("pg-t").textContent = tot;
  const b = getBests();
  document.getElementById("prog-games").innerHTML = ALL_GAMES.map(g =>
    `<div class="pgrow"><div class="pgr-n">${ICONS[g]} ${g.toUpperCase()}</div><div class="pgr-s" style="color:${GCOLS[g]}">${b[g] || "—"}</div></div>`
  ).join("");
  const sl = document.getElementById("sess-list");
  if (!s.length) { sl.innerHTML = '<div class="empty">No sessions yet.</div>'; return; }
  sl.innerHTML = s.slice(0, 15).map(x => {
    const d = new Date(x.date);
    const ds = d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `<div class="srow"><div class="si">${ICONS[x.game] || "🎮"}</div><div class="sinfo"><div class="sg">${x.game.toUpperCase()}</div><div class="sd">${ds}</div></div><div class="ssc">${x.score}</div></div>`;
  }).join("");
}

export function wireHub() {
  onTap(document.getElementById("nav-lb"), () => { go("lb"); renderLB("all"); });
  onTap(document.getElementById("nav-prog"), () => { go("prog"); renderProg(); });
  onTap(document.getElementById("back-lb"), () => go("home"));
  onTap(document.getElementById("back-prog"), () => go("home"));

  document.querySelectorAll(".lb-tab").forEach(tab => {
    onTap(tab, () => {
      document.querySelectorAll(".lb-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderLB(tab.dataset.filter);
    });
  });

  onTap(document.getElementById("clear-lb"), () => {
    if (confirm("Clear all scores?")) { saveSessions([]); renderLB("all"); refreshHome(); }
  });

  onTap(document.getElementById("clear-prog"), () => {
    if (confirm("Clear all progress?")) {
      saveSessions([]); saveBests({});
      localStorage.setItem("bob_str", "0");
      localStorage.setItem("bob_day", "null");
      renderProg(); refreshHome();
    }
  });
}
