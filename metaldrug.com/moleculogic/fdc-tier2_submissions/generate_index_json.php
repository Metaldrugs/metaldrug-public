<?php
// File: C:\Users\Kunfirm\Downloads\MDC_Root\metaldrug.com\moleculogic\fdc-tier2_submissions\generate_index_json.php

/**
 * Summary:
 * Scans the current directory for all .json submission files
 * and outputs a JSON array as index.json for frontend display.
 *
 * Intended to be run manually or via cron.
 */

$directory = __DIR__;
$outputFile = $directory . '/index.json';
$submissionFiles = [];

foreach (scandir($directory) as $file) {
    if (pathinfo($file, PATHINFO_EXTENSION) === 'json' && $file !== 'index.json') {
        $submissionFiles[] = $file;
    }
}

file_put_contents($outputFile, json_encode(array_values($submissionFiles), JSON_PRETTY_PRINT));
echo "index.json updated with " . count($submissionFiles) . " submissions.\n";
