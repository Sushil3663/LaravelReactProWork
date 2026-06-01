<?php

namespace App\Providers;

use App\Swagger\SilentGeneratorFactory;
use Illuminate\Support\ServiceProvider;
use L5Swagger\GeneratorFactory;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            GeneratorFactory::class,
            SilentGeneratorFactory::class
        );
    }

    public function boot(): void
    {
        //
    }
}
