// Minimal checkbox checklist (no conversational flow)
// - Renders full list with checkboxes
// - Saves state to localStorage automatically
// - Overall + per-section progress
// - Expand/Collapse all + Reset

const STORAGE_KEY = "als_diamond_bouncer_checklist_checkboxes_v1";

const DATA = {
  opening: [
    { text: "Fill ice for bartenders" },
    { text: "Walk parking lot for trash" },
    { text: "Make sure bathrooms / dressing room is clean" },
    { text: "Make sure all dishes are washed in the kitchen" },
    { text: "Make sure kitchen is clean" },
    { text: "Check toilet paper and paper towels" },
    { text: "Make sure bar & stage have clean rags" },
  ],
  during: [
    { text: "Make sure chairs are pushed in" },
    { text: "Take any glasses to bar" },
    { text: "Help girls with ones on stage" },
    { text: "Keep eye on floor — no phones and/or photos" },
    { text: "Wipe all chairs with disinfectant spray (bottle is pre-mixed and labeled)" },
  ],
  closing: [
    { text: "Spray all booths and carpet in booths" },
    {
      text: "Use mop to clean stage / bathrooms / dressing (use hot water & bleach)",
      note: "Change the water after each area. Do not use dirty water to clean."
    },
    { text: "Kitchen needs to be clean" },
    { text: "Mop behind bar" },
    { text: "Clean floor around stage" },
    { text: "Clean the floor around the DJ area" },
    { text: "Check cigarette holder out front" },
    { text: "Take out trash and recycling" },
  ],
};

function makeId(sectionKey, index) {
  return `${sectionKey}_${index}`;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { checked: {} };
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === "object") ? parsed : { checked: {} };
  } catch {
    return { checked: {} };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setChecked(id, value) {
  state.checked[id] = !!value;
  saveState();
  updateProgress();
  updateItemStyle(id);
}

function isChecked(id) {
  return !!state.checked[id];
}

function $(id) {
  return document.getElementById(id);
}

const overallProgressText = $("overallProgressText");
const overallProgressFill = $("overallProgressFill");

const openingList = $("openingList");
const duringList