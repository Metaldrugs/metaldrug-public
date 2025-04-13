// validate_nda.js

// Validate NDA token on Tier 1 pages and redirect if not valid

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("nda_token");
  if (!token) {
    window.location.href = "/request-nda.html";
    return;
  }

  fetch("/nda_handler/nda_token_status_check.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.valid || data.status !== "approved") {
        window.location.href = "/request-nda.html";
      }
    })
    .catch(err => {
      console.error("NDA check error:", err);
      window.location.href = "/request-nda.html";
    });
});
