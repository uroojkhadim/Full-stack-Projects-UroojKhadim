<?php
// backend/api/quote_pdf.php - Luxury Quotation & Specification Sheet Print/PDF Engine
require_once __DIR__ . '/../db.php';

header("Content-Type: text/html; charset=UTF-8");

$quoteNumber = $_GET['quote_number'] ?? '';
$quoteId = (int)($_GET['id'] ?? 0);
$aptId = (int)($_GET['apt_id'] ?? 0);

$quote = null;
$apt = null;

if ($quoteNumber || $quoteId) {
    $where = $quoteNumber ? "quote_number = ?" : "id = ?";
    $param = $quoteNumber ? $quoteNumber : $quoteId;
    $stmt = $pdo->prepare("SELECT * FROM quotes WHERE $where LIMIT 1");
    $stmt->execute([$param]);
    $quote = $stmt->fetch();
    if ($quote) {
        $quote['add_ons'] = json_decode($quote['add_ons'] ?: '[]', true);
        $aptStmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
        $aptStmt->execute([$quote['apartment_id']]);
        $apt = $aptStmt->fetch();
    }
}

if (!$quote && $aptId) {
    $aptStmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $aptStmt->execute([$aptId]);
    $apt = $aptStmt->fetch();
}

if (!$quote && !$apt) {
    echo "<!DOCTYPE html><html><body style='font-family:sans-serif; text-align:center; padding:50px;'><h2>Quotation or Apartment Not Found</h2><p>Please check the link or generate a new quote.</p></body></html>";
    exit();
}

// Fetch site settings
$siteStmt = $pdo->query("SELECT key, value FROM site_settings");
$settings = [];
foreach ($siteStmt->fetchAll() as $row) {
    $settings[$row['key']] = $row['value'];
}

$siteName = $settings['site_name'] ?? '6 Stars Hospitality';
$phone = $settings['phone_primary'] ?? '+92 312 0893146';
$email = $settings['email'] ?? 'concierge@6starapartments.com';

