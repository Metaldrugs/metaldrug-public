// fdc_preview_display.js
// Loads and displays FDC Tier 1 logic from fdc_preview_logic.json in a styled layout

async function loadFdcLogic() {
  const response = await fetch("fdc_preview_logic.json");
  const data = await response.json();
  const container = document.getElementById("fdc-logic-container");
  container.innerHTML = "";

  data.components.forEach((component) => {
    const card = document.createElement("div");
    card.className = "bg-white dark:bg-gray-800 p-4 shadow rounded mb-6";

    const title = document.createElement("h3");
    title.className = "text-lg font-bold text-indigo-700 dark:text-indigo-400";
    title.textContent = `${component.name} (${component.type})`;
    card.appendChild(title);

    const role = document.createElement("p");
    role.className = "text-sm text-gray-600 dark:text-gray-300 italic";
    role.textContent = component.role;
    card.appendChild(role);

    const ul = document.createElement("ul");
    ul.className = "list-disc ml-6 mt-2 text-sm text-gray-700 dark:text-gray-300";
    component.interactions.forEach((interaction) => {
      const li = document.createElement("li");
      li.textContent = interaction;
      ul.appendChild(li);
    });
    card.appendChild(ul);

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadFdcLogic);
