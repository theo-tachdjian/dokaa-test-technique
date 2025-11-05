




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

  
  enrichAllData() {
    console.log('🔄 Enrichissement automatique des données au démarrage...');
    
    this.enrichedRestaurants = mockRestaurants.map(restaurant => {
      
      const enriched = { ...restaurant };
      
      
      
      
      
      
      const scrapedReviews = mockReviews[restaurant.id];
      if (scrapedReviews && scrapedReviews.length > 0) {
        
        const validScrapedReviews = scrapedReviews.filter(review => 
          review.comment && isValidReview(review.comment)
        );
        
        if (validScrapedReviews.length > 0) {
          
          this.enrichedReviews[restaurant.id] = validScrapedReviews.slice(0, 10);
        }
        
      }
      
      
      
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
    
    
    return this.enrichedReviews[id] || [];
  }

  getAllRestaurants() {
    return this.enrichedRestaurants.length > 0 ? this.enrichedRestaurants : mockRestaurants;
  }
}


const dataEnricher = new DataEnricher();


const enriched = dataEnricher.enrichAllData();

module.exports = {
  getEnrichedRestaurants: () => enriched.restaurants,
  getEnrichedReviews: () => enriched.reviews,
  getRestaurant: (id) => dataEnricher.getRestaurant(id),
  getReviews: (id) => dataEnricher.getReviews(id),
  getAllRestaurants: () => dataEnricher.getAllRestaurants()
};

