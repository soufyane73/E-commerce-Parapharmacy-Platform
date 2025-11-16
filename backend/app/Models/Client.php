<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'address',
        'city',
        'total_orders',
        'total_spent',
        'last_order_date',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'total_spent' => 'decimal:2',
            'last_order_date' => 'date',
        ];
    }

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
