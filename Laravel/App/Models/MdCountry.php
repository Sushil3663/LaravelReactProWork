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
        'id',
        'title',
        'code',
    ];


    public function provinces(): HasMany
    {
        return $this->hasMany(MdProvience::class, 'country_id');
    }
}