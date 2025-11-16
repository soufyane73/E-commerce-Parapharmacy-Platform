# Guide de Démarrage Rapide

## 🚀 Configuration en 5 minutes

### 1. Générer JWT_SECRET

```bash
cd backend
php artisan jwt:generate
```

Cette commande génère automatiquement un secret sécurisé et peut le mettre à jour dans votre `.env`.

### 2. Configurer la Base de Données

Éditez `backend/.env` :

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=parapharmacy_db
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe

JWT_SECRET=le_secret_genere_par_la_commande
```

### 3. Créer la Base de Données

```sql
-- Connectez-vous à PostgreSQL
CREATE DATABASE parapharmacy_db;
```

### 4. Exécuter les Migrations

```bash
cd backend
php artisan migrate
php artisan db:seed
```

### 5. Démarrer le Serveur

```bash
php artisan serve
```

Le serveur sera accessible sur `http://localhost:8000`

## ✅ Test Rapide

### Test 1 : Vérifier que l'API fonctionne

```bash
curl http://localhost:8000/api/products
```

Vous devriez voir une liste de produits JSON.

### Test 2 : Créer un compte et se connecter

```bash
# Inscription
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "firstName": "Test",
    "lastName": "User",
    "type": "b2c"
  }'

# Copiez le token de la réponse, puis testez :
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

## 🔗 Connecter le Frontend

### 1. Créer le fichier `.env` à la racine du projet frontend

```env
VITE_API_URL=http://localhost:8000/api
```

### 2. Le service API est déjà créé

Le fichier `src/services/api.ts` est prêt à être utilisé !

### 3. Exemple d'utilisation dans un composant

```typescript
import { apiService } from '../services/api';

// Dans votre composant
const handleLogin = async () => {
  try {
    const response = await apiService.login(email, password);
    console.log('Connecté !', response.user);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

## 📚 Documentation Complète

- **SETUP.md** - Guide de configuration détaillé
- **TESTING.md** - Guide de test complet
- **README.md** - Documentation de l'API

## 🐛 Problèmes Courants

### Erreur "JWT_SECRET not found"
```bash
php artisan jwt:generate
```

### Erreur CORS
Vérifiez que `config/cors.php` contient votre URL frontend.

### Erreur de connexion PostgreSQL
Vérifiez que PostgreSQL est démarré et que les credentials dans `.env` sont corrects.

### Token expiré
Les tokens expirent après 7 jours par défaut. Reconnectez-vous pour obtenir un nouveau token.

