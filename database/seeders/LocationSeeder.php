<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        // کشور
        DB::table('countries')->updateOrInsert(
            ['code' => 'AFG'],
            ['name' => 'Afghanistan']
        );
        $countryId = DB::table('countries')->where('code', 'AFG')->value('id');

        // شهرها
        $cities = ['Kabul', 'Herat', 'Mazar-i-Sharif', 'Kandahar', 'Jalalabad'];

        foreach ($cities as $cityName) {
            DB::table('cities')->updateOrInsert(
                ['name' => $cityName, 'country_id' => $countryId],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }

        // ناحیه‌ها
        $districts = [
            'Kabul' => ['District 1', 'District 2', 'District 3', 'District 4'],
            'Herat' => ['District 1', 'District 2', 'District 3'],
        ];

        foreach ($districts as $cityName => $names) {
            $cityId = DB::table('cities')
                ->where('name', $cityName)
                ->where('country_id', $countryId)
                ->value('id');

            foreach ($names as $districtName) {
                DB::table('districts')->updateOrInsert(
                    ['name' => $districtName, 'city_id' => $cityId],
                    []
                );
            }
        }

        // نوع‌های ملک
        $types = ['House', 'Apartment', 'Land', 'Commercial', 'Villa'];

        foreach ($types as $typeName) {
            DB::table('property_types')->updateOrInsert(
                ['name' => $typeName],
                []
            );
        }
    }
}