<?php

namespace App\Domains\Auth\Dto\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'password' => 'required|string|min:6',
            'phone' => 'required|string|max:20|min:10|unique:customers,phone',
            'age' => 'required|integer|min:18|max:80',
        ];
    }
}