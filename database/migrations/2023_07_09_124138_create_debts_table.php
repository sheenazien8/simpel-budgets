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
        Schema::create('debts', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained("users");
            $table->foreignId("account_id")->constrained("accounts");
            $table->string("name");
            $table->string("description")->nullable();
            $table->integer("amount");
            $table->date("date");
            $table->enum("type", [1, 2])->comment("1: debt, 2: receivable")->default(1);
            $table->enum("status", [1, 2,])->comment("1: Paid, 2: Unpaid")->default(2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('debts');
    }
};
