<?php
// update_submission_status.php
// Summary:
// Receives JSON input for FDC Tier 2 submission review.
// Updates CSV row for submission_id, sets status, appends notes.
// Sends automated email to submitter with result.

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../../nda_handler/PHPMailer/src/Exception.php';
require __DIR__ . '/../../nda_handler/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/../../nda_handler/PHPMailer/src/SMTP.php';

$input = json_decode(file_get_contents('php://input'), true);
$submissionId = $input['submission_id'] ?? '';
$newStatus = $input['status'] ?? '';
$reviewNotes = $input['notes'] ?? '';

if (!$submissionId || !$newStatus) {
    http_response_code(400);
    echo "Missing submission ID or status.";
    exit;
}

$csvPath = __DIR__ . '/fdc_submissions.csv';
$tempPath = __DIR__ . '/fdc_submissions_temp.csv';

$updated = false;
$handle = fopen($csvPath, 'r');
$tempHandle = fopen($tempPath, 'w');

if (!$handle || !$tempHandle) {
    http_response_code(500);
    echo "Unable to open submission log.";
    exit;
}

$header = fgetcsv($handle);
fputcsv($tempHandle, $header); // keep header

while (($row = fgetcsv($handle)) !== false) {
    if ($row[0] === $submissionId) {
        $row[4] = $newStatus;
        $row[5] = $reviewNotes;
        $recipientEmail = $row[3];
        $recipientName = $row[2];
        $updated = true;
    }
    fputcsv($tempHandle, $row);
}

fclose($handle);
fclose($tempHandle);

if ($updated) {
    rename($tempPath, $csvPath);

    // Notify submitter
    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'metaldrugcomplex@gmail.com';
        $mail->Password = 'piqb syrp pssj hnev'; // App password
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('metaldrugcomplex@gmail.com', 'FDC Tier 2 Review');
        $mail->addAddress($recipientEmail, $recipientName);
        $mail->Subject = "FDC Tier 2 Review: $newStatus";
        $mail->Body = "Dear $recipientName,\n\nYour submission for FDC Tier 2 review has been marked as: $newStatus.\n\nReviewer Notes:\n$reviewNotes\n\nThank you for contributing to Moleculogic.";

        $mail->send();
        echo "Review processed and notification sent.";
    } catch (Exception $e) {
        http_response_code(500);
        echo "Error sending email: " . $mail->ErrorInfo;
    }
} else {
    unlink($tempPath);
    http_response_code(404);
    echo "Submission not found.";
}
?>
