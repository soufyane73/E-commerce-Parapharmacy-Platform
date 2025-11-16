#!/bin/bash

# Script de test pour l'API Parapharmacy (Linux/Mac)

echo "=== Test de l'API Parapharmacy ==="
echo ""

# Test 1: Erreur 405 (GET sur POST route)
echo "Test 1: Erreur 405 - GET sur /api/register"
curl -s http://localhost:8000/api/register | jq .
echo ""

# Test 2: Inscription (POST)
echo "Test 2: Inscription - POST /api/register"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "firstName": "Test",
    "lastName": "User",
    "type": "b2c"
  }')

echo "$REGISTER_RESPONSE" | jq .
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token // empty')
echo ""

# Test 3: Connexion (POST)
echo "Test 3: Connexion - POST /api/login"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq .
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')
echo ""

# Test 4: Obtenir le profil (GET avec token)
if [ ! -z "$TOKEN" ]; then
  echo "Test 4: Profil - GET /api/me (avec token)"
  curl -s -X GET http://localhost:8000/api/me \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" | jq .
  echo ""
fi

# Test 5: Obtenir les produits (GET public)
echo "Test 5: Produits - GET /api/products"
curl -s http://localhost:8000/api/products | jq '.data | length' | xargs echo "Produits récupérés:"
echo ""

# Test 6: Obtenir les catégories (GET public)
echo "Test 6: Catégories - GET /api/categories"
curl -s http://localhost:8000/api/categories | jq '.categories | length' | xargs echo "Catégories récupérées:"
echo ""

echo "=== Tests terminés ==="

