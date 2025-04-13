<?php
// check_token.php
// Verifies NDA token for Tier 1 access (MDC only)

header('Content-Type: application/json');

$token = $_POST['token'] ?? '';

if (!$token || strlen($token) < 6) {
    echo json_encode(["valid" => false, "message" => "Missing or invalid token."]);
    exit;
}

// Secure path to NDA registry
$registryFile = __DIR__ . '/../../nda_handler/upload/nda_registry.json';

if (!file_exists($registryFile)) {
    echo json_encode(["valid" => false, "message" => "NDA registry not found."]);
    exit;
}

$registry = json_decode(file_get_contents($registryFile), true);

if (!is_array($registry)) {
    echo json_encode(["valid" => false, "message" => "Corrupted registry file."]);
    exit;
}

$found = false;
foreach ($registry as $record) {
    if ($record['token'] === $token && $record['access'] === 'mdc-tier1') {
        $found = true;
        break;
    }
}

if ($found) {
    echo json_encode(["valid" => true, "message" => "Token accepted."]);
} else {
    echo json_encode(["valid" => false, "message" => "Token not authorized."]);
}
?>
