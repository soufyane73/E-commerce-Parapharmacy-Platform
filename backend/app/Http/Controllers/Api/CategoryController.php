<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Get all categories
     */
    public function index()
    {
        $categories = Category::withCount('products')->get();

        return response()->json(['categories' => $categories]);
    }

    /**
     * Get single category with products
     */
    public function show($id)
    {
        $category = Category::with('products')->findOrFail($id);

        return response()->json(['category' => $category]);
    }
}
