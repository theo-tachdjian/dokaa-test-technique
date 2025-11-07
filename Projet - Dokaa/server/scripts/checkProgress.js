
const cache = require('../services/cache');

function checkProgress() {
  console.log('📊 PROGRESSION DE LA RÉCUPÉRATION DES UUIDs\n');
  cache.loadFromDisk();

  const allKeys = Array.from(cache.cache.keys());
  const cityKeys = allKeys.filter(k => k.startsWith('city:'));

  let totalRestaurants = 0;
  let totalWithUuid = 0;
  let totalWithoutUuid = 0;
  const cityStats = [];

  for (const key of cityKeys) {
    const cityName = key.replace('city:', '');
    const restaurants = cache.getStale(key);

    if (!restaurants || !Array.isArray(restaurants)) {
      continue;
    }

    let cityWithUuid = 0;
    let cityWithoutUuid = 0;

    restaurants.forEach(r => {
      if (r.partner_drn_id && r.partner_drn_id.includes('-')) {
        cityWithUuid++;
      } else {
        cityWithoutUuid++;
      }
    });

    const percentage = restaurants.length > 0 
      ? ((cityWithUuid / restaurants.length) * 100).toFixed(1)
      : 0;

    cityStats.push({
      city: cityName,
      total: restaurants.length,
      withUuid: cityWithUuid,
      withoutUuid: cityWithoutUuid,
      percentage: parseFloat(percentage)
    });

    totalRestaurants += restaurants.length;
    totalWithUuid += cityWithUuid;
    totalWithoutUuid += cityWithoutUuid;
  }

  cityStats.sort((a, b) => a.percentage - b.percentage);

  console.log('='.repeat(70));
  console.log('📋 PAR VILLE (triées par progression)');
  console.log('='.repeat(70));

  cityStats.forEach(stat => {
    const status = stat.percentage === 100 ? '✅' : stat.percentage > 50 ? '🟡' : '❌';
    console.log(`${status} ${stat.city.padEnd(25)} | Total: ${String(stat.total).padStart(4)} | UUID: ${String(stat.withUuid).padStart(4)} (${stat.percentage}%) | Manquants: ${stat.withoutUuid}`);
  });

  console.log('\n' + '='.repeat(70));
  console.log('📊 RÉSUMÉ GLOBAL');
  console.log('='.repeat(70));
  
  const globalPercentage = totalRestaurants > 0 
    ? ((totalWithUuid / totalRestaurants) * 100).toFixed(1)
    : 0;

  console.log(`Total restaurants: ${totalRestaurants}`);
  console.log(`✅ Avec UUID: ${totalWithUuid} (${globalPercentage}%)`);
  console.log(`❌ Sans UUID: ${totalWithoutUuid} (${(100 - parseFloat(globalPercentage)).toFixed(1)}%)`);
  console.log('='.repeat(70));

  const needsWork = cityStats.filter(s => s.percentage < 100 && s.withoutUuid > 0);
  if (needsWork.length > 0) {
    console.log('\n🏙️  Villes nécessitant encore du travail:');
    needsWork.slice(0, 10).forEach(stat => {
      console.log(`   - ${stat.city}: ${stat.withoutUuid} restaurants sans UUID`);
    });
    if (needsWork.length > 10) {
      console.log(`   ... et ${needsWork.length - 10} autres villes`);
    }
  } else {
    console.log('\n🎉 Tous les restaurants ont un UUID !');
  }
}

if (require.main === module) {
  checkProgress();
}

module.exports = { checkProgress };
