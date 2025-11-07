const deliverooGraphQL = require('../services/deliverooGraphQL');
const cache = require('../services/cache');
const fs = require('fs');
const path = require('path');

const payloadsDir = path.join(__dirname, '..');
const payloadFiles = fs.readdirSync(payloadsDir)
  .filter(file => file.startsWith('payload-') && file.endsWith('.json'))
  .map(file => ({
    file,
    cityName: extractCityName(file)
  }))
  .filter(item => item.cityName); 

function extractCityName(filename) {
  const name = filename
    .replace('payload-', '')
    .replace('.json', '')
    .toLowerCase();
  
  return name;
}

const results = {
  success: [],
  failed: []
};

async function processPayload(payloadInfo) {
  const { file, cityName } = payloadInfo;
  const payloadPath = path.join(payloadsDir, file);
  
  try {
    console.log(`\n✨ Traitement de ${cityName} (${file})...`);
    
    const payloadJson = fs.readFileSync(payloadPath, 'utf8');
    const payload = JSON.parse(payloadJson);
    
    if (!payload.query || !payload.variables) {
      throw new Error('Payload invalide: doit contenir "query" et "variables"');
    }
    
    const finalCityName = cityName;
    
    console.log(`📍 Utilisation du nom de ville: ${finalCityName} (depuis le fichier)`);
    
    console.log(`📤 Envoi de la requête GraphQL à Deliveroo...`);
    const response = await deliverooGraphQL.query(payload.query, payload.variables);
    
    console.log(`📦 Extraction des restaurants de la réponse...`);
    const restaurants = deliverooGraphQL.parseRestaurantsFromResponse(response);
    
    if (restaurants.length === 0) {
      throw new Error('Aucun restaurant trouvé dans la réponse GraphQL');
    }
    
    const restaurantsWithCity = restaurants.map(r => ({ 
      ...r, 
      city: finalCityName 
    }));
    
    const cacheKey = `city:${finalCityName}`;
    cache.set(cacheKey, restaurantsWithCity, 'restaurants');
    cache.saveToDisk(); 
    
    console.log(`✅ ${restaurants.length} restaurants réels de Deliveroo ajoutés pour ${finalCityName}`);
    results.success.push({ city: finalCityName, count: restaurants.length });
    
  } catch (error) {
    console.error(`❌ Erreur pour ${cityName}:`, error.message);
    results.failed.push({ city: cityName, reason: error.message });
  }
}

async function processAllPayloads() {
  console.log('🚀 Démarrage du traitement automatique de tous les payloads...\n');
  console.log(`📋 ${payloadFiles.length} fichiers payload trouvés\n`);
  
  for (let i = 0; i < payloadFiles.length; i++) {
    const payload = payloadFiles[i];
    await processPayload(payload);
    
    if (i < payloadFiles.length - 1) {
      console.log(`⏳ Pause de 2 secondes avant la prochaine ville...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n\n📊 ===== RAPPORT FINAL =====\n');
  console.log(`✅ VILLES AVEC RESTAURANTS RÉELS DE DELIVEROO (${results.success.length}):\n`);
  results.success.sort((a, b) => b.count - a.count);
  results.success.forEach(({ city, count }) => {
    console.log(`   - ${city}: ${count} restaurants`);
  });
  
  console.log(`\n❌ VILLES ÉCHOUÉES (${results.failed.length}):\n`);
  results.failed.forEach(({ city, reason }) => {
    console.log(`   - ${city}: ${reason}`);
  });
  
  const totalRestaurants = results.success.reduce((sum, r) => sum + r.count, 0);
  console.log(`\n📈 Total: ${results.success.length} villes avec restaurants, ${totalRestaurants} restaurants réels de Deliveroo`);
  
  const reportPath = path.join(__dirname, '..', 'data', 'city-report.txt');
  const reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  let report = '===== RAPPORT DES VILLES (RESTAURANTS RÉELS DELIVEROO) =====\n\n';
  report += `✅ VILLES OÙ ON PEUT CONSULTER LES RESTAURANTS (${results.success.length}):\n\n`;
  results.success.forEach(({ city, count }) => {
    report += `   - ${city}: ${count} restaurants\n`;
  });
  report += `\n❌ VILLES OÙ ÇA N'A PAS MARCHÉ (${results.failed.length}):\n\n`;
  results.failed.forEach(({ city, reason }) => {
    report += `   - ${city}: ${reason}\n`;
  });
  report += `\n📈 Total: ${results.success.length} villes avec restaurants, ${totalRestaurants} restaurants réels de Deliveroo\n`;
  
  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`\n💾 Rapport sauvegardé dans: ${reportPath}`);
  console.log(`\n✅ Traitement terminé ! Redémarrez le serveur pour voir toutes les villes.`);
}

processAllPayloads().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
