<?php
// fdc_submit_blueprint.php
// Handles FDC Tier 1 blueprint submissions from frontend.
// Receives JSON, validates structure, logs submission with timestamp + UUID.

header("Content-Type: application/json");
date_default_timezone_set("UTC");

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Invalid request method. POST only."]);
    exit;
}

// Read input
$data = json_decode(file_get_contents("php://input"), true);

// Validate structure
if (!isset($data['name']) || !isset($data['blueprint']) || !isset($data['submittedBy'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields."]);
    exit;
}

// Sanitize
$name = preg_replace('/[^a-zA-Z0-9_\- ]/', '', $data['name']);
$submittedBy = filter_var($data['submittedBy'], FILTER_SANITIZE_EMAIL);
$uuid = uniqid("fdc_", true);
$timestamp = date("Y-m-d H:i:s");

// Prepare log
$entry = [
    "id" => $uuid,
    "timestamp" => $timestamp,
    "name" => $name,
    "submittedBy" => $submittedBy,
    "blueprint" => $data['blueprint']
];

// Create directory if missing
$saveDir = __DIR__ . "/fdc-submissions";
if (!is_dir($saveDir)) {
    mkdir($saveDir, 0775, true);
}

// Save JSON
$savePath = "$saveDir/{$uuid}.json";
file_put_contents($savePath, json_encode($entry, JSON_PRETTY_PRINT));

// Respond
echo json_encode(["success" => true, "id" => $uuid, "saved" => basename($savePath)]);
?>
