<?php
// File: C:\Users\Kunfirm\Downloads\MDC_Root\metaldrug.com\moleculogic\mdc-tier2\admin\mdc_submit_review.php
// Summary: Handles MDC Tier 2 review actions (approve/reject) and logs reviewer decisions.

$logDir = __DIR__ . '/../../mdc-tier2/logs';
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

// Basic HTTP authentication
if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW']) ||
    $_SERVER['PHP_AUTH_USER'] !== 'admin' ||
    !password_verify($_SERVER['PHP_AUTH_PW'], '$apr1$jnk8bt37$Qg.2Hwj/72MyNkL6VXVPg1')) {
    header('WWW-Authenticate: Basic realm="Restricted"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Unauthorized access';
    exit;
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $blueprintName = $_POST['blueprint_name'] ?? 'Unnamed';
    $reviewer = $_POST['reviewer'] ?? 'anonymous';
    $status = $_POST['status'] ?? 'undecided';
    $notes = $_POST['notes'] ?? '';

    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] Reviewer: $reviewer | Blueprint: $blueprintName | Status: $status | Notes: $notes\n";
    file_put_contents("$logDir/mdc_review_log.txt", $logEntry, FILE_APPEND);

    echo "<p>✅ Review recorded successfully.</p>";
    echo "<p><a href='mdc_review_panel.html'>Back to Review Panel</a></p>";
} else {
    echo "<p>Invalid request.</p>";
}
?>
