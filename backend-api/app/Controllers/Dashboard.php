<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;
use App\Controllers\BaseController;

class Dashboard extends BaseController
{
    use ResponseTrait;

    public function stats()
    {
        $db = \Config\Database::connect();

        // 1. Total books sum of stock
        $totalBooksRow = $db->table('books')->selectSum('stock')->get()->getRowArray();
        $totalBooks = (int)($totalBooksRow['stock'] ?? 0);

        // 2. Total members count
        $totalMembers = $db->table('members')->countAllResults();

        // 3. Total active loans count
        $totalActiveLoans = $db->table('loans')->where('status', 'Active')->countAllResults();

        // 4. Total earnings sum of total_fee
        $totalEarningsRow = $db->table('loans')->selectSum('total_fee')->get()->getRowArray();
        $totalEarnings = (int)($totalEarningsRow['total_fee'] ?? 0);

        // 5. Category Distribution (count of books per category)
        $categories = $db->table('categories')->get()->getResultArray();
        $categoryDistribution = [];
        foreach ($categories as $cat) {
            $bookCount = $db->table('books')->where('category_id', $cat['id'])->countAllResults();
            $categoryDistribution[] = [
                'name'  => $cat['name'],
                'count' => $bookCount
            ];
        }

        // 6. Recent Loans (last 5 loans, descending by loan_date or ID)
        $recentLoans = $db->table('loans')
            ->select('loans.id, loans.member_id as memberId, loans.book_id as bookId, loans.loan_date as loanDate, loans.return_date as returnDate, loans.status, loans.total_fee as totalFee, books.title as bookTitle, members.name as memberName')
            ->join('books', 'books.id = loans.book_id', 'left')
            ->join('members', 'members.id = loans.member_id', 'left')
            ->orderBy('loans.id', 'DESC')
            ->limit(5)
            ->get()
            ->getResultArray();

        foreach ($recentLoans as &$loan) {
            $loan['totalFee'] = (int)$loan['totalFee'];
            if ($loan['loanDate']) {
                $loan['loanDate'] = date('c', strtotime($loan['loanDate']));
            }
            if ($loan['returnDate']) {
                $loan['returnDate'] = date('c', strtotime($loan['returnDate']));
            } else {
                $loan['returnDate'] = null;
            }
        }

        $response = [
            'totalBooks'           => $totalBooks,
            'totalMembers'         => $totalMembers,
            'totalActiveLoans'     => $totalActiveLoans,
            'totalEarnings'        => $totalEarnings,
            'categoryDistribution' => $categoryDistribution,
            'recentLoans'          => $recentLoans
        ];

        return $this->respond($response);
    }
}
