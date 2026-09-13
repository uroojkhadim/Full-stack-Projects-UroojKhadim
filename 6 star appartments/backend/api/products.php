<?php
// backend/api/products.php - Apartment Catalog Management API
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Single product lookup
    if (isset($_GET['id']) || isset($_GET['slug'])) {
        $where = isset($_GET['id']) ? "p.id = ?" : "p.slug = ?";
        $val = isset($_GET['id']) ? (int)$_GET['id'] : trim($_GET['slug']);
        $cacheKey = 'product_single_' . md5($where . '_' . $val);

        $cached = cache_get($cacheKey);
        if ($cached !== null) {
            send_json(['success' => true, 'data' => $cached]);
        }

        $stmt = $pdo->prepare("
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            WHERE $where
            LIMIT 1
        ");
        $stmt->execute([$val]);
        $prod = $stmt->fetch();

        if ($prod) {
            $prod['amenities'] = json_decode($prod['amenities'] ?: '[]', true);
            $prod['images'] = json_decode($prod['images'] ?: '[]', true);
            cache_set($cacheKey, $prod, 600);
            send_json(['success' => true, 'data' => $prod]);
        } else {
            send_json(['success' => false, 'error' => 'Apartment not found'], 404);
        }
    }

    $cacheKey = 'products_list_' . md5(json_encode($_GET));
    $cached = cache_get($cacheKey);
    if ($cached !== null) {
        send_json(['success' => true, 'data' => $cached]);
    }

    // Filterable list
    $conditions = ["1=1"];
    $params = [];

    if (!empty($_GET['category_id'])) {
        $conditions[] = "p.category_id = ?";
        $params[] = (int)$_GET['category_id'];
    }

    if (!empty($_GET['category_slug'])) {
        $conditions[] = "c.slug = ?";
        $params[] = trim($_GET['category_slug']);
    }

    if (!empty($_GET['bedrooms'])) {
        $conditions[] = "p.bedrooms = ?";
        $params[] = (int)$_GET['bedrooms'];
    }

    if (!empty($_GET['featured'])) {
        $conditions[] = "p.is_featured = 1";
    }

    if (!empty($_GET['search'])) {
        $term = '%' . trim($_GET['search']) . '%';
        $conditions[] = "(p.title LIKE ? OR p.description LIKE ? OR p.view_type LIKE ?)";
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
    }

    $whereClause = implode(" AND ", $conditions);

    $sql = "
        SELECT p.*, c.name as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE $whereClause
        ORDER BY p.is_featured DESC, p.id ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    foreach ($products as &$p) {
        $p['amenities'] = json_decode($p['amenities'] ?: '[]', true);
        $p['images'] = json_decode($p['images'] ?: '[]', true);
    }

    cache_set($cacheKey, $products, 300);
    send_json(['success' => true, 'data' => $products]);
}

if ($method === 'POST') {
    require_admin_auth($pdo);
    $d = json_decode(file_get_contents('php://input'), true);

    if (empty($d['title']) || empty($d['category_id']) || !isset($d['price'])) {
        send_json(['success' => false, 'error' => 'Title, category_id, and price are required'], 400);
    }

    $title = trim($d['title']);
    $slug = !empty($d['slug']) ? trim($d['slug']) : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title))) . '-' . rand(100, 999);
    $categoryId = (int)$d['category_id'];
    $desc = $d['description'] ?? '';
    $price = (float)$d['price'];
    $priceType = $d['price_type'] ?? 'night';
    $area = (int)($d['area_sqft'] ?? 0);
    $beds = (int)($d['bedrooms'] ?? 1);
    $baths = (float)($d['bathrooms'] ?? 1);
    $view = $d['view_type'] ?? 'City View';
    $floor = $d['floor'] ?? 'High Floor';
    $status = $d['status'] ?? 'available';
    $featured = !empty($d['is_featured']) ? 1 : 0;
    $amenities = is_array($d['amenities']) ? json_encode($d['amenities']) : ($d['amenities'] ?? '[]');
    $images = is_array($d['images']) ? json_encode($d['images']) : ($d['images'] ?? '[]');

    $stmt = $pdo->prepare("
        INSERT INTO products 
        (category_id, title, slug, description, price, price_type, area_sqft, bedrooms, bathrooms, view_type, floor, status, is_featured, amenities, images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$categoryId, $title, $slug, $desc, $price, $priceType, $area, $beds, $baths, $view, $floor, $status, $featured, $amenities, $images]);
    $newId = $pdo->lastInsertId();

    cache_flush('product');
    send_json(['success' => true, 'id' => $newId, 'message' => 'Apartment created successfully'], 201);
}

if ($method === 'PUT') {
    require_admin_auth($pdo);
    $d = json_decode(file_get_contents('php://input'), true);

    if (empty($d['id'])) {
        send_json(['success' => false, 'error' => 'Apartment ID is required'], 400);
    }

    $id = (int)$d['id'];
    $title = trim($d['title']);
    $slug = !empty($d['slug']) ? trim($d['slug']) : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
    $categoryId = (int)$d['category_id'];
    $desc = $d['description'] ?? '';
    $price = (float)$d['price'];
    $priceType = $d['price_type'] ?? 'night';
    $area = (int)($d['area_sqft'] ?? 0);
    $beds = (int)($d['bedrooms'] ?? 1);
    $baths = (float)($d['bathrooms'] ?? 1);
    $view = $d['view_type'] ?? 'City View';
    $floor = $d['floor'] ?? 'High Floor';
    $status = $d['status'] ?? 'available';
    $featured = !empty($d['is_featured']) ? 1 : 0;
    $amenities = is_array($d['amenities']) ? json_encode($d['amenities']) : ($d['amenities'] ?? '[]');
    $images = is_array($d['images']) ? json_encode($d['images']) : ($d['images'] ?? '[]');

    $stmt = $pdo->prepare("
        UPDATE products SET 
            category_id = ?, title = ?, slug = ?, description = ?, price = ?, price_type = ?, 
            area_sqft = ?, bedrooms = ?, bathrooms = ?, view_type = ?, floor = ?, status = ?, 
            is_featured = ?, amenities = ?, images = ?
        WHERE id = ?
    ");
    $stmt->execute([$categoryId, $title, $slug, $desc, $price, $priceType, $area, $beds, $baths, $view, $floor, $status, $featured, $amenities, $images, $id]);

    cache_flush('product');
    send_json(['success' => true, 'message' => 'Apartment updated successfully']);
}

if ($method === 'DELETE') {
    require_admin_auth($pdo);
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if (!$id) {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
    }

    if (!$id) {
        send_json(['success' => false, 'error' => 'Apartment ID required'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$id]);

    cache_flush('product');
    send_json(['success' => true, 'message' => 'Apartment deleted successfully']);
}

send_json(['success' => false, 'error' => 'Method not allowed'], 405);
