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
        Schema::create('shop_orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->date('order_date');
            $table->unsignedBigInteger('payment_method_id');
            $table->unsignedBigInteger('shipping_address');
            $table->unsignedBigInteger('shipping_method');
            $table->decimal('order_total', 8, 2);
            $table->unsignedBigInteger('order_status');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('site_users');
            $table->foreign('payment_method_id')->references('id')->on('user_payment_methods');
            $table->foreign('shipping_address')->references('id')->on('addresses');
            $table->foreign('shipping_method')->references('id')->on('shipping_methods');
            $table->foreign('order_status')->references('id')->on('order_statuses');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop_orders');
    }
};
