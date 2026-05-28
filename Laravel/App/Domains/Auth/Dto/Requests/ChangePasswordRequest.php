<?php

namespace App\Domains\Auth\Dto\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'prevPassword' => 'required|string|min:6|max:255',
            'newPassword' => 'required|string|min:6|max:255|confirmed',
            'newPassword_confirmation' => 'required|string',
        ];
    }
}