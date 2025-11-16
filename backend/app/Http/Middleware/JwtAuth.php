<?php

namespace App\Http\Middleware;

use App\Services\JwtService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtAuth
{
    protected JwtService $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?? $request->header('Authorization');

        if (!$token) {
            return response()->json(['error' => 'Token non fourni'], 401);
        }

        // Remove 'Bearer ' prefix if present
        $token = str_replace('Bearer ', '', $token);

        $user = $this->jwtService->getUserFromToken($token);

        if (!$user) {
            return response()->json(['error' => 'Token invalide ou expiré'], 401);
        }

        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        return $next($request);
    }
}
