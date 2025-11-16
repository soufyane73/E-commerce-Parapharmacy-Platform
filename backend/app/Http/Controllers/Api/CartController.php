<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Get user's cart items
     */
    public function index(Request $request)
    {
        $cartItems = CartItem::where('user_id', $request->user()->id)
            ->with('product.category')
            ->get();

        $total = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        return response()->json([
            'cartItems' => $cartItems,
            'total' => $total,
            'totalItems' => $cartItems->sum('quantity'),
        ]);
    }

    /**
     * Add product to cart
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::findOrFail($request->product_id);

        if (!$product->in_stock) {
            return response()->json(['error' => 'Produit non disponible'], 400);
        }

        $cartItem = CartItem::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'product_id' => $product->id,
            ],
            [
                'quantity' => $request->quantity,
            ]
        );

        return response()->json([
            'message' => 'Produit ajouté au panier',
            'cartItem' => $cartItem->load('product.category'),
        ], 201);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cartItem = CartItem::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json([
            'message' => 'Quantité mise à jour',
            'cartItem' => $cartItem->load('product.category'),
        ]);
    }

    /**
     * Remove item from cart
     */
    public function destroy(Request $request, $id)
    {
        $cartItem = CartItem::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $cartItem->delete();

        return response()->json(['message' => 'Produit retiré du panier']);
    }

    /**
     * Clear cart
     */
    public function clear(Request $request)
    {
        CartItem::where('user_id', $request->user()->id)->delete();

        return response()->json(['message' => 'Panier vidé']);
    }
}
