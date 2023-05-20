<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        // get income expense data by user login
        $transactions = Transaction::query()
            ->selectRaw('sum(nominal) as total, type, if(type = 1, "Pengeluaran", if(type = 2, "Pemasukan", "Transfer")) as type_name')
            ->byCurrentUser()
            ->filter($request)
            ->groupBy('type')
            ->orderBy('type')
            ->get();

        return response()->json([
            'data' => [
                'transactions' => $transactions
            ]
        ]);
    }
}
