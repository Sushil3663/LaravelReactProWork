<?php

namespace App\Domains\AccountOpening\Dto\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IdentityUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'identityCard' => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'form_id' => 'required|string|max:255|uuid',
        ];
    }
}