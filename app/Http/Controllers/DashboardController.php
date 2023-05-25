<?php

namespace App\Http\Controllers;

use App\Enums\RecapBy;
use App\Enums\TransactionType;
use App\Models\Transaction;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function financialRecord(Request $request)
    {
        [$date, $label, $lastDate] = match ($request->input("recapBy")) {
            RecapBy::Last7Days->value => [now()->subDays(7), "7 hari terakhir", now()->subDays(14)],
            RecapBy::Last30Days->value => [now()->subDays(30), "30 hari terakhir", now()->subDays(60)],
            RecapBy::AMonth->value => [now()->subMonths(0)->startOfMonth(), "Bulan lalu", now()->subMonths(1)->startOfMonth()],
            RecapBy::ThreeMonth->value => [now()->subMonths(3)->startOfMonth(), "3 bulan lalu", now()->subMonths(6)->startOfMonth()],
        };

        $income = Transaction::query()
            ->selectRaw("sum(nominal) as nominal")
            ->byCurrentUser()
            ->where('type', TransactionType::Income)
            ->where('date', '>=', $date)
            ->first()->nominal ?? 0;

        $lastIncome = Transaction::query()
            ->selectRaw("sum(nominal) as nominal")
            ->byCurrentUser()
            ->where('type', TransactionType::Income)
            ->where('date', '>=', $lastDate)
            ->where('date', '<', $date)
            ->first()->nominal ?? 0;

        $expense = Transaction::query()
            ->selectRaw("sum(nominal) as nominal")
            ->byCurrentUser()
            ->where('type', TransactionType::Expense)
            ->where('date', '>=', $date)
            ->first()->nominal ?? 0;

        $lastExpense = Transaction::query()
            ->selectRaw("sum(nominal) as nominal")
            ->byCurrentUser()
            ->where('type', TransactionType::Expense)
            ->where('date', '>=', $lastDate)
            ->where('date', '<', $date)
            ->first()->nominal ?? 0;

        $saving = $income ? $income - $expense : '0';
        $lastSaving = $lastIncome ? $lastIncome - $lastExpense : '0';

        if ($income > $lastIncome) {
            $incomePercentage = ($lastIncome != 0 ? round((($income - $lastIncome) / $lastIncome) * 100) : 100) . "% dari {$label}";
        } else {
            $incomePercentage = ($lastIncome != 0 ? round((($lastIncome - $income) / $lastIncome) * 100) : 100) . "% dari {$label}";
        }

        if ($expense > $lastExpense) {
            $expensePercentage = ($lastExpense != 0 ? round((($expense - $lastExpense) / $lastExpense) * 100) : 100) . "% dari {$label}";
        } else {
            $expensePercentage = ($lastExpense != 0 ? round((($lastExpense - $expense) / $lastExpense) * 100) : 100) . "% dari {$label}";
        }

        if ($saving > $lastSaving) {
            $savingPercentage = ($lastSaving != 0 ? round((($saving - $lastSaving) / $lastSaving) * 100) : 100) . "% dari {$label}";
        } else {
            $savingPercentage = ($lastSaving != 0 ? round((($lastSaving - $saving) / $lastSaving) * 100) : 100) . "% dari {$label}";
        }

        return response()->json([
            "data" => [
                "income" => [
                    'total' => $income ,
                    'percentage' => $incomePercentage,
                    'isUp' => $income > $lastIncome
                ],
                "expense" => [
                    'total' => $expense,
                    'percentage' => $expensePercentage,
                    'isUp' => $expense > $lastExpense
                ],
                "remaining" => [
                    'total' => $saving,
                    'percentage' => $savingPercentage,
                    'isUp' => $saving > $lastSaving
                ],
            ],
        ]);
    }
}
