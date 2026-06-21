<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class MainSeeder extends Seeder
{
    public function run()
    {
        $db = \Config\Database::connect();

        // Truncate tables first to avoid duplicates
        $db->table('loans')->truncate();
        $db->table('members')->truncate();
        $db->table('books')->truncate();
        $db->table('authors')->truncate();
        $db->table('categories')->truncate();
        $db->table('users')->truncate();

        // 1. Seed Admin User
        $db->table('users')->insert([
            'id'         => 'usr_1',
            'username'   => 'admin',
            'password'   => password_hash('admin123', PASSWORD_DEFAULT),
            'role'       => 'admin',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);

        // 2. Seed Authors
        $authors = [
            [
                'id'         => 'auth_1',
                'name'       => 'Tatsuki Fujimoto',
                'bio'        => 'Kreator manga asal Jepang terkenal dengan karya bertema gelap dan absurd seperti Chainsaw Man.',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id'         => 'auth_2',
                'name'       => 'R.A. Kosasih',
                'bio'        => 'Bapak Komik Indonesia, pionir komik wayang klasik yang melegenda.',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id'         => 'auth_3',
                'name'       => 'Tere Liye',
                'bio'        => 'Penulis novel produktif Indonesia dengan puluhan karya best-seller berkelas nasional.',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id'         => 'auth_4',
                'name'       => 'Andrea Hirata',
                'bio'        => 'Novelist inspiratif, penulis Laskar Pelangi yang melambungkan nama Belitung ke seluruh penjuru dunia.',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id'         => 'auth_5',
                'name'       => 'Isman H. Suryaman',
                'bio'        => 'Penulis literatur pemrograman web dan sistem berbasis teknologi modern.',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ];
        $db->table('authors')->insertBatch($authors);

        // 3. Seed Categories
        $categories = [
            [
                'id'         => 'cat_1',
                'name'       => 'Komik Jepang (Manga)',
                'slug'       => 'manga',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id'         => 'cat_2',
                'name'       => 'Komik Nusantara',
                'slug'       => 'komik-lokal',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id'         => 'cat_3',
                'name'       => 'Novel Sastra',
                'slug'       => 'novel-sastra',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id'         => 'cat_4',
                'name'       => 'Buku Teknologi',
                'slug'       => 'teknologi',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id'         => 'cat_5',
                'name'       => 'Pendidikan & Sains',
                'slug'       => 'pendidikan',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ];
        $db->table('categories')->insertBatch($categories);

        // 4. Seed Books
        $books = [
            [
                'id'              => 'book_1',
                'title'           => 'Chainsaw Man Vol. 1',
                'author_id'       => 'auth_1',
                'category_id'     => 'cat_1',
                'cover_url'       => 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=60',
                'description'     => 'Denji adalah pemburu iblis miskin yang melakukan kontrak mistis dengan anjing iblis gergaji bernama Pochita.',
                'stock'           => 7,
                'rental_price'    => 5000,
                'rental_duration' => 3,
                'created_at'      => date('Y-m-d H:i:s'),
                'updated_at'      => date('Y-m-d H:i:s'),
            ],
            [
                'id'              => 'book_2',
                'title'           => 'Mahabharata: Compilation Edition',
                'author_id'       => 'auth_2',
                'category_id'     => 'cat_2',
                'cover_url'       => 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&auto=format&fit=crop&q=60',
                'description'     => 'Karya agung legendaris R.A Kosasih menceritakan kisah epik kesatria Pandawa dan Kurawa di padang Kurukshetra.',
                'stock'           => 3,
                'rental_price'    => 8000,
                'rental_duration' => 5,
                'created_at'      => date('Y-m-d H:i:s'),
                'updated_at'      => date('Y-m-d H:i:s'),
            ],
            [
                'id'              => 'book_3',
                'title'           => 'Bumi (Saga Dunia Paralel)',
                'author_id'       => 'auth_3',
                'category_id'     => 'cat_3',
                'cover_url'       => 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=60',
                'description'     => 'Pertualangan seru Raib, Seli, dan Ali melintasi portal ke dimensi Klan Bulan yang penuh sihir dan teknologi tinggi.',
                'stock'           => 5,
                'rental_price'    => 6000,
                'rental_duration' => 7,
                'created_at'      => date('Y-m-d H:i:s'),
                'updated_at'      => date('Y-m-d H:i:s'),
            ],
            [
                'id'              => 'book_4',
                'title'           => 'Laskar Pelangi',
                'author_id'       => 'auth_4',
                'category_id'     => 'cat_3',
                'cover_url'       => 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=60',
                'description'     => 'Kisah mengharukan perjuangan 10 murid Laskar Pelangi bersama guru tangguh mereka di Gantong, pulau Belitung.',
                'stock'           => 10,
                'rental_price'    => 4000,
                'rental_duration' => 7,
                'created_at'      => date('Y-m-d H:i:s'),
                'updated_at'      => date('Y-m-d H:i:s'),
            ],
            [
                'id'              => 'book_5',
                'title'           => 'Seni Pemrograman React & Vue modern',
                'author_id'       => 'auth_5',
                'category_id'     => 'cat_4',
                'cover_url'       => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60',
                'description'     => 'Panduan komprehensif menguasai pengembangan aplikasi decoupled SPA menggunakan ekosistem terbaru Javascript.',
                'stock'           => 4,
                'rental_price'    => 10000,
                'rental_duration' => 10,
                'created_at'      => date('Y-m-d H:i:s'),
                'updated_at'      => date('Y-m-d H:i:s'),
            ],
        ];
        $db->table('books')->insertBatch($books);

        // 5. Seed Members
        $members = [
            [
                'id'              => 'mem_1',
                'name'            => 'Danur Wijaya',
                'email'           => 'danurwp70@gmail.com',
                'phone'           => '081234567890',
                'membership_type' => 'Premium',
                'created_at'      => date('Y-m-d H:i:s'),
                'updated_at'      => date('Y-m-d H:i:s'),
            ],
            [
                'id'              => 'mem_2',
                'name'            => 'Budi Santoso',
                'email'           => 'budi.s@outlook.com',
                'phone'           => '085678901234',
                'membership_type' => 'Regular',
                'created_at'      => date('Y-m-d H:i:s'),
                'updated_at'      => date('Y-m-d H:i:s'),
            ],
            [
                'id'              => 'mem_3',
                'name'            => 'Siti Rahmawati',
                'email'           => 'rahmasiti@gmail.com',
                'phone'           => '089876543210',
                'membership_type' => 'Premium',
                'created_at'      => date('Y-m-d H:i:s'),
                'updated_at'      => date('Y-m-d H:i:s'),
            ],
        ];
        $db->table('members')->insertBatch($members);

        // 6. Seed Loans
        $loans = [
            [
                'id'          => 'loan_1',
                'member_id'   => 'mem_1',
                'book_id'     => 'book_1',
                'loan_date'   => '2026-06-10 09:00:00',
                'return_date' => '2026-06-13 10:30:00',
                'status'      => 'Returned',
                'total_fee'   => 5000,
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ],
            [
                'id'          => 'loan_2',
                'member_id'   => 'mem_1',
                'book_id'     => 'book_3',
                'loan_date'   => '2026-06-12 11:00:00',
                'return_date' => null,
                'status'      => 'Active',
                'total_fee'   => 6000,
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ],
            [
                'id'          => 'loan_3',
                'member_id'   => 'mem_2',
                'book_id'     => 'book_2',
                'loan_date'   => '2026-06-14 08:00:00',
                'return_date' => null,
                'status'      => 'Active',
                'total_fee'   => 8000,
                'created_at'  => date('Y-m-d H:i:s'),
                'updated_at'  => date('Y-m-d H:i:s'),
            ],
        ];
        $db->table('loans')->insertBatch($loans);
    }
}
