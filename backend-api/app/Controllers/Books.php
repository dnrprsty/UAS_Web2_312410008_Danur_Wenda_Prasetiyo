<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Books extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $books = $db->table('books')
            ->select('books.id, books.title, books.author_id as authorId, books.category_id as categoryId, books.cover_url as coverUrl, books.description, books.stock, books.rental_price as rentalPrice, books.rental_duration as rentalDuration, authors.name as authorName, categories.name as categoryName')
            ->join('authors', 'authors.id = books.author_id', 'left')
            ->join('categories', 'categories.id = books.category_id', 'left')
            ->get()
            ->getResultArray();

        // Convert stock, rentalPrice, rentalDuration back to numeric integers
        foreach ($books as &$book) {
            $book['stock'] = (int)$book['stock'];
            $book['rentalPrice'] = (int)$book['rentalPrice'];
            $book['rentalDuration'] = (int)$book['rentalDuration'];
        }

        return $this->respond($books);
    }

    public function create()
    {
        $json = $this->request->getJSON(true) ?? $this->request->getPost();
        
        if (empty($json['title']) || empty($json['authorId']) || empty($json['categoryId'])) {
            return $this->fail('Kolom judul, penulis, dan kategori wajib diisi!', 400);
        }

        $db = \Config\Database::connect();
        $newBook = [
            'id'              => 'book_' . time() . '_' . rand(10, 99),
            'title'           => $json['title'],
            'author_id'       => $json['authorId'],
            'category_id'     => $json['categoryId'],
            'cover_url'       => $json['coverUrl'] ?: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=60',
            'description'     => $json['description'] ?: 'Tidak ada deskripsi tambahan.',
            'stock'           => (int)($json['stock'] ?? 1),
            'rental_price'    => (int)($json['rentalPrice'] ?? 3000),
            'rental_duration' => (int)($json['rentalDuration'] ?? 3),
            'created_at'      => date('Y-m-d H:i:s'),
            'updated_at'      => date('Y-m-d H:i:s')
        ];

        $db->table('books')->insert($newBook);

        // Map output back to camelCase
        $output = [
            'id'             => $newBook['id'],
            'title'          => $newBook['title'],
            'authorId'       => $newBook['author_id'],
            'categoryId'     => $newBook['category_id'],
            'coverUrl'       => $newBook['cover_url'],
            'description'    => $newBook['description'],
            'stock'          => $newBook['stock'],
            'rentalPrice'    => $newBook['rental_price'],
            'rentalDuration' => $newBook['rental_duration'],
        ];

        return $this->respond($output, 201);
    }

    public function update($id = null)
    {
        $json = $this->request->getJSON(true) ?? $this->request->getRawInput();
        if (!$id) {
            return $this->fail('ID Buku tidak disediakan.', 400);
        }

        $db = \Config\Database::connect();
        $book = $db->table('books')->where('id', $id)->get()->getRowArray();
        if (!$book) {
            return $this->failNotFound('Buku tidak ditemukan!');
        }

        $updateData = [];
        if (isset($json['title'])) $updateData['title'] = $json['title'];
        if (isset($json['authorId'])) $updateData['author_id'] = $json['authorId'];
        if (isset($json['categoryId'])) $updateData['category_id'] = $json['categoryId'];
        if (isset($json['coverUrl'])) $updateData['cover_url'] = $json['coverUrl'];
        if (isset($json['description'])) $updateData['description'] = $json['description'];
        if (isset($json['stock'])) $updateData['stock'] = (int)$json['stock'];
        if (isset($json['rentalPrice'])) $updateData['rental_price'] = (int)$json['rentalPrice'];
        if (isset($json['rentalDuration'])) $updateData['rental_duration'] = (int)$json['rentalDuration'];
        $updateData['updated_at'] = date('Y-m-d H:i:s');

        if (!empty($updateData)) {
            $db->table('books')->where('id', $id)->update($updateData);
        }

        // Get updated book with author & category names
        $updatedBook = $db->table('books')
            ->select('books.id, books.title, books.author_id as authorId, books.category_id as categoryId, books.cover_url as coverUrl, books.description, books.stock, books.rental_price as rentalPrice, books.rental_duration as rentalDuration, authors.name as authorName, categories.name as categoryName')
            ->join('authors', 'authors.id = books.author_id', 'left')
            ->join('categories', 'categories.id = books.category_id', 'left')
            ->where('books.id', $id)
            ->get()
            ->getRowArray();

        $updatedBook['stock'] = (int)$updatedBook['stock'];
        $updatedBook['rentalPrice'] = (int)$updatedBook['rentalPrice'];
        $updatedBook['rentalDuration'] = (int)$updatedBook['rentalDuration'];

        return $this->respond($updatedBook);
    }

    public function delete($id = null)
    {
        if (!$id) {
            return $this->fail('ID Buku tidak disediakan.', 400);
        }

        $db = \Config\Database::connect();
        $book = $db->table('books')->where('id', $id)->get()->getRowArray();
        if (!$book) {
            return $this->failNotFound('Buku tidak ditemukan!');
        }

        // Cascade: hapus semua loans terkait buku ini dulu
        $db->table('loans')->where('book_id', $id)->delete();

        // Hapus buku
        $db->table('books')->where('id', $id)->delete();
        return $this->respond(['success' => true, 'message' => 'Buku berhasil dihapus.']);
    }
}
