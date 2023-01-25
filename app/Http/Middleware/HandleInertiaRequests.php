<?php

namespace App\Http\Middleware;

use App\Models\Account;
use App\Models\Budget;
use App\Models\Month;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'warning' => [
                'month' => Month::where("user_id", auth()->id())
                    ->count() == 0 ? "Anda belum membuat daftar bulan untuk anggaran anda" : "",
                'account' => Account::where("user_id", auth()->id())
                    ->count() == 0 ? "Anda belum membuat daftar akun untuk cashflow anda" : "",
                'budget' => Budget::where("user_id", auth()->id())
                    ->count() == 0 ? "Anda belum membuat satupun budget untuk rencana anggaran anda" : "",
                'cashflow' => Transaction::where("user_id", auth()->id())
                    ->count() == 0 ? "Yuk catat pengeluaran dan pemasukan anda" : "",
            ]
        ]);
    }
}
