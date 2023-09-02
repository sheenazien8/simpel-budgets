<?php

namespace App\Http\Controllers;

use App\Models\Shortcut;

class ShortcutController extends Controller
{
    public function __invoke()
    {
        $shortcuts = Shortcut::all();

        return response()->json([
            "data" => $shortcuts,
            "message" => "",
        ]);
    }
}
