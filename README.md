# E-Library — Sistem Informasi Rental Buku & Komik Digital

**Proyek Akhir Pemrograman Web 2 (UAS)**

---

## Tentang Sistem

E-Library adalah aplikasi web untuk mengelola rental buku dan komik digital. Sistem ini dibangun dengan arsitektur **decoupled** (terpisah), memisahkan backend API dan frontend SPA secara penuh.

- **Backend API** — CodeIgniter 4 (PHP), RESTful API dengan autentikasi token dan CORS filter.
- **Frontend SPA** — VueJS 3 + Vue Router 4 + Axios + TailwindCSS, desain **Neo-Brutalist** yang responsif dan interaktif.

---

## Fitur Utama

### 🔐 Autentikasi Admin
- Login admin dengan username & password.
- Autentikasi berbasis Bearer Token (mock JWT).
- Endpoint POST/PUT/DELETE dilindungi oleh AuthFilter.

### 📊 Dashboard
- Statistik total buku, total anggota, pinjaman aktif, dan total pendapatan.
- Distribusi buku berdasarkan kategori (grafik).

### 📚 Manajemen Buku
- CRUD buku (tambah, edit, hapus, lihat).
- Data buku meliputi: judul, penulis, kategori, stok, harga rental, durasi rental, cover URL, deskripsi.
- Relasi dengan tabel penulis dan kategori.

### ✍️ Manajemen Penulis
- CRUD penulis (tambah, edit, hapus, lihat).
- Data penulis: nama, bio.

### 📂 Manajemen Kategori
- CRUD kategori (tambah, edit, hapus, lihat).
- Data kategori: nama, slug.

### 👥 Manajemen Anggota
- CRUD anggota (tambah, edit, hapus, lihat).
- Data anggota: nama, email, telepon, tipe keanggotaan (Premium/Basic).

### 📖 Manajemen Peminjaman (Loans)
- CRUD peminjaman (tambah, edit, hapus, lihat).
- Data peminjaman: anggota, buku, tanggal pinjam, tanggal kembali, status (Active/Returned/Overdue), total biaya.
- Relasi dengan tabel anggota dan buku.

---

## Arsitektur Sistem

```
┌─────────────────────┐         ┌─────────────────────────┐
│   Frontend SPA      │  HTTP   │   Backend API           │
│   (VueJS 3 +        │ ──────► │   (CodeIgniter 4)       │
│    TailwindCSS)     │  JSON   │   RESTful API Server    │
│   index.html        │ ◄────── │   localhost:8080/api    │
└─────────────────────┘         └───────────┬─────────────┘
                                            │
                                            ▼
                                  ┌─────────────────────┐
                                  │   MySQL/MariaDB     │
                                  │   uas_web2_elibrary │
                                  └─────────────────────┘
```

### Database Tables
| Tabel | Deskripsi |
|-------|-----------|
| `users` | Akun admin (username, password hash, role) |
| `books` | Data buku/komik |
| `authors` | Data penulis |
| `categories` | Kategori buku |
| `members` | Data anggota rental |
| `loans` | Data peminjaman buku |

---

## API Endpoints

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/login` | Login admin | ❌ |
| GET | `/api/books` | Daftar buku | ❌ |
| POST | `/api/books` | Tambah buku | ✅ |
| PUT | `/api/books/{id}` | Edit buku | ✅ |
| DELETE | `/api/books/{id}` | Hapus buku | ✅ |
| GET | `/api/authors` | Daftar penulis | ❌ |
| POST | `/api/authors` | Tambah penulis | ✅ |
| PUT | `/api/authors/{id}` | Edit penulis | ✅ |
| DELETE | `/api/authors/{id}` | Hapus penulis | ✅ |
| GET | `/api/categories` | Daftar kategori | ❌ |
| POST | `/api/categories` | Tambah kategori | ✅ |
| PUT | `/api/categories/{id}` | Edit kategori | ✅ |
| DELETE | `/api/categories/{id}` | Hapus kategori | ✅ |
| GET | `/api/members` | Daftar anggota | ❌ |
| POST | `/api/members` | Tambah anggota | ✅ |
| PUT | `/api/members/{id}` | Edit anggota | ✅ |
| DELETE | `/api/members/{id}` | Hapus anggota | ✅ |
| GET | `/api/loans` | Daftar peminjaman | ❌ |
| POST | `/api/loans` | Tambah peminjaman | ✅ |
| PUT | `/api/loans/{id}` | Edit peminjaman | ✅ |
| DELETE | `/api/loans/{id}` | Hapus peminjaman | ✅ |
| GET | `/api/dashboard/stats` | Statistik dashboard | ❌ |

---

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Backend | CodeIgniter 4 (PHP 8.x) |
| Frontend | VueJS 3, Vue Router 4, Axios |
| Styling | TailwindCSS (CDN), Neo-Brutalist Design |
| Database | MySQL / MariaDB |
| Server | PHP Built-in Dev Server |

---

## Struktur Repositori

```
web/
├── backend-api/          # CodeIgniter 4 RESTful API
│   ├── app/
│   │   ├── Config/       # Konfigurasi (Routes, Database, CORS, Filter)
│   │   ├── Controllers/  # Controller API (Auth, Books, Authors, dll.)
│   │   ├── Database/     # Migrations & Seeds
│   │   └── Filters/      # AuthFilter, CorsFilter
│   ├── public/           # Entry point (index.php)
│   └── writable/         # Cache, logs, uploads
├── frontend-spa/         # VueJS 3 SPA
│   ├── index.html        # Entry point HTML
│   ├── app.js            # Vue App & Router
│   ├── assets/css/       # Custom CSS
│   └── components/       # Komponen Vue (Login, Dashboard, Home)
├── GUIDE.md              # Panduan singkat menjalankan proyek
└── README.md             # Dokumentasi ini