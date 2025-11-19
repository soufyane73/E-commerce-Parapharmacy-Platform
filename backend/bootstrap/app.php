<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'auth:api' => \App\Http\Middleware\JwtAuth::class,
        ]);

        // Désactiver CSRF pour les routes API
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
        return;
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Handle MethodNotAllowedHttpException for API routes
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                $allowedMethods = $e->getHeaders()['Allow'] ?? [];
                $allowedMethodsString = is_array($allowedMethods) ? implode(', ', $allowedMethods) : $allowedMethods;

                return response()->json([
                    'error' => 'Méthode HTTP non autorisée',
                    'message' => 'Cette route ne supporte pas la méthode ' . $request->method() . '. Méthodes supportées: ' . $allowedMethodsString,
                ], 405);
            }
        });

        // Handle NotFoundHttpException for API routes
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'error' => 'Route non trouvée',
                    'message' => 'La route demandée n\'existe pas',
                ], 404);
            }
        });
        return;
    })->create();

