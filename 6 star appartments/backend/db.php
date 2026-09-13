<?php
// backend/db.php - SQLite 3 PDO Connection, Auto-Migrations & Seeders

// Global CORS & JSON Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_file = __DIR__ . '/database.sqlite';

try {
    $pdo = new PDO("sqlite:" . $db_file);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // High Performance SQLite PRAGMA Optimization (WAL Mode + 64MB Cache)
    $pdo->exec("PRAGMA journal_mode = WAL;");
    $pdo->exec("PRAGMA synchronous = NORMAL;");
    $pdo->exec("PRAGMA cache_size = -64000;");
    $pdo->exec("PRAGMA busy_timeout = 5000;");
    $pdo->exec("PRAGMA foreign_keys = ON;");

    // Auto-create tables if they do not exist
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS site_settings (
            key TEXT PRIMARY KEY,
            value TEXT
        );

        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT,
            image TEXT
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER,
            title TEXT NOT NULL,
            slug TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            price_type TEXT DEFAULT 'night',
            area_sqft INTEGER,
            bedrooms INTEGER,
            bathrooms INTEGER,
            view_type TEXT,
            floor TEXT,
            status TEXT DEFAULT 'available',
            is_featured INTEGER DEFAULT 0,
            amenities TEXT,
            images TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS blogs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            category TEXT,
            excerpt TEXT,
            content TEXT,
            author TEXT DEFAULT '6 Star Concierge',
            image TEXT,
            read_time TEXT DEFAULT '5 min read',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quote_number TEXT UNIQUE NOT NULL,
            customer_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            apartment_id INTEGER,
            apartment_title TEXT,
            duration_type TEXT,
            duration_count INTEGER DEFAULT 1,
            guests INTEGER DEFAULT 1,
            add_ons TEXT,
            base_price REAL DEFAULT 0,
            add_ons_price REAL DEFAULT 0,
            tax_amount REAL DEFAULT 0,
            total_price REAL DEFAULT 0,
            notes TEXT,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS inquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            subject TEXT,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'New',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'superadmin',
            token TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS guests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            google_sub TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            picture TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS cache_store (
            key TEXT PRIMARY KEY,
            value TEXT,
            expires_at INTEGER
        );

        -- Database Performance Indexes for Scalability
        CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
        CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
        CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
        CREATE INDEX IF NOT EXISTS idx_quotes_quote_number ON quotes(quote_number);
        CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
        CREATE INDEX IF NOT EXISTS idx_quotes_created ON quotes(created_at);
        CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
        CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at);
        CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
        CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
        CREATE INDEX IF NOT EXISTS idx_cache_expires ON cache_store(expires_at);
        CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
    ");

    // Seed default admin if empty
    $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM admins");
    $admin_count = $stmt->fetch()['cnt'];
    if ($admin_count == 0) {
        $default_hash = password_hash('admin123', PASSWORD_BCRYPT);
        $ins = $pdo->prepare("INSERT INTO admins (username, password_hash, role) VALUES (?, ?, ?)");
        $ins->execute(['admin', $default_hash, 'superadmin']);
    }

    // Migrate any legacy placeholder phone numbers in site_settings to verified +92 312 0893146
    try {
        $pdo->exec("UPDATE site_settings SET value = '+92 312 0893146' WHERE key IN ('phone_primary', 'phone_secondary', 'whatsapp') AND (value LIKE '%300 555%' OR value LIKE '%111 678%')");
    } catch (Exception $e) {}

    // Seed default site settings if empty
    $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM site_settings");
    $settings_count = $stmt->fetch()['cnt'];
    if ($settings_count == 0) {
        $default_settings = [
            'site_name' => '6 Stars Hospitality',
            'property_name' => '6 Star Centaurus Apartments',
            'tagline' => 'Luxury Living & Serviced Residences in Islamabad',
            'phone_primary' => '+92 312 0893146',
            'phone_secondary' => '+92 312 0893146',
            'whatsapp' => '+92 312 0893146',
            'email' => 'concierge@6starhospitality.com',
            'quote_notice' => 'Rates include 24/7 dedicated electricity backup, high-speed fiber internet, housekeeping, pool & fitness club access, and Centaurus Mall privileged parking.',
            'showrooms' => json_encode([
                [
                    'name' => 'The Centaurus Residence Suite',
                    'tag' => 'Flagship Showroom',
                    'address' => 'Tower B, 18th Floor, The Centaurus, Jinnah Avenue, F-8/4, Islamabad',
                    'phone' => '+92 312 0893146',
                    'email' => 'centaurus@6starhospitality.com',
                    'hours' => 'Mon - Sun: 09:00 AM - 10:00 PM',
                    'map_url' => 'https://maps.google.com/?q=The+Centaurus+Mall+Islamabad'
                ],
                [
                    'name' => 'Blue Area Executive Office',
                    'tag' => 'Corporate & Leasing Office',
                    'address' => 'Executive Tower 4, Blue Area, Jinnah Avenue, Islamabad',
                    'phone' => '+92 312 0893146',
                    'email' => 'leasing@6starhospitality.com',
                    'hours' => 'Mon - Sat: 09:00 AM - 07:00 PM',
                    'map_url' => 'https://maps.google.com/?q=Blue+Area+Islamabad'
                ]
            ]),
            'social_links' => json_encode([
                'facebook' => 'https://facebook.com/6starhospitality',
                'instagram' => 'https://instagram.com/6starhospitality',
                'whatsapp' => 'https://wa.me/923120893146'
            ])
        ];

        $ins_set = $pdo->prepare("INSERT INTO site_settings (key, value) VALUES (?, ?)");
        foreach ($default_settings as $k => $v) {
            $ins_set->execute([$k, $v]);
        }
    }

    // Seed default categories and apartments if empty
    $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM categories");
    $cat_count = $stmt->fetch()['cnt'];
    if ($cat_count == 0) {
        $categories = [
            ['One Bed Studio Apartment', 'one-bed-studio-apartment', 'Cozy, elegantly decorated studio apartments ideal for solo executives or short corporate visits.', 'images/One bed studio apartment/WhatsApp Image 2026-09-06 at 11.07.00 PM (1).jpeg'],
            ['1+Study Apartment', '1-plus-study-apartment', 'Spacious 1-bedroom luxury suite equipped with a dedicated executive study workstation.', 'images/1+study apartment/WhatsApp Image 2026-09-06 at 11.07.07 PM.jpeg'],
            ['1 Bed Margalla Facing', '1-bed-margalla-facing', 'Breathtaking high-floor 1-bedroom apartment overlooking the majestic Margalla Hills and Faisal Mosque skyline.', 'images/1bed apartment Margla facing/WhatsApp Image 2026-09-06 at 11.07.32 PM.jpeg'],
            ['2 Bed Apartments', '2-bed-apartments', 'Refined two-bedroom luxury residences crafted for families and extended luxury stays.', 'images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.01 PM.jpeg'],
            ['2+Study Apartment', '2-plus-study-apartment', 'Deluxe dual-bedroom apartment featuring an independent conference/study nook and open living salon.', 'images/2+study apartment/WhatsApp Image 2026-09-06 at 11.07.27 PM.jpeg'],
            ['Centaurus Two Bedrooms', 'centaurus-two-bedrooms', 'Signature Centaurus tower residences boasting designer Italian furnishings and high ceilings.', 'images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.01 PM.jpeg'],
            ['3 Bed Executive Penthouse', '3-bed-apartment', 'Grand three-bedroom luxury penthouse with expansive terrace, chef kitchen, and panoramic city vistas.', 'images/3bed apartment/WhatsApp Image 2026-09-06 at 11.07.02 PM.jpeg']
        ];

        $ins_cat = $pdo->prepare("INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)");
        foreach ($categories as $c) {
            $ins_cat->execute($c);
        }

        // Seed real products matching the folders
        $products = [
            [
                'category_id' => 1,
                'title' => 'Signature 1-Bed Studio Suite',
                'slug' => 'signature-1-bed-studio-suite',
                'description' => 'Ultra-chic modern studio apartment at The Centaurus. Features king plush bedding, smart entertainment system, kitchenette with premium appliances, marble ensuite bath, and sweeping city views.',
                'price' => 18000,
                'price_type' => 'night',
                'area_sqft' => 650,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'view_type' => 'Islamabad Skyline View',
                'floor' => '14th Floor',
                'is_featured' => 1,
                'amenities' => json_encode(['High Speed Fiber WiFi', 'Smart 4K TV with Netflix', '24/7 Concierge & Security', '100% Uninterrupted Power', 'Centaurus Mall Direct Access', 'Daily Housekeeping', 'Fully Equipped Kitchenette']),
                'images' => json_encode([
                    'images/One bed studio apartment/WhatsApp Image 2026-09-06 at 11.07.00 PM (1).jpeg',
                    'images/One bed studio apartment/WhatsApp Image 2026-09-06 at 11.07.00 PM (2).jpeg',
                    'images/One bed studio apartment/WhatsApp Image 2026-09-06 at 11.07.00 PM.jpeg',
                    'images/One bed studio apartment/WhatsApp Image 2026-09-06 at 11.06.59 PM.jpeg'
                ])
            ],
            [
                'category_id' => 2,
                'title' => 'Executive 1+Study Luxury Residence',
                'slug' => 'executive-1-study-luxury-residence',
                'description' => 'Tailored for traveling dignitaries, diplomats, and senior professionals. Comes with a separate quiet study zone, ergonomic leather chair, high-speed workstation, plush king master bedroom, and bespoke lounge.',
                'price' => 24000,
                'price_type' => 'night',
                'area_sqft' => 880,
                'bedrooms' => 1,
                'bathrooms' => 1.5,
                'view_type' => 'City & Jinnah Avenue View',
                'floor' => '17th Floor',
                'is_featured' => 1,
                'amenities' => json_encode(['Dedicated Executive Study', 'High-Speed Fiber WiFi', 'Complimentary Valet Parking', 'Infinity Pool Access', 'State-of-the-art Fitness Gym', '24/7 Power Backup', 'Smart Lock Keyless Entry']),
                'images' => json_encode([
                    'images/1+study apartment/WhatsApp Image 2026-09-06 at 11.07.07 PM.jpeg',
                    'images/1+study apartment/WhatsApp Image 2026-09-06 at 11.07.07 PM (1).jpeg',
                    'images/1+study apartment/WhatsApp Image 2026-09-06 at 11.07.07 PM (2).jpeg',
                    'images/1+study apartment/WhatsApp Image 2026-09-06 at 11.07.08 PM.jpeg'
                ])
            ],
            [
                'category_id' => 3,
                'title' => 'Margalla Hills Panorama 1-Bed Residence',
                'slug' => 'margalla-hills-panorama-1-bed',
                'description' => 'Immerse in nature without leaving luxury behind. Floor-to-ceiling glass windows open directly to the lush Margalla Hills national park and the sunset over Islamabad. Includes custom furnishings and deep-soak bathtub.',
                'price' => 26000,
                'price_type' => 'night',
                'area_sqft' => 820,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'view_type' => 'Direct Margalla Hills & Faisal Mosque View',
                'floor' => '21st Floor',
                'is_featured' => 1,
                'amenities' => json_encode(['Margalla Panoramic View', 'Floor-to-Ceiling Windows', 'Espresso Coffee Bar', 'Designer Italian Furniture', '24/7 In-Room Dining', 'Heated Pool Access', 'Soundproof Triple Glazing']),
                'images' => json_encode([
                    'images/1bed apartment Margla facing/WhatsApp Image 2026-09-06 at 11.07.32 PM.jpeg',
                    'images/1bed apartment Margla facing/WhatsApp Image 2026-09-06 at 11.07.32 PM (1).jpeg',
                    'images/1bed apartment Margla facing/WhatsApp Image 2026-09-06 at 11.07.33 PM (1).jpeg',
                    'images/1bed apartment Margla facing/WhatsApp Image 2026-09-06 at 11.07.33 PM.jpeg'
                ])
            ],
            [
                'category_id' => 4,
                'title' => 'Royal 2-Bedroom Family Residence',
                'slug' => 'royal-2-bedroom-family-residence',
                'description' => 'A spacious haven of comfort with two master suites, lavish living and dining room, granite gourmet kitchen, and twin luxury baths. Ideal for discerning families and international guests.',
                'price' => 38000,
                'price_type' => 'night',
                'area_sqft' => 1450,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'view_type' => 'Dual Aspect: City & Hills',
                'floor' => '16th Floor',
                'is_featured' => 1,
                'amenities' => json_encode(['Two Master Suites', 'Full Gourmet Kitchen', 'Washer & Dryer in Unit', 'Private High-Speed Elevator', 'Dedicated Reserved Parking', 'Baby Cot on Request', 'Centaurus Mall VIP Card']),
                'images' => json_encode([
                    'images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.01 PM.jpeg',
                    'images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.02 PM.jpeg',
                    'images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.04 PM.jpeg',
                    'images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.07 PM.jpeg'
                ])
            ],
            [
                'category_id' => 5,
                'title' => 'Prestige 2+Study Diplomatic Suite',
                'slug' => 'prestige-2-study-diplomatic-suite',
                'description' => 'Equipped with 2 royal bedrooms, a private conference study, oversized salon, and laundry pantry. Favored by corporate delegations and long-term expatriates requiring privacy and comfort.',
                'price' => 44000,
                'price_type' => 'night',
                'area_sqft' => 1650,
                'bedrooms' => 2,
                'bathrooms' => 2.5,
                'view_type' => 'Margalla Hills & Boulevard',
                'floor' => '19th Floor',
                'is_featured' => 0,
                'amenities' => json_encode(['Executive Study / Office', '2 Master King Bedrooms', 'Dual Living Salons', 'Fiber WiFi 100 Mbps', 'Airport Pickup Included for 3+ Nights', 'Premium Toiletries', '24/7 Butler on Call']),
                'images' => json_encode([
                    'images/2+study apartment/WhatsApp Image 2026-09-06 at 11.07.27 PM.jpeg',
                    'images/2+study apartment/WhatsApp Image 2026-09-06 at 11.07.27 PM (1).jpeg',
                    'images/2+study apartment/WhatsApp Image 2026-09-06 at 11.07.27 PM (2).jpeg',
                    'images/2+study apartment/WhatsApp Image 2026-09-06 at 11.07.26 PM.jpeg'
                ])
            ],
            [
                'category_id' => 6,
                'title' => 'Centaurus Tower Two-Bedroom Grand Suite',
                'slug' => 'centaurus-tower-two-bedroom-grand-suite',
                'description' => 'The crown jewel of Centaurus Tower living. Featuring ultra-contemporary decor, ambient recessed LED chandeliers, custom velvet sofas, and floor-to-ceiling glass showcasing the capital.',
                'price' => 42000,
                'price_type' => 'night',
                'area_sqft' => 1500,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'view_type' => 'Jinnah Avenue & Constitution Avenue View',
                'floor' => '22nd Floor',
                'is_featured' => 1,
                'amenities' => json_encode(['VIP Centaurus Card', 'Automated Curtains & Lights', 'Sub-Zero Refrigerator', 'Rain Shower & Jacuzzi', '24/7 Security & Video Intercom', 'Chauffeured Car Service Available']),
                'images' => json_encode([
                    'images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.01 PM.jpeg',
                    'images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.02 PM.jpeg',
                    'images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.04 PM.jpeg',
                    'images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.07 PM.jpeg'
                ])
            ],
            [
                'category_id' => 7,
                'title' => 'Imperial 3-Bedroom Sky Penthouse',
                'slug' => 'imperial-3-bedroom-sky-penthouse',
                'description' => 'Unmatched grandeur spanning 2,200 sqft. Three lavish bedrooms with marble ensuites, chef kitchen, grand dining hall for 8 guests, and an open balcony offering 360-degree vistas across Islamabad.',
                'price' => 65000,
                'price_type' => 'night',
                'area_sqft' => 2200,
                'bedrooms' => 3,
                'bathrooms' => 3.5,
                'view_type' => '360° Margalla Hills & City Skyline',
                'floor' => '23rd Floor',
                'is_featured' => 1,
                'amenities' => json_encode(['Top Floor Penthouse', 'Private Observation Balcony', 'Chef Grade Kitchen', 'Dining Table for 8', 'Jacuzzi in Master Ensuite', 'Dedicated Concierge', 'Complimentary Valet for 2 Cars']),
                'images' => json_encode([
                    'images/3bed apartment/WhatsApp Image 2026-09-06 at 11.07.02 PM.jpeg',
                    'images/3bed apartment/WhatsApp Image 2026-09-06 at 11.07.02 PM (1).jpeg',
                    'images/3bed apartment/WhatsApp Image 2026-09-06 at 11.07.02 PM (2).jpeg',
                    'images/3bed apartment/WhatsApp Image 2026-09-06 at 11.07.03 PM.jpeg'
                ])
            ]
        ];

        $ins_prod = $pdo->prepare("
            INSERT INTO products 
            (category_id, title, slug, description, price, price_type, area_sqft, bedrooms, bathrooms, view_type, floor, is_featured, amenities, images) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        foreach ($products as $p) {
            $ins_prod->execute([
                $p['category_id'], $p['title'], $p['slug'], $p['description'], $p['price'], $p['price_type'],
                $p['area_sqft'], $p['bedrooms'], $p['bathrooms'], $p['view_type'], $p['floor'], $p['is_featured'],
                $p['amenities'], $p['images']
            ]);
        }
    }

    // Seed default blogs if empty
    $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM blogs");
    $blog_count = $stmt->fetch()['cnt'];
    if ($blog_count == 0) {
        $blogs = [
            [
                'title' => 'Why The Centaurus Islamabad is Pakistan’s Premier Luxury Address',
                'slug' => 'why-the-centaurus-islamabad-is-premier-luxury-address',
                'category' => 'Lifestyle & Living',
                'excerpt' => 'Discover how The Centaurus revolutionized high-rise serviced living with world-class security, mall access, and unmatched views.',
                'content' => "Rising dramatically above the heart of Islamabad, The Centaurus represents the pinnacle of contemporary luxury and architectural sophistication in Pakistan. For overseas Pakistanis, diplomats, business leaders, and travelers, residing in The Centaurus offers an effortless blend of five-star hospitality and residential privacy.\n\nFrom dedicated elevators and 24/7 security checkpoints to instantaneous power backup and direct enclosed access to fine dining and premier retail, every convenience is engineered at your fingertips.",
                'author' => 'Imran Malik, Luxury Advisor',
                'image' => 'images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.01 PM.jpeg',
                'read_time' => '4 min read'
            ],
            [
                'title' => 'Complete Guide: Short-Term Serviced Rentals vs Long-Term Leases',
                'slug' => 'short-term-serviced-rentals-vs-long-term-leases',
                'category' => 'Buyer & Tenant Guide',
                'excerpt' => 'Navigating lease durations, furnished inclusions, and corporate quotation benefits for luxury apartments in Islamabad.',
                'content' => "Whether you are visiting the capital for a two-week diplomatic mission or relocating your family for an annual contract, choosing between daily serviced rates and monthly executive leases requires understanding total cost of occupancy.\n\nAt 6 Star Apartments, all reservations include full furnishings, utilities, high-speed fiber internet, and comprehensive maintenance—eliminating traditional lease hassles like security meter deposits and maintenance contracts.",
                'author' => 'Sarah Qureshi, Leasing Director',
                'image' => 'images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.01 PM.jpeg',
                'read_time' => '6 min read'
            ],
            [
                'title' => 'Experiencing the Margalla Hills: Morning Mist to Sunset Glow',
                'slug' => 'experiencing-the-margalla-hills-views',
                'category' => 'Scenic Views',
                'excerpt' => 'Why high-floor Margalla-facing apartments remain the most sought-after residences in the federal capital.',
                'content' => "There is no sight quite like watching the early morning fog roll off the Margalla ridges with a freshly brewed espresso on your private Centaurus balcony.\n\nOur Margalla-facing luxury suites are acoustically insulated with triple-glazed glass, allowing complete serenity inside while offering unobstructed panorama of the mountains, Faisal Mosque, and the lush green canopy of Islamabad.",
                'author' => '6 Star Editorial Team',
                'image' => 'images/1bed apartment Margla facing/WhatsApp Image 2026-09-06 at 11.07.32 PM.jpeg',
                'read_time' => '3 min read'
            ]
        ];

        $ins_blog = $pdo->prepare("
            INSERT INTO blogs (title, slug, category, excerpt, content, author, image, read_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        foreach ($blogs as $b) {
            $ins_blog->execute([
                $b['title'], $b['slug'], $b['category'], $b['excerpt'], $b['content'], $b['author'], $b['image'], $b['read_time']
            ]);
        }
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit();
}

// Include Redis + SQLite Cache Manager
require_once __DIR__ . '/cache.php';

// Authentication helper for admin routes
function require_admin_auth($pdo) {
    $headers = getallheaders();
    $auth = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    if (!$auth && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['HTTP_AUTHORIZATION'];
    }

    if (!preg_match('/Bearer\s(\S+)/', $auth, $matches)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Unauthorized: Missing token']);
        exit();
    }

    $token = $matches[1];
    $stmt = $pdo->prepare("SELECT id, username, role FROM admins WHERE token = ? AND token IS NOT NULL");
    $stmt->execute([$token]);
    $admin = $stmt->fetch();

    if (!$admin) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Unauthorized: Invalid or expired token']);
        exit();
    }

    return $admin;
}

// Standard JSON response helper
function send_json($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}
