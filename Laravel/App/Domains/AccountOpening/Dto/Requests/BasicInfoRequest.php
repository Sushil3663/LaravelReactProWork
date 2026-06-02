<?php

namespace App\Domains\AccountOpening\Dto\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BasicInfoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'salutation' => 'required|string|max:255',
            'full_name' => 'required|string|max:255',
            'gender' => 'required|string|in:male,female,other',
            "date_of_birth" => 'required|date',
            'father_name' => 'required|string|max:255',
            'mother_name' => 'required|string|max:255',
            'place_of_birth' => 'required|string|max:255',
            'form_id' => 'required|string|max:255|uuid',
        ];
    }
}