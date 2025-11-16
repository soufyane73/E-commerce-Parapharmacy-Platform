# Guide de Test de l'API

## Tests Rapides avec cURL

### 1. Test des Routes Publiques

#### Obtenir les catégories
```bash
curl http://localhost:8000/api/categories
```

#### Obtenir les produits
```bash
curl http://localhost:8000/api/products
```

#### Rechercher des produits
```bash
curl "http://localhost:8000/api/products?search=vitamine"
```

#### Filtrer par catégorie
```bash
curl "http://localhost:8000/api/products?category=vitamines"
```

### 2. Test d'Authentification

#### Inscription (B2C)
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@test.com",
    "password": "password123",
    "password_confirmation": "password123",
    "firstName": "Jean",
    "lastName": "Dupont",
    "phone": "+212612345678",
    "address": "123 Rue Test",
    "city": "Casablanca",
    "type": "b2c"
  }'
```

#### Inscription (B2B)
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pharmacy@test.com",
    "password": "password123",
    "password_confirmation": "password123",
    "firstName": "Pharmacie",
    "lastName": "Test",
    "phone": "+212612345679",
    "address": "456 Avenue Test",
    "city": "Rabat",
    "type": "b2b",
    "companyName": "Pharmacie Test SARL",
    "taxId": "123456789",
    "licenseNumber": "PH-TEST-001"
  }'
```

#### Connexion
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@test.com",
    "password": "password123"
  }'
```

**Copiez le token de la réponse !**

### 3. Test des Routes Protégées

Remplacez `VOTRE_TOKEN` par le token obtenu lors de la connexion.

#### Obtenir le profil
```bash
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json"
```

#### Ajouter au panier
```bash
curl -X POST http://localhost:8000/api/cart \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

#### Obtenir le panier
```bash
curl -X GET http://localhost:8000/api/cart \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json"
```

#### Ajouter aux favoris
```bash
curl -X POST http://localhost:8000/api/favorites \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1
  }'
```

#### Créer une commande
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "client@test.com",
    "phone": "+212612345678",
    "address": "123 Rue Test",
    "city": "Casablanca",
    "postalCode": "20000",
    "shippingMethod": "amana",
    "paymentMethod": "cash"
  }'
```

### 4. Test B2B (nécessite un compte B2B)

#### Dashboard B2B
```bash
curl -X GET http://localhost:8000/api/b2b/dashboard \
  -H "Authorization: Bearer TOKEN_B2B" \
  -H "Content-Type: application/json"
```

#### Créer une commande en gros
```bash
curl -X POST http://localhost:8000/api/b2b/orders \
  -H "Authorization: Bearer TOKEN_B2B" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Client Test",
    "customerEmail": "customer@test.com",
    "customerPhone": "+212612345680",
    "customerAddress": "789 Rue Client",
    "items": [
      {
        "productId": 1,
        "quantity": 10
      },
      {
        "productId": 2,
        "quantity": 5
      }
    ],
    "paymentMethod": "cash",
    "deliveryMethod": "amana",
    "discount": 0
  }'
```

## Tests avec Postman

### Collection Postman

1. Créez une nouvelle collection "Parapharmacy API"
2. Ajoutez les variables d'environnement :
   - `base_url`: `http://localhost:8000/api`
   - `token`: (vide au début)

### Requêtes à créer

1. **Register** - `POST {{base_url}}/register`
2. **Login** - `POST {{base_url}}/login`
   - Dans l'onglet "Tests", ajoutez :
   ```javascript
   if (pm.response.code === 200) {
       var jsonData = pm.response.json();
       pm.environment.set("token", jsonData.token);
   }
   ```
3. **Get Profile** - `GET {{base_url}}/me`
   - Header: `Authorization: Bearer {{token}}`
4. **Get Products** - `GET {{base_url}}/products`
5. **Get Categories** - `GET {{base_url}}/categories`
6. **Add to Cart** - `POST {{base_url}}/cart`
7. **Get Cart** - `GET {{base_url}}/cart`
8. **Create Order** - `POST {{base_url}}/orders`

## Tests avec PHPUnit (à venir)

```bash
php artisan test
```

## Vérification de la Base de Données

```bash
php artisan tinker
```

Dans Tinker :
```php
// Compter les produits
\App\Models\Product::count();

// Voir tous les produits
\App\Models\Product::all();

// Compter les utilisateurs
\App\Models\User::count();

// Voir les catégories
\App\Models\Category::all();
```

## Dépannage

### Erreur "Token non fourni"
- Vérifiez que le header `Authorization: Bearer {token}` est présent
- Vérifiez que le token n'est pas expiré

### Erreur CORS
- Vérifiez que le frontend est sur `http://localhost:3000` ou `http://localhost:5173`
- Configurez CORS dans `config/cors.php`

### Erreur de connexion à la base de données
- Vérifiez les credentials dans `.env`
- Vérifiez que PostgreSQL est démarré
- Testez la connexion : `php artisan migrate:status`

### Erreur JWT
- Vérifiez que `JWT_SECRET` est défini dans `.env`
- Régénérez avec : `php artisan jwt:generate`

