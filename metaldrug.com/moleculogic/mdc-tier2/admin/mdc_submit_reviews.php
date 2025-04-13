<?php
// File: mdc_submit_review.php
// Summary: Processes admin review form for MDC Tier 2 logic submissions.

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(403);
  echo "Invalid request.";
  exit;
}

$submissionId = $_POST['submission_id'] ?? '';
$status = $_POST['status'] ?? '';
$notes = $_POST['notes'] ?? '';

if (!$submissionId || !$status) {
  echo "Submission ID and status are required.";
  exit;
}

$logPath = __DIR__ . '/../submissions/mdc_tier2_reviews.log';
$entry = date('Y-m-d H:i:s') . " | ID: $submissionId | Status: $status | Notes: $notes\n";
file_put_contents($logPath, $entry, FILE_APPEND);

// Optional: trigger email notification if needed (to be added later)

echo "✅ Review logged for submission ID: $submissionId.";
?>
