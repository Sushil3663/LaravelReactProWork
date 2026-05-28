<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

class ResponseHandler
{
    private mixed $data = null;

    private mixed $transformer = null;

    public function transformWith($transformer): static
    {
        $this->transformer = $transformer;

        return $this;
    }

    public function toItem($item): static
    {
        $this->data = $this->transformer
            ? $this->transformer->transform($item)
            : $item;

        return $this;
    }

    public function toCollection($collection): static
    {
        $this->data = $this->transformer
            ? $collection->map(fn($item) => $this->transformer->transform($item))
            : $collection;

        return $this;
    }

    public function toJson(int $status, string $description, mixed $extra = null): JsonResponse
    {
        return response()->json([
            'resCode' => (string) $status,
            'resDesc' => $description,
            'data' => $extra ?? $this->data,
        ], $status);
    }


}