<?php
// approve_logic_fdc.php
// Summary:
// Moves approved FDC logic file from 'pending/' to 'approved/' and logs the action.

$logicName = $_POST['name'] ?? '';

if (!$logicName || !preg_match('/^[a-zA-Z0-9_\-]+\.json$/', $logicName)) {
    http_response_code(400);
    echo "Invalid file name.";
    exit;
}

$pending = __DIR__ . '/pending/' . $logicName;
$approved = __DIR__ . '/approved/' . $logicName;

if (!file_exists($pending)) {
    http_response_code(404);
    echo "File not found in pending.";
    exit;
}

if (!rename($pending, $approved)) {
    http_response_code(500);
    echo "Error moving file.";
    exit;
}

file_put_contents(
    __DIR__ . '/approval_log.txt',
    "[" . date('Y-m-d H:i:s') . "] Approved: $logicName\n",
    FILE_APPEND
);

echo "Approved successfully.";
