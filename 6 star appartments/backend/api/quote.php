<?php
// backend/api/quote.php - Quotation Engine & Calculation API
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Single quote by quote_number
    if (!empty($_GET['quote_number'])) {
        $stmt = $pdo->prepare("SELECT * FROM quotes WHERE quote_number = ? LIMIT 1");
        $stmt->execute([trim($_GET['quote_number'])]);
        $quote = $stmt->fetch();
        if ($quote) {
            $quote['add_ons'] = json_decode($quote['add_ons'] ?: '[]', true);
            send_json(['success' => true, 'data' => $quote]);
        } else {
            send_json(['success' => false, 'error' => 'Quotation not found'], 404);
        }
    }

    // Admin list of quotes
    require_admin_auth($pdo);
    $stmt = $pdo->query("SELECT * FROM quotes ORDER BY id DESC");
    $quotes = $stmt->fetchAll();
    foreach ($quotes as &$q) {
        $q['add_ons'] = json_decode($q['add_ons'] ?: '[]', true);
    }
    send_json(['success' => true, 'data' => $quotes]);
}

if ($method === 'POST') {
    $d = json_decode(file_get_contents('php://input'), true);

    if (empty($d['customer_name']) || empty($d['phone']) || empty($d['apartment_id'])) {
        send_json(['success' => false, 'error' => 'Customer name, phone, and apartment are required'], 400);
    }

    $apartmentId = (int)$d['apartment_id'];
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$apartmentId]);
    $apt = $stmt->fetch();

    if (!$apt) {
        send_json(['success' => false, 'error' => 'Selected apartment does not exist'], 404);
    }

    $customerName = trim($d['customer_name']);
    $email = trim($d['email'] ?? '');
    $phone = trim($d['phone']);
    $durationType = $d['duration_type'] ?? 'night'; // 'night', 'month', 'year'
    $durationCount = max(1, (int)($d['duration_count'] ?? 1));
    $guests = max(1, (int)($d['guests'] ?? 1));
    $notes = trim($d['notes'] ?? '');

    // Add-ons list with standardized unit costs (PKR)
    $availableAddOns = [
        'vip_airport_transfer' => ['name' => 'VIP Airport Transfer (Chauffeured Mercedes/V8)', 'price' => 12000],
        'private_chauffeur' => ['name' => 'Dedicated Daily Chauffeur & Luxury Sedan', 'price' => 15000],
        'executive_breakfast' => ['name' => 'Executive Breakfast Buffet & Room Dining (Per Day)', 'price' => 3500],
        'daily_housekeeping' => ['name' => 'Twice-Daily Full Housekeeping & Turndown', 'price' => 4000],
        'club_gym_pool' => ['name' => 'Centaurus Fitness & Heated Pool VIP Pass', 'price' => 2500],
    ];

    $selectedAddOns = $d['add_ons'] ?? [];
    $addOnsData = [];
    $addOnsTotal = 0;

    if (is_array($selectedAddOns)) {
        foreach ($selectedAddOns as $key) {
            if (isset($availableAddOns[$key])) {
                $item = $availableAddOns[$key];
                $multiplier = ($key === 'executive_breakfast' || $key === 'daily_housekeeping') ? $durationCount : 1;
                $cost = $item['price'] * $multiplier;
                $addOnsTotal += $cost;
                $addOnsData[] = [
                    'key' => $key,
                    'name' => $item['name'],
                    'price' => $cost
                ];
            }
        }
    }

    // Base price calculation
    $baseRate = (float)$apt['price'];
    $subtotal = 0;

    if ($durationType === 'night') {
        $subtotal = $baseRate * $durationCount;
        // Extended stay discounts
        if ($durationCount >= 30) {
            $subtotal *= 0.75; // 25% discount for 30+ nights
        } elseif ($durationCount >= 7) {
            $subtotal *= 0.90; // 10% discount for 7+ nights
        }
    } elseif ($durationType === 'month') {
        // Monthly rate approx 22x daily rate
        $monthlyRate = $baseRate * 22;
        $subtotal = $monthlyRate * $durationCount;
        if ($durationCount >= 6) {
            $subtotal *= 0.88; // 12% discount for 6+ months
        }
    } elseif ($durationType === 'year') {
        $annualMonthlyRate = $baseRate * 19;
        $subtotal = $annualMonthlyRate * 12 * $durationCount;
    }

    // Standardized luxury hospitality service & utility charge (5%)
    $serviceTax = round(($subtotal + $addOnsTotal) * 0.05, 2);
    $grandTotal = round($subtotal + $addOnsTotal + $serviceTax, 2);

    $quoteNumber = '6STAR-' . date('Ymd') . '-' . strtoupper(substr(md5(uniqid(rand(), true)), 0, 5));

    $ins = $pdo->prepare("
        INSERT INTO quotes (
            quote_number, customer_name, email, phone, apartment_id, apartment_title,
            duration_type, duration_count, guests, add_ons, base_price, add_ons_price,
            tax_amount, total_price, notes, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    ");

    $ins->execute([
        $quoteNumber,
        $customerName,
        $email,
        $phone,
        $apt['id'],
        $apt['title'],
        $durationType,
        $durationCount,
        $guests,
        json_encode($addOnsData),
        $subtotal,
        $addOnsTotal,
        $serviceTax,
        $grandTotal,
        $notes
    ]);

    $quoteId = $pdo->lastInsertId();

    send_json([
        'success' => true,
        'message' => 'Quotation generated successfully',
        'data' => [
            'id' => $quoteId,
            'quote_number' => $quoteNumber,
            'customer_name' => $customerName,
            'apartment_title' => $apt['title'],
            'duration_type' => $durationType,
            'duration_count' => $durationCount,
            'guests' => $guests,
            'base_price' => $subtotal,
            'add_ons' => $addOnsData,
            'add_ons_price' => $addOnsTotal,
            'tax_amount' => $serviceTax,
            'total_price' => $grandTotal,
            'status' => 'Pending',
            'created_at' => date('Y-m-d H:i:s')
        ]
    ], 201);
}

if ($method === 'PUT') {
    require_admin_auth($pdo);
    $d = json_decode(file_get_contents('php://input'), true);

    if (empty($d['id']) || empty($d['status'])) {
        send_json(['success' => false, 'error' => 'Quote ID and status are required'], 400);
    }

    $id = (int)$d['id'];
    $status = trim($d['status']);

    $stmt = $pdo->prepare("UPDATE quotes SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);

    send_json(['success' => true, 'message' => 'Quotation status updated successfully']);
}

send_json(['success' => false, 'error' => 'Method not allowed'], 405);
