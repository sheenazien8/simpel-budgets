<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\GoalDetailController;
use App\Http\Controllers\MonthController;
use App\Http\Controllers\SettingFilterController;
use App\Http\Controllers\TransactionController;
use App\Models\Account;
use App\Models\Budget;
use App\Models\Month;
use App\Models\Transaction;
use Illuminate\Support\Facades\Route;


Route::get("test", function () {
    return response()->json(["status" => "connected"]);
});

Route::post("/auth/login", [AuthController::class, 'login']);
Route::post("/auth/register", [AuthController::class, 'register']);
Route::post("/auth/reset-token", [AuthController::class, 'resetToken']);

Route::group([
    'middleware' => 'auth:api',
], function() {
    Route::post("/auth/logout", [AuthController::class, 'logout']);
    Route::resource("months", MonthController::class);
    Route::get("info", function() {
        return response()->json([
            'data' => [
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
    });
    Route::resource("budgets", BudgetController::class);
    Route::post("budgets/copy", [BudgetController::class, 'copy'])->name("budgets.copy");
    Route::resource("accounts", AccountController::class);
    Route::resource("transactions", TransactionController::class);
    Route::resource("filters", SettingFilterController::class);
    Route::resource("goals", GoalController::class);
    Route::get("dashboard", DashboardController::class);
    Route::group([
        'prefix' => 'goals/{goal}',
    ], function() {
        Route::resource("details", GoalDetailController::class);
    });
});
