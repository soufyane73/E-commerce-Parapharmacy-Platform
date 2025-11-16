<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FavoriteController extends Controller
{
    /**
     * Get user's favorites
     */
    public function index(Request $request)
    {
        $favorites = Favorite::where('user_id', $request->user()->id)
            ->with('product.category')
            ->get();

        return response()->json(['favorites' => $favorites]);
    }

    /**
     * Add product to favorites
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $favorite = Favorite::firstOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json([
            'message' => 'Produit ajouté aux favoris',
            'favorite' => $favorite->load('product.category'),
        ], 201);
    }

    /**
     * Remove product from favorites
     */
    public function destroy(Request $request, $id)
    {
        $favorite = Favorite::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $favorite->delete();

        return response()->json(['message' => 'Produit retiré des favoris']);
    }

    /**
     * Toggle favorite status
     */
    public function toggle(Request $request, $productId)
    {
        $favorite = Favorite::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json(['message' => 'Produit retiré des favoris', 'isFavorite' => false]);
        } else {
            $favorite = Favorite::create([
                'user_id' => $request->user()->id,
                'product_id' => $productId,
            ]);
            return response()->json([
                'message' => 'Produit ajouté aux favoris',
                'isFavorite' => true,
                'favorite' => $favorite->load('product.category'),
            ]);
        }
    }
}
