<?php

namespace App\Domains\Auth\Dto\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'userName' => 'required|string',
            'password' => 'required|string|min:6',
        ];
    }
}