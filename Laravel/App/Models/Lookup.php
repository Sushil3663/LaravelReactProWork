<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Lookup extends Model
{
    use HasUuids;

    protected $fillable = [
        'id',
        'type',
        'code',
        'title',
        'parent_id',
        'sort_order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    // Parent relationship (for hierarchy)
    public function parent()
    {
        return $this->belongsTo(Lookup::class, 'parent_id');
    }

    // Children relationship (for hierarchy)
    public function children()
    {
        return $this->hasMany(Lookup::class, 'parent_id');
    }

    // Scope to filter by type
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    // Scope for active only
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}