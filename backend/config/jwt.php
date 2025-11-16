<?php

return [
    'secret' => env('JWT_SECRET', 'your-secret-key-change-in-production'),
    'expiration' => env('JWT_EXPIRATION', 60 * 24 * 7), // 7 days in minutes
];

