/*
  Summary:
  Backend handler for FDC Tier 2 blueprint submission.
  Accepts POST data (name, metadata, content) and logs into timestamped .json file.
  Requires valid NDA token in sessionStorage (handled on frontend).
*/
<?php
// File: fdc-tier2_submission.php

header('Content-Type: application/json');

// Ensure POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

// Extract POST data
$name     = $_POST['name']     ?? '';
$metadata = $_POST['metadata'] ?? '';
$content  = $_POST['content']  ?? '';

// Validate content
if (!$name || !$content) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
    exit;
}

// Prepare file save path
$dir = __DIR__ . "/fdc-tier2_submissions";
if (!file_exists($dir)) {
    mkdir($dir, 0775, true);
}

$timestamp = date('Y-m-d_H-i-s');
$safeName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $name);
$filePath = "$dir/{$safeName}_$timestamp.json";

// Structure the submission
$submission = [
    "timestamp" => $timestamp,
    "submitted_by" => $name,
    "metadata" => $metadata,
    "blueprint" => json_decode($content, true)
];

// Save
file_put_contents($filePath, json_encode($submission, JSON_PRETTY_PRINT));

echo json_encode(["status" => "success", "message" => "Blueprint submitted successfully."]);
?>
