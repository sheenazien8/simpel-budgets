<?php

namespace App\Http\Requests;

use App\Enums\DebtType;
use App\Models\Account;
use App\Models\Debt;
use App\Models\DebtPayment;
use Exception;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

class StoreDebtPaymentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "amount" => ["required", "integer", function ($attribute, $value, $fail) {
                $debt = Debt::find($this->debt);
                if ($debt->amount < $debt->payments->sum("amount") + $value) {
                    $fail("The $attribute is invalid, the amount is greater than the debt");
                }
            }],
            "date" => ["date"],
            "account_id" => ["required", "exists:accounts,id"],
        ];
    }

    public function created()
    {
        try {
            DB::beginTransaction();
            $this->merge([
                "date" => $this->date ?? now(),
            ]);
            $debt = Debt::find($this->debt);
            $account = Account::find($this->account_id);
            match ((int) $debt->type) {
                DebtType::debt->value => $account->total -= $this->amount,
                DebtType::receivable->value => $account->total += $this->amount,
            };
            $account->save();
            $debtPayment = new DebtPayment();
            $debtPayment->fill($this->all());
            $debtPayment->debt()->associate($debt);
            $debtPayment->account()->associate($account);
            $debtPayment->save();
            if ($debt->amount == $debt->payments->sum("amount")) {
                $debt->status = 1;
                $debt->save();
            }
            DB::commit();
        } catch (Exception $error) {
            DB::rollBack();
            throw $error;
        }
    }
}
