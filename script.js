/* Al’s Diamond Bouncer Checklist
   - Single-item mode (strict format)
   - Blocked logging w/ one follow-up: “What’s the blocker?”
   - Skip logging
   - Batch mode (up to 5) optional
   - Phase logic: opening → during_shift (cycles) → closing → verification gate
   - Persistent state in localStorage
*/

const STORAGE_KEY = "als_diamond_bouncer_checklist_v1";

const CHECKLIST = {
  opening: [
    "Fill ice for bartenders",
    "Walk parking lot for trash",
    "Make sure bathrooms / dressing room is clean",
    "Make sure all dishes are washed in the kitchen",
    "Make sure kitchen is clean",
    "Check toilet paper and paper towels",
    "Make sure bar & stage have clean rags",
  ],
  during_shift: [
    "Make sure chairs are pushed in",
    "Take any glasses to bar",
    "Help girls with ones on stage",
    "Keep eye on floor — no phones and/or photos",
    "Wipe all chairs with disinfectant spray (bottle is pre-mixed and labeled)",
  ],
  closing: [
    "Spray all booths and carpet in booths",
    "Use mop to clean stage / bathrooms / dressing (use hot water & bleach). BE SURE TO CHANGE THE WATER AFTER EACH AREA. SHOULD NOT BE USING DIRTY WATER TO CLEAN",
    "Kitchen needs to be clean",
    "Mop behind bar",
    "Clean floor around stage",
    "Clean the floor around the DJ area",
    "Check cigarette holder out front",
    "Take out trash and recycling",
  ],
};

