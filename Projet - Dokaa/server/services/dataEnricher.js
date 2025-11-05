// Service d'enrichissement automatique des données au démarrage
// FALLBACK UNIQUEMENT : Les vraies données viennent du scraping (Google Maps + TripAdvisor)
// Ce service est utilisé seulement si le scraping échoue

// Essayer de charger les vraies données d'abord, sinon fallback sur mockData
let mockDataModule;
try {
  mockDataModule = require('./mockDataReal');
  console.log('✅ Chargement des vraies données depuis mockDataReal.js');
} catch (error) {
  mockDataModule = require('./mockData');
  console.log('⚠️  Utilisation de mockData.js (exécutez "npm run update-all-data" pour les vraies données)');
}

const { mockRestaurants, mockReviews } = mockDataModule;
const { isValidReview } = require('./reviewValidator');

class DataEnricher {
  constructor() {
    this.enrichedRestaurants = [];
    this.enrichedReviews = {};
  }

  // Enrichir toutes les données au démarrage
  enrichAllData() {
    console.log('🔄 Enrichissement automatique des données au démarrage...');
    
    this.enrichedRestaurants = mockRestaurants.map(restaurant => {
      // Créer une copie pour ne pas modifier l'original
      const enriched = { ...restaurant };
      
      // L'adresse du restaurant est déjà dans mockRestaurants (mockData.js ou mockDataReal.js)
      // Pas besoin d'enrichissement supplémentaire
      
      // Priorité 1 : Utiliser les avis depuis mockDataReal.js si ils existent ET sont valides
      // (ce sont de vrais avis scrapés)
      const scrapedReviews = mockReviews[restaurant.id];
      if (scrapedReviews && scrapedReviews.length > 0) {
        // Filtrer pour ne garder que les vrais avis (pas du code HTML)
        const validScrapedReviews = scrapedReviews.filter(review => 
          review.comment && isValidReview(review.comment)
        );
        
        if (validScrapedReviews.length > 0) {
          // Utiliser les vrais avis scrapés
          this.enrichedReviews[restaurant.id] = validScrapedReviews.slice(0, 10);
        }
        // Si les avis scrapés ne sont pas valides, on ne met rien (pas d'avis)
      }
      // Si pas d'avis scrapés dans mockDataReal, on ne met rien (pas d'avis)
      // Les avis mockés de base sont dans mockData.js mais on préfère les vraies données scrapées
      
      return enriched;
    });
    
    const restaurantsWithReviews = Object.keys(this.enrichedReviews).length;
    console.log(`✓ ${this.enrichedRestaurants.length} restaurants enrichis`);
    console.log(`✓ ${restaurantsWithReviews} restaurants avec 10 avis professionnels`);
    console.log(`ℹ Les vraies données scrapées (si disponibles) sont utilisées en priorité\n`);
    
    return {
      restaurants: this.enrichedRestaurants,
      reviews: this.enrichedReviews
    };
  }

  getRestaurant(id) {
    return this.enrichedRestaurants.find(r => r.id === id) || 
           mockRestaurants.find(r => r.id === id);
  }

  getReviews(id) {
    // Utiliser uniquement les avis enrichis (qui contiennent soit les avis scrapés valides, soit les avis enrichis)
    // Ne pas mélanger avec mockReviews pour éviter les doublons
    return this.enrichedReviews[id] || [];
  }

  getAllRestaurants() {
    return this.enrichedRestaurants.length > 0 ? this.enrichedRestaurants : mockRestaurants;
  }
}

// Instance singleton
const dataEnricher = new DataEnricher();

// Enrichir les données au chargement du module
const enriched = dataEnricher.enrichAllData();

module.exports = {
  getEnrichedRestaurants: () => enriched.restaurants,
  getEnrichedReviews: () => enriched.reviews,
  getRestaurant: (id) => dataEnricher.getRestaurant(id),
  getReviews: (id) => dataEnricher.getReviews(id),
  getAllRestaurants: () => dataEnricher.getAllRestaurants()
};

