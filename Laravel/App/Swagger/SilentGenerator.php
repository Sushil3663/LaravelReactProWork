<?php

namespace App\Swagger;

use L5Swagger\Generator;
use OpenApi\Generator as OpenApiGenerator;
use Psr\Log\LoggerInterface;

class SilentGenerator extends Generator
{
    private ?LoggerInterface $swaggerLogger = null;

    public function setSwaggerLogger(?LoggerInterface $logger): void
    {
        $this->swaggerLogger = $logger;
    }

    protected function createOpenApiGenerator(): OpenApiGenerator
    {
        $generator = new OpenApiGenerator($this->swaggerLogger);

        if (! empty($this->scanOptions['default_processors_configuration'])
            && is_array($this->scanOptions['default_processors_configuration'])
        ) {
            $generator->setConfig($this->scanOptions['default_processors_configuration']);
        }

        $generator->setVersion(
            $this->scanOptions['open_api_spec_version'] ?? self::OPEN_API_DEFAULT_SPEC_VERSION
        );

        $this->setProcessors($generator);
        $this->setAnalyser($generator);

        return $generator;
    }
}
