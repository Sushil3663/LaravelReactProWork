<?php

namespace App\Domains\AccountOpening\Dto\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OtherInfoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'country' => 'required|uuid|max:255',
            'permanent_provience' => 'required|uuid|max:255',
            'permanent_district' => 'required|uuid|max:255',
            'permanent_municipality' => 'required|uuid|max:255',
            'permanent_ward' => 'required|string|max:3',
            'permanent_city' => 'required|string|max:255',
            'temporary_provience' => 'required|uuid|max:255',
            'temporary_district' => 'required|uuid|max:255',
            'temporary_municipality' => 'required|uuid|max:255',
            'temporary_ward' => 'required|string|max:3',
            'temporary_city' => 'required|string|max:255',
            'form_id' => 'required|string|max:255|uuid',
            'full_name' => 'required|string|max:255',
            'gender' => 'required|string|in:male,female,other',
            'date_of_birth' => 'required|date',
            'father_name' => 'required|string|max:255',
            'mother_name' => 'required|string|max:255',
            'place_of_birth' => 'required|string|max:255',
        ];
    }
}
