// Script de test pour vérifier que le scraping TripAdvisor fonctionne
// Usage: node scripts/testTripAdvisorScraper.js "Sushi Express" "Paris"

require('dotenv').config();
const tripadvisorScraper = require('../services/tripadvisorScraper');

async function testScraper() {
  const restaurantName = process.argv[2] || 'Sushi Express';
  const city = process.argv[3] || 'Paris';

  console.log(`\n🧪 Test du scraper TripAdvisor pour: ${restaurantName} (${city})\n`);

  try {
    // Test 1: Recherche de l'adresse
    console.log('📍 Test 1: Recherche de l\'adresse...');
    const addressInfo = await tripadvisorScraper.searchRestaurantAddress(restaurantName, city);
    
    if (addressInfo) {
      console.log('✅ Adresse trouvée:', addressInfo.address);
      if (addressInfo.rating) {
        console.log('✅ Note trouvée:', addressInfo.rating);
      }
    } else {
      console.log('❌ Aucune adresse trouvée');
    }

    console.log('\n');

    // Test 2: Recherche des avis
    console.log('💬 Test 2: Recherche des avis...');
    const reviews = await tripadvisorScraper.scrapeRestaurantReviews(restaurantName, city);
    
    if (reviews && reviews.length > 0) {
      console.log(`✅ ${reviews.length} avis trouvés:\n`);
      reviews.forEach((review, index) => {
        console.log(`Avis ${index + 1}:`);
        console.log(`  - Auteur: ${review.author}`);
        console.log(`  - Note: ${review.rating}/5`);
        console.log(`  - Date: ${review.date}`);
        console.log(`  - Commentaire: ${review.comment.substring(0, 100)}...`);
        console.log('');
      });
    } else {
      console.log('❌ Aucun avis trouvé');
      console.log('💡 Vérifiez les sélecteurs CSS dans tripadvisorScraper.js');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await tripadvisorScraper.close();
    process.exit(0);
  }
}

testScraper();

