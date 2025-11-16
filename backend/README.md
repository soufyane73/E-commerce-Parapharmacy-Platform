# Backend API - E-commerce Parapharmacy Platform

Backend Laravel avec authentification JWT et base de données PostgreSQL pour la plateforme e-commerce de parapharmacie.

## Technologies

- **Laravel 12** - Framework PHP
- **PostgreSQL** - Base de données
- **JWT (Firebase PHP-JWT)** - Authentification
- **Eloquent ORM** - Gestion des modèles

## Prérequis

- PHP >= 8.2
- Composer
- PostgreSQL >= 12
- Node.js et NPM (pour les assets si nécessaire)

## Installation

1. **Installer les dépendances**
```bash
composer install
```

2. **Configurer l'environnement**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Configurer la base de données PostgreSQL**

Éditez le fichier `.env` :
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=parapharmacy_db
DB_USERNAME=your_username
DB_PASSWORD=your_password

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=10080
```

4. **Créer la base de données**
```sql
CREATE DATABASE parapharmacy_db;
```

5. **Exécuter les migrations**
```bash
php artisan migrate
```

6. **Remplir la base de données (optionnel)**
```bash
php artisan db:seed
```

7. **Démarrer le serveur**
```bash
php artisan serve
```

Le serveur sera accessible sur `http://localhost:8000`

## Structure de l'API

### Base URL
```
http://localhost:8000/api
```

### Authentification

Toutes les routes protégées nécessitent un token JWT dans le header :
```
Authorization: Bearer {token}
```

## Endpoints API

### Authentification

#### POST `/api/register`
Inscription d'un nouvel utilisateur

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+212612345678",
  "address": "123 Rue Example",
  "city": "Casablanca",
  "type": "b2c",
  "companyName": "Company Name" // Si type = b2b
}
```

**Response:**
```json
{
  "message": "Inscription réussie",
  "user": {...},
  "token": "jwt_token_here"
}
```

#### POST `/api/login`
Connexion

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/me`
Obtenir l'utilisateur connecté (protégé)

#### PUT `/api/profile`
Mettre à jour le profil (protégé)

### Catégories

#### GET `/api/categories`
Liste toutes les catégories

#### GET `/api/categories/{id}`
Détails d'une catégorie

### Produits

#### GET `/api/products`
Liste tous les produits

**Query Parameters:**
- `category` - Filtrer par catégorie (slug ou ID)
- `search` - Recherche par nom, description, marque
- `in_stock` - Filtrer par disponibilité (true/false)
- `sort_by` - Trier par (created_at, price, name)
- `sort_order` - Ordre (asc, desc)
- `per_page` - Nombre d'éléments par page

#### GET `/api/products/{id}`
Détails d'un produit

### Panier

#### GET `/api/cart`
Obtenir le panier (protégé)

#### POST `/api/cart`
Ajouter un produit au panier (protégé)

**Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

#### PUT `/api/cart/{id}`
Mettre à jour la quantité (protégé)

#### DELETE `/api/cart/{id}`
Retirer un produit (protégé)

#### DELETE `/api/cart`
Vider le panier (protégé)

### Favoris

#### GET `/api/favorites`
Liste des favoris (protégé)

#### POST `/api/favorites`
Ajouter aux favoris (protégé)

#### DELETE `/api/favorites/{id}`
Retirer des favoris (protégé)

#### POST `/api/favorites/toggle/{productId}`
Basculer le statut favori (protégé)

### Commandes

#### GET `/api/orders`
Liste des commandes (protégé)

#### GET `/api/orders/{id}`
Détails d'une commande (protégé)

#### POST `/api/orders`
Créer une commande depuis le panier (protégé)

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+212612345678",
  "address": "123 Rue Example",
  "city": "Casablanca",
  "postalCode": "20000",
  "notes": "Notes optionnelles",
  "shippingMethod": "amana",
  "paymentMethod": "cash"
}
```

### Notifications

#### GET `/api/notifications`
Liste des notifications (protégé)

#### GET `/api/notifications/unread-count`
Nombre de notifications non lues (protégé)

#### PUT `/api/notifications/{id}/read`
Marquer comme lue (protégé)

#### PUT `/api/notifications/read-all`
Tout marquer comme lu (protégé)

#### DELETE `/api/notifications/{id}`
Supprimer une notification (protégé)

### B2B (Professionnels)

#### GET `/api/b2b/dashboard`
Statistiques du dashboard (protégé, B2B uniquement)

#### GET `/api/b2b/orders`
Liste des commandes en gros (protégé, B2B uniquement)

#### POST `/api/b2b/orders`
Créer une commande en gros (protégé, B2B uniquement)

**Body:**
```json
{
  "customerName": "Client Name",
  "customerEmail": "client@example.com",
  "customerPhone": "+212612345678",
  "customerAddress": "123 Address",
  "items": [
    {
      "productId": 1,
      "quantity": 10
    }
  ],
  "notes": "Notes",
  "paymentMethod": "cash",
  "deliveryMethod": "amana",
  "discount": 0
}
```

#### GET `/api/b2b/clients`
Liste des clients (protégé, B2B uniquement)

#### POST `/api/b2b/clients`
Créer un client (protégé, B2B uniquement)

#### PUT `/api/b2b/clients/{id}`
Mettre à jour un client (protégé, B2B uniquement)

#### DELETE `/api/b2b/clients/{id}`
Supprimer un client (protégé, B2B uniquement)

## Structure de la base de données

### Tables principales

- `users` - Utilisateurs (B2C et B2B)
- `categories` - Catégories de produits
- `products` - Produits
- `cart_items` - Articles du panier
- `favorites` - Favoris
- `orders` - Commandes B2C
- `order_items` - Articles de commande
- `bulk_orders` - Commandes en gros B2B
- `bulk_order_items` - Articles de commande en gros
- `clients` - Clients B2B
- `notifications` - Notifications utilisateur

## Configuration CORS

Le CORS est configuré pour permettre les requêtes depuis le frontend React. Assurez-vous que le frontend est configuré pour pointer vers l'URL du backend.

## Sécurité

- Les mots de passe sont hashés avec bcrypt
- JWT avec expiration configurable
- Middleware d'authentification pour les routes protégées
- Validation des données avec Laravel Validator

## Développement

### Créer un seeder
```bash
php artisan make:seeder CategorySeeder
```

### Exécuter les tests
```bash
php artisan test
```

### Générer la documentation API
Utilisez des outils comme Postman ou Swagger pour documenter l'API.

## Support

Pour toute question ou problème, consultez la documentation Laravel : https://laravel.com/docs
