// mdc-export-promote.js
// Summary:
// Handles blueprint export to JSON and submission for Tier 2 review. Includes client-side validation, file download, and async POST to backend.

function exportBlueprintAsFile(inputId = 'blueprintInput') {
  const content = document.getElementById(inputId).value.trim();
  if (!content) return alert("Nothing to export.");
  try {
    const parsed = JSON.parse(content);
    const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${parsed.ligand || 'mdc_blueprint'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert("Invalid JSON. Please validate before exporting.");
  }
}

function submitBlueprintForReview(inputId = 'blueprintInput', email = '') {
  const content = document.getElementById(inputId).value.trim();
  if (!content) return alert("Nothing to submit.");
  try {
    const payload = {
      json: JSON.parse(content),
      email: email || prompt("Enter your email for confirmation:")
    };
    if (!payload.email) return;

    fetch("/moleculogic/mdc-tier2/process_tier2_submission.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") {
          alert("Submitted successfully for Tier 2 review.");
        } else {
          alert("Submission failed: " + data.message);
        }
      })
      .catch(err => alert("Error during submission."));
  } catch (e) {
    alert("Invalid JSON format.");
  }
}

function setupExportPromoteButtons() {
  const bar = document.createElement('div');
  bar.className = "flex gap-4 mt-6";

  const exportBtn = document.createElement('button');
  exportBtn.textContent = "📦 Export Blueprint";
  exportBtn.className = "bg-yellow-600 text-white px-4 py-2 rounded";
  exportBtn.onclick = () => exportBlueprintAsFile();

  const promoteBtn = document.createElement('button');
  promoteBtn.textContent = "🚀 Submit to Tier 2";
  promoteBtn.className = "bg-blue-600 text-white px-4 py-2 rounded";
  promoteBtn.onclick = () => submitBlueprintForReview();

  bar.appendChild(exportBtn);
  bar.appendChild(promoteBtn);
  document.getElementById("validatorOutput")?.appendChild(bar);
}
