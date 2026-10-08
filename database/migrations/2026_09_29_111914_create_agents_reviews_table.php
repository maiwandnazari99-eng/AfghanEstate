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
        Schema::create('agents_reviews', function (Blueprint $table) {
            			$table->id();
			$table->foreignId('agent_id')->constrained('agents', 'user_id')->onDelete('cascade');
			$table->foreignId('user_id')->constrained('users')->onDelete('cascade');
			$table->tinyInteger('rating');
			$table->text('review')->nullable();
			$table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agents_reviews');
    }
};
