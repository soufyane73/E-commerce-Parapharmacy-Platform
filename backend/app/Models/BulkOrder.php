<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BulkOrder extends Model
{
    protected $fillable = [
        'user_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'notes',
        'payment_method',
        'delivery_method',
        'subtotal',
        'discount',
        'total',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'discount' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(BulkOrderItem::class);
    }
}
