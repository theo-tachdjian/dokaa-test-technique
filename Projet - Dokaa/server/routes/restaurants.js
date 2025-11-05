const express = require('express');
const router = express.Router();
const { cities } = require('../services/mockData');
const { getEnrichedRestaurants, getEnrichedReviews, getRestaurant, getReviews } = require('../services/dataEnricher');
const cache = require('../services/cache');
const validator = require('../services/validator');
const tripadvisorScraper = require('../services/tripadvisorScraper');
const googleMapsScraper = require('../services/googleMapsScraper');
const nominatimAPI = require('../services/nominatimAPI');
const multiSourceReviewsScraper = require('../services/multiSourceReviewsScraper');

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
    
    // Utiliser les restaurants enrichis
    const allRestaurants = getEnrichedRestaurants();
    
    // Filtrer par ville si fourni
    let filtered = allRestaurants;
    if (city && city.trim().length > 0) {
      filtered = allRestaurants.filter(r => r.city === city);
    }

    // Si pas de recherche textuelle, retourner tous les restaurants de la ville (ou tous)
    if (!q || q.trim().length === 0) {
      // Ajouter les métadonnées de validation même sans recherche
      const resultsWithValidation = filtered.map(restaurant => {
        const validation = validator.validateRestaurant(restaurant);
        return {
          ...restaurant,
          _validation: {
            reliabilityScore: validation.reliabilityScore,
            verified: validation.verified,
            needsVerification: validation.needsVerification,
            warnings: validation.warnings
          }
        };
      });
      return res.json(resultsWithValidation);
    }

    // Recherche simple dans les données mockées
    const searchTerm = q.toLowerCase().trim();
    const results = filtered.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm) ||
      restaurant.address.toLowerCase().includes(searchTerm)
    );

    // Pour chaque restaurant avec image générique, essayer de scraper la vraie image
    // On le fait en parallèle pour ne pas ralentir trop la réponse
    const resultsWithImages = await Promise.all(results.map(async (restaurant) => {
      const isGenericImage = restaurant.imageUrl && (
        restaurant.imageUrl.includes('unsplash.com') || 
        restaurant.imageUrl.includes('placeholder') ||
        restaurant.imageUrl.includes('via.placeholder')
      );
      
      // Si image générique et scraping activé, essayer de récupérer la vraie image
      // Note: On limite le scraping pour ne pas surcharger (seulement si DISABLE_SCRAPING=false)
      if (isGenericImage && !scrapingDisabled && scraper && restaurant.url && process.env.SCRAPE_IMAGES === 'true') {
        try {
          const realImageUrl = await scraper.scrapeRestaurantImage(restaurant.url);
          if (realImageUrl) {
            restaurant.imageUrl = realImageUrl;
          }
        } catch (error) {
          // Silencieusement ignorer les erreurs pour ne pas bloquer la réponse
          console.log(`[SKIP] Image scraping échoué pour ${restaurant.name}: ${error.message}`);
        }
      }
      
      return restaurant;
    }));

    // Ajouter les métadonnées de validation pour chaque restaurant
    const resultsWithValidation = resultsWithImages.map(restaurant => {
      const validation = validator.validateRestaurant(restaurant);
      return {
        ...restaurant,
        _validation: {
          reliabilityScore: validation.reliabilityScore,
          verified: validation.verified,
          needsVerification: validation.needsVerification,
          warnings: validation.warnings
        }
      };
    });

    res.json(resultsWithValidation);
  } catch (error) {
    console.error('Erreur recherche:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

// Récupérer tous les restaurants d'une ville (sans recherche textuelle)
router.get('/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const allRestaurants = getEnrichedRestaurants();
    const results = allRestaurants.filter(r => r.city === city);
    
    // Pour chaque restaurant avec image générique, essayer de scraper la vraie image
    // (seulement si SCRAPE_IMAGES=true pour éviter de surcharger)
    const resultsWithImages = await Promise.all(results.map(async (restaurant) => {
      const isGenericImage = restaurant.imageUrl && (
        restaurant.imageUrl.includes('unsplash.com') || 
        restaurant.imageUrl.includes('placeholder') ||
        restaurant.imageUrl.includes('via.placeholder')
      );
      
      if (isGenericImage && !scrapingDisabled && scraper && restaurant.url && process.env.SCRAPE_IMAGES === 'true') {
        try {
          const realImageUrl = await scraper.scrapeRestaurantImage(restaurant.url);
          if (realImageUrl) {
            restaurant.imageUrl = realImageUrl;
          }
        } catch (error) {
          console.log(`[SKIP] Image scraping échoué pour ${restaurant.name}`);
        }
      }
      
      return restaurant;
    }));

    // Ajouter les métadonnées de validation
    const resultsWithValidation = resultsWithImages.map(restaurant => {
      const validation = validator.validateRestaurant(restaurant);
      return {
        ...restaurant,
        _validation: {
          reliabilityScore: validation.reliabilityScore,
          verified: validation.verified,
          needsVerification: validation.needsVerification,
          warnings: validation.warnings
        }
      };
    });
    
    res.json(resultsWithValidation);
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

    // Utiliser les restaurants enrichis (avec adresses réalistes)
    let restaurant = getRestaurant(id);
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant introuvable' });
    }

    // SCRAPING D'ADRESSE DÉSACTIVÉ en temps réel (trop lent)
    // Utiliser uniquement les adresses pré-scrapées depuis mockDataReal.js
    // Le scraping se fait uniquement via npm run update-all-data
    
    // Si on veut forcer le scraping (pas recommandé), décommenter ci-dessous :
    /*
    if (!scrapingDisabled && restaurant.name && restaurant.city && process.env.FORCE_REAL_TIME_SCRAPING === 'true') {
      try {
        const realAddressInfo = await nominatimAPI.searchRestaurantAddress(restaurant.name, restaurant.city);
        
        if (realAddressInfo && realAddressInfo.address) {
          restaurant.address = realAddressInfo.address;
          console.log(`✓ Adresse RÉELLE récupérée depuis OpenStreetMap: ${realAddressInfo.address}`);
        }
      } catch (error) {
        console.log(`ℹ API Nominatim non disponible: ${error.message}`);
      }
    }
    */

    // Valider le restaurant
    const validation = validator.validateRestaurant(restaurant);
    
    // Si l'image est générique (Unsplash) et qu'on a l'URL Deliveroo, scraper la vraie image
    const isGenericImage = restaurant.imageUrl && (
      restaurant.imageUrl.includes('unsplash.com') || 
      restaurant.imageUrl.includes('placeholder') ||
      restaurant.imageUrl.includes('via.placeholder')
    );
    
    if (isGenericImage && !scrapingDisabled && scraper && restaurant.url) {
      try {
        console.log(`Tentative de récupération de l'image réelle pour: ${restaurant.name}`);
        const realImageUrl = await scraper.scrapeRestaurantImage(restaurant.url);
        
        if (realImageUrl) {
          restaurant.imageUrl = realImageUrl;
          console.log(`✓ Image réelle récupérée depuis Deliveroo`);
        } else {
          console.log('⚠ Image non trouvée via scraping, conservation de l\'image générique');
        }
      } catch (error) {
        console.error('Erreur lors du scraping de l\'image:', error.message);
        // En cas d'erreur, on garde l'image générique
      }
    }

    // Ajouter les métadonnées de validation
    const restaurantWithValidation = {
      ...restaurant,
      _validation: {
        reliabilityScore: validation.reliabilityScore,
        verified: validation.verified,
        needsVerification: validation.needsVerification,
        warnings: validation.warnings,
        errors: validation.errors
      }
    };

    // Mettre en cache
    cache.set(cacheKey, restaurantWithValidation, 'restaurants');

    res.json(restaurantWithValidation);
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

    // IMPORTANT : Les avis doivent être RÉELS, récupérés depuis TripAdvisor (mieux écrits et plus précis)
    // Stratégie : Essayer d'abord TripAdvisor, puis Deliveroo, puis mockés temporaires
    
    let reviews = [];
    
    // Récupérer le restaurant
    const restaurant = getRestaurant(id);
    
    // SCRAPING DÉSACTIVÉ en temps réel (trop lent et gênant)
    // Utiliser uniquement les données pré-scrapées depuis mockDataReal.js
    // Le scraping se fait uniquement via npm run update-all-data
    
    // Si on veut forcer le scraping (pas recommandé), décommenter ci-dessous :
    /*
    if (!scrapingDisabled && restaurant && restaurant.name && restaurant.city && process.env.FORCE_REAL_TIME_SCRAPING === 'true') {
      try {
        reviews = await multiSourceReviewsScraper.scrapeAllSources(
          restaurant.name,
          restaurant.city,
          restaurant.address,
          restaurant.url
        );
        
        if (reviews && reviews.length > 0) {
          console.log(`✅ ${reviews.length} AVIS RÉELS récupérés depuis ${reviews[0].source || 'source inconnue'}`);
        }
      } catch (error) {
        console.error(`✗ Erreur scraping avis:`, error.message);
      }
    }
    */
    
    // Utiliser uniquement les avis enrichis (pas de doublons)
    if (reviews.length === 0) {
      reviews = getReviews(id);
      if (reviews.length > 0) {
        console.log(`✓ ${reviews.length} avis chargés`);
      }
    }
    
    // Dédupliquer les avis par ID pour éviter les doublons
    const seenIds = new Set();
    reviews = reviews.filter(review => {
      if (seenIds.has(review.id)) {
        return false; // Doublon, exclure
      }
      seenIds.add(review.id);
      return true;
    });

    // Les avis sont déjà triés par date (plus récent en premier) et limités à 10 par le scraper
    // On s'assure juste qu'on a bien les 10 plus récents
    const last10Reviews = reviews
      .sort((a, b) => {
        // Trier par date décroissante si pas déjà fait
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (isNaN(dateA) && isNaN(dateB)) return 0;
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateB - dateA; // Plus récent en premier
      })
      .slice(0, 10); // Garder les 10 plus récents

    // Valider chaque avis et ajouter les métadonnées
    // Si les avis viennent de TripAdvisor, on les marque explicitement
    const isTripAdvisorSource = reviews.length > 0 && reviews[0].id && reviews[0].id.includes('tripadvisor');
    
    const validatedReviews = last10Reviews.map(review => {
      const reviewValidation = validator.validateReview(review, restaurant?.url);
      
      // Forcer la source TripAdvisor si les avis proviennent de TripAdvisor
      const source = isTripAdvisorSource ? 'tripadvisor' : reviewValidation.source;
      
      return {
        ...review,
        _validation: {
          source: source,
          verified: reviewValidation.verified,
          warnings: reviewValidation.warnings
        }
      };
    });

    // Mettre en cache
    cache.set(cacheKey, validatedReviews, 'reviews');

    res.json(validatedReviews);
  } catch (error) {
    console.error('Erreur récupération avis:', error);
    res.status(500).json({ 
      error: 'Impossible de récupérer les avis',
      details: error.message 
    });
  }
});

module.exports = router;


