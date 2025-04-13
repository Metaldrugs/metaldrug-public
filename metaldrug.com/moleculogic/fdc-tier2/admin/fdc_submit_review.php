<?php
// File: C:\Users\Kunfirm\Downloads\MDC_Root\metaldrug.com\moleculogic\fdc-tier2\admin\fdc_submit_review.php
// Summary: Handles FDC Tier 2 review actions with optional notification

date_default_timezone_set('UTC');

$logFile = __DIR__ . '/fdc_review_log_' . date('Y-m-d') . '.txt';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Invalid request method.";
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';
$submissionId = $input['submissionId'] ?? '';
$comment = $input['comment'] ?? '';
$reviewer = $input['reviewer'] ?? 'unknown';

if (!$action || !$submissionId) {
    http_response_code(400);
    echo "Missing action or submission ID.";
    exit;
}

// Optional: Email alert
function sendReviewEmail($action, $submissionId, $comment, $reviewer) {
    $to = 'kunfirm@metaldrug.com';
    $subject = "FDC Tier 2 Review: $action";
    $message = "Submission ID: $submissionId\nReviewer: $reviewer\nAction: $action\n\nComment:\n$comment";
    $headers = 'From: noreply@metaldrug.com' . "\r\n";
    @mail($to, $subject, $message, $headers);
}

$logEntry = "[" . date('H:i:s') . "] Submission: $submissionId | Reviewer: $reviewer | Action: $action | Comment: $comment\n";
file_put_contents($logFile, $logEntry, FILE_APPEND);

// Uncomment to enable email notifications
// sendReviewEmail($action, $submissionId, $comment, $reviewer);

echo json_encode(["status" => "success", "message" => "FDC review recorded."]);
?>
