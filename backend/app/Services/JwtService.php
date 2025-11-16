<?php

namespace App\Services;

use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Hash;

class JwtService
{
    private string $secretKey;
    private int $expirationTime;

    public function __construct()
    {
        $this->secretKey = config('jwt.secret', env('JWT_SECRET', 'your-secret-key-change-in-production'));
        $this->expirationTime = config('jwt.expiration', 60 * 24 * 7); // 7 days in minutes
    }

    /**
     * Generate JWT token for user
     */
    public function generateToken(User $user): string
    {
        $payload = [
            'iss' => config('app.url'), // Issuer
            'iat' => time(), // Issued at
            'exp' => time() + ($this->expirationTime * 60), // Expiration time
            'sub' => $user->id, // Subject (user ID)
            'email' => $user->email,
            'type' => $user->type,
        ];

        return JWT::encode($payload, $this->secretKey, 'HS256');
    }

    /**
     * Verify and decode JWT token
     */
    public function verifyToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key($this->secretKey, 'HS256'));
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get user from token
     */
    public function getUserFromToken(string $token): ?User
    {
        $decoded = $this->verifyToken($token);
        
        if (!$decoded || !isset($decoded->sub)) {
            return null;
        }

        return User::find($decoded->sub);
    }
}

