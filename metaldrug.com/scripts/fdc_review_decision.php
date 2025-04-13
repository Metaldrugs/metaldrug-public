<?php
// fdc_review_decision.php
// Summary:
// Backend processor for FDC Tier 2 review actions. Accepts index, new status, and reviewer notes,
// updates the JSON file, and sends email notification to admin.

$submissionFile = __DIR__ . '/fdc_tier2_submissions.json';
$logFile = __DIR__ . '/fdc_tier2_review_log.txt';

// Read input
$data = json_decode(file_get_contents("php://input"), true);
$index = $data['index'];
$newStatus = $data['newStatus'];
$notes = trim($data['notes'] ?? '');

// Load existing submissions
$submissions = json_decode(file_get_contents($submissionFile), true);

if (!isset($submissions[$index])) {
  http_response_code(400);
  echo "Invalid submission index.";
  exit;
}

// Update submission
$submissions[$index]['status'] = $newStatus;
$submissions[$index]['review_notes'] = $notes;
$submissions[$index]['reviewed_at'] = date("Y-m-d H:i:s");

// Save back to file
file_put_contents($submissionFile, json_encode($submissions, JSON_PRETTY_PRINT));

// Log review
file_put_contents($logFile, "[" . date("Y-m-d H:i:s") . "] Reviewed submission #$index | Status: $newStatus | Notes: $notes\n", FILE_APPEND);

// Email alert
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require __DIR__ . '/../../nda_handler/PHPMailer/src/Exception.php';
require __DIR__ . '/../../nda_handler/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/../../nda_handler/PHPMailer/src/SMTP.php';

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
    $mail->addAddress('kunfirm@metaldrug.com');

    $mail->Subject = "Tier 2 FDC Submission Review: $newStatus";
    $mail->Body = "Review decision:\n\nStatus: $newStatus\nNotes: $notes\n\nSubmission:\n" . json_encode($submissions[$index], JSON_PRETTY_PRINT);

    $mail->send();
    echo "Review saved and email sent.";
} catch (Exception $e) {
    echo "Review saved but email failed: {$mail->ErrorInfo}";
}
