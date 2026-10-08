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
        Schema::create('view_logs', function (Blueprint $table) {
            			$table->id();
			$table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
			$table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
			$table->string('ip_address', 45);
			$table->timestamp('viewed_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('view_logs');
    }
};
