<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MdMunicipility extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $table = 'md_municipilities';

    protected $fillable = [
        'district_id',
        'name',
        'code',
        'type',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function district(): BelongsTo
    {
        return $this->belongsTo(MdDistrict::class, 'district_id');
    }
}
