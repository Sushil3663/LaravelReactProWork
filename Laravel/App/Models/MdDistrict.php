<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MdDistrict extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $table = 'md_districts';

    protected $fillable = [
        'provience_id',
        'title',
        'code',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function provience(): BelongsTo
    {
        return $this->belongsTo(MdProvience::class, 'provience_id');
    }

    public function municipalities(): HasMany
    {
        return $this->hasMany(MdMunicipility::class, 'district_id');
    }
}
