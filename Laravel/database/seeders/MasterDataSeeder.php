<?php

namespace Database\Seeders;

use Database\Seeders\MasterData\CountrySeeder;
use Database\Seeders\MasterData\DistrictSeeder;
use Database\Seeders\MasterData\MunicipalitySeeder;
use Database\Seeders\MasterData\ProvinceSeeder;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CountrySeeder::class,
            ProvinceSeeder::class,
            DistrictSeeder::class,
            MunicipalitySeeder::class,
        ]);
    }
}
