<?php
// fdc_admin_loader.php
// Summary:
// Returns all FDC Tier 2 pending submissions (JSON format) from 'pending' directory.

$pendingDir = __DIR__ . '/pending/';
$response = [];

foreach (glob($pendingDir . '*.json') as $filePath) {
    $filename = basename($filePath);
    $content = file_get_contents($filePath);
    $response[] = [
        'name' => $filename,
        'content' => $content
    ];
}

header('Content-Type: application/json');
echo json_encode($response);
