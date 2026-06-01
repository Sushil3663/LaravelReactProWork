<?php

namespace App\Swagger;

use L5Swagger\ConfigFactory;
use L5Swagger\Generator;
use L5Swagger\GeneratorFactory;
use L5Swagger\SecurityDefinitions;

class SilentGeneratorFactory extends GeneratorFactory
{
    public function __construct()
    {
        // Bypass parent constructor
    }

    public function make(string $documentation): Generator
    {
        $configFactory = app(ConfigFactory::class);
        $config = $configFactory->documentationConfig($documentation);

        $generator = new SilentGenerator(
            $config['paths'],
            $config['constants'] ?? [],
            $config['generate_yaml_copy'] ?? false,
            new SecurityDefinitions(
                $config['securityDefinitions']['securitySchemes'] ?? [],
                $config['securityDefinitions']['security'] ?? []
            ),
            $config['scanOptions'] ?? []
        );

        $generator->setSwaggerLogger(new NullLogger);

        return $generator;
    }
}
