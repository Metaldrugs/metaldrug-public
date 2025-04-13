<?php
// send_approval_email.php
// Summary:
// Centralized function to send approval email for Tier 2 access.
// Called by both MDC and FDC Tier 2 approval processors.

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

function sendApprovalEmail($token, $tierLabel = "FDC Tier 2") {
    $email = extractEmailFromToken($token);
    if (!$email) return;

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'metaldrugcomplex@gmail.com';
        $mail->Password = 'piqb syrp pssj hnev'; // Gmail app password
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('metaldrugcomplex@gmail.com', 'MDC Platform Access');
        $mail->addAddress($email);
        $mail->Subject = "$tierLabel Access Approved";
        $mail->Body = "Your NDA token ($token) has been approved for $tierLabel access.\n\nYou may now access the secure logic environment.";

        $mail->send();
    } catch (Exception $e) {
        error_log("Email error: {$mail->ErrorInfo}");
    }
}

function extractEmailFromToken($token) {
    $csvPath = __DIR__ . '/nda-submissions.csv';
    if (!file_exists($csvPath)) return null;

    $lines = file($csvPath);
    foreach ($lines as $line) {
        $fields = str_getcsv(trim($line));
        if (count($fields) < 2) continue;
        if ($fields[1] === $token) return $fields[2];
    }
    return null;
}
