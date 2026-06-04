<?php

namespace Database\Seeders\MasterData;

use App\Models\MdProvience;
use Illuminate\Database\Seeder;

class ProvinceSeeder extends Seeder
{
    public function run(): void
    {
        $provinces = [
            ['id' => 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'country_id' => 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'title' => 'Koshi Province', 'code' => 'P1'],
            ['id' => 'b2c3d4e5-f6a7-8901-cdef-123456789012', 'country_id' => 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'title' => 'Madhesh Province', 'code' => 'P2'],
            ['id' => 'b3c4d5e6-f7a8-9012-defa-234567890123', 'country_id' => 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'title' => 'Bagmati Province', 'code' => 'P3'],
            ['id' => 'b4c5d6e7-f8a9-0123-efab-345678901234', 'country_id' => 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'title' => 'Gandaki Province', 'code' => 'P4'],
            ['id' => 'b5c6d7e8-f9a0-1234-fabc-456789012345', 'country_id' => 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'title' => 'Lumbini Province', 'code' => 'P5'],
            ['id' => 'b6c7d8e9-f0a1-2345-abcd-567890123456', 'country_id' => 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'title' => 'Karnali Province', 'code' => 'P6'],
            ['id' => 'b7c8d9e0-f1a2-3456-bcde-678901234567', 'country_id' => 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'title' => 'Sudurpashchim Province', 'code' => 'P7'],
        ];

        foreach ($provinces as $province) {
            MdProvience::create($province);
        }
    }
}
