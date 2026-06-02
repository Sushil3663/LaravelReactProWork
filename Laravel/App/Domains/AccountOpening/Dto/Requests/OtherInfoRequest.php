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
        ];
    }
}