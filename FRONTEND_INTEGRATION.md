# Guide d'Intégration Frontend-Backend

## ✅ Modifications Effectuées

### 1. Service API (`src/services/api.ts`)
- Service complet pour toutes les opérations API
- Gestion automatique du token JWT
- Stockage du token dans localStorage

### 2. Authentification (`src/components/AuthModal.tsx`)
- ✅ Utilise `apiService.login()` au lieu de `validateCredentials()`
- ✅ Utilise `apiService.register()` pour l'inscription
- ✅ Gestion des erreurs avec messages appropriés
- ✅ État de chargement sur les boutons

### 3. Application Principale (`src/App.tsx`)
- ✅ Charge les produits depuis l'API au démarrage
- ✅ Charge les catégories depuis l'API
- ✅ Vérifie l'authentification au démarrage (token dans localStorage)
- ✅ Charge le panier, favoris et notifications quand l'utilisateur se connecte
- ✅ Toutes les opérations utilisent maintenant l'API :
  - `handleAddToCart` → `apiService.addToCart()`
  - `handleToggleFavorite` → `apiService.toggleFavorite()`
  - `handleOrderComplete` → `apiService.createOrder()`
  - `handleLogout` → `apiService.logout()`
  - Notifications → `apiService.getNotifications()`, etc.

### 4. Checkout (`src/components/CheckoutModal.tsx`)
- ✅ Pré-remplit le formulaire avec les données utilisateur
- ✅ Passe les données de commande à l'API

## 🔧 Configuration Requise

### 1. Créer le fichier `.env` à la racine du projet

```env
VITE_API_URL=http://localhost:8000/api
```

### 2. Démarrer le backend

```bash
cd backend
php artisan serve
```

### 3. Démarrer le frontend

```bash
npm run dev
```

## 🧪 Test de l'Intégration

### 1. Test de connexion
1. Ouvrez l'application
2. Cliquez sur "Connexion"
3. Créez un compte ou connectez-vous
4. Le token est automatiquement sauvegardé

### 2. Test du panier
1. Ajoutez un produit au panier
2. Vérifiez que le panier se charge depuis l'API
3. Modifiez la quantité
4. Retirez un produit

### 3. Test des favoris
1. Ajoutez un produit aux favoris
2. Vérifiez que les favoris persistent après rechargement

### 4. Test de commande
1. Ajoutez des produits au panier
2. Passez commande
3. Vérifiez que la commande est créée dans la base de données

## 🔄 Flux de Données

### Au démarrage
1. `loadInitialData()` → Charge produits et catégories
2. `checkAuth()` → Vérifie si un token existe et est valide
3. Si utilisateur connecté → `loadUserData()` → Charge panier, favoris, notifications

### Lors de la connexion
1. `apiService.login()` → Obtient le token
2. Token sauvegardé dans localStorage
3. `setUser()` → Déclenche `useEffect` qui appelle `loadUserData()`

### Lors de l'ajout au panier
1. `apiService.addToCart()` → Appel API
2. Rechargement du panier depuis l'API
3. Mise à jour de l'état local

## 🐛 Dépannage

### Erreur CORS
- Vérifiez que le backend est démarré
- Vérifiez `backend/config/cors.php`
- Vérifiez que `VITE_API_URL` pointe vers le bon port

### Token expiré
- Le token expire après 7 jours
- L'utilisateur sera automatiquement déconnecté
- Il devra se reconnecter

### Erreur "Token non fourni"
- Vérifiez que le token est bien sauvegardé dans localStorage
- Vérifiez que `apiService.setToken()` est appelé après login

### Produits ne se chargent pas
- Vérifiez que le backend est démarré
- Vérifiez que les migrations et seeders sont exécutés
- Ouvrez la console du navigateur pour voir les erreurs

## 📝 Notes Importantes

1. **Format des données** : L'API retourne `snake_case` (ex: `company_name`) mais le frontend utilise `camelCase` (ex: `companyName`). La conversion est faite automatiquement.

2. **IDs** : L'API retourne des IDs numériques, le frontend les convertit en strings pour compatibilité.

3. **Catégories** : Les catégories peuvent être filtrées par ID ou slug.

4. **Pagination** : Les produits sont chargés avec `per_page: 100` par défaut. Pour la pagination complète, modifiez `loadInitialData()`.

## 🚀 Prochaines Étapes

1. Ajouter la pagination pour les produits
2. Ajouter le rafraîchissement automatique des notifications
3. Ajouter la gestion des erreurs réseau
4. Ajouter un système de retry pour les requêtes échouées
5. Optimiser les appels API (cache, debounce, etc.)

