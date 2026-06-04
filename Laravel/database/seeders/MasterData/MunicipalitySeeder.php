<?php

namespace Database\Seeders\MasterData;

use App\Models\MdMunicipility;
use Illuminate\Database\Seeder;

class MunicipalitySeeder extends Seeder
{
    public function run(): void
    {
        $municipalities = [
            // Kathmandu district (e28e9f0a-1b2c-3456-bdef-890123456788)
            ['district_id' => 'e28e9f0a-1b2c-3456-bdef-890123456788', 'title' => 'Kathmandu Metropolitan City', 'code' => 'M01'],
            ['district_id' => 'e28e9f0a-1b2c-3456-bdef-890123456788', 'title' => 'Kageshwori Manohara Municipality', 'code' => 'M02'],
            ['district_id' => 'e28e9f0a-1b2c-3456-bdef-890123456788', 'title' => 'Budhanilkantha Municipality', 'code' => 'M03'],
            ['district_id' => 'e28e9f0a-1b2c-3456-bdef-890123456788', 'title' => 'Tokha Municipality', 'code' => 'M04'],
            ['district_id' => 'e28e9f0a-1b2c-3456-bdef-890123456788', 'title' => 'Tarakeshwor Municipality', 'code' => 'M05'],
            ['district_id' => 'e28e9f0a-1b2c-3456-bdef-890123456788', 'title' => 'Nagarjun Municipality', 'code' => 'M06'],
            ['district_id' => 'e28e9f0a-1b2c-3456-bdef-890123456788', 'title' => 'Shankharapur Municipality', 'code' => 'M07'],
            ['district_id' => 'e28e9f0a-1b2c-3456-bdef-890123456788', 'title' => 'Changunarayan Municipality', 'code' => 'M08'],
            ['district_id' => 'e28e9f0a-1b2c-3456-bdef-890123456788', 'title' => 'Dakshinkali Municipality', 'code' => 'M09'],
            ['district_id' => 'e28e9f0a-1b2c-3456-bdef-890123456788', 'title' => 'Gokarneshwor Municipality', 'code' => 'M10'],

            // Lalitpur district (e39f0a1b-2c3d-4567-cefa-901234567899)
            ['district_id' => 'e39f0a1b-2c3d-4567-cefa-901234567899', 'title' => 'Lalitpur Metropolitan City', 'code' => 'M11'],
            ['district_id' => 'e39f0a1b-2c3d-4567-cefa-901234567899', 'title' => 'Godawari Municipality', 'code' => 'M12'],
            ['district_id' => 'e39f0a1b-2c3d-4567-cefa-901234567899', 'title' => 'Mahalaxmi Municipality', 'code' => 'M13'],
            ['district_id' => 'e39f0a1b-2c3d-4567-cefa-901234567899', 'title' => 'Konjyosom Rural Municipality', 'code' => 'M14'],
            ['district_id' => 'e39f0a1b-2c3d-4567-cefa-901234567899', 'title' => 'Bagmati Rural Municipality', 'code' => 'M15'],

            // Bhaktapur district (d73f4a5b-6c7d-8901-cefa-345678901233)
            ['district_id' => 'd73f4a5b-6c7d-8901-cefa-345678901233', 'title' => 'Bhaktapur Municipality', 'code' => 'M16'],
            ['district_id' => 'd73f4a5b-6c7d-8901-cefa-345678901233', 'title' => 'Changunarayan Municipality', 'code' => 'M17'],
            ['district_id' => 'd73f4a5b-6c7d-8901-cefa-345678901233', 'title' => 'Suryabinayak Municipality', 'code' => 'M18'],
            ['district_id' => 'd73f4a5b-6c7d-8901-cefa-345678901233', 'title' => 'Madhyapur Thimi Municipality', 'code' => 'M19'],

            // Morang district (c6d7e8f9-a0b1-2345-bcde-678901234566)
            ['district_id' => 'c6d7e8f9-a0b1-2345-bcde-678901234566', 'title' => 'Biratnagar Metropolitan City', 'code' => 'M20'],
            ['district_id' => 'c6d7e8f9-a0b1-2345-bcde-678901234566', 'title' => 'Urlabari Municipality', 'code' => 'M21'],
            ['district_id' => 'c6d7e8f9-a0b1-2345-bcde-678901234566', 'title' => 'Rangeli Municipality', 'code' => 'M22'],
            ['district_id' => 'c6d7e8f9-a0b1-2345-bcde-678901234566', 'title' => 'Sundar Haraicha Municipality', 'code' => 'M23'],

            // Sunsari district (cb1f2a3b-4c5d-6789-0efa-123456789011)
            ['district_id' => 'cb1f2a3b-4c5d-6789-0efa-123456789011', 'title' => 'Dharan Sub-Metropolitan City', 'code' => 'M24'],
            ['district_id' => 'cb1f2a3b-4c5d-6789-0efa-123456789011', 'title' => 'Inaruwa Municipality', 'code' => 'M25'],
            ['district_id' => 'cb1f2a3b-4c5d-6789-0efa-123456789011', 'title' => 'Duhabi Municipality', 'code' => 'M26'],
            ['district_id' => 'cb1f2a3b-4c5d-6789-0efa-123456789011', 'title' => 'Koshi Haraicha Municipality', 'code' => 'M27'],

            // Jhapa district (c4d5e6f7-a8b9-0123-fabc-456789012344)
            ['district_id' => 'c4d5e6f7-a8b9-0123-fabc-456789012344', 'title' => 'Mechinagar Municipality', 'code' => 'M28'],
            ['district_id' => 'c4d5e6f7-a8b9-0123-fabc-456789012344', 'title' => 'Damak Municipality', 'code' => 'M29'],
            ['district_id' => 'c4d5e6f7-a8b9-0123-fabc-456789012344', 'title' => 'Bhadrapur Municipality', 'code' => 'M30'],
            ['district_id' => 'c4d5e6f7-a8b9-0123-fabc-456789012344', 'title' => 'Birtamod Municipality', 'code' => 'M31'],
            ['district_id' => 'c4d5e6f7-a8b9-0123-fabc-456789012344', 'title' => 'Shivasatakshi Municipality', 'code' => 'M32'],

            // Kaski district (f28c9d0e-1f2a-3456-fbcd-890123456788)
            ['district_id' => 'f28c9d0e-1f2a-3456-fbcd-890123456788', 'title' => 'Pokhara Metropolitan City', 'code' => 'M33'],
            ['district_id' => 'f28c9d0e-1f2a-3456-fbcd-890123456788', 'title' => 'Annapurna Rural Municipality', 'code' => 'M34'],
            ['district_id' => 'f28c9d0e-1f2a-3456-fbcd-890123456788', 'title' => 'Rupa Rural Municipality', 'code' => 'M35'],
            ['district_id' => 'f28c9d0e-1f2a-3456-fbcd-890123456788', 'title' => 'Madi Rural Municipality', 'code' => 'M36'],

            // Rupandehi district (h28e9f0a-1b2c-3456-bdef-890123456788)
            ['district_id' => 'h28e9f0a-1b2c-3456-bdef-890123456788', 'title' => 'Butwal Sub-Metropolitan City', 'code' => 'M37'],
            ['district_id' => 'h28e9f0a-1b2c-3456-bdef-890123456788', 'title' => 'Siddharthanagar Municipality', 'code' => 'M38'],
            ['district_id' => 'h28e9f0a-1b2c-3456-bdef-890123456788', 'title' => 'Tilottama Municipality', 'code' => 'M39'],

            // Dang district (g40c1d2e-3f4a-5678-fbcd-012345678900)
            ['district_id' => 'g40c1d2e-3f4a-5678-fbcd-012345678900', 'title' => 'Ghorahi Sub-Metropolitan City', 'code' => 'M40'],
            ['district_id' => 'g40c1d2e-3f4a-5678-fbcd-012345678900', 'title' => 'Tulsipur Sub-Metropolitan City', 'code' => 'M41'],
            ['district_id' => 'g40c1d2e-3f4a-5678-fbcd-012345678900', 'title' => 'Lamahi Municipality', 'code' => 'M42'],

            // Chitwan district (d84a5b6c-7d8e-9012-dfab-456789012344)
            ['district_id' => 'd84a5b6c-7d8e-9012-dfab-456789012344', 'title' => 'Bharatpur Metropolitan City', 'code' => 'M43'],
            ['district_id' => 'd84a5b6c-7d8e-9012-dfab-456789012344', 'title' => 'Ratnanagar Municipality', 'code' => 'M44'],
            ['district_id' => 'd84a5b6c-7d8e-9012-dfab-456789012344', 'title' => 'Khairhani Municipality', 'code' => 'M45'],

            // Banke district (g28a9b0c-1d2e-3456-dfab-890123456788)
            ['district_id' => 'g28a9b0c-1d2e-3456-dfab-890123456788', 'title' => 'Nepalgunj Sub-Metropolitan City', 'code' => 'M46'],
            ['district_id' => 'g28a9b0c-1d2e-3456-dfab-890123456788', 'title' => 'Kohalpur Municipality', 'code' => 'M47'],

            // Kailali district (j06e7f8a-9b0c-1234-bdef-678901234566)
            ['district_id' => 'j06e7f8a-9b0c-1234-bdef-678901234566', 'title' => 'Dhangadhi Sub-Metropolitan City', 'code' => 'M48'],
            ['district_id' => 'j06e7f8a-9b0c-1234-bdef-678901234566', 'title' => 'Tikapur Municipality', 'code' => 'M49'],
            ['district_id' => 'j06e7f8a-9b0c-1234-bdef-678901234566', 'title' => 'Ghodaghodi Municipality', 'code' => 'M50'],

            // Surkhet district (i17b8c9d-0e1f-2345-eabc-789012345677)
            ['district_id' => 'i17b8c9d-0e1f-2345-eabc-789012345677', 'title' => 'Birendranagar Municipality', 'code' => 'M51'],
            ['district_id' => 'i17b8c9d-0e1f-2345-eabc-789012345677', 'title' => 'Gurbhakot Municipality', 'code' => 'M52'],
        ];

        foreach ($municipalities as $municipality) {
            MdMunicipility::create($municipality);
        }
    }
}
