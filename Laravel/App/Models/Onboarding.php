<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Onboarding extends Model
{
    use SoftDeletes;

    use HasUuids;
    protected $table = 'onboardings';

    public $incrementing = false;
    protected $primaryKey = 'form_id';
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'form_id',
        'formData',
        'name',
        'email',
        'status',
        'phone',
        'path',
        'expires_at',
    ];

    protected $casts = [
        'formData' => 'object',
        'expires_at' => 'datetime',
    ];
}