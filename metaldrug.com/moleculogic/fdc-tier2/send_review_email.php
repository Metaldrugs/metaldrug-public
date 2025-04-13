<?php
// send_review_email.php
// Summary: Sends approval/rejection notification to user regarding their FDC Tier 2 submission.

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../../../nda_handler/PHPMailer/src/Exception.php';
require __DIR__ . '/../../../nda_handler/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/../../../nda_handler/PHPMailer/src/SMTP.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(403);
  echo "Unauthorized request.";
  exit;
}

// Extract input
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$status = $data['status'] ?? '';
$review_notes = $data['notes'] ?? '';

// Validate
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !in_array($status, ['approved', 'rejected'])) {
  http_response_code(422);
  echo "Invalid submission data.";
  exit;
}

// Setup PHPMailer
$mail = new PHPMailer(true);

try {
  $mail->isSMTP();
  $mail->Host = 'smtp.gmail.com';
  $mail->SMTPAuth = true;
  $mail->Username = 'metaldrugcomplex@gmail.com';
  $mail->Password = 'piqb syrp pssj hnev'; // Gmail App Password
  $mail->SMTPSecure = 'tls';
  $mail->Port = 587;

  $mail->setFrom('metaldrugcomplex@gmail.com', 'FDC Tier 2 Review');
  $mail->addAddress($email);

  $subject = $status === 'approved' ? "Your FDC Tier 2 Submission Has Been Approved" : "Your FDC Tier 2 Submission Has Been Rejected";
  $body = "Hello,\n\nYour recent submission to the FDC Tier 2 review system has been **$status**.\n\nReviewer Notes:\n$review_notes\n\nIf approved, your submission will proceed to internal validation. If rejected, you may revise and resubmit.\n\n- Moleculogic Review Team";

  $mail->Subject = $subject;
  $mail->Body = $body;

  $mail->send();
  echo "Email sent successfully.";
} catch (Exception $e) {
  http_response_code(500);
  echo "Mailer Error: " . $mail->ErrorInfo;
}
?>
