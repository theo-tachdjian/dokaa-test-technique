# Utilisation des données réelles

## Après avoir exécuté `npm run update-all-data`

Une fois le script terminé, voici ce qu'il faut faire :

### 1. Vérifier que le fichier a été créé

Le script génère un fichier `server/services/mockDataReal.js` avec toutes les vraies données.

### 2. Redémarrer le serveur

```bash
# Arrêter le serveur si il tourne (Ctrl+C)
# Puis redémarrer
cd server
npm run dev
```

Tu devrais voir dans la console :
```
✅ Chargement des vraies données depuis mockDataReal.js
```

### 3. Vérifier en front

Ouvre le frontend et vérifie que :
- Les adresses sont maintenant les vraies adresses des restaurants
- Les avis sont les vrais avis depuis TripAdvisor (si disponibles)

### 4. Si ça ne fonctionne pas

**Option A : Forcer le rechargement**
- Arrêter le serveur
- Supprimer le cache Node.js : `rm -rf node_modules/.cache` (si ça existe)
- Redémarrer : `npm run dev`

**Option B : Vérifier le fichier**
- Vérifier que `server/services/mockDataReal.js` existe
- Vérifier qu'il contient bien des données (pas vide)

**Option C : Utiliser les données même si incomplètes**
- Si seulement certaines adresses ont été trouvées, c'est normal
- Les restaurants sans adresse trouvée gardent leur adresse enrichie
- C'est mieux que rien !

## Mettre à jour régulièrement

Pour récupérer les dernières données :
```bash
npm run update-all-data
```

Puis redémarrer le serveur.

## Note importante

- Le script peut prendre 5-10 minutes pour tous les restaurants
- OpenStreetMap a un rate limit : 1 requête/seconde max
- Les avis TripAdvisor peuvent ne pas tous être trouvés (dépend du scraping)
- C'est normal si certains restaurants n'ont pas d'adresse trouvée (nom trop générique, restaurant fictif, etc.)

