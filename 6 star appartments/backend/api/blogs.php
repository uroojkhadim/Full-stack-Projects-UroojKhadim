<?php
// backend/api/blogs.php - Article Publishing System & Buyer Guides
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['id']) || isset($_GET['slug'])) {
        $where = isset($_GET['id']) ? "id = ?" : "slug = ?";
        $val = isset($_GET['id']) ? (int)$_GET['id'] : trim($_GET['slug']);

        $stmt = $pdo->prepare("SELECT * FROM blogs WHERE $where LIMIT 1");
        $stmt->execute([$val]);
        $blog = $stmt->fetch();

        if ($blog) {
            send_json(['success' => true, 'data' => $blog]);
        } else {
            send_json(['success' => false, 'error' => 'Article not found'], 404);
        }
    }

    $stmt = $pdo->query("SELECT * FROM blogs ORDER BY id DESC");
    $blogs = $stmt->fetchAll();
    send_json(['success' => true, 'data' => $blogs]);
}

if ($method === 'POST') {
    require_admin_auth($pdo);
    $d = json_decode(file_get_contents('php://input'), true);

    if (empty($d['title']) || empty($d['content'])) {
        send_json(['success' => false, 'error' => 'Title and content are required'], 400);
    }

    $title = trim($d['title']);
    $slug = !empty($d['slug']) ? trim($d['slug']) : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title))) . '-' . rand(100, 999);
    $category = $d['category'] ?? 'General';
    $excerpt = $d['excerpt'] ?? substr(strip_tags($d['content']), 0, 160) . '...';
    $content = $d['content'];
    $author = $d['author'] ?? '6 Star Editorial Team';
    $image = $d['image'] ?? '';
    $readTime = $d['read_time'] ?? '4 min read';

    $stmt = $pdo->prepare("
        INSERT INTO blogs (title, slug, category, excerpt, content, author, image, read_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$title, $slug, $category, $excerpt, $content, $author, $image, $readTime]);
    $newId = $pdo->lastInsertId();

    send_json(['success' => true, 'id' => $newId, 'message' => 'Article published successfully'], 201);
}

if ($method === 'PUT') {
    require_admin_auth($pdo);
    $d = json_decode(file_get_contents('php://input'), true);

    if (empty($d['id']) || empty($d['title'])) {
        send_json(['success' => false, 'error' => 'Article ID and title are required'], 400);
    }

    $id = (int)$d['id'];
    $title = trim($d['title']);
    $slug = !empty($d['slug']) ? trim($d['slug']) : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
    $category = $d['category'] ?? 'General';
    $excerpt = $d['excerpt'] ?? substr(strip_tags($d['content']), 0, 160) . '...';
    $content = $d['content'];
    $author = $d['author'] ?? '6 Star Editorial Team';
    $image = $d['image'] ?? '';
    $readTime = $d['read_time'] ?? '4 min read';

    $stmt = $pdo->prepare("
        UPDATE blogs SET 
            title = ?, slug = ?, category = ?, excerpt = ?, content = ?, author = ?, image = ?, read_time = ?
        WHERE id = ?
    ");
    $stmt->execute([$title, $slug, $category, $excerpt, $content, $author, $image, $readTime, $id]);

    send_json(['success' => true, 'message' => 'Article updated successfully']);
}

if ($method === 'DELETE') {
    require_admin_auth($pdo);
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if (!$id) {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
    }

    if (!$id) {
        send_json(['success' => false, 'error' => 'Article ID required'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM blogs WHERE id = ?");
    $stmt->execute([$id]);

    send_json(['success' => true, 'message' => 'Article deleted successfully']);
}

send_json(['success' => false, 'error' => 'Method not allowed'], 405);
