<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Members extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $members = $db->table('members')
            ->select('id, name, email, phone, membership_type as membershipType')
            ->get()
            ->getResultArray();
        return $this->respond($members);
    }

    public function create()
    {
        $json = $this->request->getJSON(true) ?? $this->request->getPost();
        
        if (empty($json['name']) || empty($json['email'])) {
            return $this->fail('Nama dan Email anggota wajib diisi!', 400);
        }

        $db = \Config\Database::connect();
        $newMember = [
            'id'              => 'mem_' . time() . '_' . rand(10, 99),
            'name'            => $json['name'],
            'email'           => $json['email'],
            'phone'           => $json['phone'] ?: '-',
            'membership_type' => ($json['membershipType'] === 'Premium') ? 'Premium' : 'Regular',
            'created_at'      => date('Y-m-d H:i:s'),
            'updated_at'      => date('Y-m-d H:i:s')
        ];

        $db->table('members')->insert($newMember);

        $output = [
            'id'             => $newMember['id'],
            'name'           => $newMember['name'],
            'email'          => $newMember['email'],
            'phone'          => $newMember['phone'],
            'membershipType' => $newMember['membership_type']
        ];

        return $this->respond($output, 201);
    }

    public function update($id = null)
    {
        $json = $this->request->getJSON(true);
        if (!$json) {
            return $this->fail('Request body harus dalam format JSON!', 400);
        }
        if (!$id) {
            return $this->fail('ID Anggota tidak disediakan.', 400);
        }

        $db = \Config\Database::connect();
        $member = $db->table('members')->where('id', $id)->get()->getRowArray();
        if (!$member) {
            return $this->failNotFound('Anggota tidak ditemukan!');
        }

        $updateData = [];
        if (isset($json['name'])) $updateData['name'] = $json['name'];
        if (isset($json['email'])) $updateData['email'] = $json['email'];
        if (isset($json['phone'])) $updateData['phone'] = $json['phone'];
        if (isset($json['membershipType'])) $updateData['membership_type'] = ($json['membershipType'] === 'Premium') ? 'Premium' : 'Regular';
        $updateData['updated_at'] = date('Y-m-d H:i:s');

        if (!empty($updateData)) {
            $db->table('members')->where('id', $id)->update($updateData);
        }

        $updatedMember = $db->table('members')
            ->select('id, name, email, phone, membership_type as membershipType')
            ->where('id', $id)
            ->get()
            ->getRowArray();

        return $this->respond($updatedMember);
    }

    public function delete($id = null)
    {
        if (!$id) {
            return $this->fail('ID Anggota tidak disediakan.', 400);
        }

        $db = \Config\Database::connect();
        $member = $db->table('members')->where('id', $id)->get()->getRowArray();
        if (!$member) {
            return $this->failNotFound('Anggota tidak ditemukan!');
        }

        // Cascade: hapus semua loans anggota ini
        $db->table('loans')->where('member_id', $id)->delete();

        $db->table('members')->where('id', $id)->delete();
        return $this->respond(['success' => true, 'message' => 'Anggota berhasil dihapus.']);
    }
}
