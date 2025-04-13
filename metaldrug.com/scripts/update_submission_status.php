<?php
// update_submission_status.php
// Summary:
// Accepts POST JSON: { file: "filename.json", status: "Approved"/"Rejected" }
// Appends or updates review metadata at the top of the file.

$input = json_decode(file_get_contents('php://input'), true);
$filename = basename($input['file']);
$status = $input['status'] ?? 'Unreviewed';

$dir = __DIR__ . "/logic_submissions/";
$fullPath = $dir . $filename;

// Verify file exists
if (!file_exists($fullPath)) {
    http_response_code(404);
    echo "File not found.";
    exit;
}

// Load and decode
$content = file_get_contents($fullPath);
$data = json_decode($content, true);

if (!is_array($data)) {
    http_response_code(500);
    echo "Invalid JSON.";
    exit;
}

// Inject review metadata
$data['_review'] = [
    'status' => $status,
    'reviewed_at' => date("Y-m-d H:i:s"),
    'reviewed_by' => 'admin'
];

// Save updated file
file_put_contents($fullPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
echo "Status updated to: $status";
