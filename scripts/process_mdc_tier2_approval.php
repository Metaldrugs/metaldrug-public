<?php
// process_mdc_tier2_approval.php
// Summary:
// Handles admin approval or rejection of MDC Tier 2 logic submissions.
// Expects JSON payload with "token" and "decision" (approve/reject).
// Logs the outcome and optionally triggers approval email.

header("Content-Type: application/json");

// Read raw POST input
$input = json_decode(file_get_contents('php://input'), true);
$token = $input['token'] ?? '';
$decision = $input['decision'] ?? '';

if (!$token || !in_array($decision, ['approve', 'reject'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
    exit;
}

// Define log path
$logFile = __DIR__ . '/logs/mdc_tier2_approval_log_' . date('Y-m-d') . '.txt';
$timestamp = date('Y-m-d H:i:s');
$entry = "[$timestamp] Token: $token | Decision: $decision\n";
file_put_contents($logFile, $entry, FILE_APPEND);

// Optional email trigger for approvals only
if ($decision === 'approve') {
    require_once __DIR__ . '/send_approval_email.php';
    sendApprovalEmail($token, "MDC Tier 2");
}

echo json_encode(["status" => "success", "message" => "Decision recorded."]);
