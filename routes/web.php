<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::get("/migrate", function() {
    Artisan::call("migrate");
});

Route::get("artisan/{command}", function ($command, Request $request) {
    if ($param = $request->exists("param")) {
        Artisan::call($command, [ "name" => $param ]);
    } else {
        Artisan::call($command);
    }

    return Artisan::output();
});

Route::get('/email/verify/{id}/{hash}', function (string $id, string $hash) {
    $user = User::find($id);
    $user->markEmailAsVerified();
    if ($user->hasVerifiedEmail()) {
        return redirect("/login?verified=true");
    }

    return redirect("/login?verified=false");
})->name('verification.verify');
