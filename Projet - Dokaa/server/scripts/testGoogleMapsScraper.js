


require('dotenv').config();
const googleMapsScraper = require('../services/googleMapsScraper');

async function testScraper() {
  const restaurantName = process.argv[2] || 'Sushi Express';
  const city = process.argv[3] || 'Paris';

  console.log(`\n🧪 Test du scraper Google Maps pour: ${restaurantName} (${city})\n`);

  try {
    console.log('📍 Test: Recherche de l\'adresse réelle...');
    const addressInfo = await googleMapsScraper.searchRestaurantAddress(restaurantName, city);
    
    if (addressInfo) {
      console.log('✅ Adresse trouvée:', addressInfo.address);
      if (addressInfo.rating) {
        console.log('✅ Note trouvée:', addressInfo.rating);
      }
    } else {
      console.log('❌ Aucune adresse trouvée');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await googleMapsScraper.close();
    process.exit(0);
  }
}

testScraper();

