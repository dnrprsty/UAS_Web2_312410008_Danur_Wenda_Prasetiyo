<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Authors extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $authors = $db->table('authors')->get()->getResultArray();
        return $this->respond($authors);
    }

    public function create()
    {
        $json = $this->request->getJSON(true) ?? $this->request->getPost();
        
        if (empty($json['name'])) {
            return $this->fail('Nama penulis wajib diisi!', 400);
        }

        $db = \Config\Database::connect();
        $newAuthor = [
            'id'         => 'auth_' . time() . '_' . rand(10, 99),
            'name'       => $json['name'],
            'bio'        => $json['bio'] ?: 'Tidak ada profil biografi tambahan.',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        $db->table('authors')->insert($newAuthor);
        return $this->respond($newAuthor, 201);
    }

    public function update($id = null)
    {
        $json = $this->request->getJSON(true);
        if (!$json) {
            return $this->fail('Request body harus dalam format JSON!', 400);
        }
        if (!$id) {
            return $this->fail('ID Penulis tidak disediakan.', 400);
        }

        $db = \Config\Database::connect();
        $author = $db->table('authors')->where('id', $id)->get()->getRowArray();
        if (!$author) {
            return $this->failNotFound('Penulis tidak ditemukan!');
        }

        $updateData = [];
        if (isset($json['name'])) $updateData['name'] = $json['name'];
        if (isset($json['bio'])) $updateData['bio'] = $json['bio'];
        $updateData['updated_at'] = date('Y-m-d H:i:s');

        if (!empty($updateData)) {
            $db->table('authors')->where('id', $id)->update($updateData);
        }

        $updatedAuthor = $db->table('authors')->where('id', $id)->get()->getRowArray();
        return $this->respond($updatedAuthor);
    }

    public function delete($id = null)
    {
        if (!$id) {
            return $this->fail('ID Penulis tidak disediakan.', 400);
        }

        $db = \Config\Database::connect();
        $author = $db->table('authors')->where('id', $id)->get()->getRowArray();
        if (!$author) {
            return $this->failNotFound('Penulis tidak ditemukan!');
        }

        // Cascade: set author_id = null for all books using this author
        $db->table('books')->where('author_id', $id)->update(['author_id' => null]);

        $db->table('authors')->where('id', $id)->delete();
        return $this->respond(['success' => true, 'message' => 'Penulis berhasil dihapus.']);
    }
}
