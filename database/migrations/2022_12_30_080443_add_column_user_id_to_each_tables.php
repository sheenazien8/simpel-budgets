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
        Schema::table('accounts', function (Blueprint $table) {
            $table->foreignId("user_id")->nullable()->constrained();
        });
        Schema::table('budgets', function (Blueprint $table) {
            $table->foreignId("user_id")->nullable()->constrained();
        });
        Schema::table('months', function (Blueprint $table) {
            $table->foreignId("user_id")->nullable()->constrained();
        });
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId("user_id")->nullable()->constrained();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->dropColumn("user_id");
        });
        Schema::table('budgets', function (Blueprint $table) {
            $table->dropColumn("user_id");
        });
        Schema::table('months', function (Blueprint $table) {
            $table->dropColumn("user_id");
        });
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn("user_id");
        });
    }
};
