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
        Schema::create('properties', function (Blueprint $table) {
            			$table->id();
			$table->foreignId('agent_id')->constrained('agents', 'user_id')->onDelete('cascade');
			$table->foreignId('property_type_id')->constrained('property_types')->onDelete('restrict');
			$table->string('title');
			$table->text('description');
			$table->enum('listing_type', ['sale', 'rent']);
			$table->decimal('price', 12, 2);
			$table->string('currency', 10)->default('AFN');
			$table->smallInteger('bedrooms')->nullable();
			$table->smallInteger('bathrooms')->nullable();
			$table->decimal('area_size', 10, 2);
			$table->string('area_unit', 20)->default('sqm');
			$table->foreignId('city_id')->constrained('cities')->onDelete('restrict');
			$table->foreignId('district_id')->nullable()->constrained('districts')->onDelete('set null');
			$table->string('address');
			$table->decimal('latitude', 10, 8)->nullable();
			$table->decimal('longitude', 11, 8)->nullable();
			$table->boolean('is_featured')->default(false);
			$table->enum('status', ['available', 'sold', 'rented'])->default('available');
			$table->foreignId('created_by')->constrained('agents', 'user_id')->onDelete('cascade');
			$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
