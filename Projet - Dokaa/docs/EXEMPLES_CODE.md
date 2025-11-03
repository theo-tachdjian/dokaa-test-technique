# Exemples de code pratiques

## Backend - Service de scraping

### Service de base avec Puppeteer

**server/services/scraper.js**

```javascript
const puppeteer = require('puppeteer');

class DeliverooScraper {
  constructor() {
    this.browser = null;
  }

  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    return this.browser;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async scrapeRestaurantReviews(restaurantUrl) {
    const browser = await this.init();
    const page = await browser.newPage();

    try {
      // User-agent pour éviter la détection
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      await page.goto(restaurantUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // ATTENTION : À adapter selon la structure réelle de Deliveroo
      // Utilisez DevTools pour identifier les bons sélecteurs

      // Attendre que les avis se chargent (sélecteur à adapter)
      await page.waitForSelector('[data-testid="review"]', { timeout: 10000 });

      // Extraire les avis
      const reviews = await page.evaluate(() => {
        // À ADAPTER selon la structure réelle
        const reviewElements = document.querySelectorAll('[data-testid="review"]');
        
        return Array.from(reviewElements)
          .slice(0, 10)
          .map((el, index) => {
            // Extraire les données (sélecteurs à adapter)
            const ratingElement = el.querySelector('.rating, [aria-label*="star"]');
            const commentElement = el.querySelector('.review-text, .comment');
            const dateElement = el.querySelector('.review-date, .date');
            const authorElement = el.querySelector('.review-author, .author');

            return {
              id: `review-${index}`,
              rating: ratingElement ? parseFloat(ratingElement.textContent) : null,
              comment: commentElement ? commentElement.textContent.trim() : '',
              date: dateElement ? dateElement.textContent.trim() : '',
              author: authorElement ? authorElement.textContent.trim() : 'Anonyme'
            };
          });
      });

      return reviews;
    } catch (error) {
      console.error('Erreur lors du scraping:', error);
      throw new Error(`Impossible de scraper les avis: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async searchRestaurants(query) {
    // Option 1 : Scraper la page de recherche
    // Option 2 : Utiliser des données mockées (plus simple pour le test)
    
    // Pour le test, on peut utiliser des données mockées
    return this.mockSearch(query);
  }

  mockSearch(query) {
    // Données mockées pour le développement
    const mockRestaurants = [
      {
        id: '1',
        name: `Restaurant ${query}`,
        slug: `restaurant-${query.toLowerCase()}`,
        address: '123 Rue de Test, Paris',
        rating: 4.5,
        imageUrl: 'https://via.placeholder.com/300',
        cuisine: 'Italienne',
        status: 'open',
        url: 'https://deliveroo.fr/fr/restaurants/paris/test'
      }
    ];

    return mockRestaurants.filter(r => 
      r.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}

module.exports = new DeliverooScraper();
```

### Service avec cache

**server/services/cache.js**

```javascript
class Cache {
  constructor() {
    this.cache = new Map();
    this.ttl = {
      restaurants: 24 * 60 * 60 * 1000, // 24 heures
      reviews: 60 * 60 * 1000 // 1 heure
    };
  }

  set(key, value, type = 'reviews') {
    const expiry = Date.now() + this.ttl[type];
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

module.exports = new Cache();
```

### Routes Express

**server/routes/restaurants.js**

```javascript
const express = require('express');
const router = express.Router();
const scraper = require('../services/scraper');
const cache = require('../services/cache');

// Recherche de restaurants
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Le paramètre de recherche "q" est requis' 
      });
    }

    const cacheKey = `search:${q}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const restaurants = await scraper.searchRestaurants(q);
    cache.set(cacheKey, restaurants, 'restaurants');

    res.json(restaurants);
  } catch (error) {
    console.error('Erreur recherche:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

// Détails d'un restaurant
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Implémenter la récupération des détails
    res.json({ id, message: 'À implémenter' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Avis d'un restaurant
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    
    const cacheKey = `reviews:${id}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    // Récupérer l'URL du restaurant (à partir de la base ou de l'ID)
    const restaurantUrl = `https://deliveroo.fr/fr/restaurants/paris/restaurant-${id}`;
    
    const reviews = await scraper.scrapeRestaurantReviews(restaurantUrl);
    cache.set(cacheKey, reviews, 'reviews');

    res.json(reviews);
  } catch (error) {
    console.error('Erreur avis:', error);
    res.status(500).json({ 
      error: 'Impossible de récupérer les avis',
      details: error.message 
    });
  }
});

