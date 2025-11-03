# APIs et Scraping - Mes notes

Alors, le problème c'est que Deliveroo n'a pas d'API publique (j'ai vérifié, y'a rien d'officiel). Donc je vais devoir scraper leur site. C'est pas l'idéal mais bon, c'est ce qu'ils demandent.

## Comment je vais récupérer les données

### Option 1 : Scraping Web (c'est ce que je vais faire)

Bon, pas le choix, faut scraper. Je vais voir comment faire ça proprement.

#### Les outils que j'ai regardés

1. **Puppeteer** (ce que je vais utiliser)
   - Ça lance un vrai navigateur Chrome en arrière-plan
   - Ça gère le JavaScript, c'est important parce que Deliveroo charge sûrement les avis en JS
   - J'ai déjà testé Puppeteer une fois, ça avait marché
   ```bash
   npm install puppeteer
   ```

2. **Playwright** (j'ai regardé mais je vais pas l'utiliser)
   - Ça a l'air bien mais je connais pas trop
   - API moderne apparemment
   - Je pense que Puppeteer sera suffisant

3. **Cheerio** (trop simple pour ce cas)
   - Plus léger mais ça marche que si le HTML est déjà chargé
   - Je pense que Deliveroo charge les avis en dynamique, donc ça passera pas
   - Mais bon, je garde ça en tête si jamais

#### Structure des URLs Deliveroo

J'ai regardé quelques pages, ça a l'air d'être comme ça :
- Page restaurant : `https://deliveroo.fr/fr/restaurants/[region]/[slug]?day=today&geohash=[hash]`
- Exemple : `https://deliveroo.fr/fr/restaurants/paris/restaurant-name?day=today&geohash=u09tv`

Bon, le geohash ça a l'air optionnel peut-être, je vais tester sans aussi. Faut que je voie comment construire l'URL à partir d'un nom de restaurant.

#### Stratégie de scraping

**Étape 1 : Recherche de restaurants**
```javascript
// Option A : Scraper la page de recherche
https://deliveroo.fr/fr/restaurants?q=[search-term]

// Option B : Utiliser des données mockées pour la recherche
// (Plus rapide pour le test, si le scraping de recherche est complexe)
```

**Étape 2 : Récupération des avis**
- Identifier les sélecteurs CSS/éléments DOM contenant les avis
- Attendre le chargement dynamique (si JS requis)
- Extraire : note, commentaire, date, auteur

#### Exemple de code avec Puppeteer

```javascript
const puppeteer = require('puppeteer');

async function scrapeRestaurantReviews(restaurantUrl) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Définir un user-agent pour éviter les blocages
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
  try {
    await page.goto(restaurantUrl, { waitUntil: 'networkidle2' });
    
    // Attendre que les avis se chargent
    await page.waitForSelector('[data-testid="review-item"]', { timeout: 10000 });
    
    // Extraire les avis
    const reviews = await page.evaluate(() => {
      const reviewElements = document.querySelectorAll('[data-testid="review-item"]');
      return Array.from(reviewElements).slice(0, 10).map(el => ({
        rating: el.querySelector('.rating')?.textContent || '',
        comment: el.querySelector('.review-text')?.textContent || '',
        date: el.querySelector('.review-date')?.textContent || '',
        author: el.querySelector('.review-author')?.textContent || 'Anonyme'
      }));
    });
    
    return reviews;
  } catch (error) {
    console.error('Erreur lors du scraping:', error);
    return [];
  } finally {
    await browser.close();
  }
}
```

#### Trucs à faire attention

1. **Respecter le site**
   - Vérifier `robots.txt` : `https://deliveroo.fr/robots.txt` (je dois faire ça)
   - Mettre des délais entre les requêtes (pas spammer)
   - Utiliser un User-Agent normal (pas un truc suspect)

2. **Gérer les erreurs**
   - Mettre des timeouts (faut pas que ça attende indéfiniment)
   - Si le restaurant existe pas, faut pas que ça crashe
   - Peut-être essayer 2-3 fois si ça rate la première fois ?

3. **Performance**
   - Mettre en cache les résultats (je vais faire un cache simple en mémoire)
   - Pas faire trop de requêtes en même temps
   - Headless mode pour que ça soit rapide

4. **User-Agent** (je vais mettre un truc classique)
```javascript
// Je vais mettre un User-Agent classique, pas un truc qui fait "bot"
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
```

### Option 2 : API Alternatives (si disponibles)

#### APIs de restaurants générales

1. **Google Places API**
   - Peut trouver des restaurants
   - Nécessite une clé API (payante après crédits gratuits)
   - Pas spécifique à Deliveroo

2. **Yelp Fusion API**
   - Accès aux restaurants et avis
   - Limite de requêtes gratuites
   - Pas spécifique à Deliveroo

**Note** : Ces APIs ne donneront pas les restaurants Deliveroo spécifiquement.

### Option 3 : Mock Data (Pour le développement)

En attendant de configurer le scraping, utiliser des données mockées :

```javascript
// server/services/mockData.js
const mockRestaurants = [
  {
    id: '1',
    name: 'Restaurant Test',
    address: '123 Rue de Test, Paris',
    rating: 4.5,
    image: 'https://example.com/image.jpg',
    slug: 'restaurant-test'
  }
];

const mockReviews = [
  {
    id: '1',
    rating: 5,
    comment: 'Excellent restaurant !',
    date: '2024-01-15',
    author: 'Jean D.'
  },
  // ...
];
```

## Architecture recommandée

### Service de scraping séparé

```
server/
├── services/
│   ├── scraper.js          # Service principal de scraping
│   ├── deliverooScraper.js # Implémentation spécifique Deliveroo
│   └── cache.js            # Cache des résultats
```

### Endpoints API

```
GET /api/restaurants/search?q=terme
  → Retourne liste de restaurants correspondants

GET /api/restaurants/:id
  → Retourne détails d'un restaurant

GET /api/restaurants/:id/reviews
  → Retourne les 10 derniers avis (scrapés)
```

## Dépendances nécessaires

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "puppeteer": "^21.0.0",
    "cheerio": "^1.0.0-rc.12",
    "axios": "^1.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## Ce que je dois faire

1. **Aller sur Deliveroo** et regarder une page restaurant avec les DevTools ouverts
2. **Faire un petit script de test** pour scraper une seule page et voir si ça marche
3. **Mettre en place la recherche** (peut-être avec des données mockées si c'est trop galère)
4. **Faire un cache** pour pas re-scraper les mêmes trucs tout le temps
5. **Gérer les erreurs** (parce que ça va planter, c'est sûr)

## Ressources utiles

- [Puppeteer Documentation](https://pptr.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Cheerio Documentation](https://cheerio.js.org/)
- [Web Scraping Best Practices](https://www.scraperapi.com/blog/web-scraping-best-practices/)

