// mdc-tier1-sync.js
// Summary:
// Enables automatic sync and recovery of MDC Tier 1 logic sessions from localStorage.
// Ensures blueprint states persist across sessions and can be recalled dynamically.

function syncBlueprintToStorage(nameFieldId = "blueprintName", inputId = "blueprintInput") {
  const name = document.getElementById(nameFieldId).value.trim();
  const logic = document.getElementById(inputId).value.trim();
  if (!name || !logic) return alert("Name and blueprint are required.");

  try {
    JSON.parse(logic); // Validation check
    const timestamp = new Date().toISOString();
    const entry = { name, logic, timestamp };
    let stored = JSON.parse(localStorage.getItem("mdc_tier1_blueprints") || "[]");
    stored.push(entry);
    localStorage.setItem("mdc_tier1_blueprints", JSON.stringify(stored));
    alert("Session saved.");
  } catch (e) {
    alert("Invalid JSON. Session not saved.");
  }
}

function loadMdcBlueprintHistory(containerId = "historyContainer", inputId = "blueprintInput") {
  const container = document.getElementById(containerId);
  container.innerHTML = "<h3 class='font-semibold text-indigo-400 mb-2'>📜 Session History</h3>";

  const data = JSON.parse(localStorage.getItem("mdc_tier1_blueprints") || "[]");
  if (data.length === 0) {
    container.innerHTML += "<p class='text-sm text-gray-400'>No previous sessions found.</p>";
    return;
  }

  data.reverse().forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "border-b border-gray-700 py-2 flex justify-between items-center";

    const info = document.createElement("div");
    info.innerHTML = `<strong>${item.name}</strong><br/><span class="text-xs text-gray-400">${item.timestamp}</span>`;

    const actions = document.createElement("div");
    actions.className = "space-x-2";

    const loadBtn = document.createElement("button");
    loadBtn.textContent = "Load";
    loadBtn.className = "text-blue-500 text-sm underline";
    loadBtn.onclick = () => {
      document.getElementById(inputId).value = item.logic;
      alert(`Loaded: ${item.name}`);
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.className = "text-red-400 text-sm";
    delBtn.onclick = () => {
      if (confirm("Delete this entry?")) {
        data.splice(data.length - 1 - index, 1);
        localStorage.setItem("mdc_tier1_blueprints", JSON.stringify(data));
        loadMdcBlueprintHistory(containerId, inputId);
      }
    };

    actions.appendChild(loadBtn);
    actions.appendChild(delBtn);
    row.appendChild(info);
    row.appendChild(actions);
    container.appendChild(row);
  });
}
