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
        Schema::create('order_lines', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_item_id');
            $table->unsignedBigInteger('order_id');
            $table->integer('qty');
            $table->decimal('price', 8, 2);
            $table->timestamps();

            $table->foreign('product_item_id')->references('id')->on('product_items');
            $table->foreign('order_id')->references('id')->on('shop_orders');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_lines');
    }
};
