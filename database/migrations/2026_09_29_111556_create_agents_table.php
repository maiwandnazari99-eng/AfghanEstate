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
        Schema::create('agents', function (Blueprint $table) {
           			$table->foreignId('user_id')->constrained('users')->onDelete('cascade');
			$table->primary('user_id');
			$table->string('agency_name')->nullable();
			$table->string('license_number')->nullable();
			$table->boolean('is_verified')->default(false);
			$table->decimal('rating_avg', 3, 2)->default(0);
			$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agents');
    }
};
