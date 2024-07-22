<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('variation_opitions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('variation_id');
            $table->string('value');
            $table->timestamps();

            $table->foreign('variation_id')->references('id')->on('variations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variation_opitions');
    }
};
