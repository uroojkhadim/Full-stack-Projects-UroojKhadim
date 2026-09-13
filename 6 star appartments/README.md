# 6 Star Apartments — Luxury Living & Serviced Residences
**The Centaurus, Jinnah Avenue, Islamabad**

A high-performance full-stack web application, online quotation engine, and administrative portal built for **6 Star Apartments Centaurus Islamabad**.

---

## 🌟 Technology Stack

### 1. Frontend (Client-Side)
- **Core Framework**: React 18.3 (`react`, `react-dom`)
- **Language**: TypeScript 5.7 (Strictly typed components, API types, interfaces)
- **Build Tool & Bundler**: Vite 5.4 (Instant HMR, tree-shaken production bundles)
- **Routing**: React Router DOM v6 (`HashRouter` for zero-config routing across cPanel and Apache subdirectories)
- **Styling & Design System**: Tailwind CSS 3.4 with PostCSS and Autoprefixer
- **Utility Helpers**: `clsx` and `tailwind-merge` (`cn` helper)
- **Typography**: Google Fonts — **Outfit** (Headings & Luxury Branding) & **Inter** (Body text & UI)
- **Animations & Interactivity**: Framer Motion 12 + Custom IntersectionObserver scroll triggers
- **Iconography**: Lucide React (`lucide-react`)

### 2. Backend (Server-Side & APIs)
- **Language / Runtime**: PHP 7.4+ / 8.x (100% compatible with standard cPanel shared hosting)
- **API Architecture**: Lightweight RESTful JSON API in `backend/api/`
- **Database**: SQLite 3 via PHP PDO (`backend/database.sqlite`)
  - Zero external MySQL setup required
  - Self-healing database installer & seeders in `backend/db.php`
- **Security & Media**:
  - `backend/.htaccess` protects `database.sqlite` and `db.php` from direct web download
  - Bearer token session authentication
  - Media uploader with MIME type verification saving into `backend/uploads/`

---

## 📂 Key Backend Endpoints (`backend/api/`)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `site.php` | `GET`, `POST` | Dynamic site settings (hotline numbers, multiple showroom addresses, quotation notices) |
| `products.php` | `GET`, `POST`, `PUT`, `DELETE` | Dynamic apartment catalog management (CRUD, specifications, images) |
| `categories.php` | `GET`, `POST`, `PUT`, `DELETE` | Apartment category management |
| `blogs.php` | `GET`, `POST`, `PUT`, `DELETE` | Article publishing system and tenant/buyer guides |
| `quote.php` | `POST`, `GET`, `PUT` | Quotation calculation engine (duration, guests, VIP add-ons, extended discounts) |
| `quote_pdf.php` | `GET` | Generates official printable & downloadable PDF quotation specification sheets |
| `admin_login.php` | `POST`, `GET`, `PUT` | Admin panel authentication, token validation, and password management |
| `google_auth.php` | `POST` | Server-side verification of Google Identity Services ID tokens and guest account creation |
| `upload.php` | `POST` | Image & media upload handler (saves to `backend/uploads/`) |
| `contact.php` | `POST`, `GET`, `PUT`, `DELETE` | Customer contact and viewing tour inquiry logger |

---

## 🚀 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000/`.

> **Note**: In local development, the frontend includes a dual-mode API service: it automatically probes `backend/api/`, and if PHP is not running locally, seamlessly uses an offline storage cache seeded with real photos from `public/images/`.

### 4. Official Google sign-in setup

Guest sign-in uses Google's official Google Identity Services button and One Tap. It does not imitate Google's UI or handle Google passwords. Copy `.env.example` to `.env`, then set the public client ID:

```bash
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Set the same value as `GOOGLE_CLIENT_ID` in the PHP server environment. In Google Cloud Console, add every local and production origin to the OAuth client's authorized JavaScript origins. The PHP server must have cURL and outbound HTTPS access so `backend/api/google_auth.php` can verify ID tokens with Google. Never put a client secret or private key in `.env` values prefixed with `VITE_`.

Without a configured client ID, the sign-in panel intentionally shows a setup message instead of offering fake authentication.

### 3. Production Build
```bash
npm run build
```
Creates an optimized static bundle in `dist/`.

---

## 🔒 Admin Portal Credentials

- **URL**: `/#/admin` or `/#/admin/login`
- **Default Username**: `admin`
- **Default Password**: `admin123`

Features available in Admin Portal:
1. **Dashboard**: Live counters for apartments, quotations, inquiries, and published articles.
2. **Apartment Manager**: Add, edit, or delete residences with full specifications, room amenities, and photo galleries.
3. **Quotation Pipeline**: Review all customer quotation requests, change pipeline status (`Pending`, `Contacted`, `Confirmed`), and print/save PDF sheets.
4. **Inquiries**: Review messages from the contact form and private tour requests.
5. **Blog Publisher**: Write, update, and publish buyer guides and lifestyle articles.
6. **Site Settings & Showrooms**: Update hotline numbers, WhatsApp direct link, email, client notices, and showroom addresses.

---

## 🌐 cPanel Deployment Guide

1. Run `npm run build` on your local machine.
2. Upload the contents of `dist/` into your cPanel `public_html/` (or your chosen subdirectory).
3. Upload the `backend/` folder into `public_html/backend/`.
4. Ensure `backend/uploads/` has write permissions (`755` or `775`).
5. Open your domain (e.g. `https://yourdomain.com/#/`) — your full 6 Star Apartments platform is live!
