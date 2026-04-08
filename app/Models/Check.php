<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Check extends Model
{
    protected $fillable = [
        'domain_id',
        'status',
        'http_code',
        'response_time',
        'error_message',
        'checked_at'
    ];

    public function domain()
    {
        return $this->belongsTo(Domain::class);
    }
}
