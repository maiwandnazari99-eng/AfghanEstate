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
        Schema::create('inquiry_messages', function (Blueprint $table) {
            			$table->id();
			$table->foreignId('inquiry_id')->constrained('inquiries')->onDelete('cascade');
			$table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
			$table->text('message');
			$table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiry_messages');
    }
};
