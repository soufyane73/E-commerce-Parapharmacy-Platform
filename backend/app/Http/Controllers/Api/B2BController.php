<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BulkOrder;
use App\Models\BulkOrderItem;
use App\Models\Client;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class B2BController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        if ($user->type !== 'b2b') {
            return response()->json(['error' => 'Accès réservé aux utilisateurs B2B'], 403);
        }

        // Sales statistics
        $totalSales = BulkOrder::where('user_id', $user->id)
            ->where('status', '!=', 'cancelled')
            ->sum('total');

        $totalOrders = BulkOrder::where('user_id', $user->id)->count();
        $pendingOrders = BulkOrder::where('user_id', $user->id)
            ->where('status', 'pending')
            ->count();

        $totalClients = Client::where('user_id', $user->id)->count();

        // Recent orders
        $recentOrders = BulkOrder::where('user_id', $user->id)
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Sales by month (last 6 months)
        $salesByMonth = BulkOrder::where('user_id', $user->id)
            ->where('status', '!=', 'cancelled')
            ->selectRaw('DATE_TRUNC(\'month\', created_at) as month, SUM(total) as total')
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get();

        return response()->json([
            'statistics' => [
                'totalSales' => $totalSales,
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'totalClients' => $totalClients,
            ],
            'recentOrders' => $recentOrders,
            'salesByMonth' => $salesByMonth,
        ]);
    }

    /**
     * Get all bulk orders
     */
    public function bulkOrders(Request $request)
    {
        $user = $request->user();

        if ($user->type !== 'b2b') {
            return response()->json(['error' => 'Accès réservé aux utilisateurs B2B'], 403);
        }

        $query = BulkOrder::where('user_id', $user->id)
            ->with('items.product');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%")
                  ->orWhere('order_number', 'like', "%{$search}%");
            });
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($orders);
    }

    /**
     * Create bulk order
     */
    public function createBulkOrder(Request $request)
    {
        $user = $request->user();

        if ($user->type !== 'b2b') {
            return response()->json(['error' => 'Accès réservé aux utilisateurs B2B'], 403);
        }

        $validator = Validator::make($request->all(), [
            'customerName' => 'required|string|max:255',
            'customerEmail' => 'required|email',
            'customerPhone' => 'required|string|max:20',
            'customerAddress' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.productId' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
            'paymentMethod' => 'required|string',
            'deliveryMethod' => 'required|string',
            'discount' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $subtotal = 0;
            $orderItems = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['productId']);
                $quantity = $item['quantity'];
                $price = $product->price;
                $itemTotal = $quantity * $price;
                $subtotal += $itemTotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $price,
                    'total' => $itemTotal,
                ];
            }

            $discount = $request->discount ?? 0;
            $total = $subtotal - $discount;

            $bulkOrder = BulkOrder::create([
                'user_id' => $user->id,
                'customer_name' => $request->customerName,
                'customer_email' => $request->customerEmail,
                'customer_phone' => $request->customerPhone,
                'customer_address' => $request->customerAddress,
                'notes' => $request->notes,
                'payment_method' => $request->paymentMethod,
                'delivery_method' => $request->deliveryMethod,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $total,
                'status' => 'pending',
            ]);

            foreach ($orderItems as $item) {
                BulkOrderItem::create([
                    'bulk_order_id' => $bulkOrder->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['total'],
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Commande en gros créée avec succès',
                'order' => $bulkOrder->load('items.product'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erreur lors de la création de la commande'], 500);
        }
    }

    /**
     * Get all clients
     */
    public function clients(Request $request)
    {
        $user = $request->user();

        if ($user->type !== 'b2b') {
            return response()->json(['error' => 'Accès réservé aux utilisateurs B2B'], 403);
        }

        $clients = Client::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($clients);
    }

    /**
     * Create or update client
     */
    public function saveClient(Request $request)
    {
        $user = $request->user();

        if ($user->type !== 'b2b') {
            return response()->json(['error' => 'Accès réservé aux utilisateurs B2B'], 403);
        }

        $validator = Validator::make($request->all(), [
            'id' => 'nullable|exists:clients,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'status' => 'required|in:active,inactive,vip',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->has('id')) {
            $client = Client::where('id', $request->id)
                ->where('user_id', $user->id)
                ->firstOrFail();
            $client->update($request->only(['name', 'email', 'phone', 'address', 'city', 'status']));
            $message = 'Client mis à jour';
        } else {
            $client = Client::create([
                'user_id' => $user->id,
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'status' => $request->status,
            ]);
            $message = 'Client créé';
        }

        return response()->json([
            'message' => $message,
            'client' => $client,
        ], $request->has('id') ? 200 : 201);
    }

    /**
     * Delete client
     */
    public function deleteClient(Request $request, $id)
    {
        $user = $request->user();

        if ($user->type !== 'b2b') {
            return response()->json(['error' => 'Accès réservé aux utilisateurs B2B'], 403);
        }

        $client = Client::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $client->delete();

        return response()->json(['message' => 'Client supprimé']);
    }
}
