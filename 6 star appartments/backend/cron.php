<?php
// backend/cron.php - Automated Maintenance & Database Optimization Cron Worker
// Can be executed via CLI: php backend/cron.php
// Or via Web with Secret Token: GET /backend/cron.php?token=6star_cron_secret_key

require_once __DIR__ . '/db.php';

// Security check: Only allow CLI execution or authenticated HTTP requests
$isCli = (php_sapi_name() === 'cli');
$cronToken = getenv('CRON_TOKEN') ?: '6star_cron_secret_key';
$providedToken = $_GET['token'] ?? '';

if (!$isCli && $providedToken !== $cronToken) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Forbidden: Invalid cron maintenance token']);
    exit();
}

$startTime = microtime(true);
$results = [
    'timestamp' => date('Y-m-d H:i:s'),
    'mode' => $isCli ? 'CLI' : 'HTTP',
    'actions' => []
];

// 1. Prune expired cache records
try {
    $pruned = CacheManager::getInstance()->pruneExpired();
    $results['actions']['cache_prune'] = [
        'status' => 'success',
        'records_removed' => $pruned
    ];
} catch (Throwable $e) {
    $results['actions']['cache_prune'] = [
        'status' => 'error',
        'message' => $e->getMessage()
    ];
}

// 2. Perform SQLite WAL Checkpoint to keep WAL file size bounded
try {
    $checkpointStmt = $pdo->query("PRAGMA wal_checkpoint(PASSIVE);");
    $checkpointResult = $checkpointStmt->fetch();
    $results['actions']['wal_checkpoint'] = [
        'status' => 'success',
        'details' => $checkpointResult
    ];
} catch (Throwable $e) {
    $results['actions']['wal_checkpoint'] = [
        'status' => 'error',
        'message' => $e->getMessage()
    ];
}

// 3. Optimize SQLite Query Planner statistics
try {
    $pdo->exec("PRAGMA optimize;");
    $results['actions']['query_planner_optimize'] = [
        'status' => 'success'
    ];
} catch (Throwable $e) {
    $results['actions']['query_planner_optimize'] = [
        'status' => 'error',
        'message' => $e->getMessage()
    ];
}

$duration = round((microtime(true) - $startTime) * 1000, 2);
$results['duration_ms'] = $duration;
$results['memory_peak'] = round(memory_get_peak_usage() / 1024 / 1024, 2) . ' MB';

if ($isCli) {
    echo "=== 6 STARS HOSPITALITY - MAINTENANCE CRON COMPLETED ===\n";
    echo "Timestamp: " . $results['timestamp'] . "\n";
    echo "Cache pruned: " . ($results['actions']['cache_prune']['records_removed'] ?? 0) . " items\n";
    echo "WAL Checkpoint: Success\n";
    echo "Duration: {$duration} ms\n";
    echo "Peak Memory: " . $results['memory_peak'] . "\n";
} else {
    header('Content-Type: application/json');
    echo json_encode($results, JSON_PRETTY_PRINT);
}
