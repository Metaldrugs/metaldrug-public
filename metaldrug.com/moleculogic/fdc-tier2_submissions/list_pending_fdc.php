<?php
// list_pending_fdc.php
//
// Summary:
// Scans pending folder and returns JSON list of unapproved FDC Tier 2 logic files

header('Content-Type: application/json');

$pendingDir = __DIR__ . '/pending';
if (!is_dir($pendingDir)) {
    echo json_encode([]);
    exit;
}

$files = array_values(array_filter(scandir($pendingDir), function($file) use ($pendingDir) {
    return is_file($pendingDir . '/' . $file) && pathinfo($file, PATHINFO_EXTENSION) === 'json';
}));

echo json_encode($files);
?>
