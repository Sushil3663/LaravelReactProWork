<?php

namespace App\Domains\AccountOpening\Services;

use App\Http\Responses\ResponseHandler;
use App\Models\Customer;
use App\Models\Onboarding;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

class OnBoardingService
{
    public function __construct(private readonly ResponseHandler $responseHandler, private readonly Onboarding $onBoard)
    {
        // You can inject any dependencies here if needed
    }

    public function caseInitiation(): JsonResponse
    {
        $user = request()->user();
        $customer = $this->onBoard->create([
            "user_id" => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'status' => 'pending',
            "form_id" => (string) Str::uuid()
        ]);
        return $this->responseHandler->toJson(201, 'Case initiated successfully', $customer);
    }

    public function getOnboardingForm(string $formId): JsonResponse
    {
        $form = $this->onBoard->where('form_id', $formId)->first();

        if (!$form) {
            return $this->responseHandler->toJson(404, 'Form not found', null);
        }

        return $this->responseHandler->toJson(200, 'Onboarding form retrieved successfully', $form->formData);
    }

    public function getLatestOnboarding(): JsonResponse
    {
        $user = request()->user();
        $latestOnboarding = $this->onBoard->where('user_id', $user->id)->latest()->first();
        if ($latestOnboarding === null) {
            return $this->responseHandler->toJson(404, 'No onboarding case found', ["form_id" => null, "status" => null]);
        }
        return $this->responseHandler->toJson(200, 'Onboarding case retrieved successfully', ["form_id" => $latestOnboarding->form_id, "status" => $latestOnboarding->status]);
    }


    public function uploadImage(array $data): JsonResponse
    {
        /**
         * @var UploadedFile $uploadedFile
         */
        $uploadedFile = $data['identityCard'];
        $FormId = $data['form_id'];
        $formExists = $this->onBoard->where("form_id", $FormId)->first();

        if ($formExists) {
            if ($formExists->status == "completed") {
                return $this->responseHandler->toJson(400, 'Form already completed', ['status' => $formExists->status, 'form_id' => $formExists->form_id, 'path' => $formExists->path]);
            } else {
                if ($formExists->path) {
                    Storage::disk('public')->delete($formExists->path);
                }
                $originalName = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                $fileName = $originalName . '_' . now()->format('Y-m-d_H-i-s') . '.' . $uploadedFile->getClientOriginalExtension();
                $path = $uploadedFile->storeAs('onboardings', $fileName, 'public');
                $formExists->update(['path' => $path]);
                return $this->responseHandler->toJson(200, 'Image uploaded successfully', ['image' => $path, 'form_id' => $formExists->form_id, 'status' => $formExists->status]);
            }

        } else {
            return $this->responseHandler->toJson(404, 'Form not found', null);
        }

    }

    public function uploadCaseDocuments(array $data): JsonResponse
    {
        $form = $this->onBoard->where('form_id', $data['form_id'])->first();

        if (!$form) {
            return $this->responseHandler->toJson(404, 'Form not found', null);
        }

        $formData = (object) [
            'documentPath' => $data['documentPath'],
            'documentType' => $data['documentType'],
            'form_id' => $data['form_id'],
            ...(array) ($form->formData ?? []),
        ];
        $form->update(['formData' => $formData]);

        return $this->responseHandler->toJson(200, 'Case documents uploaded successfully', $form->formData);
    }


}