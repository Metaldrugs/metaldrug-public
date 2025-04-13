<?php
// mdc_submission_handler.php
// Summary:
// Handles the submission of validated MDC Tier 1 blueprints for Tier 2 review.
// Saves to the server and logs metadata for administrative processing.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    echo "Invalid request method.";
    exit;
}

// Create submissions folder if it doesn't exist
$submissionDir = __DIR__ . '/submissions/';
if (!file_exists($submissionDir)) {
    mkdir($submissionDir, 0755, true);
}

// Get submitted data
$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['blueprint']) || !isset($data['metadata'])) {
    http_response_code(400);
    echo "Missing required blueprint or metadata.";
    exit;
}

$blueprint = $data['blueprint'];
$meta = $data['metadata'];

$filename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $meta['title']) . '_' . time() . '.json';
$filePath = $submissionDir . $filename;

file_put_contents($filePath, json_encode([
    'blueprint' => $blueprint,
    'metadata' => $meta,
    'submitted_at' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT));

echo json_encode(['status' => 'success', 'file' => $filename]);
