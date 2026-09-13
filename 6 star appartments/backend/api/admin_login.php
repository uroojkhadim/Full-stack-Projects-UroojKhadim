<?php
// backend/api/admin_login.php - Admin Authentication & Session Management
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $admin = require_admin_auth($pdo);
    send_json([
        'success' => true,
        'user' => [
            'id' => $admin['id'],
            'username' => $admin['username'],
            'role' => $admin['role']
        ]
    ]);
}

if ($method === 'POST') {
    $action = $_GET['action'] ?? 'login';
    $d = json_decode(file_get_contents('php://input'), true);

    if ($action === 'logout') {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
        if (preg_match('/Bearer\s(\S+)/', $auth, $matches)) {
            $stmt = $pdo->prepare("UPDATE admins SET token = NULL WHERE token = ?");
            $stmt->execute([$matches[1]]);
        }
        send_json(['success' => true, 'message' => 'Logged out successfully']);
    }

    // Login process
    if (empty($d['username']) || empty($d['password'])) {
        send_json(['success' => false, 'error' => 'Username and password are required'], 400);
    }

    $username = trim($d['username']);
    $password = $d['password'];

    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ? LIMIT 1");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        send_json(['success' => false, 'error' => 'Invalid username or password'], 401);
    }

    // Generate token
    $token = bin2hex(random_bytes(32));
    $up = $pdo->prepare("UPDATE admins SET token = ? WHERE id = ?");
    $up->execute([$token, $admin['id']]);

    send_json([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $admin['id'],
            'username' => $admin['username'],
            'role' => $admin['role']
        ],
        'message' => 'Login successful'
    ]);
}

if ($method === 'PUT') {
    $admin = require_admin_auth($pdo);
    $d = json_decode(file_get_contents('php://input'), true);

    if (empty($d['new_password'])) {
        send_json(['success' => false, 'error' => 'New password is required'], 400);
    }

    $newHash = password_hash($d['new_password'], PASSWORD_BCRYPT);
    $up = $pdo->prepare("UPDATE admins SET password_hash = ? WHERE id = ?");
    $up->execute([$newHash, $admin['id']]);

    send_json(['success' => true, 'message' => 'Password updated successfully']);
}

send_json(['success' => false, 'error' => 'Method not allowed'], 405);
