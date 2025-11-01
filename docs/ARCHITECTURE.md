# Architecture du Projet - Guide détaillé

## Architecture globale

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│   Frontend      │         │   Backend        │         │   Deliveroo  │
│   (Next.js)     │◄───────►│   (Express)      │◄───────►│   Website    │
│                 │  HTTP   │                  │ Scraping│              │
└─────────────────┘         └──────────────────┘         └──────────────┘
```

## Structure détaillée

### Frontend (Next.js + Tailwind)

```
client/
├── app/                          # App Router Next.js 13+
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Page d'accueil
│   ├── api/                     # Routes API (optionnel, si pas de backend séparé)
│   └── restaurants/
│       └── [id]/
│           └── page.tsx         # Page détail restaurant
│
├── components/                   # Composants React
│   ├── ui/                      # Composants UI réutilisables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── LoadingSpinner.tsx
│   │
│   ├── search/                  # Composants de recherche
│   │   ├── SearchBar.tsx       # Barre de recherche principale
│   │   └── SearchResults.tsx   # Liste des résultats
│   │
│   ├── restaurant/             # Composants restaurant
│   │   ├── RestaurantCard.tsx  # Carte restaurant (liste)
│   │   ├── RestaurantDetail.tsx # Détails complets
│   │   └── RestaurantInfo.tsx  # Infos basiques
│   │
│   └── reviews/                # Composants avis
│       ├── ReviewsList.tsx      # Liste des avis
│       └── ReviewCard.tsx      # Carte d'un avis
│
├── lib/                         # Utilitaires et services
│   ├── api.ts                  # Client API pour communiquer avec le backend
│   ├── utils.ts                # Fonctions utilitaires
│   └── types.ts                # Types TypeScript
│
├── hooks/                       # Custom React Hooks
│   ├── useSearch.ts            # Hook pour la recherche
│   ├── useRestaurant.ts        # Hook pour récupérer un restaurant
│   └── useReviews.ts           # Hook pour récupérer les avis
│
├── styles/                      # Styles globaux
│   └── globals.css             # Styles Tailwind + personnalisés
│
└── public/                      # Assets statiques
    └── images/
```

### Backend (Express)

```
server/
├── index.js                     # Point d'entrée
├── config/                      # Configuration
│   ├── express.js              # Configuration Express
│   └── cors.js                 # Configuration CORS
│
├── routes/                      # Routes API
│   ├── restaurants.js          # Routes restaurants
│   │   ├── GET /api/restaurants/search
│   │   ├── GET /api/restaurants/:id
│   │   └── GET /api/restaurants/:id/reviews
│   └── health.js               # Route de santé (optionnel)
│
├── services/                    # Services métier
│   ├── scraper.js              # Service de scraping principal
│   ├── deliverooScraper.js     # Implémentation Deliveroo
│   ├── cache.js                # Service de cache
│   └── searchService.js        # Service de recherche
│
├── utils/                       # Utilitaires
│   ├── logger.js               # Logger personnalisé
│   └── errors.js               # Gestion des erreurs
│
├── middleware/                  # Middlewares Express
│   ├── errorHandler.js         # Gestionnaire d'erreurs
│   ├── rateLimiter.js          # Limitation de taux (optionnel)
│   └── cacheMiddleware.js      # Cache middleware
│
└── tests/                       # Tests (optionnel)
    └── scraper.test.js
```

## Flux de données

### Recherche de restaurants

```
1. User tape dans SearchBar
   ↓
2. useSearch hook (avec debounce 300ms)
   ↓
3. API call: GET /api/restaurants/search?q=terme
   ↓
4. Backend: scraper.searchRestaurants(terme)
   ↓
5. Scraping Deliveroo ou retour cache
   ↓
6. Réponse JSON → Affichage dans SearchResults
```

### Affichage des avis

```
1. User clique sur un restaurant
   ↓
2. Navigation vers /restaurants/:id
   ↓
3. useRestaurant(id) + useReviews(id)
   ↓
4. API calls:
   - GET /api/restaurants/:id
   - GET /api/restaurants/:id/reviews
   ↓
5. Backend: scraper.getRestaurantReviews(id)
   ↓
6. Scraping de la page restaurant Deliveroo
   ↓
7. Extraction des 10 derniers avis
   ↓
8. Affichage dans ReviewsList
```

## Design System (avec Tailwind)

### Couleurs (personnalisation Tailwind)

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#fff7ed',
        500: '#f97316',  // Orange Deliveroo-like
        600: '#ea580c',
      }
    }
  }
}
```

### Composants réutilisables

- **Button** : Styles variantes (primary, secondary, outline)
- **Input** : Avec icône de recherche intégrée
- **Card** : Container générique avec ombre/bordures
- **LoadingSpinner** : Animation de chargement

## Sécurité et Performance

### Côté Backend

1. **Rate Limiting**
   - Limiter les requêtes de scraping
   - Éviter les abus

2. **Cache**
   - Cache des restaurants (24h)
   - Cache des avis (1h)
   - Utiliser Redis ou mémoire

3. **Gestion d'erreurs**
   - Try/catch sur toutes les opérations async
   - Messages d'erreur explicites
   - Logging des erreurs

### Côté Frontend

1. **Debounce sur la recherche**
   - Éviter trop de requêtes
   - 300ms de délai

2. **Loading states**
   - Spinners pendant les chargements
   - Skeleton screens pour meilleure UX

3. **Error boundaries**
   - Gérer les erreurs React gracieusement

## Modèles de données

### Restaurant

```typescript
interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  rating: number;
  imageUrl: string;
  cuisine?: string;
  priceRange?: string;
  deliveryTime?: string;
  status: 'open' | 'closed';
  url: string; // URL Deliveroo complète
}
```

### Review

```typescript
interface Review {
  id: string;
  restaurantId: string;
  rating: number; // 1-5
  comment: string;
  author: string;
  date: string; // ISO format
  verified?: boolean;
}
```

## Tests et CI/CD

### Structure des tests

```
client/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   └── lib/
└── e2e/

server/
├── __tests__/
│   ├── routes/
│   ├── services/
│   └── utils/
└── e2e/
```

### Outils

- **Tests unitaires** : Jest ou Vitest
- **Tests E2E** : Playwright
- **CI/CD** : GitHub Actions

Voir [TESTS_ET_CI.md](./TESTS_ET_CI.md) pour plus de détails.

## Optimisations possibles

1. **SSR/SSG** (Next.js)
   - Prérendre certaines pages
   - ISR pour les données fréquentes

2. **Lazy Loading**
   - Charger les avis à la demande
   - Images lazy loading

3. **Pagination**
   - Si plus de 10 avis nécessaires
   - Infinite scroll

4. **Service Worker**
   - Cache offline (PWA)

## Variables d'environnement

### Backend (.env)

```
PORT=3001
NODE_ENV=development
CACHE_TTL=3600
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