module.exports = router;
```

### Configuration Express principale

**server/index.js**

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const restaurantsRoutes = require('./routes/restaurants');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/restaurants', restaurantsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Gestion d'erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  // Fermer le navigateur Puppeteer si nécessaire
  process.exit(0);
});
```

## Frontend - Composants React

### Client API

**client/lib/api.ts**

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  rating: number;
  imageUrl: string;
  cuisine?: string;
  status: 'open' | 'closed';
  url: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  author: string;
}

export const api = {
  async searchRestaurants(query: string): Promise<Restaurant[]> {
    const response = await fetch(`${API_URL}/api/restaurants/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Erreur lors de la recherche');
    return response.json();
  },

  async getRestaurant(id: string): Promise<Restaurant> {
    const response = await fetch(`${API_URL}/api/restaurants/${id}`);
    if (!response.ok) throw new Error('Restaurant introuvable');
    return response.json();
  },

  async getReviews(id: string): Promise<Review[]> {
    const response = await fetch(`${API_URL}/api/restaurants/${id}/reviews`);
    if (!response.ok) throw new Error('Impossible de récupérer les avis');
    return response.json();
  }
};
```

### Hook de recherche

**client/hooks/useSearch.ts**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { api, Restaurant } from '@/lib/api';

export function useSearch(query: string) {
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchTimer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      
      try {
        const restaurants = await api.searchRestaurants(query);
        setResults(restaurants);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(searchTimer);
  }, [query]);

  return { results, loading, error };
}
```

### Barre de recherche

**client/components/search/SearchBar.tsx**

```typescript
'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder="Rechercher un restaurant Deliveroo..."
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={loading}
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {loading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
          </div>
        )}
      </div>
    </form>
  );
}
```

### Carte Restaurant

**client/components/restaurant/RestaurantCard.tsx**

```typescript
import Link from 'next/link';
import { Restaurant } from '@/lib/api';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{restaurant.address}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-yellow-500">⭐</span>
              <span className="ml-1 font-medium">{restaurant.rating}</span>
            </div>
            <span className={`px-2 py-1 rounded text-sm ${
              restaurant.status === 'open' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {restaurant.status === 'open' ? 'Ouvert' : 'Fermé'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### Liste des avis

**client/components/reviews/ReviewsList.tsx**

```typescript
import { Review } from '@/lib/api';
import ReviewCard from './ReviewCard';

interface ReviewsListProps {
  reviews: Review[];
  loading?: boolean;
}

export default function ReviewsList({ reviews, loading }: ReviewsListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun avis disponible pour ce restaurant.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Avis ({reviews.length})</h2>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
```

### Carte d'avis

**client/components/reviews/ReviewCard.tsx**

```typescript
import { Review } from '@/lib/api';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center mb-1">
            {renderStars(review.rating)}
            <span className="ml-2 font-semibold">{review.rating}/5</span>
          </div>
          <p className="text-sm text-gray-600">{review.author}</p>
        </div>
        <span className="text-sm text-gray-500">{review.date}</span>
      </div>
      {review.comment && (
        <p className="text-gray-700 mt-2">{review.comment}</p>
      )}
    </div>
  );
}
```

## Styles Tailwind - Exemples

### Configuration Tailwind

**client/tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Orange Deliveroo
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      }
    }
  },
  plugins: [],
}
```

## Utilisation

Copiez ces exemples dans votre projet et adaptez-les selon vos besoins. N'oubliez pas de :

1. **Adapter les sélecteurs CSS** dans le scraper selon la structure réelle de Deliveroo
2. **Tester chaque composant** individuellement
3. **Gérer les erreurs** proprement
4. **Ajouter le TypeScript** si vous l'utilisez

Bon développement ! 🎉

