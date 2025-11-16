<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'original_price',
        'image',
        'category_id',
        'brand',
        'rating',
        'reviews_count',
        'in_stock',
        'tags',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'original_price' => 'decimal:2',
            'rating' => 'decimal:2',
            'in_stock' => 'boolean',
            'tags' => 'array',
        ];
    }

    // Relations
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function bulkOrderItems()
    {
        return $this->hasMany(BulkOrderItem::class);
    }
}
