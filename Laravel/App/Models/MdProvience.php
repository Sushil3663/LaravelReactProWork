<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MdProvience extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $table = 'md_proviences';

    protected $fillable = [
        'country_id',
        'name',
        'code',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(MdCountry::class, 'country_id');
    }

    public function districts(): HasMany
    {
        return $this->hasMany(MdDistrict::class, 'provience_id');
    }
}
