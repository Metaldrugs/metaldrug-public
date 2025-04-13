<?php
// process_review_action_mdc.php
// Summary: Handles admin review decisions for MDC Tier 2 submissions (approve or reject)
// Sends email notification and logs the result to MDC review logs

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

$id = $input['id'] ?? null;
$status = $input['status'] ?? null;
$comment = $input['comment'] ?? '';

if (!$id || !$status || !in_array($status, ['approved', 'rejected'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid input.']);
    exit;
}

// Path to MDC submissions
$submissionDir = __DIR__ . '/../data/submissions_mdc/';
$filePath = $submissionDir . basename($id);

if (!file_exists($filePath)) {
    echo json_encode(['success' => false, 'error' => 'Submission file not found.']);
    exit;
}

$data = json_decode(file_get_contents($filePath), true);
$data['review'] = [
    'status' => $status,
    'comment' => $comment,
    'reviewed_at' => date('Y-m-d H:i:s')
];

file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));

// Log review result
$logEntry = "[" . date('Y-m-d H:i:s') . "] ID: $id | Status: $status | Comment: $comment\n";
file_put_contents(__DIR__ . '/../logs/mdc_review_log.txt', $logEntry, FILE_APPEND);

// Optional email to submitter
$recipient = $data['metadata']['submitter_email'] ?? '';
if ($recipient) {
    $subject = "Your MDC Tier 2 Submission Was $status";
    $body = "Hello,\n\nYour submission (ID: $id) has been $status.\n\nComment: $comment\n\n- Kunfirm Review Team";

    $headers = 'From: review@metaldrug.com' . "\r\n" .
               'Reply-To: review@metaldrug.com' . "\r\n" .
               'X-Mailer: PHP/' . phpversion();

    mail($recipient, $subject, $body, $headers);
}

echo json_encode(['success' => true]);
