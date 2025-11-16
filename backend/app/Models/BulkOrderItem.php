<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BulkOrderItem extends Model
{
    protected $fillable = [
        'bulk_order_id',
        'product_id',
        'quantity',
        'price',
        'total',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }

    // Relations
    public function bulkOrder()
    {
        return $this->belongsTo(BulkOrder::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
