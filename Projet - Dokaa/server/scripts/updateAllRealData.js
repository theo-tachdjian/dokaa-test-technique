// Script pour mettre à jour TOUS les restaurants avec de vraies adresses et avis
// Usage: npm run update-all-data

require('dotenv').config();
const { mockRestaurants } = require('../services/mockData');
const nominatimAPI = require('../services/nominatimAPI');
const multiSourceReviewsScraper = require('../services/multiSourceReviewsScraper');
const fs = require('fs');
const path = require('path');

async function updateAllRealData() {
  console.log('🚀 Mise à jour de TOUS les restaurants avec de vraies données...\n');
  console.log(`📊 ${mockRestaurants.length} restaurants à traiter\n`);

  const updatedRestaurants = [];
  const updatedReviews = {};
  let addressSuccessCount = 0;
  let reviewsSuccessCount = 0;
  let errorCount = 0;

  for (let i = 0; i < mockRestaurants.length; i++) {
    const restaurant = { ...mockRestaurants[i] };
    console.log(`\n[${i + 1}/${mockRestaurants.length}] ${restaurant.name} (${restaurant.city})`);

    try {
      // 1. Récupérer la vraie adresse depuis OpenStreetMap
      console.log('  → Recherche de l\'adresse réelle...');
      const addressInfo = await nominatimAPI.searchRestaurantAddress(restaurant.name, restaurant.city);
      
      if (addressInfo && addressInfo.address) {
        restaurant.address = addressInfo.address;
        addressSuccessCount++;
        console.log(`  ✓ Adresse trouvée: ${addressInfo.address}`);
      } else {
        console.log(`  ✗ Adresse non trouvée - RESTAURANT SUPPRIMÉ (pas de vraie adresse)`);
        // Ne pas ajouter ce restaurant aux résultats
        continue;
      }

      // 2. RÉCUPÉRER LES VRAIS AVIS - ESSAIE TOUTES LES SOURCES (VITAL pour le projet)
      let reviews = [];
      
      try {
        // Utiliser le scraper multi-sources qui essaie Google Maps, Deliveroo, Yelp
        reviews = await multiSourceReviewsScraper.scrapeAllSources(
          restaurant.name, 
          restaurant.city, 
          restaurant.address,
          restaurant.url // URL Deliveroo si disponible
        );
        
        if (reviews && reviews.length > 0) {
          updatedReviews[restaurant.id] = reviews;
          reviewsSuccessCount++;
          console.log(`  ✅ ${reviews.length} AVIS RÉELS RÉCUPÉRÉS depuis ${reviews[0].source || 'source inconnue'}`);
        } else {
          console.log('  ⚠ Aucun avis trouvé sur aucune source (Google Maps, Deliveroo, Yelp)');
        }
      } catch (reviewError) {
        console.log(`  ⚠ Erreur scraping avis: ${reviewError.message}`);
        console.log(`     → Le restaurant sera gardé car il a une vraie adresse`);
      }

      // Attendre entre les restaurants pour respecter les rate limits
      if (i < mockRestaurants.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (error) {
      console.error(`  ✗ Erreur pour ${restaurant.name}:`, error.message);
      errorCount++;
    }

    updatedRestaurants.push(restaurant);
  }

  // Sauvegarder les données mises à jour
  const outputPath = path.join(__dirname, '../services/mockDataReal.js');
  const outputContent = `// Données mises à jour avec de VRAIES adresses et avis
// Généré le ${new Date().toISOString()}
// Adresses: ${addressSuccessCount}/${mockRestaurants.length} trouvées via OpenStreetMap
// Avis: ${reviewsSuccessCount}/${mockRestaurants.length} trouvés via TripAdvisor

const cities = ${JSON.stringify(require('../services/mockData').cities, null, 2)};

const mockRestaurants = ${JSON.stringify(updatedRestaurants, null, 2)};

const mockReviews = ${JSON.stringify(updatedReviews, null, 2)};

module.exports = {
  mockRestaurants,
  mockReviews,
  cities
};
`;

  fs.writeFileSync(outputPath, outputContent);
  
  console.log(`\n✅ Données sauvegardées dans: ${outputPath}`);
  console.log(`\n📊 Résumé:`);
  console.log(`   - ${addressSuccessCount} restaurants avec adresses réelles trouvées`);
  console.log(`   - ${mockRestaurants.length - addressSuccessCount} restaurants supprimés (pas d'adresse réelle)`);
  console.log(`   - ${reviewsSuccessCount}/${addressSuccessCount} restaurants avec avis réels`);
  console.log(`   - ${errorCount} erreurs`);
  console.log(`\n✅ ${updatedRestaurants.length} restaurants conservés (avec vraies adresses)`);
  console.log(`\n⚠️  Les données sont automatiquement chargées au démarrage du serveur\n`);
  
  // Fermer les scrapers
  await multiSourceReviewsScraper.close();
  process.exit(0);
}

// Lancer le script
updateAllRealData().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});

