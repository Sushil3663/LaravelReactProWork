<?php

namespace Database\Seeders\MasterData;

use App\Models\MdDistrict;
use Illuminate\Database\Seeder;

class DistrictSeeder extends Seeder
{
    public function run(): void
    {
        $districts = [
            // Koshi Province (P1)
            ['id' => 'c1d2e3f4-a5b6-7890-cdef-123456789011', 'provience_id' => 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'title' => 'Bhojpur', 'code' => 'D01'],
            ['id' => 'c2d3e4f5-a6b7-8901-defa-234567890122', 'provience_id' => 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'title' => 'Dhankuta', 'code' => 'D02'],
            ['id' => 'c3d4e5f6-a7b8-9012-efab-345678901233', 'provience_id' => 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'title' => 'Ilam', 'code' => 'D03'],
            ['id' => 'c4d5e6f7-a8b9-0123-fabc-456789012344', 'provience_id' => 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'title' => 'Jhapa', 'code' => 'D04'],
            ['id' => 'c5d6e7f8-a9b0-1234-abcd-567890123455', 'provience_id' => 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'title' => 'Khotang', 'code' => 'D05'],
            ['id' => 'c6d7e8f9-a0b1-2345-bcde-678901234566', 'provience_id' => 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'title' => 'Morang', 'code' => 'D06'],
            ['id' => 'c7d8e9f0-a1b2-3456-cdef-789012345677', 'provience_id' => 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'title' => 'Okhaldhunga', 'code' => 'D07'],
            ['id' => 'c8d9e0f1-a2b3-4567-defa-890123456788', 'provience_id' => 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'title' => 'Panchthar', 'code' => 'D08'],
            ['id' => 'c9d0e1f2-a3b4-5678-efab-901234567899', 'provience_id' => 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'title' => 'Sankhuwasabha', 'code' => 'D09'],
            ['id' => 'ca0e1f2a-3b4c-5678-9def-012345678900', 'provience_id' => 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'title' => 'Solukhumbu', 'code' => 'D10'],
            ['id' => 'cb1f2a3b-4c5d-6789-0efa-123456789011', 'provience_id' => 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'title' => 'Sunsari', 'code' => 'D11'],
            ['id' => 'cc2a3b4c-5d6e-7890-1fab-234567890122', 'provience_id' => 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'title' => 'Taplejung', 'code' => 'D12'],
            ['id' => 'cd3b4c5d-6e7f-8901-2abc-345678901233', 'provience_id' => 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'title' => 'Terhathum', 'code' => 'D13'],
            ['id' => 'ce4c5d6e-7f8a-9012-3bcd-456789012344', 'provience_id' => 'b1c2d3e4-f5a6-7890-bcde-f12345678901', 'title' => 'Udayapur', 'code' => 'D14'],

            // Madhesh Province (P2)
            ['id' => 'cf5d6e7f-8a9b-0123-4cde-567890123455', 'provience_id' => 'b2c3d4e5-f6a7-8901-cdef-123456789012', 'title' => 'Bara', 'code' => 'D15'],
            ['id' => 'd06e7f8a-9b0c-1234-5def-678901234566', 'provience_id' => 'b2c3d4e5-f6a7-8901-cdef-123456789012', 'title' => 'Dhanusha', 'code' => 'D16'],
            ['id' => 'd17f8a9b-0c1d-2345-6efa-789012345677', 'provience_id' => 'b2c3d4e5-f6a7-8901-cdef-123456789012', 'title' => 'Mahottari', 'code' => 'D17'],
            ['id' => 'd28a9b0c-1d2e-3456-7fab-890123456788', 'provience_id' => 'b2c3d4e5-f6a7-8901-cdef-123456789012', 'title' => 'Parsa', 'code' => 'D18'],
            ['id' => 'd39b0c1d-2e3f-4567-8abc-901234567899', 'provience_id' => 'b2c3d4e5-f6a7-8901-cdef-123456789012', 'title' => 'Rautahat', 'code' => 'D19'],
            ['id' => 'd40c1d2e-3f4a-5678-9bcd-012345678900', 'provience_id' => 'b2c3d4e5-f6a7-8901-cdef-123456789012', 'title' => 'Saptari', 'code' => 'D20'],
            ['id' => 'd51d2e3f-4a5b-6789-acde-123456789011', 'provience_id' => 'b2c3d4e5-f6a7-8901-cdef-123456789012', 'title' => 'Sarlahi', 'code' => 'D21'],
            ['id' => 'd62e3f4a-5b6c-7890-bdef-234567890122', 'provience_id' => 'b2c3d4e5-f6a7-8901-cdef-123456789012', 'title' => 'Siraha', 'code' => 'D22'],

            // Bagmati Province (P3)
            ['id' => 'd73f4a5b-6c7d-8901-cefa-345678901233', 'provience_id' => 'b3c4d5e6-f7a8-9012-defa-234567890123', 'title' => 'Bhaktapur', 'code' => 'D23'],
            ['id' => 'd84a5b6c-7d8e-9012-dfab-456789012344', 'provience_id' => 'b3c4d5e6-f7a8-9012-defa-234567890123', 'title' => 'Chitwan', 'code' => 'D24'],
            ['id' => 'd95b6c7d-8e9f-0123-eabc-567890123455', 'provience_id' => 'b3c4d5e6-f7a8-9012-defa-234567890123', 'title' => 'Dhading', 'code' => 'D25'],
            ['id' => 'e06c7d8e-9f0a-1234-fbcd-678901234566', 'provience_id' => 'b3c4d5e6-f7a8-9012-defa-234567890123', 'title' => 'Dolakha', 'code' => 'D26'],
            ['id' => 'e17d8e9f-0a1b-2345-acde-789012345677', 'provience_id' => 'b3c4d5e6-f7a8-9012-defa-234567890123', 'title' => 'Kathmandu', 'code' => 'D27'],
            ['id' => 'e28e9f0a-1b2c-3456-bdef-890123456788', 'provience_id' => 'b3c4d5e6-f7a8-9012-defa-234567890123', 'title' => 'Kavrepalanchok', 'code' => 'D28'],
            ['id' => 'e39f0a1b-2c3d-4567-cefa-901234567899', 'provience_id' => 'b3c4d5e6-f7a8-9012-defa-234567890123', 'title' => 'Lalitpur', 'code' => 'D29'],
            ['id' => 'e40a1b2c-3d4e-5678-dfab-012345678900', 'provience_id' => 'b3c4d5e6-f7a8-9012-defa-234567890123', 'title' => 'Makwanpur', 'code' => 'D30'],
            ['id' => 'e51b2c3d-4e5f-6789-eabc-123456789011', 'provience_id' => 'b3c4d5e6-f7a8-9012-defa-234567890123', 'title' => 'Nuwakot', 'code' => 'D31'],
            ['id' => 'e62c3d4e-5f6a-7890-fbcd-234567890122', 'provience_id' => 'b3c4d5e6-f7a8-9012-defa-234567890123', 'title' => 'Ramechhap', 'code' => 'D32'],
            ['id' => 'e73d4e5f-6a7b-8901-acde-345678901233', 'provience_id' => 'b3c4d5e6-f7a8-9012-defa-234567890123', 'title' => 'Rasuwa', 'code' => 'D33'],
            ['id' => 'e84e5f6a-7b8c-9012-bdef-456789012344', 'provience_id' => 'b3c4d5e6-f7a8-9012-defa-234567890123', 'title' => 'Sindhuli', 'code' => 'D34'],
            ['id' => 'e95f6a7b-8c9d-0123-cefa-567890123455', 'provience_id' => 'b3c4d5e6-f7a8-9012-defa-234567890123', 'title' => 'Sindhupalchok', 'code' => 'D35'],

            // Gandaki Province (P4)
            ['id' => 'f06a7b8c-9d0e-1234-dfab-678901234566', 'provience_id' => 'b4c5d6e7-f8a9-0123-efab-345678901234', 'title' => 'Baglung', 'code' => 'D36'],
            ['id' => 'f17b8c9d-0e1f-2345-eabc-789012345677', 'provience_id' => 'b4c5d6e7-f8a9-0123-efab-345678901234', 'title' => 'Gorkha', 'code' => 'D37'],
            ['id' => 'f28c9d0e-1f2a-3456-fbcd-890123456788', 'provience_id' => 'b4c5d6e7-f8a9-0123-efab-345678901234', 'title' => 'Kaski', 'code' => 'D38'],
            ['id' => 'f39d0e1f-2a3b-4567-acde-901234567899', 'provience_id' => 'b4c5d6e7-f8a9-0123-efab-345678901234', 'title' => 'Lamjung', 'code' => 'D39'],
            ['id' => 'f40e1f2a-3b4c-5678-bdef-012345678900', 'provience_id' => 'b4c5d6e7-f8a9-0123-efab-345678901234', 'title' => 'Manang', 'code' => 'D40'],
            ['id' => 'f51f2a3b-4c5d-6789-cefa-123456789011', 'provience_id' => 'b4c5d6e7-f8a9-0123-efab-345678901234', 'title' => 'Mustang', 'code' => 'D41'],
            ['id' => 'f62a3b4c-5d6e-7890-dfab-234567890122', 'provience_id' => 'b4c5d6e7-f8a9-0123-efab-345678901234', 'title' => 'Myagdi', 'code' => 'D42'],
            ['id' => 'f73b4c5d-6e7f-8901-eabc-345678901233', 'provience_id' => 'b4c5d6e7-f8a9-0123-efab-345678901234', 'title' => 'Nawalpur', 'code' => 'D43'],
            ['id' => 'f84c5d6e-7f8a-9012-fbcd-456789012344', 'provience_id' => 'b4c5d6e7-f8a9-0123-efab-345678901234', 'title' => 'Parbat', 'code' => 'D44'],
            ['id' => 'f95d6e7f-8a9b-0123-acde-567890123455', 'provience_id' => 'b4c5d6e7-f8a9-0123-efab-345678901234', 'title' => 'Syangja', 'code' => 'D45'],
            ['id' => 'g06e7f8a-9b0c-1234-bdef-678901234566', 'provience_id' => 'b4c5d6e7-f8a9-0123-efab-345678901234', 'title' => 'Tanahun', 'code' => 'D46'],

            // Lumbini Province (P5)
            ['id' => 'g17f8a9b-0c1d-2345-cefa-789012345677', 'provience_id' => 'b5c6d7e8-f9a0-1234-fabc-456789012345', 'title' => 'Arghakhanchi', 'code' => 'D47'],
            ['id' => 'g28a9b0c-1d2e-3456-dfab-890123456788', 'provience_id' => 'b5c6d7e8-f9a0-1234-fabc-456789012345', 'title' => 'Banke', 'code' => 'D48'],
            ['id' => 'g39b0c1d-2e3f-4567-eabc-901234567899', 'provience_id' => 'b5c6d7e8-f9a0-1234-fabc-456789012345', 'title' => 'Bardiya', 'code' => 'D49'],
            ['id' => 'g40c1d2e-3f4a-5678-fbcd-012345678900', 'provience_id' => 'b5c6d7e8-f9a0-1234-fabc-456789012345', 'title' => 'Dang', 'code' => 'D50'],
            ['id' => 'g51d2e3f-4a5b-6789-acde-123456789011', 'provience_id' => 'b5c6d7e8-f9a0-1234-fabc-456789012345', 'title' => 'Gulmi', 'code' => 'D51'],
            ['id' => 'g62e3f4a-5b6c-7890-bdef-234567890122', 'provience_id' => 'b5c6d7e8-f9a0-1234-fabc-456789012345', 'title' => 'Kapilvastu', 'code' => 'D52'],
            ['id' => 'g73f4a5b-6c7d-8901-cefa-345678901233', 'provience_id' => 'b5c6d7e8-f9a0-1234-fabc-456789012345', 'title' => 'Nawalparasi (West)', 'code' => 'D53'],
            ['id' => 'g84a5b6c-7d8e-9012-dfab-456789012344', 'provience_id' => 'b5c6d7e8-f9a0-1234-fabc-456789012345', 'title' => 'Palpa', 'code' => 'D54'],
            ['id' => 'g95b6c7d-8e9f-0123-eabc-567890123455', 'provience_id' => 'b5c6d7e8-f9a0-1234-fabc-456789012345', 'title' => 'Pyuthan', 'code' => 'D55'],
            ['id' => 'h06c7d8e-9f0a-1234-fbcd-678901234566', 'provience_id' => 'b5c6d7e8-f9a0-1234-fabc-456789012345', 'title' => 'Rolpa', 'code' => 'D56'],
            ['id' => 'h17d8e9f-0a1b-2345-acde-789012345677', 'provience_id' => 'b5c6d7e8-f9a0-1234-fabc-456789012345', 'title' => 'Rukum (East)', 'code' => 'D57'],
            ['id' => 'h28e9f0a-1b2c-3456-bdef-890123456788', 'provience_id' => 'b5c6d7e8-f9a0-1234-fabc-456789012345', 'title' => 'Rupandehi', 'code' => 'D58'],

            // Karnali Province (P6)
            ['id' => 'h39f0a1b-2c3d-4567-cefa-901234567899', 'provience_id' => 'b6c7d8e9-f0a1-2345-abcd-567890123456', 'title' => 'Dailekh', 'code' => 'D59'],
            ['id' => 'h40a1b2c-3d4e-5678-dfab-012345678900', 'provience_id' => 'b6c7d8e9-f0a1-2345-abcd-567890123456', 'title' => 'Dolpa', 'code' => 'D60'],
            ['id' => 'h51b2c3d-4e5f-6789-eabc-123456789011', 'provience_id' => 'b6c7d8e9-f0a1-2345-abcd-567890123456', 'title' => 'Humla', 'code' => 'D61'],
            ['id' => 'h62c3d4e-5f6a-7890-fbcd-234567890122', 'provience_id' => 'b6c7d8e9-f0a1-2345-abcd-567890123456', 'title' => 'Jajarkot', 'code' => 'D62'],
            ['id' => 'h73d4e5f-6a7b-8901-acde-345678901233', 'provience_id' => 'b6c7d8e9-f0a1-2345-abcd-567890123456', 'title' => 'Jumla', 'code' => 'D63'],
            ['id' => 'h84e5f6a-7b8c-9012-bdef-456789012344', 'provience_id' => 'b6c7d8e9-f0a1-2345-abcd-567890123456', 'title' => 'Kalikot', 'code' => 'D64'],
            ['id' => 'h95f6a7b-8c9d-0123-cefa-567890123455', 'provience_id' => 'b6c7d8e9-f0a1-2345-abcd-567890123456', 'title' => 'Mugu', 'code' => 'D65'],
            ['id' => 'i06a7b8c-9d0e-1234-dfab-678901234566', 'provience_id' => 'b6c7d8e9-f0a1-2345-abcd-567890123456', 'title' => 'Salyan', 'code' => 'D66'],
            ['id' => 'i17b8c9d-0e1f-2345-eabc-789012345677', 'provience_id' => 'b6c7d8e9-f0a1-2345-abcd-567890123456', 'title' => 'Surkhet', 'code' => 'D67'],
            ['id' => 'i28c9d0e-1f2a-3456-fbcd-890123456788', 'provience_id' => 'b6c7d8e9-f0a1-2345-abcd-567890123456', 'title' => 'Rukum (West)', 'code' => 'D68'],

            // Sudurpashchim Province (P7)
            ['id' => 'i39d0e1f-2a3b-4567-acde-901234567899', 'provience_id' => 'b7c8d9e0-f1a2-3456-bcde-678901234567', 'title' => 'Achham', 'code' => 'D69'],
            ['id' => 'i40e1f2a-3b4c-5678-bdef-012345678900', 'provience_id' => 'b7c8d9e0-f1a2-3456-bcde-678901234567', 'title' => 'Baitadi', 'code' => 'D70'],
            ['id' => 'i51f2a3b-4c5d-6789-cefa-123456789011', 'provience_id' => 'b7c8d9e0-f1a2-3456-bcde-678901234567', 'title' => 'Bajhang', 'code' => 'D71'],
            ['id' => 'i62a3b4c-5d6e-7890-dfab-234567890122', 'provience_id' => 'b7c8d9e0-f1a2-3456-bcde-678901234567', 'title' => 'Bajura', 'code' => 'D72'],
            ['id' => 'i73b4c5d-6e7f-8901-eabc-345678901233', 'provience_id' => 'b7c8d9e0-f1a2-3456-bcde-678901234567', 'title' => 'Dadeldhura', 'code' => 'D73'],
            ['id' => 'i84c5d6e-7f8a-9012-fbcd-456789012344', 'provience_id' => 'b7c8d9e0-f1a2-3456-bcde-678901234567', 'title' => 'Darchula', 'code' => 'D74'],
            ['id' => 'i95d6e7f-8a9b-0123-acde-567890123455', 'provience_id' => 'b7c8d9e0-f1a2-3456-bcde-678901234567', 'title' => 'Doti', 'code' => 'D75'],
            ['id' => 'j06e7f8a-9b0c-1234-bdef-678901234566', 'provience_id' => 'b7c8d9e0-f1a2-3456-bcde-678901234567', 'title' => 'Kailali', 'code' => 'D76'],
            ['id' => 'j17f8a9b-0c1d-2345-cefa-789012345677', 'provience_id' => 'b7c8d9e0-f1a2-3456-bcde-678901234567', 'title' => 'Kanchanpur', 'code' => 'D77'],
        ];

        foreach ($districts as $district) {
            MdDistrict::create($district);
        }
    }
}
