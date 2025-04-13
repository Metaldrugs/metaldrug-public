<?php
// fdc_submission_handler.php
// Handles submission of FDC blueprint logic + overlays from Moleculogic Tier 1

header('Content-Type: application/json');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Only POST requests allowed."]);
    exit;
}

// Parse incoming data
$data = json_decode(file_get_contents('php://input'), true);
$blueprint = $data['blueprint'] ?? null;
$overlay = $data['overlay'] ?? null;
$email = $data['email'] ?? 'unknown';

// Validate structure
if (!$blueprint || !$overlay) {
    http_response_code(400);
    echo json_encode(["error" => "Missing blueprint or overlay data."]);
    exit;
}

// Create submission folder if needed
$savePath = __DIR__ . '/fdc_submissions';
if (!is_dir($savePath)) {
    mkdir($savePath, 0775, true);
}

// File naming
$timestamp = date('Ymd_His');
$filename = "$savePath/fdc_submission_{$timestamp}.json";

// Structure content
$submission = [
    "timestamp" => $timestamp,
    "submitted_by" => $email,
    "blueprint" => $blueprint,
    "overlay_scores" => $overlay
];

// Save file
file_put_contents($filename, json_encode($submission, JSON_PRETTY_PRINT));

// Basic log
file_put_contents("$savePath/fdc_submission_log.txt", "[$timestamp] Submission by $email\n", FILE_APPEND);

// Return confirmation
echo json_encode(["status" => "success", "message" => "FDC blueprint submitted", "file" => basename($filename)]);
