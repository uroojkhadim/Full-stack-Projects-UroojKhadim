<?php
// backend/api/upload.php - Media/Image Upload Handler
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'error' => 'Method not allowed'], 405);
}

require_admin_auth($pdo);

if (empty($_FILES['file'])) {
    send_json(['success' => false, 'error' => 'No file was uploaded'], 400);
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    send_json(['success' => false, 'error' => 'Upload error code: ' . $file['error']], 400);
}

$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mime, $allowedTypes)) {
    send_json(['success' => false, 'error' => 'Invalid file type. Only JPEG, PNG, WEBP, and GIF images are permitted'], 400);
}

$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
if (!$ext) {
    $ext = 'jpg';
}

$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$safeFilename = 'img_' . date('Ymd_His') . '_' . substr(md5(uniqid(rand(), true)), 0, 8) . '.' . strtolower($ext);
$targetPath = $uploadDir . $safeFilename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    send_json(['success' => false, 'error' => 'Failed to save uploaded file on server'], 500);
}

$publicUrl = 'backend/uploads/' . $safeFilename;

send_json([
    'success' => true,
    'message' => 'Image uploaded successfully',
    'url' => $publicUrl,
    'filename' => $safeFilename
]);
