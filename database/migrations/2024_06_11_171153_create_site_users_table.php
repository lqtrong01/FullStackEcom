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
        Schema::create('site_users', function (Blueprint $table) {
            $table->id();
            $table->string('email', 200)->unique();
            $table->string('name', 200);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('remember_token', 100)->nullable();
            $table->mediumText('user_image')->nullable();
            $table->string('role', 10);
            $table->string('password');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_users');
    }
};
