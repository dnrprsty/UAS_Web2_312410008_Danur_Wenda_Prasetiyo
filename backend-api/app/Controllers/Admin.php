<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;
use App\Controllers\BaseController;

class Admin extends BaseController
{
    use ResponseTrait;

    public function resetDb()
    {
        try {
            $seeder = \Config\Database::seeder();
            $seeder->call('App\Database\Seeds\MainSeeder');

            return $this->respond([
                'success' => true,
                'message' => 'Database kembali di-seeding ke data bawaan!'
            ]);
        } catch (\Exception $e) {
            return $this->fail('Gagal melakukan reset database: ' . $e->getMessage(), 500);
        }
    }
}
