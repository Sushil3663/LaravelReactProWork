<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;
use App\Exceptions\GeneralException;

class ApiHelper
{
    public function apiCall(
        string $method,
        string $url,
        array  $data    = [],
        array  $options = [],
        bool   $useSSL  = false
    ): array {
        try {
            $http = Http::timeout(30)
                ->connectTimeout(10)
                ->retry(2, 500)
                ->withoutVerifying(!$useSSL);

            if (!empty($options['headers'])) {
                $http = $http->withHeaders($options['headers']);
            }

            if (!empty($options['bearer'])) {
                $http = $http->withToken($options['bearer']);
            }

            $contentType = $options['content_type'] ?? 'json';

            $response = match (strtoupper($method)) {
                'GET'    => $http->get($url, $data),
                'POST'   => $contentType === 'form'
                            ? $http->asForm()->post($url, $data)
                            : $http->post($url, $data),
                'PUT'    => $http->put($url, $data),
                'DELETE' => $http->delete($url, $data),
                default  => throw new GeneralException('Unsupported HTTP method', 400),
            };

            if ($response->failed()) {
                throw new GeneralException(
                    'External API call failed: ' . $response->body(),
                    $response->status()
                );
            }

            return $response->json() ?? [];

        } catch (GeneralException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw new GeneralException('External API error: ' . $e->getMessage(), 500);
        }
    }
}
