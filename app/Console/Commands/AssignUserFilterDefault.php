<?php

namespace App\Console\Commands;

use App\Models\Budget;
use App\Models\Transaction;
use App\Models\User;
use Exception;
use Illuminate\Console\Command;

class AssignUserFilterDefault extends Command
{
    protected $signature = 'app:assign-filter';

    protected $description = 'Assign User Filter';

    public function handle()
    {
        try {
            $users = User::all();
            $users->each(function (User $user) {
                $keys = [
                    [
                        'keys' => 'budgets',
                        'model' => Budget::class,
                        'default' => [
                            "show_current_month" => true,
                            "show_current_and_next_month" => false,
                            "show_active_month" => true,
                        ]
                    ],
                    [
                        'keys' => 'transactions',
                        'model' => Transaction::class,
                        'default' => [
                            "show_current_month" => true,
                            "show_current_and_next_month" => false,
                            "show_active_month" => true,
                        ]
                    ]
                ];

                foreach ($keys as $key) {
                    $filter = $user->filters()->where("key", $key["keys"])->first();
                    if (!$filter) {
                        $user->filters()->create([
                            "key" => $key["keys"],
                            "model" => $key["model"],
                            "default" => $key["default"],
                        ]);
                    }
                }
            });

            return Command::SUCCESS;
        } catch (Exception $exception) {
            dd($exception);
            return Command::FAILURE;
        }
    }
}
