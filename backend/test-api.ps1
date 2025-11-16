# Script de test pour l'API Parapharmacy

Write-Host "=== Test de l'API Parapharmacy ===" -ForegroundColor Green
Write-Host ""

# Test 1: Erreur 405 (GET sur POST route)
Write-Host "Test 1: Erreur 405 - GET sur /api/register" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/register" -Method GET -ErrorAction Stop
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $content = $_.ErrorDetails.Message
    Write-Host "Status: $statusCode" -ForegroundColor Red
    Write-Host "Response: $content" -ForegroundColor Gray
}
Write-Host ""

# Test 2: Inscription (POST)
Write-Host "Test 2: Inscription - POST /api/register" -ForegroundColor Yellow
$registerData = @{
    email = "test@example.com"
    password = "password123"
    password_confirmation = "password123"
    firstName = "Test"
    lastName = "User"
    type = "b2c"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/register" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "✅ Inscription réussie!" -ForegroundColor Green
    Write-Host "Token: $($response.token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host "User: $($response.user.name)" -ForegroundColor Gray
    $token = $response.token
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Détails: $($_.ErrorDetails.Message)" -ForegroundColor Gray
    }
}
Write-Host ""

# Test 3: Connexion (POST)
Write-Host "Test 3: Connexion - POST /api/login" -ForegroundColor Yellow
$loginData = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Connexion réussie!" -ForegroundColor Green
    Write-Host "Token: $($response.token.Substring(0, 20))..." -ForegroundColor Gray
    $token = $response.token
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Obtenir le profil (GET avec token)
if ($token) {
    Write-Host "Test 4: Profil - GET /api/me (avec token)" -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8000/api/me" -Method GET -Headers $headers
        Write-Host "✅ Profil récupéré!" -ForegroundColor Green
        Write-Host "User: $($response.user.name) ($($response.user.email))" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 5: Obtenir les produits (GET public)
Write-Host "Test 5: Produits - GET /api/products" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/products" -Method GET
    $products = if ($response.data) { $response.data } else { $response }
    Write-Host "✅ Produits récupérés: $($products.Count) produits" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Obtenir les catégories (GET public)
Write-Host "Test 6: Catégories - GET /api/categories" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/categories" -Method GET
    $categories = if ($response.categories) { $response.categories } else { $response }
    Write-Host "✅ Catégories récupérées: $($categories.Count) catégories" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Tests terminés ===" -ForegroundColor Green

