// Script pour corriger les noms des restaurants pour qu'ils correspondent aux vrais noms
// Usage: node scripts/fixRestaurantNames.js

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
      // Chercher le restaurant sur OpenStreetMap pour obtenir le vrai nom
      const addressInfo = await nominatimAPI.searchRestaurantAddress(restaurant.name, restaurant.city);
      
      if (addressInfo && addressInfo.address) {
        // Le nom dans l'adresse peut contenir le vrai nom
        // Ou on peut utiliser le nom original si l'adresse est trouvée
        console.log(`  ✓ Adresse trouvée: ${addressInfo.address}`);
        
        // Si l'adresse contient un nom différent, on peut l'utiliser
        // Mais pour l'instant, on garde le nom original si l'adresse est trouvée
        // (le vrai nom sera dans mockDataReal.js après le scraping)
      } else {
        console.log(`  ⚠ Adresse non trouvée - le nom "${restaurant.name}" n'existe peut-être pas`);
        console.log(`  💡 Suggestion: Chercher le vrai nom sur Google Maps et le mettre à jour manuellement`);
      }

      // Attendre entre les requêtes
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

