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
        Schema::create('inquiries', function (Blueprint $table) {
            			$table->id();
			$table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
			$table->foreignId('inquirer_id')->constrained('users')->onDelete('cascade');
			$table->foreignId('agent_id')->constrained('agents', 'user_id')->onDelete('cascade');
			$table->string('subject')->nullable();
			$table->text('message');
			$table->enum('status', ['pending', 'responded', 'closed'])->default('pending');
			$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
