<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('debt_payments', function (Blueprint $table) {
            $table->after('debt_id', function ($table) {
                $table->foreignId('transaction_id')->nullable()->constrained('transactions')->onDelete('cascade');
            });
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('debt_payments', function (Blueprint $table) {
            $table->dropColumn('transaction_id');
        });
    }
};
