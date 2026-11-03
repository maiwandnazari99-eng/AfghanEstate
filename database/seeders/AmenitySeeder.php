<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AmenitySeeder extends Seeder
{
    public function run(): void
    {
        $amenities = [
            ['Parking', '🚗'],
            ['Garden', '🌳'],
            ['Electricity', '💡'],
            ['Running water', '🚰'],
            ['Gas', '🔥'],
            ['Generator', '⚡'],
            ['Solar panels', '☀'],
            ['Heating', '♨'],
            ['Air conditioning', '❄'],
            ['Furnished', '🛋'],
            ['Elevator', '🛗'],
            ['Security guard', '🛡'],
            ['Balcony', '🏙'],
            ['Internet', '🌐'],
            ['Basement', '🏚'],
        ];

        foreach ($amenities as [$name, $icon]) {
            DB::table('amenities')->updateOrInsert(
                ['name' => $name],
                ['icon' => $icon]
            );
        }
    }
}