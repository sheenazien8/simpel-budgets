<?php

namespace App\Http\Requests;

use App\Models\Account;
use App\Models\Budget;
use App\Models\Transaction;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class StoreTransactionRequest extends FormRequest
{
    private Account $account;

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
            "type" => [ "required", "numeric", Rule::in([1, 2, 3]) ],
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

    public function created(): void
    {
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
        Transaction::create($this->request->all());
    }

    private function expenseAccount(): void
    {
        $this->account->update([
            'total' => $this->account->total - $this->request->get("nominal")
        ]);
    }

    private function incomeAccount(): void
    {
        $this->account->update([
            'total' => $this->account->total + $this->request->get("nominal")
        ]);
    }

    private function transferAccount(): void
    {
        $account_from = $this->account;
        $account_from->total = $account_from->total - (double) $this->request->get("nominal");
        $account_from->save();

        $account_target = Account::find($this->request->get("account_target"));
        $account_target->total += $this->request->get("nominal");
        $account_target->save();
    }
}
