<?php

namespace App\Http\Controllers\Api;

use App\Models\MdCountry;
use App\Models\MdProvience;
use App\Models\MdDistrict;
use App\Models\MdMunicipility;

class MasterDataController extends Controller
{
    public function index()
    {
        $masterData = [
            'country' => MdCountry::all(['id', 'title', 'code']),
            'proviences' => MdProvience::all(['id', 'country_id', 'title', 'code']),
            'district' => MdDistrict::all(['id', 'provience_id', 'title', 'code']),
            'municipilities' => MdMunicipility::all(['id', 'district_id', 'title', 'code']),
        ];

        return $this->responseHandler->toJson(
            200,
            'Master data retrieved successfully',
            ['masterData' => $masterData]
        );
    }
}
