<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Profile extends Model
{
    use SoftDeletes;

    use HasUuids;
    public $incrementing = false;

    protected $table = 'profiles';

    protected $fillable = [
        'user_id',
        'name',
        'gender',
        'date_of_birth',
        'occupation_type',
        'image',
        'mobile',
        'mobile_verified_at',
    ];

    protected $casts = [
        'mobile_verified_at' => 'datetime',
        'date_of_birth' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(Customer::class, 'user_id');
    }
}