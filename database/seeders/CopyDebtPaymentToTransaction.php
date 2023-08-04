<?php

namespace Database\Seeders;

use App\Models\DebtPayment;
use App\Models\Transaction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CopyDebtPaymentToTransaction extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        try {
            DB::beginTransaction();
            $debtPayments = DebtPayment::all();
            foreach ($debtPayments as $debtPayment) {
                $transaction = Transaction::create([
                    'user_id' => $debtPayment->user_id,
                    'account_id' => $debtPayment->debt->account_id,
                    'account_target' => $debtPayment->account_id,
                    'date' => $debtPayment->date,
                    'nominal' => $debtPayment->amount,
                    'notes' => $debtPayment->debt->type == 1 ? 'Pembayaran hutang' : 'Penerimaan piutang',
                    'user_id' => $debtPayment->user_id,
                ]);
                $debtPayment->transaction()->associate($transaction);
                $debtPayment->save();
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