function defaultState() {
  return {
    phase: "opening",               // opening | during_shift | closing | done
    current_item_index: 0,
    completed_items: [],            // {phase, index, text, ts}
    blocked_items: [],              // {phase, index, text, blocker, ts}
    skipped_items: [],              // {phase, index, text, ts}
    notes: [],
    during_shift_cycles_completed: 0
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function nowISO() {
  return new Date().toISOString();
}

function phaseLabel(phase) {
  if (phase === "opening") return "OPENING";
  if (phase === "during_shift") return "DURING SHIFT";
  if (phase === "closing") return "CLOSING";
  if (phase === "done") return "DONE";
  return String(phase).toUpperCase();
}

function stepMeta(phase, index) {
  const total = CHECKLIST[phase]?.length ?? 0;
  return `Step ${index + 1}/${total}`;
}

function currentTaskText() {
  const list = CHECKLIST[state.phase];
  if (!list) return null;
  if (state.current_item_index < 0 || state.current_item_index >= list.length) return null;
  return list[state.current_item_index];
}

function strictLine() {
  const total = CHECKLIST[state.phase]?.length ?? 0;
  const x = state.current_item_index + 1;
  const y = total;
  const task = currentTaskText() ?? "(no task)";
  return `[${phaseLabel(state.phase)}] Step ${x}/${y}: ${task}\nReply: done | blocked | skip`;
}

function renderLog() {
  const lines = [];

  if (state.blocked_items.length) {
    lines.push("BLOCKED:");
    for (const b of state.blocked_items.slice(-20)) {
      lines.push(`- [${phaseLabel(b.phase)} ${b.index + 1}] ${b.text} :: ${b.blocker}`);
    }
    lines.push("");
  }

  if (state.skipped_items.length) {
    lines.push("SKIPPED:");
    for (const s of state.skipped_items.slice(-20)) {
      lines.push(`- [${phaseLabel(s.phase)} ${s.index + 1}] ${s.text}`);
    }
    lines.push("");
  }

  if (!lines.length) return "(none)";
  return lines.join("\n").trim();
}

function showClosingVerification(show) {
  closingVerifyCard.hidden = !show;
}

function render() {
  phasePill.textContent = phaseLabel(state.phase);

  const task = currentTaskText();
  if (task) {
    stepMetaEl.textContent = stepMeta(state.phase, state.current_item_index);
    taskLine.textContent = strictLine();
    singleControls.hidden = isBatchMode();
    batchBox.hidden = !isBatchMode();
    showClosingVerification(false);
    if (isBatchMode()) renderBatch();
  } else {
    // Phase complete – handle transitions
    handlePhaseCompletionUI();
  }

  logBody.textContent = renderLog();
}

function isBatchMode() {
  return !!batchToggle.checked;
}

function nextItem() {
  state.current_item_index += 1;
  saveState();
  render();
}

function completeCurrent() {
  const text = currentTaskText();
  if (!text) return;

  state.completed_items.push({
    phase: state.phase,
    index: state.current_item_index,
    text,
    ts: nowISO()
  });

  nextItemOrPhaseAdvance();
}

function skipCurrent() {
  const text = currentTaskText();
  if (!text) return;

  state.skipped_items.push({
    phase: state.phase,
    index: state.current_item_index,
    text,
    ts: nowISO()
  });

  nextItemOrPhaseAdvance();
}

function blockCurrent(blocker) {
  const text = currentTaskText();
  if (!text) return;

  state.blocked_items.push({
    phase: state.phase,
    index: state.current_item_index,
    text,
    blocker: blocker || "(no details)",
    ts: nowISO()
  });

  nextItemOrPhaseAdvance();
}

function nextItemOrPhaseAdvance() {
  const list = CHECKLIST[state.phase];
  const nextIndex = state.current_item_index + 1;

  if (list && nextIndex < list.length) {
    state.current_item_index = nextIndex;
    saveState();
    render();
    return;
  }

  // End of this phase’s list
  state.current_item_index = list ? list.length : 0;
  saveState();
  render();
}

function handlePhaseCompletionUI() {
  // Called when currentTaskText() is null (end of list)
  if (state.phase === "opening") {
    taskLine.textContent = "Opening complete. Moving to During Shift.";
    stepMetaEl.textContent = "";
    singleControls.hidden = true;
    batchBox.hidden = true;
    showClosingVerification(false);

    // auto-transition
    state.phase = "during_shift";
    state.current_item_index = 0;
    saveState();
    setTimeout(render, 250);
    return;
  }

  if (state.phase === "during_shift") {
    state.during_shift_cycles_completed += 1;
    saveState();

    // Ask the user: Run another floor cycle? (yes/no)
    taskLine.textContent =
      `During Shift cycle complete.\nRun another floor cycle? (yes/no)\n\n` +
      `Use buttons: done=yes, skip=no (then we’ll offer Closing).`;

    stepMetaEl.textContent = "";
    singleControls.hidden = isBatchMode(); // batch off here
    batchBox.hidden = true;
    showClosingVerification(false);

    // Re-map controls temporarily: done=yes, skip=no, blocked=disabled
    doneBtn.textContent = "yes";
    skipBtn.textContent = "no";
    blockedBtn.disabled = true;

    // Wire temporary handlers (guarded by a flag)
    inCyclePrompt = true;
    return;
  }

  if (state.phase === "closing") {
    // Mandatory End Rule: cannot end until closing + verification complete
    taskLine.textContent = "Closing checklist complete. Run verification below.";
    stepMetaEl.textContent = "";
    singleControls.hidden = true;
    batchBox.hidden = true;
    showClosingVerification(true);
    return;
  }

  if (state.phase === "done") {
    taskLine.textContent = "Checklist complete. You’re cleared to leave.";
    stepMetaEl.textContent = "";
    singleControls.hidden = true;
    batchBox.hidden = true;
    showClosingVerification(false);
    return;
  }

  taskLine.textContent = "No active task.";
  stepMetaEl.textContent = "";
}

let state = loadState();
let inCyclePrompt = false;

const phasePill = document.getElementById("phasePill");
const stepMetaEl = document.getElementById("stepMeta");
const taskLine = document.getElementById("taskLine");

const singleControls = document.getElementById("singleControls");
const doneBtn = document.getElementById("doneBtn");
const blockedBtn = document.getElementById("blockedBtn");
const skipBtn = document.getElementById("skipBtn");

const blockerBox = document.getElementById("blockerBox");
const blockerInput = document.getElementById("blockerInput");
const blockerSaveBtn = document.getElementById("blockerSaveBtn");
const blockerCancelBtn = document.getElementById("blockerCancelBtn");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const batchToggle = document.getElementById("batchToggle");
const batchBox = document.getElementById("batchBox");
const batchList = document.getElementById("batchList");
const batchSubmitBtn = document.getElementById("batchSubmitBtn");

const logBody = document.getElementById("logBody");

const closingVerifyCard = document.getElementById("closingVerifyCard");
const vMop = document.getElementById("vMop");
const vTrash = document.getElementById("vTrash");
const vBlocked = document.getElementById("vBlocked");
const verifyBtn = document.getElementById("verifyBtn");
const verifyResult = document.getElementById("verifyResult");

function start() {
  // START BEHAVIOR
  state.phase = "opening";
  state.current_item_index = 0;
  inCyclePrompt = false;

  // restore normal controls
  doneBtn.textContent = "done";
  skipBtn.textContent = "skip";
  blockedBtn.textContent = "blocked";
  blockedBtn.disabled = false;

  saveState();
  render();
}

function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
  state = defaultState();
  inCyclePrompt = false;

  // restore normal controls
  doneBtn.textContent = "done";
  skipBtn.textContent = "skip";
  blockedBtn.textContent = "blocked";
  blockedBtn.disabled = false;

  // reset verification
  vMop.checked = false;
  vTrash.checked = false;
  vBlocked.checked = false;
  verifyResult.textContent = "";

  render();
}

function showBlockerPrompt() {
  blockerInput.value = "";
  blockerBox.hidden = false;
  blockerInput.focus();
}

function hideBlockerPrompt() {
  blockerBox.hidden = true;
}

function renderBatch() {
  const list = CHECKLIST[state.phase] || [];
  const startIdx = state.current_item_index;
  const slice = list.slice(startIdx, startIdx + 5);

  batchList.innerHTML = "";
  slice.forEach((text, i) => {
    const li = document.createElement("li");
    const id = `batch_${startIdx + i}`;
    li.innerHTML = `
      <label for="${id}">
        <input type="checkbox" id="${id}" data-abs-index="${startIdx + i}" />
        ${escapeHTML(text)}
      </label>
    `;
    batchList.appendChild(li);
  });
}

function escapeHTML(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function submitBatch() {
  const checks = batchList.querySelectorAll("input[type=checkbox]");
  const marked = [];
  checks.forEach(ch => {
    if (ch.checked) marked.push(Number(ch.dataset.absIndex));
  });

  // Complete marked items in order, then advance to first uncompleted in batch window
  // Rule: batch mode only affects completion; blocked/skip still handled single-item.
  marked.sort((a,b)=>a-b);

  for (const absIndex of marked) {
    const text = CHECKLIST[state.phase][absIndex];
    state.completed_items.push({ phase: state.phase, index: absIndex, text, ts: nowISO() });
  }

  // Advance current index to next item after the highest contiguous completed from current
  let idx = state.current_item_index;
  while (idx < CHECKLIST[state.phase].length) {
    const alreadyCompleted = state.completed_items.some(x => x.phase === state.phase && x.index === idx);
    const alreadySkipped = state.skipped_items.some(x => x.phase === state.phase && x.index === idx);
    const alreadyBlocked = state.blocked_items.some(x => x.phase === state.phase && x.index === idx);
    if (alreadyCompleted || alreadySkipped || alreadyBlocked) idx += 1;
    else break;
  }

  state.current_item_index = idx;
  saveState();
  render();
}

function handleCycleAnswer(isYes) {
  // Restore normal controls after this prompt
  doneBtn.textContent = "done";
  skipBtn.textContent = "skip";
  blockedBtn.disabled = false;

  inCyclePrompt = false;

  if (isYes) {
    // repeat during_shift
    state.phase = "during_shift";
    state.current_item_index = 0;
    saveState();
    render();
  } else {
    // offer transition to closing
    taskLine.textContent = "Go to Closing? (yes/no)\n\nUse buttons: done=yes, skip=no.";
    blockedBtn.disabled = true; // keep simple
    inClosingPrompt = true;
  }
}

let inClosingPrompt = false;

function handleClosingAnswer(isYes) {
  // Restore normal controls after this prompt
  doneBtn.textContent = "done";
  skipBtn.textContent = "skip";
  blockedBtn.disabled = false;

  inClosingPrompt = false;

  if (isYes) {
    state.phase = "closing";
    state.current_item_index = 0;
    saveState();
    render();
  } else {
    // stay in during_shift (ready for another cycle prompt)
    state.phase = "during_shift";
    state.current_item_index = CHECKLIST.during_shift.length; // forces completion UI again
    saveState();
    render();
  }
}

function finalizeClosing() {
  // Mandatory end rule: must pass verification after closing.
  const mopOK = vMop.checked;
  const trashOK = vTrash.checked;

  // vBlocked checked means: NO blocked items left.
  const noBlockedLeft = vBlocked.checked;

  if (!mopOK || !trashOK || !noBlockedLeft) {
    verifyResult.textContent = "Not cleared. Complete the missing confirmations.";
    verifyResult.style.color = "var(--danger)";
    return;
  }

  verifyResult.textContent = "Checklist complete. You’re cleared to leave.";
  verifyResult.style.color = "var(--ok)";

  state.phase = "done";
  saveState();
  render();
}

startBtn.addEventListener("click", start);
resetBtn.addEventListener("click", resetAll);

batchToggle.addEventListener("change", () => {
  // Only meaningful during active steps
  render();
});

doneBtn.addEventListener("click", () => {
  if (inCyclePrompt) return handleCycleAnswer(true);
  if (inClosingPrompt) return handleClosingAnswer(true);
  completeCurrent();
});

skipBtn.addEventListener("click", () => {
  if (inCyclePrompt) return handleCycleAnswer(false);
  if (inClosingPrompt) return handleClosingAnswer(false);
  skipCurrent();
});

blockedBtn.addEventListener("click", () => {
  if (inCyclePrompt || inClosingPrompt) return;
  showBlockerPrompt();
});

blockerSaveBtn.addEventListener("click", () => {
  const blocker = blockerInput.value.trim();
  hideBlockerPrompt();
  blockCurrent(blocker);
});

blockerCancelBtn.addEventListener("click", () => {
  hideBlockerPrompt();
});

batchSubmitBtn.addEventListener("click", () => {
  submitBatch();
});

verifyBtn.addEventListener("click", finalizeClosing);

// Initial render: if there’s an active phase + index, show it; otherwise prompt start
render();