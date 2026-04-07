# Vibepick / Karukolpo E-Commerce Platform

**🚀 Live Deployment:** [https://marfy-art.github.io/vibepick/](https://marfy-art.github.io/vibepick/)

A premium, fast, and dynamic Single Page Application (SPA) built for the **Vibepick** & **Karukolpo** brand. This project brings together a state-of-the-art Shopping Frontend with a powerful, secure Admin ERP—all built efficiently with Vanilla JS, Tailwind CSS, and local data persistence.

---

## 📸 Project Highlights

### The Premium Shopping Frontend
Designed with a "Refined Editorial" aesthetic, featuring dynamic routing, smooth cart animations, and responsive grids.
- **Dynamic Product Rendering**: All product listings and detail pages flow from a single source of truth without requiring page reloads.
- **Refine Details System**: A modular, dynamic specification renderer for deep-dive product features.
- **Persistent Cart**: Complex variants (sizes, colors) tracked reliably using LocalStorage.

![Product Details Page Placeholder](./images/details_placeholder.png "Product Details UI")

### SPA Admin ERP & Dashboard
An isolated, secure management portal designed to oversee operations seamlessly.
- **Secure Authentication**: SHA-256 cryptographic hashing combined with Base64 obfuscation prevents unauthorized access. No plaintext passwords exist in the client.
- **Live Sales Analytics & Profit Calculator**: Instant calculations of revenue, items sold, and advanced profit analytics.
- **Real-time Order Management**: Process, ship, and complete orders directly from the dashboard.

![Analytics Dashboard Placeholder](./images/analytics_placeholder.png "Admin Dashboard UI")

---

## 🛠 Tech Stack
- **Core Scripting:** Vanilla JavaScript (ES6+), optimized with event delegation and strict DOM management.
- **Styling:** Tailwind CSS (via CDN with custom `tailwind.config` overrides) & Google Fonts (`Manrope`, `Inter`).
- **Data Architecture:** LocalStorage persistence with an Immutable Source of Truth pattern to prevent state desyncs.
- **Icons:** Google Material Symbols.

---

## 🛡️ Security & Performance Enhancements v2.0
- **Sanitized Inputs:** All administrative login attempts pass through automated string sanitization.
- **Cryptographic Hashing:** Implemented `crypto.subtle.digest(SHA-256)` preventing password exposure on GitHub.
- **Event Delegation Security:** Centralized DOM listeners prevent memory leaks and isolated script injection. 

---

## 🚀 How to Run Locally

Since this is a lightweight, dependency-free architecture, you just need a standard HTTP server.

1. Clone the repository natively.
2. Initialize a local server (e.g., Python):
   ```bash
   python3 -m http.server 8000
   ```
3. Open `http://localhost:8000` in your web browser.

> Note: Local file protocols (`file://`) will block data saving due to strict CORS and browser storage security policies. Running via `http://localhost` is required.

---

### Developed for Vibepick
*The definitive shopping experience.*
