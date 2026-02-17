const STORAGE_KEY = "als_bouncer_checklist_v2";

const CHECKLIST = {
  "Opening Checklist": [
    "Fill ice for bartenders",
    "Walk parking lot for trash",
    "Make sure bathrooms / dressing room is clean",
    "Make sure all dishes are washed in the kitchen",
    "Make sure kitchen is clean",
    "Check toilet paper and paper towels",
    "Make sure bar & stage have clean rags"
  ],
  "During Shift": [
    "Make sure chairs are pushed in",
    "Take any glasses to bar",
    "Help girls with ones on stage",
    "Keep eye on floor — no phones and/or photos",
    "Wipe all chairs with disinfectant spray (bottle is pre-mixed and labeled)"
  ],
  "Closing Checklist": [
    "Spray all booths and carpet in booths",
    "Use mop to clean stage / bathrooms / dressing (use hot water & bleach)",
    "Change the water after each area. Do NOT use dirty water.",
    "Kitchen needs to be clean",
    "Mop behind bar",
    "Clean floor around stage",
    "Clean the floor around the DJ area",
    "Check cigarette holder out front",
    "Take out trash and recycling"
  ]
};

let state = loadState();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  const container = document.getElementById("checklist");
  container.innerHTML = "";

  Object.keys(CHECKLIST).forEach(sectionName => {
    const section = document.createElement("div");
    section.className = "section";

    const title = document.createElement("h2");
    title.textContent = sectionName;
    section.appendChild(title);

    CHECKLIST[sectionName].forEach((text, index) => {
      const id = sectionName + "_" + index;

      const item = document {
        const note = document.createElement("span");
        note.className = "note";
        note.textContent = text;
        label.textContent = "";
        label.appendChild(note);
      }

      checkbox.addEventListener("change", () => {
        state[id] = checkbox.checked;
        saveState();
      });

      item.appendChild(checkbox);
      item.appendChild(label);
      section.appendChild(item);
    });

    container.appendChild(section);
  });
}

document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Reset all checkboxes?")) {
    localStorage.removeItem(STORAGE_KEY);
    state = {};
    render();
  }
});

render();