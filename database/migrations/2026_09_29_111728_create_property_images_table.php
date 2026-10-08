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
        Schema::create('property_images', function (Blueprint $table) {
           			$table->id();
			$table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
			$table->string('image_url');
			$table->boolean('is_cover')->default(false);
			$table->smallInteger('sort_order')->default(0);
			$table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_images');
    }
};
