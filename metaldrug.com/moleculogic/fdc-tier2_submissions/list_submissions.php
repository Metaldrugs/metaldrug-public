<?php
// list_submissions.php
// Summary:
// Scans the FDC Tier 2 submissions directory and returns a list of pending .json files for admin review.

header('Content-Type: application/json');

// Define path to pending logic files
$submissionDir = __DIR__ . '/pending/';
$baseUrl = '/metaldrug.com/moleculogic/fdc-tier2_submissions/pending/';

// Check if directory exists
if (!is_dir($submissionDir)) {
    http_response_code(500);
    echo json_encode(["error" => "Submission directory not found"]);
    exit;
}

// Get list of JSON files
$files = array_values(array_filter(scandir($submissionDir), function ($file) use ($submissionDir) {
    return pathinfo($file, PATHINFO_EXTENSION) === 'json' && is_file($submissionDir . $file);
}));

// Return public URLs
$fullUrls = array_map(function ($filename) use ($baseUrl) {
    return $baseUrl . $filename;
}, $files);

echo json_encode($fullUrls);
