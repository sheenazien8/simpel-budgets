<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::get("/migrate", function() {
    Artisan::call("migrate");
});
Route::inertia("/", "Index");
Route::inertia('/login', "Login");
Route::inertia('/login-demo', "LoginDemo");
Route::inertia('/register', "Register");
Route::inertia('/reset-password', "ResetPassword");

Route::group([], function() {
    Route::inertia("/dashboard", "Home");
    Route::inertia('/months', "Month");
    Route::inertia('/budgets', "Budget");
    Route::inertia('/accounts', "Account");
    Route::inertia('/cashflow', "Cashflow");
});
