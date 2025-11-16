<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected JwtService $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'type' => 'required|in:b2c,b2b',
            // B2B fields
            'companyName' => 'required_if:type,b2b|string|max:255',
            'taxId' => 'required_if:type,b2b|string|max:50',
            'licenseNumber' => 'required_if:type,b2b|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->firstName . ' ' . $request->lastName,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'type' => $request->type,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'company_name' => $request->companyName ?? null,
            'tax_id' => $request->taxId ?? null,
            'license_number' => $request->licenseNumber ?? null,
        ]);

        $token = $this->jwtService->generateToken($user);

        return response()->json([
            'message' => 'Inscription réussie',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Identifiants invalides'], 401);
        }

        $token = $this->jwtService->generateToken($user);

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'companyName' => 'nullable|string|max:255',
            'taxId' => 'nullable|string|max:50',
            'licenseNumber' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update([
            'name' => $request->name ?? $user->name,
            'phone' => $request->phone ?? $user->phone,
            'address' => $request->address ?? $user->address,
            'city' => $request->city ?? $user->city,
            'company_name' => $request->companyName ?? $user->company_name,
            'tax_id' => $request->taxId ?? $user->tax_id,
            'license_number' => $request->licenseNumber ?? $user->license_number,
        ]);

        return response()->json([
            'message' => 'Profil mis à jour',
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Logout user (client-side token removal)
     */
    public function logout()
    {
        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
