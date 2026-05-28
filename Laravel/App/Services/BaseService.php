<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseService
{
    public function __construct(protected Model $model) {}

    public function all(array $columns = ['*']): Collection
    {
        return $this->model->all($columns);
    }

    public function getById(int|string $id): Model
    {
        return $this->model->findOrFail($id);
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function updateById(int|string $id, array $data): Model
    {
        $record = $this->getById($id);
        $record->update($data);
        return $record->fresh();
    }

    public function deleteById(int|string $id): bool
    {
        return $this->getById($id)->delete();
    }
}
