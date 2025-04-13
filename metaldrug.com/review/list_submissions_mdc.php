<?php
// list_submissions_mdc.php
// Summary:
// Scans the /data/submissions_mdc/ directory and returns JSON array of all submission filenames.

$dir = __DIR__ . '/../../data/submissions_mdc/';
$files = [];

if (is_dir($dir)) {
    foreach (scandir($dir) as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'json') {
            $files[] = $file;
        }
    }
}

header('Content-Type: application/json');
echo json_encode($files);
