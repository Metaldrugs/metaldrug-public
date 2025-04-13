<?php
// delete_logic_fdc.php
//
// Summary:
// Permanently deletes a logic submission from 'pending'. Does NOT touch approved files.

$filename = $_POST['file'] ?? '';
$target = __DIR__ . '/pending/' . basename($filename);

if (!file_exists($target)) {
    http_response_code(404);
    echo "Error: File not found.";
    exit;
}

if (!unlink($target)) {
    http_response_code(500);
    echo "Error: Could not delete file.";
    exit;
}

echo "Logic deleted successfully.";
?>
