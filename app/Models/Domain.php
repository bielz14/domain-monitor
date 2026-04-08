<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Domain extends Model
{
    protected $fillable = [
        'user_id',
        'url',
        'check_interval',
        'timeout',
        'method',
        'last_checked_at'
    ];

    public function checks()
    {
        return $this->hasMany(Check::class);
    }
}
