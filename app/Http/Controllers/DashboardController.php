<?php

namespace App\Http\Controllers;

use App\Enums\BudgetType;
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
            ->whereHas('budget', function ($query) {
                $query->where('type', BudgetType::Expense);
            })
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

        $saving = Transaction::query()
            ->selectRaw("sum(nominal) as nominal")
            ->byCurrentUser()
            ->whereHas('budget', function ($query) {
                $query->where('type', BudgetType::Saving);
            })
            ->where('type', TransactionType::Expense)
            ->where('date', '>=', $date)
            ->first()->nominal ?? 0;

        $remaining = $income ? $income - $expense - $saving : '0';
        $lastRemaining = $lastIncome ? $lastIncome - $lastExpense : '0';

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

        if ($remaining > $lastRemaining) {
            $savingPercentage = ($lastRemaining != 0 ? round((($remaining - $lastRemaining) / $lastRemaining) * 100) : 100) . "% dari {$label}";
        } else {
            $savingPercentage = ($lastRemaining != 0 ? round((($lastRemaining - $remaining) / $lastRemaining) * 100) : 100) . "% dari {$label}";
        }

        return response()->json([
            "data" => [
                [
                    "label" => "Income",
                    'total' => $income,
                    'percentage' => $incomePercentage,
                    'isUp' => $income > $lastIncome
                ],
                [
                    "label" => "Expense",
                    'total' => $expense,
                    'percentage' => $expensePercentage,
                    'isUp' => $expense > $lastExpense
                ],
                [
                    "label" => "Saving",
                    'total' => $saving,
                    'percentage' => $savingPercentage,
                    'isUp' => false
                ],
                [
                    "label" => "Remaining",
                    'total' => $remaining,
                    'percentage' => $savingPercentage,
                    'isUp' => $remaining > $lastRemaining
                ],
            ],
        ]);
    }
}
