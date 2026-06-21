<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;
use App\Controllers\BaseController;

class Auth extends BaseController
{
    use ResponseTrait;

    public function login()
    {
        try {
            // Accept both JSON body and form-encoded
            $json = $this->request->getJSON(true);
            if (is_array($json) && !empty($json)) {
                $username = $json['username'] ?? null;
                $password = $json['password'] ?? null;
            } else {
                $username = $this->request->getPost('username');
                $password = $this->request->getPost('password');
            }

            if (!is_string($username) || trim($username) === '' || !is_string($password) || $password === '') {
                return $this->respond([
                    'status'  => 400,
                    'success' => false,
                    'error'   => 'Username dan Password wajib diisi!'
                ], 400);
            }

            $username = trim($username);

            $db = \Config\Database::connect();
            $user = $db->table('users')->where('username', $username)->get()->getRowArray();

            // Verify password: prefer bcrypt hash, allow plaintext fallback only for legacy seeded data
            $passwordMatches = false;
            if ($user) {
                $hash = $user['password'] ?? '';
                if ($hash !== '' && password_verify($password, $hash)) {
                    $passwordMatches = true;
                } elseif ($hash !== '' && hash_equals($hash, $password)) {
                    // Legacy plaintext fallback (kept for robustness during seeding mismatches)
                    $passwordMatches = true;
                }
            }

            if ($passwordMatches) {
                return $this->respond([
                    'status'  => 200,
                    'success' => true,
                    'message' => 'Autentikasi admin sukses!',
                    'token'   => 'mock-jwt-admin-secret-token',
                    'user'    => [
                        'username' => $user['username'],
                        'role'     => $user['role'] ?? 'admin'
                    ]
                ], 200);
            }

            return $this->respond([
                'status'  => 400,
                'success' => false,
                'error'   => 'Username atau Password salah!'
            ], 400);
        } catch (\Throwable $e) {
            log_message('error', '[Auth::login] ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return $this->respond([
                'status'  => 500,
                'success' => false,
                'error'   => 'Terjadi kesalahan server saat autentikasi: ' . $e->getMessage()
            ], 500);
        }
    }
}
