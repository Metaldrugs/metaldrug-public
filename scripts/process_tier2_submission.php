<?php
// process_tier2_submission.php
// Accepts MDC Tier 2 blueprint logic submissions and stores securely

header("Content-Type: application/json");
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode(["status" => "error", "message" => "Invalid request method."]);
  exit;
}

// Read JSON body
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data['name'])) {
  http_response_code(400);
  echo json_encode(["status" => "error", "message" => "Invalid or missing blueprint data."]);
  exit;
}

// Setup destination
$logDir = __DIR__ . "/../tier2_submissions/";
if (!file_exists($logDir)) {
  mkdir($logDir, 0777, true);
}
$filename = $logDir . "mdc_tier2_" . date("Y-m-d") . ".jsonl";

// Append entry
$entry = [
  "timestamp" => date("Y-m-d H:i:s"),
  "ip" => $_SERVER['REMOTE_ADDR'],
  "blueprint" => $data
];
file_put_contents($filename, json_encode($entry) . PHP_EOL, FILE_APPEND);

// Optional email alert
$to = "kunfirm@metaldrug.com";
$subject = "New MDC Tier 2 Submission: " . $data["name"];
$message = "New submission received at " . date("Y-m-d H:i:s") . "\n\nName: " . $data["name"] . "\nIP: " . $_SERVER['REMOTE_ADDR'];
$headers = "From: tier2@metaldrug.com";
mail($to, $subject, $message, $headers);

// Return confirmation
echo json_encode(["status" => "success", "message" => "Blueprint received. Awaiting admin review."]);
?>
