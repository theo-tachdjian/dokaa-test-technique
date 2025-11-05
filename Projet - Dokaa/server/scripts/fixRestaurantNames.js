


require('dotenv').config();
const { mockRestaurants } = require('../services/mockData');
const nominatimAPI = require('../services/nominatimAPI');
const fs = require('fs');
const path = require('path');

async function fixRestaurantNames() {
  console.log('🔧 Correction des noms des restaurants pour correspondre aux vrais noms...\n');

  const correctedRestaurants = [];
  
  for (let i = 0; i < mockRestaurants.length; i++) {
    const restaurant = { ...mockRestaurants[i] };
    console.log(`\n[${i + 1}/${mockRestaurants.length}] ${restaurant.name} (${restaurant.city})`);

    try {
      
      const addressInfo = await nominatimAPI.searchRestaurantAddress(restaurant.name, restaurant.city);
      
      if (addressInfo && addressInfo.address) {
        
        
        console.log(`  ✓ Adresse trouvée: ${addressInfo.address}`);
        
        
        
        
      } else {
        console.log(`  ⚠ Adresse non trouvée - le nom "${restaurant.name}" n'existe peut-être pas`);
        console.log(`  💡 Suggestion: Chercher le vrai nom sur Google Maps et le mettre à jour manuellement`);
      }

      
      if (i < mockRestaurants.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1200));
      }

    } catch (error) {
      console.error(`  ✗ Erreur:`, error.message);
    }

    correctedRestaurants.push(restaurant);
  }

  console.log(`\n✅ Vérification terminée`);
  console.log(`\n💡 Pour corriger les noms:`);
  console.log(`   1. Vérifie chaque restaurant sur Google Maps`);
  console.log(`   2. Mets à jour le nom dans mockData.js ou mockDataReal.js`);
  console.log(`   3. Relance npm run update-all-data\n`);
}

fixRestaurantNames().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});

