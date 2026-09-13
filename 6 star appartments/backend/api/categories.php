<?php
// backend/api/categories.php - Dynamic Apartment Categories API
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("
        SELECT c.*, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id
        ORDER BY c.id ASC
    ");
    $categories = $stmt->fetchAll();
    send_json(['success' => true, 'data' => $categories]);
}

if ($method === 'POST') {
    require_admin_auth($pdo);
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['name'])) {
        send_json(['success' => false, 'error' => 'Category name is required'], 400);
    }

    $name = trim($data['name']);
    $slug = !empty($data['slug']) ? trim($data['slug']) : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
    $desc = $data['description'] ?? '';
    $image = $data['image'] ?? '';

    $stmt = $pdo->prepare("INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $slug, $desc, $image]);
    $newId = $pdo->lastInsertId();

    send_json(['success' => true, 'id' => $newId, 'message' => 'Category created successfully'], 201);
}

if ($method === 'PUT') {
    require_admin_auth($pdo);
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['id']) || empty($data['name'])) {
        send_json(['success' => false, 'error' => 'ID and category name are required'], 400);
    }

    $id = (int)$data['id'];
    $name = trim($data['name']);
    $slug = !empty($data['slug']) ? trim($data['slug']) : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
    $desc = $data['description'] ?? '';
    $image = $data['image'] ?? '';

    $stmt = $pdo->prepare("UPDATE categories SET name = ?, slug = ?, description = ?, image = ? WHERE id = ?");
    $stmt->execute([$name, $slug, $desc, $image, $id]);

    send_json(['success' => true, 'message' => 'Category updated successfully']);
}

if ($method === 'DELETE') {
    require_admin_auth($pdo);
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if (!$id) {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
    }

    if (!$id) {
        send_json(['success' => false, 'error' => 'Category ID required'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
    $stmt->execute([$id]);

    send_json(['success' => true, 'message' => 'Category deleted successfully']);
}

send_json(['success' => false, 'error' => 'Method not allowed'], 405);
