<?php

namespace App\Domains\AccountOpening\Dto\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CaseDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'documentPath' => 'required|string|max:255',
            'form_id' => 'required|string|max:255|uuid',
            'documentType' => 'required|string|max:255',
        ];
    }
}