<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\GoalDetailController;
use App\Http\Controllers\MonthController;
use App\Http\Controllers\SettingFilterController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\ProfileController;
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
    Route::group([
        'prefix' => 'auth',
    ], function() {
        Route::post("/logout", [AuthController::class, 'logout']);
        Route::post("/reset-password", [AuthController::class, 'resetPassword']);
        Route::resource("profiles", ProfileController::class);
    });
    Route::resource("months", MonthController::class);
    Route::get("info", function() {
        return response()->json([
            'data' => [
                'month' => Month::where("user_id", auth()->id())
                    ->count() == 0 ? "Anda belum membuat <a href='/months' class='underline'>daftar bulan</a> untuk anggaran anda" : "",
                'account' => Account::where("user_id", auth()->id())
                    ->count() == 0 ? "Anda belum membuat <a href='/accounts' class='underline'>daftar akun</a> untuk cashflow anda" : "",
                'budget' => Budget::where("user_id", auth()->id())
                    ->count() == 0 ? "Anda belum membuat satupun <a href='/budgets' class='underline'>budget untuk rencana anggaran</a> anda" : "",
                'cashflow' => Transaction::where("user_id", auth()->id())
                    ->count() == 0 ? "Yuk catat <a href='/cashflow' class='underline'>pengeluaran dan pemasukan</a> anda" : "",
            ]
        ]);
    });
    Route::resource("budgets", BudgetController::class);
    Route::post("budgets/copy", [BudgetController::class, 'copy'])->name("budgets.copy");
    Route::resource("accounts", AccountController::class);
    Route::group([
        'prefix' => '/transactions',
    ], function() {
        /* Route::get("/info", [TransactionController::class, 'info']); */
        Route::resource("/", TransactionController::class);
    });
    Route::resource("filters", SettingFilterController::class);
    Route::resource("goals", GoalController::class);
    Route::get("dashboard", DashboardController::class);
    Route::group([
        'prefix' => 'goals/{goal}',
    ], function() {
        Route::resource("details", GoalDetailController::class);
    });
});
