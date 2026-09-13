<?php
// backend/api/site.php - Dynamic Site Settings & Showrooms API
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT key, value FROM site_settings");
    $raw = $stmt->fetchAll();
    $settings = [];
    foreach ($raw as $row) {
        $key = $row['key'];
        $val = $row['value'];
        if ($key === 'showrooms' || $key === 'social_links') {
            $settings[$key] = json_decode($val, true);
        } else {
            $settings[$key] = $val;
        }
    }
    send_json(['success' => true, 'data' => $settings]);
}

if ($method === 'POST' || $method === 'PUT') {
    require_admin_auth($pdo);
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !is_array($input)) {
        send_json(['success' => false, 'error' => 'Invalid JSON payload'], 400);
    }

    $stmt = $pdo->prepare("INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value");

    foreach ($input as $key => $value) {
        if (is_array($value)) {
            $value = json_encode($value);
        }
        $stmt->execute([$key, $value]);
    }

    send_json(['success' => true, 'message' => 'Site settings successfully updated']);
}

send_json(['success' => false, 'error' => 'Method not allowed'], 405);
