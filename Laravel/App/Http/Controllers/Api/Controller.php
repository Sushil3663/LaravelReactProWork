<?php

namespace App\Http\Controllers\Api;

use App\Http\Responses\ResponseHandler;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    protected ResponseHandler $responseHandler;

    public function __construct()
    {
        $this->responseHandler = app(ResponseHandler::class);
    }
}
