# 🚀 Panduan Singkat Menjalankan E-Library

---

## Prasyarat

- **PHP** >= 8.1 (dengan extension `mysqli` dan `pdo_mysql`)
- **Composer**
- **MySQL / MariaDB**
- **Browser** (Chrome / Firefox / Edge)

---

## 1. Setup Database

```bash
# Buat database
sudo mariadb -e "CREATE DATABASE IF NOT EXISTS uas_web2_elibrary CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"

# Buat user (ganti 'noer' dengan username kamu)
sudo mariadb -e "CREATE USER IF NOT EXISTS 'noer'@'localhost' IDENTIFIED BY ''; GRANT ALL PRIVILEGES ON uas_web2_elibrary.* TO 'noer'@'localhost'; FLUSH PRIVILEGES;"
```

---

## 2. Setup Backend API

```bash
cd backend-api

# Copy env file
cp env .env

# Edit .env — pastikan database config benar:
#   database.default.DBDriver = MySQLi
#   database.default.database = uas_web2_elibrary
#   database.default.username = noer
#   database.default.password = (kosong)

# Install dependencies (jika belum)
composer install

# Jalankan migrasi
php spark migrate --all

# Seed data awal
php spark db:seed MainSeeder

# Jalankan server
php spark serve
```

Server berjalan di: **http://localhost:8080**

---

## 3. Jalankan Frontend SPA

```bash
cd frontend-spa

# Buka index.html di browser
# Atau gunakan VS Code Live Server
```

Pastikan backend sudah menyala sebelum membuka frontend.

---

## 4. Login Admin

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

---

## 5. Test API (opsional)

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Ambil data buku
curl http://localhost:8080/api/books

# Ambil statistik dashboard
curl http://localhost:8080/api/dashboard/stats
```

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `Class "PDO\Connection" not found` | Ganti `DBDriver` di `.env` dari `PDO` ke `MySQLi` |
| `Access denied for user` | Cek username/password di `.env` dan pastikan user DB sudah dibuat |
| `MYSQLI_STORE_RESULT` not found | Enable extension `mysqli` di `php.ini` |
| Login 401 | Pastikan AuthFilter skip `/api/auth/` endpoint |
| Port 8080 sudah dipakai | `killall php` lalu `php spark serve`, atau gunakan port lain |
