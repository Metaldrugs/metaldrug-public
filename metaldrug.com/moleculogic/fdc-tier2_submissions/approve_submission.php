<?php
// approve_submission.php
// Summary:
// Moves a selected FDC Tier 2 submission from the pending directory to the approved directory.

header('Content-Type: application/json');

// Define folder paths
$baseDir = __DIR__;
$pendingDir = $baseDir . '/pending/';
$approvedDir = $baseDir . '/approved/';

// Validate input
$data = json_decode(file_get_contents("php://input"), true);
$filename = $data['filename'] ?? '';

if (!$filename || !preg_match('/^[a-zA-Z0-9_\-\.]+\.json$/', $filename)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid filename"]);
    exit;
}

// Check if file exists
$sourcePath = $pendingDir . $filename;
$destPath = $approvedDir . $filename;

if (!file_exists($sourcePath)) {
    http_response_code(404);
    echo json_encode(["error" => "File not found"]);
    exit;
}

// Attempt to move the file
if (!rename($sourcePath, $destPath)) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to move file"]);
    exit;
}

echo json_encode(["success" => true, "message" => "Submission approved"]);
