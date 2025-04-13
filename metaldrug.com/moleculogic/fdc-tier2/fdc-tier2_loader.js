// fdc-tier2_loader.js
// Summary:
// Dynamically loads and renders approved Tier 2 FDC logic blueprints from index.json.
// Used in fdc-tier2/index.html to populate preview cards on page load.

async function loadFDCTier2Submissions() {
  const container = document.getElementById("fdcTier2Gallery");
  if (!container) return;

  try {
    const response = await fetch("index.json");
    const entries = await response.json();

    container.innerHTML = ""; // Clear existing

    entries.forEach(entry => {
      const card = document.createElement("div");
      card.className = "border border-gray-700 p-4 rounded bg-gray-900 shadow";

      card.innerHTML = `
        <h3 class="text-xl font-semibold text-indigo-400 mb-1">${entry.name}</h3>
        <p class="text-sm text-gray-400 mb-2">${entry.summary}</p>
        <p class="text-xs text-gray-500 mb-1">Submitted: ${entry.submitted}</p>
        <p class="text-xs text-gray-500 mb-3">By: ${entry.author}</p>
        <a href="${entry.download}" class="text-sm text-green-400 underline">Download Blueprint</a>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    container.innerHTML = "<p class='text-red-400'>Failed to load blueprints.</p>";
    console.error("Tier 2 FDC load error:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadFDCTier2Submissions);
