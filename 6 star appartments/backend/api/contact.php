<?php
// backend/api/contact.php - Customer Contact & Inquiry Logger
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    require_admin_auth($pdo);
    $stmt = $pdo->query("SELECT * FROM inquiries ORDER BY id DESC");
    $inquiries = $stmt->fetchAll();
    send_json(['success' => true, 'data' => $inquiries]);
}

if ($method === 'POST') {
    $d = json_decode(file_get_contents('php://input'), true);

    if (empty($d['name']) || empty($d['message'])) {
        send_json(['success' => false, 'error' => 'Name and message are required fields'], 400);
    }

    if (empty($d['email']) && empty($d['phone'])) {
        send_json(['success' => false, 'error' => 'Please provide either an email or phone number for us to reply'], 400);
    }

    $name = trim($d['name']);
    $email = trim($d['email'] ?? '');
    $phone = trim($d['phone'] ?? '');
    $subject = trim($d['subject'] ?? 'General Apartment Inquiry');
    $message = trim($d['message']);

    $stmt = $pdo->prepare("INSERT INTO inquiries (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $phone, $subject, $message]);
    $newId = $pdo->lastInsertId();

    send_json([
        'success' => true,
        'id' => $newId,
        'message' => 'Thank you for your message. A 6 Star luxury concierge specialist will contact you shortly.'
    ], 201);
}

if ($method === 'PUT') {
    require_admin_auth($pdo);
    $d = json_decode(file_get_contents('php://input'), true);

    if (empty($d['id']) || empty($d['status'])) {
        send_json(['success' => false, 'error' => 'Inquiry ID and status are required'], 400);
    }

    $id = (int)$d['id'];
    $status = trim($d['status']);

    $stmt = $pdo->prepare("UPDATE inquiries SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);

    send_json(['success' => true, 'message' => 'Inquiry status updated successfully']);
}

if ($method === 'DELETE') {
    require_admin_auth($pdo);
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if (!$id) {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
    }

    if (!$id) {
        send_json(['success' => false, 'error' => 'Inquiry ID required'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM inquiries WHERE id = ?");
    $stmt->execute([$id]);

    send_json(['success' => true, 'message' => 'Inquiry deleted successfully']);
}

send_json(['success' => false, 'error' => 'Method not allowed'], 405);
