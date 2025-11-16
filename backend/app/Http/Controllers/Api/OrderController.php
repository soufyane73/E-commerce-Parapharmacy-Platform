<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Get user's orders
     */
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($orders);
    }

    /**
     * Get single order
     */
    public function show(Request $request, $id)
    {
        $order = Order::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->with('items.product')
            ->firstOrFail();

        return response()->json(['order' => $order]);
    }

    /**
     * Create new order from cart
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'postalCode' => 'nullable|string|max:10',
            'notes' => 'nullable|string',
            'shippingMethod' => 'required|string',
            'paymentMethod' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cartItems = CartItem::where('user_id', $request->user()->id)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['error' => 'Le panier est vide'], 400);
        }

        DB::beginTransaction();
        try {
            // Calculate totals
            $subtotal = $cartItems->sum(function ($item) {
                return $item->quantity * $item->product->price;
            });
            $discount = 0; // Can be calculated based on promotions
            $total = $subtotal - $discount;

            // Generate order number
            $orderNumber = 'CMD' . date('Ymd') . str_pad(Order::count() + 1, 6, '0', STR_PAD_LEFT);

            // Create order
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $request->user()->id,
                'first_name' => $request->firstName,
                'last_name' => $request->lastName,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'postal_code' => $request->postalCode,
                'notes' => $request->notes,
                'shipping_method' => $request->shippingMethod,
                'payment_method' => $request->paymentMethod,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $total,
                'status' => 'pending',
            ]);

            // Create order items
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price,
                    'total' => $cartItem->quantity * $cartItem->product->price,
                ]);
            }

            // Clear cart
            CartItem::where('user_id', $request->user()->id)->delete();

            DB::commit();

            return response()->json([
                'message' => 'Commande créée avec succès',
                'order' => $order->load('items.product'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erreur lors de la création de la commande'], 500);
        }
    }
}
