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
        Schema::create('goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id");
            $table->string("title");
            $table->text("description")->nullable();
            $table->date("start_date");
            $table->date("target_date");
            $table->string("reminder_per")->nullable();
            $table->string("reminder_day")->nullable();
            $table->dateTime("reminder_time")->nullable();
            $table->double("nominal_target");
            $table->boolean("status")->default(false);
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
        Schema::dropIfExists('goals');
    }
};