// Official 3D Plaque Logo Resolution
$logoPath = __DIR__ . '/../../public/images/logo/WhatsApp Image 2026-09-08 at 6.45.07 PM.jpeg';
$logoSrc = '/images/logo/WhatsApp Image 2026-09-08 at 6.45.07 PM.jpeg';
if (file_exists($logoPath)) {
    $logoData = base64_encode(file_get_contents($logoPath));
    $logoSrc = 'data:image/jpeg;base64,' . $logoData;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Official Quotation - <?= htmlspecialchars($quote['quote_number'] ?? '6STAR-SPEC-SHEET') ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', sans-serif;
            background: #0f1117;
            color: #222;
            padding: 40px 20px;
        }
        .page {
            max-width: 850px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            padding: 50px 60px;
            position: relative;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #C5A850;
            padding-bottom: 25px;
            margin-bottom: 35px;
        }
        .brand-title {
            font-family: 'Outfit', sans-serif;
            font-size: 26px;
            font-weight: 800;
            color: #1a1612;
            letter-spacing: -0.5px;
        }
        .brand-sub {
            font-size: 12px;
            color: #C5A850;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-top: 4px;
        }
        .quote-badge {
            text-align: right;
        }
        .quote-badge h3 {
            font-family: 'Outfit', sans-serif;
            font-size: 20px;
            color: #1a1612;
        }
        .quote-badge p {
            font-size: 13px;
            color: #666;
            margin-top: 2px;
        }
        .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 35px;
            padding: 20px;
            background: #fdfbf7;
            border-radius: 6px;
            border: 1px solid #f0e5cb;
        }
        .meta-col h4 {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #8C7127;
            margin-bottom: 8px;
            font-weight: 700;
        }
        .meta-col p {
            font-size: 14px;
            color: #333;
            line-height: 1.6;
        }
        .table-wrap {
            margin-bottom: 35px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background: #1a1a22;
            color: #ffffff;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 12px 16px;
            text-align: left;
        }
        th:last-child { text-align: right; }
        td {
            padding: 14px 16px;
            font-size: 14px;
            border-bottom: 1px solid #eee;
            color: #333;
        }
        td:last-child { text-align: right; font-weight: 600; }
        .summary-box {
            margin-left: auto;
            width: 320px;
            margin-bottom: 40px;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
            color: #555;
        }
        .summary-row.total {
            border-top: 2px solid #C5A850;
            margin-top: 10px;
            padding-top: 12px;
            font-size: 18px;
            font-weight: 700;
            color: #1a1612;
        }
        .terms {
            border-top: 1px solid #eee;
            padding-top: 20px;
            font-size: 11.5px;
            color: #777;
            line-height: 1.7;
        }
        .actions {
            text-align: center;
            margin-top: 30px;
        }
        .btn-print {
            background: #C5A850;
            color: #000;
            font-weight: 600;
            padding: 12px 30px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(197,168,80,0.3);
            margin: 0 8px;
        }
        .btn-print:hover { background: #b09138; }
        @media print {
            body { background: #fff; padding: 0; }
            .page { box-shadow: none; padding: 20px 0; }
            .actions { display: none; }
        }
    </style>
</head>
<body>

<div class="page">
    <div class="header">
        <div style="display: flex; align-items: center; gap: 16px;">
            <img src="<?= $logoSrc ?>" alt="6 STARS HOSPITALITY" style="height: 60px; width: 60px; object-fit: cover; border-radius: 8px; border: 1.5px solid #C5A850; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
            <div>
                <div class="brand-title">6 STARS HOSPITALITY</div>
                <div class="brand-sub">6 Star Centaurus Apartments • Islamabad</div>
            </div>
        </div>
        <div class="quote-badge">
            <h3><?= $quote ? 'OFFICIAL QUOTATION' : 'UNIT SPECIFICATION' ?></h3>
            <p><strong>Ref:</strong> <?= htmlspecialchars($quote['quote_number'] ?? 'SPEC-' . ($apt['id'] ?? '001')) ?></p>
            <p><strong>Date:</strong> <?= date('d M Y') ?></p>
        </div>
    </div>

    <div class="meta-grid">
        <div class="meta-col">
            <h4>Prepared For</h4>
            <p><strong><?= htmlspecialchars($quote['customer_name'] ?? 'Prospective Resident / Client') ?></strong></p>
            <?php if (!empty($quote['phone'])): ?><p>Phone: <?= htmlspecialchars($quote['phone']) ?></p><?php endif; ?>
            <?php if (!empty($quote['email'])): ?><p>Email: <?= htmlspecialchars($quote['email']) ?></p><?php endif; ?>
            <p>Duration: <?= $quote['duration_count'] ?? 1 ?> <?= ucfirst($quote['duration_type'] ?? 'Stay') ?>(s) • <?= $quote['guests'] ?? 2 ?> Guests</p>
        </div>
        <div class="meta-col">
            <h4>Residence Location & Issuer</h4>
            <p><strong>6 Stars Hospitality - Centaurus Residences</strong></p>
            <p>The Centaurus Towers, Jinnah Avenue, F-8/4, Islamabad</p>
            <p>Concierge Hotline: <strong><?= htmlspecialchars($phone) ?></strong></p>
            <p>WhatsApp Concierge: <strong>+92 312 0893146</strong></p>
            <p>Direct Email: <?= htmlspecialchars($email) ?></p>
        </div>
    </div>

    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>Description & Itemized Specifications</th>
                    <th>Rate/Details</th>
                    <th>Total (PKR)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong><?= htmlspecialchars($apt['title'] ?? $quote['apartment_title'] ?? 'Luxury Suite') ?></strong><br>
                        <span style="font-size:12px; color:#666;">
                            <?= ($apt['bedrooms'] ?? 1) ?> Bed • <?= ($apt['bathrooms'] ?? 1) ?> Bath • <?= ($apt['area_sqft'] ?? 800) ?> Sq Ft • <?= htmlspecialchars($apt['view_type'] ?? 'Centaurus View') ?> • Floor: <?= htmlspecialchars($apt['floor'] ?? 'High Floor') ?>
                        </span>
                    </td>
                    <td><?= $quote['duration_count'] ?? 1 ?> <?= $quote['duration_type'] ?? 'night' ?>(s)</td>
                    <td>Rs. <?= number_format($quote['base_price'] ?? $apt['price'] ?? 0) ?></td>
                </tr>

                <?php if (!empty($quote['add_ons']) && is_array($quote['add_ons'])): ?>
                    <?php foreach ($quote['add_ons'] as $addon): ?>
                        <tr>
                            <td>
                                <strong><?= htmlspecialchars($addon['name']) ?></strong><br>
                                <span style="font-size:12px; color:#888;">Executive concierge bespoke add-on</span>
                            </td>
                            <td>Selected</td>
                            <td>Rs. <?= number_format($addon['price']) ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <div class="summary-box">
        <div class="summary-row">
            <span>Base Residence Rate:</span>
            <span>Rs. <?= number_format($quote['base_price'] ?? $apt['price'] ?? 0) ?></span>
        </div>
        <?php if (!empty($quote['add_ons_price'])): ?>
        <div class="summary-row">
            <span>Bespoke Add-ons:</span>
            <span>Rs. <?= number_format($quote['add_ons_price']) ?></span>
        </div>
        <?php endif; ?>
        <div class="summary-row">
            <span>Hospitality & Utilities (5%):</span>
            <span>Rs. <?= number_format($quote['tax_amount'] ?? round(($apt['price'] ?? 0) * 0.05)) ?></span>
        </div>
        <div class="summary-row total">
            <span>Grand Total:</span>
            <span style="color:#8C7127;">Rs. <?= number_format($quote['total_price'] ?? round(($apt['price'] ?? 0) * 1.05)) ?></span>
        </div>
    </div>

    <div class="terms">
        <p><strong>Reservation & Payment Terms:</strong></p>
        <p>1. Rates include uninterrupted generator backup power, high-speed fiber internet, and access to Centaurus facilities.</p>
        <p>2. Standard check-in is 2:00 PM; check-out is 12:00 PM. Early check-in or late check-out is subject to prior confirmation.</p>
        <p>3. This formal quotation is valid for 14 calendar days from the date of issuance.</p>
        <p>4. Valid National ID (CNIC) or Passport is mandatory for all guests upon key handover.</p>
    </div>

    <div class="actions">
        <button class="btn-print" onclick="window.print()">Print / Save PDF</button>
        <button class="btn-print" style="background:#1a1a22; color:#fff;" onclick="window.close()">Close Window</button>
    </div>
</div>

</body>
</html>
