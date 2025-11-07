const deliverooGraphQL = require('../services/deliverooGraphQL');
const cache = require('../services/cache');

async function addCityFromPayload(cityName, payloadJson) {
  console.log(`\n🚀 Ajout de la ville ${cityName} depuis le payload...\n`);
  
  try {
    let payload;
    if (typeof payloadJson === 'string') {
      payload = JSON.parse(payloadJson);
    } else {
      payload = payloadJson;
    }
    
    if (!payload.query || !payload.variables) {
      throw new Error('Payload invalide: doit contenir "query" et "variables"');
    }
    
    const location = payload.variables.location;
    if (location && location.city_uname) {
      console.log(`📍 Ville détectée dans le payload: ${location.city_uname}`);
    }
    
    console.log(`📤 Exécution de la requête GraphQL...`);
    const response = await deliverooGraphQL.query(payload.query, payload.variables);
    
    console.log(`📦 Parsing de la réponse...`);
    const restaurants = deliverooGraphQL.parseRestaurantsFromResponse(response);
    
    if (restaurants.length === 0) {
      console.log(`⚠️  Aucun restaurant trouvé dans la réponse`);
      console.log(`📋 Structure de la réponse:`, JSON.stringify(response, null, 2).substring(0, 500));
      return;
    }
    
    const restaurantsWithCity = restaurants.map(r => ({ 
      ...r, 
      city: cityName 
    }));
    
    const cacheKey = `city:${cityName}`;
    cache.set(cacheKey, restaurantsWithCity, 'restaurants');
    cache.saveToDisk(); 
    
    console.log(`\n✅ ${restaurants.length} restaurants ajoutés pour ${cityName}`);
    console.log(`📋 Clé du cache: ${cacheKey}`);
    console.log(`💾 Cache sauvegardé sur le disque`);
    
    console.log(`\n📋 Exemples de restaurants ajoutés:`);
    restaurantsWithCity.slice(0, 5).forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.name} (${r.rating || 'N/A'}★) - ${r.imageUrl ? '✅ Image' : '❌ Pas d\'image'}`);
    });
    
    const allCacheKey = 'all:all-cities';
    const allCache = cache.getStale(allCacheKey);
    if (allCache) {
      console.log(`\n💡 Note: Le cache global "all:all-cities" contient ${allCache.length} restaurants`);
      console.log(`   Il sera mis à jour lors de la prochaine requête /all`);
    }
    
    console.log(`\n✅ ${cityName} ajoutée avec succès !`);
    console.log(`💡 Redémarrez le serveur pour voir les restaurants de ${cityName}`);
    
  } catch (error) {
    console.error(`\n❌ Erreur lors de l'ajout de ${cityName}:`, error.message);
    console.error(`📋 Stack:`, error.stack);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const fs = require('fs');
const path = require('path');

if (args.length < 1) {
  console.log(`
📋 Usage: node scripts/addCityFromPayload.js <cityName> [payloadJson|payloadFile]

Exemples:
  node scripts/addCityFromPayload.js Paris '{"query":"...","variables":{...}}'
  node scripts/addCityFromPayload.js Paris payload-paris.json
  `);
  process.exit(1);
}

const cityName = args[0];
let payloadJson = args[1];

if (payloadJson && (payloadJson.endsWith('.json') || payloadJson.includes('/') || payloadJson.includes('\\'))) {
  const filePath = path.isAbsolute(payloadJson) ? payloadJson : path.join(__dirname, '..', payloadJson);
  if (fs.existsSync(filePath)) {
    console.log(`📂 Lecture du fichier: ${filePath}`);
    payloadJson = fs.readFileSync(filePath, 'utf8');
  } else {
    console.error(`❌ Fichier non trouvé: ${filePath}`);
    process.exit(1);
  }
}

addCityFromPayload(cityName, payloadJson).then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
