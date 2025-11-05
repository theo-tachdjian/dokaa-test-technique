# Scraping TripAdvisor - Guide de configuration

## Le problème

Pour que le scraping fonctionne correctement, il faut identifier les **bons sélecteurs CSS** sur TripAdvisor. Ces sélecteurs peuvent changer selon la structure de la page.

## Comment tester et configurer

### 1. Tester le scraper sur un restaurant

```bash
cd server
npm run test-scraper "Sushi Express" "Paris"
```

Ce script va :
- Chercher le restaurant sur TripAdvisor
- Tenter de récupérer l'adresse
- Tenter de récupérer les 10 avis les plus récents
- Afficher les résultats dans la console

### 2. Si ça ne fonctionne pas

Le script affiche des messages de debug qui indiquent :
- Quels sélecteurs ont été essayés
- Ce qui a été trouvé sur la page
- Les classes CSS des éléments trouvés

### 3. Adapter les sélecteurs

1. Ouvrir TripAdvisor dans un navigateur
2. Chercher un restaurant (ex: "Sushi Express Paris")
3. Ouvrir les DevTools (F12)
4. Inspecter les éléments d'avis
5. Identifier les classes CSS ou attributs data-*
6. Mettre à jour les sélecteurs dans `server/services/tripadvisorScraper.js`

### 4. Sélecteurs à vérifier

**Pour les avis :**
- Conteneur des avis : `[data-test-target="HR_CC_CARD"]`
- Texte du commentaire : `.partial_entry`, `.reviewText`
- Auteur : `.username`, `.memberOverlayLink`
- Date : `.ratingDate`, `time[datetime]`
- Note : `.ui_bubble_rating`, `.bubble_50` (pour 5 étoiles)

**Pour les adresses :**
- `[data-test-target="address"]`
- `.address a`
- Liens vers Google Maps

## Mettre à jour toutes les données

Une fois que le scraping fonctionne pour un restaurant :

```bash
cd server
npm run update-data
```

Ce script va :
- Scraper les vraies adresses pour tous les restaurants
- Scraper les 10 vrais avis pour tous les restaurants
- Générer un fichier `mockDataUpdated.js` avec les vraies données
- Afficher un résumé des résultats

**Important :** Ce script peut prendre du temps (plusieurs minutes) car il traite tous les restaurants.

## Utiliser les données mises à jour

Une fois le script terminé :

1. Remplacer `server/services/mockData.js` par `server/services/mockDataUpdated.js`
2. Ou copier le contenu de `mockDataUpdated.js` dans `mockData.js`
3. Redémarrer le serveur

## Notes importantes

- TripAdvisor peut bloquer les requêtes trop fréquentes
- Le script attend 3 secondes entre chaque restaurant
- Si le scraping échoue, les données mockées sont conservées
- Les sélecteurs CSS peuvent changer si TripAdvisor modifie leur site

## Dépannage

**Aucun avis trouvé :**
- Vérifier que le restaurant existe bien sur TripAdvisor
- Vérifier les sélecteurs CSS dans les DevTools
- Activer le mode debug pour voir la structure HTML

**Adresse non trouvée :**
- Vérifier que le nom du restaurant correspond exactement
- Essayer avec la ville en plus précis (ex: "Paris 8ème" au lieu de "Paris")

**Erreurs de timeout :**
- Augmenter `defaultGotoTimeoutMs` dans `tripadvisorScraper.js`
- Vérifier votre connexion internet
- TripAdvisor peut être lent à répondre

