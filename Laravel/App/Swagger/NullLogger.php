<?php

namespace App\Swagger;

use Psr\Log\AbstractLogger;

class NullLogger extends AbstractLogger
{
    public function log($level, $message, array $context = []): void {}
}
