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

        // نام شهرهای قدیمی را به نام ولایت تغییر می‌دهیم (شناسه‌ها حفظ می‌شوند)
        DB::table('cities')->where('name', 'Mazar-i-Sharif')->where('country_id', $countryId)->update(['name' => 'Balkh']);
        DB::table('cities')->where('name', 'Jalalabad')->where('country_id', $countryId)->update(['name' => 'Nangarhar']);

        // ۳۴ ولایت افغانستان
        $provinces = [
            'Badakhshan', 'Badghis', 'Baghlan', 'Balkh', 'Bamyan', 'Daykundi',
            'Farah', 'Faryab', 'Ghazni', 'Ghor', 'Helmand', 'Herat',
            'Jowzjan', 'Kabul', 'Kandahar', 'Kapisa', 'Khost', 'Kunar',
            'Kunduz', 'Laghman', 'Logar', 'Nangarhar', 'Nimruz', 'Nuristan',
            'Paktia', 'Paktika', 'Panjshir', 'Parwan', 'Samangan', 'Sar-e Pol',
            'Takhar', 'Uruzgan', 'Wardak', 'Zabul',
        ];

        foreach ($provinces as $provinceName) {
            DB::table('cities')->updateOrInsert(
                ['name' => $provinceName, 'country_id' => $countryId],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }

        // ناحیه‌ها (فعلاً فقط برای کابل و هرات)
        $districts = [
            'Kabul' => ['District 1', 'District 2', 'District 3', 'District 4'],
            'Herat' => ['District 1', 'District 2', 'District 3'],
        ];

        foreach ($districts as $provinceName => $names) {
            $cityId = DB::table('cities')
                ->where('name', $provinceName)
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