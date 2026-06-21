<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Categories extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $categories = $db->table('categories')->get()->getResultArray();
        return $this->respond($categories);
    }

    public function create()
    {
        $json = $this->request->getJSON(true) ?? $this->request->getPost();
        
        if (empty($json['name'])) {
            return $this->fail('Nama kategori wajib diisi!', 400);
        }

        $db = \Config\Database::connect();
        
        $slug = lowercase_slug($json['name']);
        
        $newCat = [
            'id'         => 'cat_' . time() . '_' . rand(10, 99),
            'name'       => $json['name'],
            'slug'       => $slug,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        $db->table('categories')->insert($newCat);
        return $this->respond($newCat, 201);
    }

    public function update($id = null)
    {
        $json = $this->request->getJSON(true);
        if (!$json) {
            return $this->fail('Request body harus dalam format JSON!', 400);
        }
        if (!$id) {
            return $this->fail('ID Kategori tidak disediakan.', 400);
        }

        $db = \Config\Database::connect();
        $category = $db->table('categories')->where('id', $id)->get()->getRowArray();
        if (!$category) {
            return $this->failNotFound('Kategori tidak ditemukan!');
        }

        $updateData = [];
        if (isset($json['name'])) {
            $updateData['name'] = $json['name'];
            $updateData['slug'] = lowercase_slug($json['name']);
        }
        $updateData['updated_at'] = date('Y-m-d H:i:s');

        if (!empty($updateData)) {
            $db->table('categories')->where('id', $id)->update($updateData);
        }

        $updatedCat = $db->table('categories')->where('id', $id)->get()->getRowArray();
        return $this->respond($updatedCat);
    }

    public function delete($id = null)
    {
        if (!$id) {
            return $this->fail('ID Kategori tidak disediakan.', 400);
        }

        $db = \Config\Database::connect();
        $category = $db->table('categories')->where('id', $id)->get()->getRowArray();
        if (!$category) {
            return $this->failNotFound('Kategori tidak ditemukan!');
        }

        // Cascade: set category_id = null for all books using this category
        $db->table('books')->where('category_id', $id)->update(['category_id' => null]);

        $db->table('categories')->where('id', $id)->delete();
        return $this->respond(['success' => true, 'message' => 'Kategori berhasil dihapus.']);
    }
}

// Helper slug generator
function lowercase_slug($string) {
    return strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $string), '-'));
}
