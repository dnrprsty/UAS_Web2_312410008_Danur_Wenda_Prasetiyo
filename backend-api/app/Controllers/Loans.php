<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;
use App\Controllers\BaseController;

class Loans extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $db = \Config\Database::connect();
        $loans = $db->table('loans')
            ->select('loans.id, loans.member_id as memberId, loans.book_id as bookId, loans.loan_date as loanDate, loans.return_date as returnDate, loans.status, loans.total_fee as totalFee, books.title as bookTitle, books.rental_price as rentalPrice, members.name as memberName')
            ->join('books', 'books.id = loans.book_id', 'left')
            ->join('members', 'members.id = loans.member_id', 'left')
            ->get()
            ->getResultArray();

        // Convert totalFee and rentalPrice to numeric integers
        foreach ($loans as &$loan) {
            $loan['totalFee'] = (int)$loan['totalFee'];
            $loan['rentalPrice'] = (int)$loan['rentalPrice'];
            
            // Format dates as ISO-8601 strings if they exist to match frontend expectation
            if ($loan['loanDate']) {
                $loan['loanDate'] = date('c', strtotime($loan['loanDate']));
            }
            if ($loan['returnDate']) {
                $loan['returnDate'] = date('c', strtotime($loan['returnDate']));
            } else {
                $loan['returnDate'] = null;
            }
        }

        return $this->respond($loans);
    }

    public function create()
    {
        $json = $this->request->getJSON(true) ?? $this->request->getPost();
        
        $memberId = $json['memberId'] ?? null;
        $bookId = $json['bookId'] ?? null;

        if (!$memberId || !$bookId) {
            return $this->fail('Pilih Anggota dan Buku yang akan dipinjam!', 400);
        }

        $db = \Config\Database::connect();
        
        // Start transaction
        $db->transStart();

        // Verify book stock
        $book = $db->table('books')->where('id', $bookId)->get()->getRowArray();
        if (!$book) {
            $db->transRollback();
            return $this->failNotFound('Buku tidak ditemukan!');
        }

        if ((int)$book['stock'] <= 0) {
            $db->transRollback();
            return $this->fail('Stok buku saat ini kosong! Tidak dapat melakukan rental.', 400);
        }

        // Decrement stock
        $db->table('books')->where('id', $bookId)->update([
            'stock' => (int)$book['stock'] - 1
        ]);

        $newLoan = [
            'id'          => 'loan_' . time() . '_' . rand(10, 99),
            'member_id'   => $memberId,
            'book_id'     => $bookId,
            'loan_date'   => date('Y-m-d H:i:s'),
            'return_date' => null,
            'status'      => 'Active',
            'total_fee'   => (int)$book['rental_price'],
            'created_at'  => date('Y-m-d H:i:s'),
            'updated_at'  => date('Y-m-d H:i:s')
        ];

        $db->table('loans')->insert($newLoan);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->fail('Gagal melakukan pencatatan peminjaman.', 500);
        }

        // Map output
        $output = [
            'id'         => $newLoan['id'],
            'memberId'   => $newLoan['member_id'],
            'bookId'     => $newLoan['book_id'],
            'loanDate'   => date('c', strtotime($newLoan['loan_date'])),
            'returnDate' => null,
            'status'     => $newLoan['status'],
            'totalFee'   => $newLoan['total_fee']
        ];

        return $this->respond($output, 201);
    }

    public function returnBook($id = null)
    {
        if (!$id) {
            return $this->fail('ID Peminjaman tidak disediakan.', 400);
        }

        $db = \Config\Database::connect();
        
        $db->transStart();

        $loan = $db->table('loans')->where('id', $id)->get()->getRowArray();
        if (!$loan) {
            $db->transRollback();
            return $this->failNotFound('Peminjaman tidak ditemukan!');
        }

        if ($loan['status'] === 'Returned') {
            $db->transRollback();
            return $this->fail('Peminjaman ini sudah dikembalikan sebelumnya!', 400);
        }

        // Update status & return date
        $returnDate = date('Y-m-d H:i:s');
        $db->table('loans')->where('id', $id)->update([
            'status'      => 'Returned',
            'return_date' => $returnDate,
            'updated_at'  => date('Y-m-d H:i:s')
        ]);

        // Increment book stock
        $book = $db->table('books')->where('id', $loan['book_id'])->get()->getRowArray();
        if ($book) {
            $db->table('books')->where('id', $loan['book_id'])->update([
                'stock' => (int)$book['stock'] + 1
            ]);
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->fail('Gagal memperbarui status pengembalian.', 500);
        }

        $updatedLoan = [
            'id'         => $loan['id'],
            'memberId'   => $loan['member_id'],
            'bookId'     => $loan['book_id'],
            'loanDate'   => date('c', strtotime($loan['loan_date'])),
            'returnDate' => date('c', strtotime($returnDate)),
            'status'     => 'Returned',
            'totalFee'   => (int)$loan['total_fee']
        ];

        return $this->respond($updatedLoan);
    }

    public function delete($id = null)
    {
        if (!$id) {
            return $this->fail('ID Peminjaman tidak disediakan.', 400);
        }

        $db = \Config\Database::connect();
        
        $db->transStart();

        $loan = $db->table('loans')->where('id', $id)->get()->getRowArray();
        if (!$loan) {
            $db->transRollback();
            return $this->failNotFound('Peminjaman tidak ditemukan!');
        }

        // If deleted while active, restore book stock
        if ($loan['status'] === 'Active') {
            $book = $db->table('books')->where('id', $loan['book_id'])->get()->getRowArray();
            if ($book) {
                $db->table('books')->where('id', $loan['book_id'])->update([
                    'stock' => (int)$book['stock'] + 1
                ]);
            }
        }

        $db->table('loans')->where('id', $id)->delete();

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->fail('Gagal menghapus data transaksi.', 500);
        }

        return $this->respond(['success' => true, 'message' => 'Peminjaman berhasil dihapus.']);
    }
}
