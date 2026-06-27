# 🚀 Panduan Deploy E-Library (Backend + Frontend Terpisah)

Arsitektur deploy:

```
┌──────────────────────┐   HTTPS / JSON   ┌──────────────────────┐   TLS    ┌─────────────────────┐
│  Frontend SPA        │ ───────────────► │  Backend API         │ ───────► │  Database           │
│  Vercel (statis)     │ ◄─────────────── │  Render (Docker PHP) │          │  TiDB Cloud (MySQL) │
└──────────────────────┘                  └──────────────────────┘          └─────────────────────┘
```

| Bagian   | Host                       | Biaya | Catatan                                   |
|----------|----------------------------|-------|-------------------------------------------|
| Database | TiDB Cloud Serverless      | $0    | MySQL-compatible, tanpa kartu kredit      |
| Backend  | Render (Docker)            | $0    | Tanpa kartu kredit; cold start ~30–50 dtk |
| Frontend | Vercel (static)            | $0    | Tanpa kartu kredit                        |

> **Urutan deploy: Database → Backend → Frontend.** Backend butuh kredensial DB, dan
> frontend butuh URL backend.

---

## ⚠️ WAJIB: Rotasi password database

File `backend-api/app/Config/Database.php` **dulunya** menyimpan kredensial TiDB
secara hardcoded dan sudah pernah ter-commit ke git. Sekarang sudah dipindah ke
environment variable, **tapi password lama masih ada di riwayat git**.

➡️ Login ke TiDB Cloud → **reset/generate password baru** sebelum deploy, lalu pakai
password baru itu di langkah berikutnya.

---

## 1. Database — TiDB Cloud Serverless

1. Daftar / login di <https://tidbcloud.com> (bisa via akun Google/GitHub, tanpa kartu).
2. **Create Cluster** → pilih tipe **Serverless** → region terdekat (mis. `Singapore`).
3. Setelah cluster jadi, klik **Connect**. Catat detail koneksi:
   - **Host** → mis. `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`
   - **Port** → `4000`
   - **User** → mis. `xxxxxxxx.root`
   - **Password** → (yang baru kamu generate)
4. Buat database untuk app ini. Di tab **SQL Editor** / **Chat2Query** jalankan:
   ```sql
   CREATE DATABASE IF NOT EXISTS elibrary
     CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
   ```
   (Boleh pakai nama lain — sesuaikan `DB_NAME` nanti.)

> Tabel **tidak perlu** dibuat manual — migration CodeIgniter dijalankan otomatis
> oleh container backend saat boot.

---

## 2. Backend — Render (Docker)

### 2a. Push kode ke GitHub
Repo ini sudah berisi `Dockerfile`, `docker-entrypoint.sh`, `render.yaml`, dan
CA cert `backend-api/isrgrootx1.pem`. Cukup commit & push ke GitHub:

```bash
git add .
git commit -m "Add deployment config (Render + Vercel + TiDB)"
git push
```

### 2b. Buat Web Service di Render
1. Daftar / login di <https://render.com> (bisa via GitHub, tanpa kartu kredit).
2. **New → Web Service** → connect repo GitHub kamu.
3. Render akan mendeteksi `render.yaml` (Blueprint). Kalau tidak, isi manual:
   - **Root Directory:** `backend-api`
   - **Runtime:** `Docker`
   - **Instance Type:** `Free`
4. Di **Environment**, isi variabel berikut (yang `sync:false` belum terisi):

   | Key            | Value (contoh)                                              |
   |----------------|------------------------------------------------------------|
   | `CI_ENVIRONMENT` | `production`                                             |
   | `DB_HOST`      | `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`          |
   | `DB_PORT`      | `4000`                                                     |
   | `DB_NAME`      | `elibrary`                                                 |
   | `DB_USER`      | `xxxxxxxx.root`                                            |
   | `DB_PASS`      | `<password TiDB baru kamu>`                                |
   | `DB_SSL_CA`    | `isrgrootx1.pem`                                           |
   | `APP_BASE_URL` | `https://NAMA-SERVICE-KAMU.onrender.com` *(URL service ini)*    |

   > `APP_BASE_URL` baru kamu tahu setelah service dibuat. Boleh isi sementara,
   > lalu update setelah dapat URL final, dan **Manual Deploy** ulang.
5. **Create Web Service**. Render build image (~3–5 menit), lalu jalan. Container otomatis
   menjalankan `php spark migrate --all` (membuat semua tabel).

