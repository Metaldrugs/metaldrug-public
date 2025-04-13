<?php
// reject_logic_fdc.php
// Summary:
// Deletes a pending FDC logic file and logs rejection.

$logicName = $_POST['name'] ?? '';

if (!$logicName || !preg_match('/^[a-zA-Z0-9_\-]+\.json$/', $logicName)) {
    http_response_code(400);
    echo "Invalid file name.";
    exit;
}

$pendingPath = __DIR__ . '/pending/' . $logicName;

if (!file_exists($pendingPath)) {
    http_response_code(404);
    echo "File not found in pending.";
    exit;
}

if (!unlink($pendingPath)) {
    http_response_code(500);
    echo "Error deleting file.";
    exit;
}

file_put_contents(
    __DIR__ . '/rejection_log.txt',
    "[" . date('Y-m-d H:i:s') . "] Rejected: $logicName\n",
    FILE_APPEND
);

echo "Rejected successfully.";
