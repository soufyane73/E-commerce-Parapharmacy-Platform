<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'icon',
        'action_label',
        'action_type',
        'action_data',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'action_data' => 'array',
            'is_read' => 'boolean',
        ];
    }

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
