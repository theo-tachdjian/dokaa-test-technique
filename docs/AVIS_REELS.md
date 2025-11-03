# Récupération des avis réels - Stratégie

## Problématique

Les avis doivent être les **10 derniers avis écrits par de vrais clients**, pas des avis générés ou inventés.

## Solutions possibles

### Solution 1 : Scraping Deliveroo (Recommandé - Source principale)

**Avantage** : Deliveroo affiche déjà les vrais avis clients sur leurs pages restaurant.

**Comment ça marche** :
1. Chaque restaurant Deliveroo a une page avec ses avis clients
2. Les avis sont déjà affichés sur `deliveroo.fr/fr/restaurants/[ville]/[restaurant]`
3. Le scraping Puppeteer récupère ces vrais avis directement depuis Deliveroo

**Avantages** :
- Avis réels de clients Deliveroo
- Pas besoin d'API externe payante
- Directement liés aux restaurants Deliveroo

**Code actuel** : `server/services/scraper.js` est déjà configuré pour ça, il faut juste :
1. Identifier les vrais sélecteurs CSS sur Deliveroo
2. Adapter le code pour extraire les vrais avis
3. Activer le scraping dans les routes

### Solution 2 : Google Places API (Optionnel - Complémentaire)

**Avantage** : Beaucoup d'avis Google, mais pas spécifique à Deliveroo.

**Comment ça marche** :
1. Chercher le restaurant sur Google Places avec l'adresse
2. Récupérer les avis Google
3. Filtrer pour correspondre au restaurant Deliveroo

**Inconvénients** :
- Nécessite une clé API Google (payant après crédits gratuits)
- Pas toujours une correspondance exacte avec les restaurants Deliveroo
- Limite de requêtes

**Documentation** :
- https://developers.google.com/maps/documentation/places/web-service
- Nécessite activation du billing Google Cloud

### Solution 3 : TripAdvisor (Optionnel - Complémentaire)

**Avantage** : Avis nombreux sur TripAdvisor.

**Inconvénients** :
- Pas d'API publique officielle
- Nécessiterait du scraping (plus complexe)
- Pas toujours de correspondance avec Deliveroo

## Recommandation

**Utiliser le scraping Deliveroo comme source principale** :

1. Les pages Deliveroo affichent déjà les vrais avis clients
2. C'est la source la plus fiable car directement liée au restaurant Deliveroo
3. Pas besoin d'API payante
4. Le code est déjà en place dans `scraper.js`

## Étapes pour activer les vrais avis

### Étape 1 : Identifier les sélecteurs CSS sur Deliveroo

1. Aller sur une page restaurant Deliveroo : `https://deliveroo.fr/fr/restaurants/paris/[un-restaurant]`
2. Ouvrir DevTools (F12)
3. Inspecter la section des avis
4. Identifier les classes/id/sélecteurs pour :
   - La note (rating)
   - Le commentaire
   - La date
   - L'auteur

### Étape 2 : Adapter le scraper

Modifier `server/services/scraper.js` avec les vrais sélecteurs :

```javascript
// Exemple avec les vrais sélecteurs (à adapter selon Deliveroo)
reviews = await page.evaluate(() => {
  const reviewElements = document.querySelectorAll('[vrai-selecteur-avis]');
  
  return Array.from(reviewElements)
    .slice(0, 10)
    .map((el) => {
      return {
        rating: el.querySelector('[vrai-selecteur-note]').textContent,
        comment: el.querySelector('[vrai-selecteur-commentaire]').textContent,
        date: el.querySelector('[vrai-selecteur-date]').textContent,
        author: el.querySelector('[vrai-selecteur-auteur]').textContent || 'Anonyme'
      };
    });
});
```

### Étape 3 : Activer le scraping dans les routes

Dans `server/routes/restaurants.js`, décommenter et adapter :

```javascript
// Activer le scraping au lieu des données mockées
const restaurantUrl = restaurant.url; // L'URL du restaurant
const scrapedReviews = await scraper.scrapeRestaurantReviews(restaurantUrl);
if (scrapedReviews.length > 0) {
  reviews = scrapedReviews; // Utiliser les vrais avis
}
```

## Données mockées actuelles

Les données mockées dans `mockData.js` retournent un tableau vide pour les avis, car :
- Les vrais avis viendront du scraping Deliveroo
- Les données mockées sont uniquement pour développer le frontend
- En production, seuls les vrais avis scrapés seront utilisés

## Note importante

Le scraping doit :
- Respecter les conditions d'utilisation de Deliveroo
- Ne pas surcharger leurs serveurs (délais entre requêtes)
- Utiliser un cache pour éviter de re-scraper trop souvent

