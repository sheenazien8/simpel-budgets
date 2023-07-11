<?php

namespace App\Http\Requests;

use App\Enums\DebtType;
use App\Models\Account;
use App\Models\Debt;
use Exception;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

class StoreDebtRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "name" => ["required", "string"],
            "description" => ["nullable", "string"],
            "amount" => ["required", "integer", function ($attribute, $value, $fail) {
                if ($this->account_id == null) {
                    return;
                }
                $account = Account::find($this->account_id);
                if ($account == null) {
                    return;
                }
                if ($account->total <= $value) {
                    $fail("$attribute must be less than or equal to account total balance");
                }
            }],
            "date" => ["date"],
            "type" => ["required", "in:1,2"],
            "account_id" => ["required", "exists:accounts,id"],
        ];
    }

    public function created()
    {
        try {
            DB::beginTransaction();
            $account = Account::find($this->account_id);
            match ((int) $this->type) {
                DebtType::debt->value => $account->total += $this->amount,
                DebtType::receivable->value => $account->total -= $this->amount,
            };
            $this->merge([
                "date" => $this->date ?? now(),
            ]);
            $account->save();
            $debt = new Debt();
            $debt->fill($this->all());
            $debt->account()->associate($account);
            $debt->save();
            DB::commit();
        } catch (Exception $error) {
            DB::rollBack();
            throw $error;
        }
    }
}
