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
        Schema::create('subscriptions', function (Blueprint $table) {
            			$table->id();
			$table->foreignId('agent_id')->constrained('agents', 'user_id')->onDelete('cascade');
			$table->foreignId('plan_id')->constrained('plans')->onDelete('restrict');
			$table->dateTime('starts_at');
$table->dateTime('ends_at');
			$table->enum('status', ['active', 'expired', 'cancelled'])->default('active');
			$table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
