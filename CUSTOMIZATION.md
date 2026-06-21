# 🛠 Panduan Kustomisasi Data — E-Library Neo Brutalist

Panduan ini mencakup cara **menambah, mengedit, dan menghapus** data penulis, buku, kategori, anggota, dan peminjaman lewat **Dashboard Admin UI** maupun **REST API langsung**.

---

## Daftar Isi

1. [Akses Dashboard Admin](#1-akses-dashboard-admin)
2. [Kategori](#2-kategori)
3. [Penulis](#3-penulis)
4. [Buku](#4-buku)
5. [Anggota](#5-anggota)
6. [Peminjaman](#6-peminjaman)
7. [API Reference](#7-api-reference)

---

## 1. Akses Dashboard Admin

1. Buka `frontend-spa/index.html` di browser.
2. Klik tombol **Login Admin** pojok kanan atas.
3. Masuk pakai kredensial:

   | Field    | Value       |
   |----------|-------------|
   | Username | `admin`     |
   | Password | `admin123`  |

4. Setelah login, kamu masuk ke **Dashboard Admin** dengan 6 tab:

   | Tab                    | Fungsi                        |
   |------------------------|-------------------------------|
   | Ringkasan Dashboard    | Statistik & grafik kategori   |
   | Katalog Buku           | CRUD buku                     |
   | Manajemen Kategori     | CRUD kategori                 |
   | Daftar Penulis         | CRUD penulis                  |
   | Registrasi Anggota     | CRUD anggota                  |
   | Sirkulasi Rental       | CRUD peminjaman               |

---

## 2. Kategori

### Via UI Dashboard

**Tambah Kategori:**
1. Klik tab **Manajemen Kategori**.
2. Klik tombol **+ Catat Data Baru**.
3. Isi field **Nama Kategori** (contoh: `Fiksi Ilmiah`).
4. Klik **Simpan Perubahan**.

> Slug dibuat otomatis dari nama (contoh: `fiksi-ilmiah`).

**Edit Kategori:**
1. Cari baris yang mau diedit.
2. Klik tombol **Edit**.
3. Ubah nama, klik **Simpan Perubahan**.

**Hapus Kategori:**
1. Klik tombol **Hapus** pada baris yang dituju.
2. Konfirmasi dialog. Buku yang memakai kategori ini akan otomatis kategori_id-nya jadi `null`.

### Via API

```bash
# GET daftar kategori
curl http://localhost:8080/api/categories

# POST tambah kategori baru
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Fiksi Ilmiah"}'

# PUT edit kategori (ganti <id> dengan id kategori)
curl -X PUT http://localhost:8080/api/categories/<id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Fiksi & Fantasi"}'

# DELETE hapus kategori
curl -X DELETE http://localhost:8080/api/categories/<id> \
  -H "Authorization: Bearer <token>"
```

---

## 3. Penulis

### Via UI Dashboard

**Tambah Penulis:**
1. Klik tab **Daftar Penulis**.
2. Klik **+ Catat Data Baru**.
3. Isi:
   - **Nama Penulis / Sastrawan** (wajib)
   - **Profil Biografi** (opsional)
4. Klik **Simpan Perubahan**.

**Edit Penulis:**
1. Klik **Edit** pada baris penulis.
2. Ubah data, klik **Simpan Perubahan**.

**Hapus Penulis:**
1. Klik **Hapus**.
2. Konfirmasi. Buku terkait otomatis author_id-nya jadi `null`.

### Via API

```bash
# GET semua penulis
curl http://localhost:8080/api/authors

# POST tambah penulis
curl -X POST http://localhost:8080/api/authors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"J.K. Rowling","bio":"Penulis seri Harry Potter."}'

# PUT edit penulis
curl -X PUT http://localhost:8080/api/authors/<id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Joanne Rowling","bio":"Penulis Inggris."}'

# DELETE hapus penulis
curl -X DELETE http://localhost:8080/api/authors/<id> \
  -H "Authorization: Bearer <token>"
```

---

## 4. Buku

### Via UI Dashboard

**Tambah Buku:**
1. Klik tab **Katalog Buku**.
2. Klik **+ Catat Data Baru**.
3. Isi form:

   | Field                      | Keterangan                          |
   |----------------------------|--------------------------------------|
   | Judul Buku / Komik         | Wajib                                |
   | Penulis / Kreator          | Pilih dari dropdown (data penulis)   |
   | Genre Kategori             | Pilih dari dropdown (data kategori)  |
   | Tautan Gambar Cover (URL)  | Opsional, default gambar Unsplash    |
   | Sinopsis Ringkasan         | Opsional                             |
   | Jumlah Unit Stok           | Angka, default 5                     |
   | Biaya Rental / hari (Rp)   | Angka, default 5000                  |
   | Batas Hari Rental          | Angka, default 7                     |

4. Klik **Simpan Perubahan**.

**Edit Buku:**
1. Klik **Edit** pada baris buku.
2. Ubah data. Dropdown penulis & kategori otomatis terisi data terkini.
3. Klik **Simpan Perubahan**.

**Hapus Buku:**
1. Klik **Hapus**.
2. Konfirmasi. Semua peminjaman terkait buku ini juga ikut terhapus (cascade).

### Via API

```bash
# GET semua buku (dengan relasi author & category)
curl http://localhost:8080/api/books

# POST tambah buku
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title":"Harry Potter and the Sorcerer Stone",
    "authorId":"auth_xxx",
    "categoryId":"cat_xxx",
    "coverUrl":"https://images.unsplash.com/photo-xxx",
    "description":"Seorang anak penyihir...",
    "stock":5,
    "rentalPrice":7000,
    "rentalDuration":7
  }'

# PUT edit buku
curl -X PUT http://localhost:8080/api/books/<id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Harry Potter (Revised)","stock":10}'

# DELETE hapus buku (beserta loans terkait)
curl -X DELETE http://localhost:8080/api/books/<id> \
  -H "Authorization: Bearer <token>"
```

---

## 5. Anggota

### Via UI Dashboard

**Tambah Anggota:**
1. Klik tab **Registrasi Anggota**.
2. Klik **+ Catat Data Baru**.
3. Isi:

   | Field             | Keterangan                             |
   |-------------------|-----------------------------------------|
   | Nama Lengkap      | Wajib                                   |
   | Alamat Email      | Wajib, harus format email               |
   | Nomor Telepon     | Opsional                                |
   | Level Keanggotaan | Pilih: **Regular** atau **Premium**     |

4. Klik **Simpan Perubahan**.

**Edit Anggota:** Klik **Edit**, ubah data, simpan.
**Hapus Anggota:** Klik **Hapus**, konfirmasi.

### Via API

```bash
# GET semua anggota
curl http://localhost:8080/api/members

# POST tambah anggota
curl -X POST http://localhost:8080/api/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "phone":"08123456789",
    "membershipType":"Premium"
  }'

# PUT edit anggota
curl -X PUT http://localhost:8080/api/members/<id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"John Doe Updated","membershipType":"Regular"}'

# DELETE hapus anggota
curl -X DELETE http://localhost:8080/api/members/<id> \
  -H "Authorization: Bearer <token>"
```

---

## 6. Peminjaman

### Via UI Dashboard

**Buat Peminjaman Baru:**
1. Klik tab **Sirkulasi Rental**.
2. Klik **+ Catat Data Baru**.
3. Pilih:
   - **Pilih Anggota Perpustakaan** — hanya anggota yang terdaftar muncul.
   - **Buku yang Akan Disewa** — hanya buku dengan stok > 0 yang muncul.
4. Klik **Simpan Perubahan**.
5. Stok buku otomatis berkurang 1.

**Kembalikan Buku:**
1. Cari baris peminjaman yang statusnya **AKTIF**.
2. Klik tombol **Kembalikan**.
3. Stok buku otomatis pulih, status jadi **KEMBALI**, fee dihitung otomatis.

**Hapus Transaksi:**
1. Klik **Hapus** pada baris peminjaman.
2. Konfirmasi. Catatan: ini hapus permanen, tidak pengembalian.

### Via API

```bash
# GET semua peminjaman
curl http://localhost:8080/api/loans

# POST buat peminjaman baru
curl -X POST http://localhost:8080/api/loans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "memberId":"mem_xxx",
    "bookId":"book_xxx"
  }'

# POST kembalikan buku
curl -X POST http://localhost:8080/api/loans/<loanId>/return \
  -H "Authorization: Bearer <token>"

# DELETE hapus peminjaman
curl -X DELETE http://localhost:8080/api/loans/<loanId> \
  -H "Authorization: Bearer <token>"
```

---

## 7. API Reference

### Endpoint Summary

| Method   | Endpoint                          | Auth  | Keterangan                           |
|----------|-----------------------------------|-------|--------------------------------------|
| `GET`    | `/api/categories`                 | Tidak | Daftar kategori                      |
| `POST`   | `/api/categories`                 | Ya    | Tambah kategori                      |
| `PUT`    | `/api/categories/{id}`            | Ya    | Edit kategori                        |
| `DELETE` | `/api/categories/{id}`            | Ya    | Hapus kategori                       |
| `GET`    | `/api/authors`                    | Tidak | Daftar penulis                       |
| `POST`   | `/api/authors`                    | Ya    | Tambah penulis                       |
| `PUT`    | `/api/authors/{id}`               | Ya    | Edit penulis                         |
| `DELETE` | `/api/authors/{id}`               | Ya    | Hapus penulis                        |
| `GET`    | `/api/books`                      | Tidak | Daftar buku (dengan relasi)          |
| `POST`   | `/api/books`                      | Ya    | Tambah buku                          |
| `PUT`    | `/api/books/{id}`                 | Ya    | Edit buku                            |
| `DELETE` | `/api/books/{id}`                 | Ya    | Hapus buku (cascade loans)           |
| `GET`    | `/api/members`                    | Ya    | Daftar anggota                       |
| `POST`   | `/api/members`                    | Ya    | Tambah anggota                       |
| `PUT`    | `/api/members/{id}`               | Ya    | Edit anggota                         |
| `DELETE` | `/api/members/{id}`               | Ya    | Hapus anggota                        |
| `GET`    | `/api/loans`                      | Ya    | Daftar peminjaman                    |
| `POST`   | `/api/loans`                      | Ya    | Buat peminjaman baru                 |
| `POST`   | `/api/loans/{id}/return`          | Ya    | Proses pengembalian buku             |
| `DELETE` | `/api/loans/{id}`                 | Ya    | Hapus transaksi peminjaman           |
| `GET`    | `/api/dashboard/stats`            | Ya    | Statistik dashboard                  |
| `POST`   | `/api/auth/login`                 | Tidak | Login dapat token                    |
| `POST`   | `/api/admin/reset-db`             | Ya    | Reset database ke data awal (seed)   |

### Auth Flow

```bash
# Step 1: Login dapat token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

# Step 2: Pakai token di request berikutnya
curl http://localhost:8080/api/books \
  -H "Authorization: Bearer $TOKEN"
```

### Catatan

- ID dibuat otomatis backend dengan format: `auth_1740000000_42`, `cat_...`, `book_...`, `mem_...`, `loan_...`
- Format response: JSON dengan field camelCase (`authorId`, `categoryName`, dll)
- Filter backend: **tidak ada**. Gunakan parameter pencarian dari frontend (client-side filter)

---

> **Tips:** Kamu bisa isi data lewat UI dulu, lalu cek hasilnya via `curl` untuk verifikasi. Atau sebaliknya — inject data banyak lewat API, lalu kelola lewat UI.