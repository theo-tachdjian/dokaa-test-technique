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


let scraper = null;
try {
  scraper = require('../services/scraper');
} catch (error) {
  console.log('⚠️  Puppeteer non installé, utilisation des données mockées uniquement');
}
const scrapingDisabled = process.env.DISABLE_SCRAPING === 'true';


router.get('/cities', (req, res) => {
  res.json(cities);
});


router.get('/search', async (req, res) => {
  try {
    const { q, city } = req.query;
    
    
    const allRestaurants = getEnrichedRestaurants();
    
    
    let filtered = allRestaurants;
    if (city && city.trim().length > 0) {
      filtered = allRestaurants.filter(r => r.city === city);
    }

    
    if (!q || q.trim().length === 0) {
      
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

    
    const searchTerm = q.toLowerCase().trim();
    const results = filtered.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm) ||
      restaurant.address.toLowerCase().includes(searchTerm)
    );

    
    
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
          
          console.log(`[SKIP] Image scraping échoué pour ${restaurant.name}: ${error.message}`);
        }
      }
      
      return restaurant;
    }));

    
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


router.get('/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const allRestaurants = getEnrichedRestaurants();
    const results = allRestaurants.filter(r => r.city === city);
    
    
    
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


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    
    const cacheKey = `restaurant:${id}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    
    let restaurant = getRestaurant(id);
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant introuvable' });
    }

    
    
    
    
    
    














    
    const validation = validator.validateRestaurant(restaurant);
    
    
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
        
      }
    }

    
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

    
    cache.set(cacheKey, restaurantWithValidation, 'restaurants');

    res.json(restaurantWithValidation);
  } catch (error) {
    console.error('Erreur récupération restaurant:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    
    
    const cacheKey = `reviews:${id}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log(`Cache hit pour reviews:${id}`);
      return res.json(cached);
    }

    
    
    
    let reviews = [];
    
    
    const restaurant = getRestaurant(id);
    
    
    
    
    
    
    

















    
    
    if (reviews.length === 0) {
      reviews = getReviews(id);
      if (reviews.length > 0) {
        console.log(`✓ ${reviews.length} avis chargés`);
      }
    }
    
    
    const seenIds = new Set();
    reviews = reviews.filter(review => {
      if (seenIds.has(review.id)) {
        return false; 
      }
      seenIds.add(review.id);
      return true;
    });

    
    
    const last10Reviews = reviews
      .sort((a, b) => {
        
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (isNaN(dateA) && isNaN(dateB)) return 0;
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateB - dateA; 
      })
      .slice(0, 10); 

    
    
    const isTripAdvisorSource = reviews.length > 0 && reviews[0].id && reviews[0].id.includes('tripadvisor');
    
    const validatedReviews = last10Reviews.map(review => {
      const reviewValidation = validator.validateReview(review, restaurant?.url);
      
      
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


