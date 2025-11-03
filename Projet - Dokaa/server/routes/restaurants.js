const express = require('express');
const router = express.Router();
const { mockRestaurants, mockReviews, cities } = require('../services/mockData');
const cache = require('../services/cache');

// Charger le scraper seulement si Puppeteer est installé
let scraper = null;
try {
  scraper = require('../services/scraper');
} catch (error) {
  console.log('⚠️  Puppeteer non installé, utilisation des données mockées uniquement');
}
const scrapingDisabled = process.env.DISABLE_SCRAPING === 'true';

// Liste des villes disponibles
router.get('/cities', (req, res) => {
  res.json(cities);
});

// Recherche de restaurants
router.get('/search', async (req, res) => {
  try {
    const { q, city } = req.query;
    
    // Filtrer par ville si fourni
    let filtered = mockRestaurants;
    if (city && city.trim().length > 0) {
      filtered = mockRestaurants.filter(r => r.city === city);
    }

    // Si pas de recherche textuelle, retourner tous les restaurants de la ville (ou tous)
    if (!q || q.trim().length === 0) {
      return res.json(filtered);
    }

    // Recherche simple dans les données mockées
    const searchTerm = q.toLowerCase().trim();
    const results = filtered.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm) ||
      restaurant.address.toLowerCase().includes(searchTerm)
    );

    res.json(results);
  } catch (error) {
    console.error('Erreur recherche:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

// Récupérer tous les restaurants d'une ville (sans recherche textuelle)
router.get('/city/:city', (req, res) => {
  try {
    const { city } = req.params;
    const results = mockRestaurants.filter(r => r.city === city);
    res.json(results);
  } catch (error) {
    console.error('Erreur récupération restaurants par ville:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Détails d'un restaurant
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier le cache
    const cacheKey = `restaurant:${id}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    let restaurant = mockRestaurants.find(r => r.id === id);
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant introuvable' });
    }

    // Si on a l'URL, on pourrait scraper les infos à jour
    // Mais pour l'instant on garde les données mockées
    // if (restaurant.url) {
    //   const scrapedInfo = await scraper.scrapeRestaurantInfo(restaurant.url);
    //   if (scrapedInfo) {
    //     restaurant = { ...restaurant, ...scrapedInfo };
    //   }
    // }

    // Mettre en cache
    cache.set(cacheKey, restaurant, 'restaurants');

    res.json(restaurant);
  } catch (error) {
    console.error('Erreur récupération restaurant:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Avis d'un restaurant
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier le cache d'abord
    const cacheKey = `reviews:${id}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log(`Cache hit pour reviews:${id}`);
      return res.json(cached);
    }

    // IMPORTANT : Les avis doivent être RÉELS, récupérés depuis Deliveroo
    // Stratégie : Essayer d'abord le scraping, sinon utiliser les mockés temporaires
    
    let reviews = [];
    
    // Récupérer le restaurant pour avoir son URL Deliveroo
    const restaurant = mockRestaurants.find(r => r.id === id);
    
    // Priorité 1 : Essayer de scraper les vrais avis depuis Deliveroo
    if (!scrapingDisabled && scraper && restaurant && restaurant.url) {
      try {
        console.log(`Tentative de scraping des vrais avis depuis Deliveroo pour: ${restaurant.name}`);
        const scrapedReviews = await scraper.scrapeRestaurantReviews(restaurant.url);
        
        if (scrapedReviews.length > 0) {
          reviews = scrapedReviews;
          console.log(`✓ ${reviews.length} avis RÉELS récupérés depuis Deliveroo`);
        } else {
          console.log('⚠ Aucun avis trouvé via scraping (sélecteurs CSS à adapter)');
        }
      } catch (error) {
        console.error('Erreur lors du scraping des avis:', error.message);
        // En cas d'erreur, continuer avec les mockés
      }
    }
    
    // Priorité 2 : Utiliser les avis mockés temporaires si pas de scraping ou scraping vide
    if (reviews.length === 0) {
      reviews = mockReviews[id] || [];
      if (reviews.length > 0) {
        console.log(`⚠ Utilisation de ${reviews.length} avis MOCKÉS temporaires pour le développement`);
      }
    }

    // Retourner les 10 derniers
    const last10Reviews = reviews.slice(0, 10);

    // Mettre en cache
    cache.set(cacheKey, last10Reviews, 'reviews');

    res.json(last10Reviews);
  } catch (error) {
    console.error('Erreur récupération avis:', error);
    res.status(500).json({ 
      error: 'Impossible de récupérer les avis',
      details: error.message 
    });
  }
});

module.exports = router;

