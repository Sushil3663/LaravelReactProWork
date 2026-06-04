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
        'title',
        'code'

    ];


    public function district(): BelongsTo
    {
        return $this->belongsTo(MdDistrict::class, 'district_id');
    }
}