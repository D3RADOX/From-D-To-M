const STORAGE_KEY = "als_bouncer_checklist_checkboxes_v1";

const CHECKLIST = [
  {
    title: "Opening Checklist",
    items: [
      { text: "Fill ice for bartenders" },
      { text: "Walk parking lot for trash" },
      { text: "Make sure bathrooms / dressing room is clean" },
      { text: "Make sure all dishes are washed in the kitchen" },
      { text: "Make sure kitchen is clean" },
      { text: "Check toilet paper and paper towels" },
      { text: "Make sure bar & stage have clean rags" },
    ],
  },
  {
    title: "During Shift",
    items: [
      { text: "Make sure chairs are pushed in" },
      { text: "Take any glasses to bar" },
      { text: "Help girls with ones on stage" },
      { text: "Keep eye on floor — no phones and/or photos" },
      { text: "Wipe all chairs with disinfectant spray (a bottle is pre mixed and labeled)" },
    ],
  },
  {
    title: "Closing Checklist",
    items: [
      { text: "Spray all booths and carpet in booths" },
      {
        text: "Use mop to clean stage / bathrooms / dressing (Use hot water & bleach)",
        note: "BE SURE TO CHANGE THE WATER AFTER EACH AREA!! SHOULD NOT BE USING DIRTY WATER TO CLEAN."
      },
      { text: "Kitchen needs to be clean" },
      { text: "Mop behind bar" },
      { text: "Clean floor around stage" },
      { text: "Clean the floor around the DJ area" },
      { text: "Check cigarette holder out front" },
      { text: "Take out trash and recycling" },
    ],
  },
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function makeId(sectionIndex, itemIndex) {
  return `s${sectionIndex}_i${itemIndex}`;
}

function render() {
  const state = loadState();
  const root = document.getElementById("checklist");
  root.innerHTML = "";

  CHECKLIST.forEach((section, sIdx) => {
    const sectionEl = document.createElement("div");
    sectionEl.className = "section";

    const titleEl = document.createElement("div");
    titleEl.className = "sectionTitle";
    titleEl.textContent = section.title;
    sectionEl.appendChild(titleEl);

    section.items.forEach((item, iIdx) => {
      const id = makeId(sIdx, iIdx);

      const row = document.createElement("div");
      row.className = "item";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = id;
      cb.checked = !!state[id];

      const label = document.createElement("label");
      label.setAttribute("for", id);
      label.textContent = item.text;

      if (item.note) {
        const note = document.createElement("span");
        note.className = "note";
        note.textContent = item.note;
        label.appendChild(note);
      }

      cb.addEventListener("change", () => {
        const next = loadState();
        next[id] = cb.checked;
        saveState(next);
      });

      row.appendChild(cb);
      row.appendChild(label);
      sectionEl.appendChild(row);
    });

    root.appendChild(sectionEl);
  });
}

document.getElementById("resetBtn").addEventListener("click", () => {
  const ok = confirm("Reset all checkboxes on this device?");
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  render();
});

render();