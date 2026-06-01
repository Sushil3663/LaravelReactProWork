<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    title: "My Laravel API Documentation",
    description: "L5 Swagger Integration Info Description"
)]
#[OA\Server(
    url: "http://localhost:8000",
    description: "Local Development Server"
)]
abstract class Controller
{
    // ...
}