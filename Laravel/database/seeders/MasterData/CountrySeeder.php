<?php

namespace Database\Seeders\MasterData;

use App\Models\MdCountry;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        MdCountry::create([
            'id' => 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            'title' => 'Nepal',
            'code' => 'NP',
        ]);
    }
}
