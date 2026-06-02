<?php

namespace App\Domains\AccountOpening\Http\Controllers;

use App\Domains\AccountOpening\Dto\Requests\CaseDocumentRequest;
use App\Domains\AccountOpening\Services\OnBoardingService;
use App\Domains\AccountOpening\Dto\Requests\IdentityUploadRequest;
use App\Http\Controllers\Api\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class OnBoardingController extends Controller
{
    public function __construct(private readonly OnBoardingService $onBoardingService)
    {
        parent::__construct();
    }
    public function getLatestOnboarding(): JsonResponse
    {
        return $this->onBoardingService->getLatestOnboarding();
    }

    public function getOnboardingForm($formId): JsonResponse
    {
        return $this->onBoardingService->getOnboardingForm($formId);
    }

    public function caseInitiation(Request $request): JsonResponse
    {
        return $this->onBoardingService->caseInitiation();
    }

    public function uploadImage(IdentityUploadRequest $request): JsonResponse
    {
        return $this->onBoardingService->uploadImage($request->validated());
    }
    public function UploadCaseDocuments(CaseDocumentRequest $request): JsonResponse
    {
        return $this->onBoardingService->UploadCaseDocuments($request->validated());
    }

}