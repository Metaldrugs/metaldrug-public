<?php
// get_logic_fdc.php
//
// Summary:
// Loads and returns the contents of a pending FDC logic file for admin preview

header('Content-Type: application/json');

$filename = $_GET['file'] ?? '';
$path = __DIR__ . '/pending/' . basename($filename);

if (!file_exists($path)) {
    http_response_code(404);
    echo json_encode(['error' => 'File not found']);
    exit;
}

$content = file_get_contents($path);
echo $content;
?>
