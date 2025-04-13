<?php
// submit_blueprint.php - Tier 1 blueprint upload handler

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$compoundType = trim($_POST['compound_type'] ?? '');
$logicLevel = trim($_POST['logic_level'] ?? '');
$notes = trim($_POST['notes'] ?? '');

if (!$name || !$email || !$compoundType || !$logicLevel) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit;
}

$timestamp = date('Y-m-d_H-i-s');
$filename = "blueprint_" . preg_replace('/[^a-zA-Z0-9]/', '_', $name) . "_$timestamp.txt";
$filepath = __DIR__ . "/../submissions/$filename";

$content = <<<EOT
Name: $name
Email: $email
Compound Type: $compoundType
Logic Level: $logicLevel
Notes: $notes
Submitted: $timestamp
EOT;

file_put_contents($filepath, $content);

echo json_encode(["success" => true]);
