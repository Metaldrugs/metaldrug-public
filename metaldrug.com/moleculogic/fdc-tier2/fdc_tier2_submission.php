<?php
// fdc_tier2_submission.php
// Summary: Receives validated FDC Tier 2 logic submissions, stores locally, logs metadata, and sends admin notification.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Method not allowed";
    exit;
}

// Extract payload
$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? 'Unknown';
$metadata = $data['metadata'] ?? [];
$content = $data['content'] ?? '';

$timestamp = date('Y-m-d_H-i-s');
$safeName = preg_replace("/[^a-zA-Z0-9_\-]/", "_", $name);
$filename = __DIR__ . "/submissions/{$safeName}_{$timestamp}.json";

$submission = [
    'name' => $name,
    'submitted_at' => date('c'),
    'metadata' => $metadata,
    'content' => $content
];

if (!is_dir(__DIR__ . '/submissions')) {
    mkdir(__DIR__ . '/submissions', 0755, true);
}

file_put_contents($filename, json_encode($submission, JSON_PRETTY_PRINT));

// Optionally: email admin (requires PHPMailer or basic mail)
$adminEmail = 'kunfirm@metaldrug.com';
$subject = "New FDC Tier 2 Submission: $name";
$body = "A new Tier 2 FDC logic file was submitted.\n\nFile: $filename\n\nMetadata:\n" . json_encode($metadata, JSON_PRETTY_PRINT);

mail($adminEmail, $subject, $body);

echo json_encode(['status' => 'success', 'filename' => basename($filename)]);
?>
