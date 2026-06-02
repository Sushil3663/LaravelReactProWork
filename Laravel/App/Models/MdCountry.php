<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MdCountry extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $table = 'md_countrys';

    protected $fillable = [
        'name',
        'code',
        'phone_code',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function provinces(): HasMany
    {
        return $this->hasMany(MdProvience::class, 'country_id');
    }
}
