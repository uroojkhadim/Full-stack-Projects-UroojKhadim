<?php
// Verify Google Identity Services ID tokens server-side and create a guest account.
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'error' => 'Method not allowed'], 405);
}

$payload = json_decode(file_get_contents('php://input'), true);
$id_token = trim($payload['credential'] ?? '');
$client_id = getenv('GOOGLE_CLIENT_ID') ?: ($_ENV['GOOGLE_CLIENT_ID'] ?? '');

if (!$id_token || !$client_id) {
    send_json(['success' => false, 'error' => 'Google sign-in is not configured on this server'], 503);
}

$ch = curl_init('https://oauth2.googleapis.com/tokeninfo?id_token=' . rawurlencode($id_token));
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 8,
    CURLOPT_SSL_VERIFYPEER => true,
]);
$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
$claims = json_decode($response ?: '', true);

if ($status !== 200 || !is_array($claims) || ($claims['aud'] ?? '') !== $client_id || empty($claims['sub']) || empty($claims['email']) || ($claims['email_verified'] ?? '') !== 'true') {
    send_json(['success' => false, 'error' => 'Google sign-in could not be verified'], 401);
}

$name = trim($claims['name'] ?? $claims['email']);
$picture = $claims['picture'] ?? null;
$stmt = $pdo->prepare('SELECT id, google_sub, name, email, picture FROM guests WHERE google_sub = ? OR email = ? LIMIT 1');
$stmt->execute([$claims['sub'], $claims['email']]);
$guest = $stmt->fetch();

if ($guest) {
    $update = $pdo->prepare('UPDATE guests SET google_sub = ?, name = ?, email = ?, picture = ?, last_login_at = CURRENT_TIMESTAMP WHERE id = ?');
    $update->execute([$claims['sub'], $name, $claims['email'], $picture, $guest['id']]);
    $guest = array_merge($guest, ['google_sub' => $claims['sub'], 'name' => $name, 'email' => $claims['email'], 'picture' => $picture]);
} else {
    $insert = $pdo->prepare('INSERT INTO guests (google_sub, name, email, picture) VALUES (?, ?, ?, ?)');
    $insert->execute([$claims['sub'], $name, $claims['email'], $picture]);
    $guest = [
        'id' => (int) $pdo->lastInsertId(),
        'google_sub' => $claims['sub'],
        'name' => $name,
        'email' => $claims['email'],
        'picture' => $picture,
    ];
}

send_json(['success' => true, 'user' => $guest]);
