<?php
// submit_logic_fdc.php
//
// Summary:
// Receives Tier 2 FDC logic submissions via POST, validates NDA session,
// saves logic to pending folder with timestamped filename, logs the event.

session_start();
header('Content-Type: application/json');

// Confirm NDA token is stored in session
if (!isset($_SESSION['nda_token'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'NDA token missing']);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
if (!isset($input['filename']) || !isset($input['logic'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

$filename = preg_replace('/[^a-zA-Z0-9_\-]/', '', $input['filename']) . '_' . date('Ymd_His') . '.json';
$logic = $input['logic'];

$pendingDir = __DIR__ . '/pending';
if (!is_dir($pendingDir)) {
    mkdir($pendingDir, 0775, true);
}

file_put_contents($pendingDir . '/' . $filename, $logic);

// Log submission
$logFile = __DIR__ . '/fdc_submission_log.txt';
$logEntry = "[" . date('Y-m-d H:i:s') . "] FDC Tier 2 logic submitted: $filename (NDA: {$_SESSION['nda_token']})\n";
file_put_contents($logFile, $logEntry, FILE_APPEND);

echo json_encode(['success' => true, 'message' => 'Submitted successfully']);
?>
