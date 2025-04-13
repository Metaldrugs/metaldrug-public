<?php
// process_review_action_fdc.php
// Summary:
// Mirrors the MDC review system for FDC Tier 2 reviews. Handles approve/reject actions and sends automated notification to submitter via email.

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../scripts/PHPMailer/src/Exception.php';
require __DIR__ . '/../scripts/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/../scripts/PHPMailer/src/SMTP.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? '';
$status = $data['status'] ?? '';
$comment = $data['comment'] ?? '';

if (!$id || !in_array($status, ['approved', 'rejected'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid input']);
  exit;
}

$filepath = __DIR__ . "/../data/submissions_fdc/{$id}.json";
if (!file_exists($filepath)) {
  http_response_code(404);
  echo json_encode(['error' => 'Submission not found']);
  exit;
}

$submission = json_decode(file_get_contents($filepath), true);
$email = $submission['metadata']['email'] ?? '';
$name = $submission['metadata']['name'] ?? 'User';

$statusText = $status === 'approved' ? "APPROVED" : "REJECTED";
$messageBody = "Dear $name,\n\nYour FDC submission ID: $id has been $statusText.\n\nComment:\n$comment\n\nThank you for your contribution.\n\n- FDC Review Team";

// Update submission status in file
$submission['review'] = [
  'status' => $status,
  'comment' => $comment,
  'timestamp' => date('Y-m-d H:i:s')
];
file_put_contents($filepath, json_encode($submission, JSON_PRETTY_PRINT));

// Send email notification
$mail = new PHPMailer(true);
try {
  $mail->isSMTP();
  $mail->Host = 'smtp.gmail.com';
  $mail->SMTPAuth = true;
  $mail->Username = 'metaldrugcomplex@gmail.com';
  $mail->Password = 'piqb syrp pssj hnev';
  $mail->SMTPSecure = 'tls';
  $mail->Port = 587;

  $mail->setFrom('metaldrugcomplex@gmail.com', 'FDC Review System');
  $mail->addAddress($email, $name);
  $mail->Subject = "FDC Blueprint Review Result: $statusText";
  $mail->Body = $messageBody;

  $mail->send();
  echo json_encode(['success' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Email error: ' . $mail->ErrorInfo]);
}
