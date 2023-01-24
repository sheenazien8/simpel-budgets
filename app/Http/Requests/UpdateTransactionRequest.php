<?php

namespace App\Http\Requests;

use App\Models\Account;
use App\Models\Budget;
use App\Models\Transaction;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UpdateTransactionRequest extends FormRequest
{
    private Account $account;

    private Transaction $transaction;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "account_id" => [
                "required",
                "numeric",
                Rule::exists("accounts", "id")->where("user_id", auth()->id())
            ],
            "account_target" => [
                Rule::requiredIf(function () {
                    return $this->request->get("type") == 3;
                }),
                function($attr, $value, $fail) {
                    if ($value != "" && !Account::where("id", $value)->where("user_id", auth()->id())->first()) {
                        $fail("Akun target tidak ada di database");
                        return;
                    }
                    return;
                }
            ],
            "budget_id" => [
                Rule::requiredIf(function () {
                    return $this->request->get("type") == 1;
                }),
                function($attr, $value, $fail) {
                    if (in_array($this->request->get("type"), [2, 3]) && $value) {
                        $fail("Budget harus kosong");
                        return;
                    }
                    if ($this->request->get("type") == 1 && !Budget::where("id", $value)->where("user_id", auth()->id())->first()) {
                        $fail("Budget tidak ada di database");
                    }
                    return;
                }
             ],
            "nominal" => [ "required", "numeric" ],
            "type" => [
                "required", "numeric", Rule::in([1, 2, 3]),
                function($attr, $value, $fail) {
                    if ($this->route("transaction")->type != $value) {
                        $fail("Type tidak boleh di update, mending dihapus aja bos");
                        return;
                    }
                    return;
                }
            ],
            "date" => [
                function($attr, $value, $fail) {
                    $todayDate = date('Y-m-d');
                    if ($value != "" && $value >  $todayDate) {
                        $fail("Tanggal tidak boleh melebihi hari ini");
                        return;
                    }
                    return;
                }
            ]
        ];
    }

    public function updated(Transaction $transaction): void
    {
        DB::beginTransaction();
        $this->transaction = $transaction;
        if (!$this->request->get("date")) {
            $this->request->add([
                "date" => now()->format("Y-m-d")
            ]);
        }
        $this->account = Account::find($this->request->get("account_id"));
        switch ($this->request->get("type")) {
            case 1:
                $this->expenseAccount();
                break;
            case 2:
                $this->incomeAccount();
                break;
            case 3:
                $this->transferAccount();
                break;
            default:
                throw new ValidationException("Invalid Type");
                break;
        }
        $this->transaction->update($this->request->all());
        DB::commit();
    }

    private function expenseAccount(): void
    {
        if ($this->transaction->account_id != $this->request->get("account_id")) {
            $this->transaction->account->total += $this->transaction->nominal;
            $this->transaction->account->save();

            $this->account->total -= $this->request->get("nominal");
            $this->account->save();
        }

        if ($this->transaction->account_id == $this->request->get("account_id")) {
            $previousTotal = $this->account->total + $this->transaction->nominal;

            $this->account->update([
                'total' => $previousTotal - $this->request->get("nominal")
            ]);
        }
    }

    private function incomeAccount(): void
    {
        $previousTotal = $this->account->total - $this->transaction->nominal;

        $this->account->update([
            'total' => $previousTotal + $this->request->get("nominal")
        ]);
    }

    private function transferAccount(): void
    {
        $account_from = $this->transaction->account;
        $account_from->total += $this->transaction->nominal;
        $account_from->save();

        $account_target = $this->transaction->account_target_data;
        $account_target->total -= $this->transaction->nominal;
        $account_target->save();

        $account_from = $this->request->get("account_id") == $this->transaction->account_id
            ? $account_from
            : $this->account;

        $account_from->total -= $this->request->get("nominal");
        $account_from->save();

        $account_target = Account::find($this->request->get("account_target"));
        $account_target->total += $this->request->get("nominal");
        $account_target->save();
    }
}
