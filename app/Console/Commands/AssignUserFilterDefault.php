<?php

namespace App\Console\Commands;

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
                $keys = ['budgets'];
                foreach ($keys as $key) {
                    $filter = $user->filters()->where("key", $key)->first();
                    if ($filter) {
                        $user->filters()->create([
                            "key" => "budgets",
                            "model" => $this->model,
                            "default" => $this->default,
                        ]);
                    }
                }
            });

            return Command::SUCCESS;
        } catch (Exception $exception) {
            return Command::FAILURE;
        }
    }
}