### 2c. Seeding data awal (SEKALI saja)
Migration membuat tabel kosong. Untuk mengisi data bawaan (admin, buku, dll.),
panggil endpoint reset-db **satu kali** dari terminal kamu:

```bash
curl -X POST https://NAMA-SERVICE-KAMU.onrender.com/api/admin/reset-db \
  -H "Authorization: Bearer mock-jwt-admin-secret-token"
```

Respons sukses: `{"success":true,"message":"Database kembali di-seeding ke data bawaan!"}`

> ⚠️ Endpoint ini **truncate + isi ulang** semua tabel ke data default. Jangan dipanggil
> lagi setelah ada data produksi (kecuali memang mau reset). Itu sebabnya seeding TIDAK
> dijalankan otomatis setiap boot.

### 2d. Tes backend
```bash
curl https://NAMA-SERVICE-KAMU.onrender.com/api/books          # daftar buku (JSON)
curl https://NAMA-SERVICE-KAMU.onrender.com/api/dashboard/stats # statistik
```

---

## 3. Frontend — Vercel

1. Edit `frontend-spa/config.js`, ganti placeholder dengan URL Render kamu (tanpa slash akhir):
   ```js
   window.API_BASE_URL =
     (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
       ? 'http://localhost:8080'
       : 'https://NAMA-SERVICE-KAMU.onrender.com';   // ← URL backend Render kamu
   ```
   Commit & push perubahan ini.
2. Daftar / login di <https://vercel.com> (via GitHub, tanpa kartu).
3. **Add New → Project** → import repo yang sama.
4. Konfigurasi penting:
   - **Root Directory:** `frontend-spa`  ← (klik *Edit*, pilih folder ini)
   - **Framework Preset:** `Other` (tidak ada build step)
   - **Build Command:** kosongkan
   - **Output Directory:** kosongkan (default, serve file statis apa adanya)
5. **Deploy**. Setelah selesai kamu dapat URL seperti `https://elibrary-xxx.vercel.app`.

---

## 4. Verifikasi end-to-end

1. Buka URL Vercel di browser → katalog buku tampil (request pertama bisa lambat
   ~30–50 dtk karena backend Render "bangun" dari cold start).
2. Klik **Admin Login** → `admin` / `admin123` → masuk Dashboard, statistik tampil.
3. Coba tambah/edit/hapus buku → tersimpan (berarti auth + DB jalan).

Kalau katalog kosong / error koneksi, cek urutannya:
- Sudah jalankan seeding (langkah 2c)?
- `config.js` sudah pakai URL Render yang benar & sudah redeploy Vercel?
- `curl .../api/books` langsung ke Render mengembalikan JSON?

---

## Troubleshooting

| Masalah                                   | Solusi                                                                 |
|-------------------------------------------|-----------------------------------------------------------------------|
| Request pertama lama lalu error timeout   | Cold start Render free. Reload; backend butuh ~30–50 dtk untuk bangun. |
| `api/books` 500 di Render                 | Cek env `DB_*` & `DB_SSL_CA=isrgrootx1.pem`. Lihat **Logs** di Render. |
| Frontend error CORS / koneksi             | Pastikan `config.js` pakai `https://...onrender.com` & sudah redeploy. |
| Login 401 padahal benar                   | Belum seeding (langkah 2c) — tabel `users` kosong.                     |
| Tabel tidak terbuat                       | Lihat log Render apakah `php spark migrate` sukses; cek kredensial DB. |

## Catatan keamanan & batasan (penting untuk produksi nyata)
- **Token admin statis** (`mock-jwt-admin-secret-token`) ada di kode publik — siapa pun
  bisa POST/PUT/DELETE. Cukup untuk UAS; untuk produksi nyata ganti ke JWT asli + secret.
- **Endpoint `/api/admin/reset-db`** bisa dipanggil siapa saja yang punya token itu →
  pertimbangkan menonaktifkannya setelah seeding.
- **Cold start Render free**: service tidur setelah 15 menit idle. Untuk demo penting,
  buka situs ~1 menit sebelumnya agar sudah "panas".
- **TiDB Serverless** punya kuota gratis bulanan (request units & storage) — lebih dari
  cukup untuk project ini.

## Pengembangan lokal (tetap jalan seperti biasa)
Perubahan ini tidak mengubah cara dev lokal — lihat `GUIDE.md`. Singkatnya: `.env` lokal
mengarah ke `localhost`, dan `config.js` otomatis pakai `http://localhost:8080` saat
diakses dari `localhost`.
