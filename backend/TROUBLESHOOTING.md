# Guide de Dépannage

## Erreur 405 - Method Not Allowed

### Symptôme
```
Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException
The GET method is not supported for route api/register. Supported methods: POST.
```

### Cause
Cette erreur se produit quand une requête HTTP utilise une méthode non autorisée pour une route. Par exemple :
- Accès direct à `/api/register` dans le navigateur (GET au lieu de POST)
- Lien ou redirection incorrecte
- Configuration incorrecte dans le frontend

### Solution

Le handler d'exceptions a été configuré pour retourner une réponse JSON propre au lieu d'une page d'erreur HTML.

**Maintenant, quand vous accédez à `/api/register` avec GET, vous recevrez :**
```json
{
  "error": "Méthode HTTP non autorisée",
  "message": "Cette route ne supporte pas la méthode GET. Méthodes supportées: POST"
}
```

### Vérifications

1. **Vérifier que le frontend utilise POST** :
   - Ouvrez les DevTools (F12)
   - Onglet Network
   - Vérifiez que les requêtes vers `/api/register` et `/api/login` utilisent la méthode POST

2. **Vérifier le service API** :
   - Le fichier `src/services/api.ts` doit utiliser `method: 'POST'` pour register et login

3. **Tester avec cURL** :
   ```bash
   # ✅ Correct (POST)
   curl -X POST http://localhost:8000/api/register -H "Content-Type: application/json" -d '{"email":"test@test.com",...}'
   
   # ❌ Incorrect (GET)
   curl http://localhost:8000/api/register
   ```

## Autres Erreurs Courantes

### Erreur 401 - Unauthorized

**Symptôme** : "Token non fourni" ou "Token invalide ou expiré"

**Solutions** :
1. Vérifier que le token est bien sauvegardé dans localStorage
2. Vérifier que le header `Authorization: Bearer {token}` est présent
3. Vérifier que le token n'est pas expiré (expire après 7 jours par défaut)
4. Se reconnecter pour obtenir un nouveau token

### Erreur 422 - Validation Error

**Symptôme** : Erreurs de validation lors de l'inscription/connexion

**Solutions** :
1. Vérifier que tous les champs requis sont remplis
2. Vérifier le format de l'email
3. Vérifier que le mot de passe fait au moins 8 caractères
4. Vérifier que `password_confirmation` correspond à `password`

### Erreur 500 - Internal Server Error

**Symptôme** : Erreur serveur générique

**Solutions** :
1. Vérifier les logs Laravel : `storage/logs/laravel.log`
2. Vérifier la connexion à la base de données
3. Vérifier que les migrations sont exécutées
4. Vérifier que JWT_SECRET est configuré dans `.env`

### Erreur CORS

**Symptôme** : "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Solutions** :
1. Vérifier `backend/config/cors.php`
2. Vérifier que l'URL du frontend est dans `allowed_origins`
3. Vérifier que le backend est démarré
4. Vider le cache : `php artisan config:clear`

### Base de données non trouvée

**Symptôme** : "SQLSTATE[3D000]: Invalid catalog name: 7 ERROR: database 'parapharmacy_db' does not exist"

**Solutions** :
1. Créer la base de données PostgreSQL :
   ```sql
   CREATE DATABASE parapharmacy_db;
   ```
2. Vérifier les credentials dans `.env`
3. Exécuter les migrations : `php artisan migrate`

### JWT_SECRET manquant

**Symptôme** : Erreurs lors de la génération/validation des tokens

**Solutions** :
1. Générer un secret : `php artisan jwt:generate`
2. Vérifier que `JWT_SECRET` est dans `.env`
3. Ne jamais utiliser le même secret en production qu'en développement

## Commandes Utiles

```bash
# Vider le cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Voir les routes disponibles
php artisan route:list

# Voir les logs en temps réel
php artisan pail

# Tester la connexion à la base de données
php artisan tinker
>>> \DB::connection()->getPdo();

# Vérifier les migrations
php artisan migrate:status
```

## Logs

Les logs Laravel sont dans : `backend/storage/logs/laravel.log`

Pour voir les erreurs en temps réel :
```bash
tail -f storage/logs/laravel.log
```

## Support

Si le problème persiste :
1. Vérifiez les logs Laravel
2. Vérifiez la console du navigateur (F12)
3. Vérifiez l'onglet Network dans les DevTools
4. Vérifiez que toutes les dépendances sont installées

