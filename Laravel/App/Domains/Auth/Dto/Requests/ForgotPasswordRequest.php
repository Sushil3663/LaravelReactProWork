<?php

namespace App\Domains\Auth\Dto\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => 'required|string|exists:customers,id',
            'newPassword' => 'required|string|min:6|max:255|confirmed',
            'newPassword_confirmation' => 'required|string',
        ];
    }
}