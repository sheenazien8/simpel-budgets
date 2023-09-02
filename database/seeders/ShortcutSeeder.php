<?php

namespace Database\Seeders;

use App\Models\Shortcut;
use Illuminate\Database\Seeder;

class ShortcutSeeder extends Seeder
{
    public function run()
    {
        $shortcuts = [
            [
                'name' => 'Debt',
                'icon' => 'TableCellsIcon',
                'url' => '/debt',
            ],
            [
                'name' => 'Account',
                'icon' => 'BuildingLibraryIcon',
                'url' => '/accounts',
            ],
            [
                'name' => 'Create Cashflow',
                'icon' => 'BanknotesIcon',
                'url' => '/cashflow/create',
            ],
        ];

        foreach ($shortcuts as $shortcut) {
            Shortcut::create($shortcut);
        }
    }
}
