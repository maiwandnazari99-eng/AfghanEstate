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
        Schema::create('buyers_tenants', function (Blueprint $table) {
            			$table->foreignId('user_id')->constrained('users')->onDelete('cascade');
			$table->primary('user_id');
			$table->string('preferred_location')->nullable();
			$table->string('preferred_type')->nullable();
			$table->decimal('preferred_price_min', 12, 2)->nullable();
			$table->decimal('preferred_price_max', 12, 2)->nullable();
			$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buyers_tenants');
    }
};
