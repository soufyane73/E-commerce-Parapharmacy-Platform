# Guide de Configuration et Test du Backend

## 1. Générer JWT_SECRET

### Méthode 1 : Commande Artisan (Recommandé)
```bash
php artisan jwt:generate
```

### Méthode 2 : Manuellement avec PHP
```bash
php -r "echo base64_encode(random_bytes(64));"
```

### Méthode 3 : En ligne de commande (Linux/Mac)
```bash
openssl rand -base64 64
```

### Méthode 4 : PowerShell (Windows)
```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Copiez le résultat et ajoutez-le dans votre fichier `.env` :
```env
JWT_SECRET=votre_secret_genere_ici
```

## 2. Configuration Complète du .env

Créez ou modifiez le fichier `backend/.env` :

```env
APP_NAME="E-commerce Parapharmacy"
APP_ENV=local
APP_KEY=base64:... (généré avec php artisan key:generate)
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=parapharmacy_db
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe

JWT_SECRET=votre_jwt_secret_genere
JWT_EXPIRATION=10080
```

## 3. Installation et Migration

```bash
# Installer les dépendances
composer install

# Générer la clé d'application
php artisan key:generate

# Créer la base de données PostgreSQL
# (Connectez-vous à PostgreSQL et exécutez)
# CREATE DATABASE parapharmacy_db;

# Exécuter les migrations
php artisan migrate

# Remplir avec les données de test
php artisan db:seed

# Démarrer le serveur
php artisan serve
```

Le serveur sera accessible sur `http://localhost:8000`

## 4. Tester l'API

### Avec cURL

#### Test 1 : Inscription
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+212612345678",
    "address": "123 Rue Example",
    "city": "Casablanca",
    "type": "b2c"
  }'
```

#### Test 2 : Connexion
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copiez le `token` de la réponse.

#### Test 3 : Accéder au profil (avec token)
```bash
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -H "Content-Type: application/json"
```

#### Test 4 : Obtenir les produits
```bash
curl -X GET http://localhost:8000/api/products \
  -H "Content-Type: application/json"
```

### Avec Postman

1. **Créer une collection** "Parapharmacy API"

2. **Variables d'environnement** :
   - `base_url`: `http://localhost:8000/api`
   - `token`: (sera rempli automatiquement)

3. **Requêtes à créer** :
   - `POST {{base_url}}/register` - Inscription
   - `POST {{base_url}}/login` - Connexion
     - Dans "Tests", ajoutez :
     ```javascript
     if (pm.response.code === 200) {
         var jsonData = pm.response.json();
         pm.environment.set("token", jsonData.token);
     }
     ```
   - `GET {{base_url}}/me` - Profil
     - Header: `Authorization: Bearer {{token}}`
   - `GET {{base_url}}/products` - Produits
   - `GET {{base_url}}/categories` - Catégories
   - `GET {{base_url}}/cart` - Panier (avec token)
   - `POST {{base_url}}/cart` - Ajouter au panier (avec token)

## 5. Connecter le Frontend React

### Étape 1 : Créer un service API

Créez `src/services/api.ts` :

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async register(data: any) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async logout() {
    this.setToken(null);
  }

  async getProfile() {
    return this.request('/me');
  }

  // Products
  async getProducts(params?: Record<string, any>) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  // Categories
  async getCategories() {
    return this.request('/categories');
  }

  // Cart
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId: string, quantity: number) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async updateCartItem(id: string, quantity: number) {
    return this.request(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(id: string) {
    return this.request(`/cart/${id}`, {
      method: 'DELETE',
    });
  }

  // Favorites
  async getFavorites() {
    return this.request('/favorites');
  }

  async toggleFavorite(productId: string) {
    return this.request(`/favorites/toggle/${productId}`, {
      method: 'POST',
    });
  }

  // Orders
  async createOrder(data: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications');
  }
}

export const apiService = new ApiService();
```

### Étape 2 : Créer un fichier .env dans le frontend

Créez `.env` à la racine du projet frontend :

```env
VITE_API_URL=http://localhost:8000/api
```

### Étape 3 : Modifier AuthModal pour utiliser l'API

Dans `src/components/AuthModal.tsx`, remplacez la logique de validation par :

```typescript
import { apiService } from '../services/api';

// Dans la fonction de login
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await apiService.login(loginData.email, loginData.password);
    onLogin(response.user);
    onClose();
    toast.success(`Bienvenue ${response.user.name} !`);
  } catch (error: any) {
    toast.error(error.message || 'Erreur de connexion');
  }
};

// Dans la fonction de register
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await apiService.register(registerData);
    onLogin(response.user);
    onClose();
    toast.success('Inscription réussie !');
  } catch (error: any) {
    toast.error(error.message || 'Erreur d\'inscription');
  }
};
```

## 6. Résolution des Problèmes CORS

Si vous avez des erreurs CORS, configurez dans `backend/config/cors.php` :

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000', 'http://localhost:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

Ou dans `backend/bootstrap/app.php`, ajoutez :

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->alias([
        'jwt.auth' => \App\Http\Middleware\JwtAuth::class,
    ]);
    
    $middleware->validateCsrfTokens(except: [
        'api/*',
    ]);
})
```

## 7. Vérification Rapide

Testez que tout fonctionne :

```bash
# 1. Vérifier que le serveur démarre
php artisan serve

# 2. Tester une route publique
curl http://localhost:8000/api/products

# 3. Vérifier la base de données
php artisan tinker
>>> \App\Models\Product::count()
```

Si tout fonctionne, vous devriez voir le nombre de produits (12 après le seed).

