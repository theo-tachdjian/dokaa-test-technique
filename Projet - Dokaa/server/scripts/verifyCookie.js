
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../services/deliverooGraphQLConfig.json');

console.log('\n🔍 Vérification du cookie Cloudflare\n');

if (!fs.existsSync(configPath)) {
  console.error('❌ Fichier de configuration introuvable:', configPath);
  process.exit(1);
}

try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  if (!config.headers) {
    console.error('❌ Pas de headers dans la configuration');
    process.exit(1);
  }
  
  const cookie = config.headers.Cookie;
  
  if (!cookie) {
    console.error('❌ Pas de cookie dans la configuration');
    console.log('💡 Exécutez: npm run update-cookie');
    process.exit(1);
  }
  
  console.log('✅ Cookie trouvé dans la configuration');
  console.log(`📏 Longueur: ${cookie.length} caractères`);
  
  if (!cookie.startsWith('__cf_bm=')) {
    console.warn('⚠️  Le cookie ne commence pas par "__cf_bm="');
    console.warn('   Il devrait commencer par "__cf_bm=..."');
  } else {
    console.log('✅ Format du cookie correct (commence par __cf_bm=)');
  }
  
  if (cookie.includes('path=') || cookie.includes('expires=') || cookie.includes('domain=')) {
    console.error('❌ Le cookie contient des métadonnées (path, expires, domain)');
    console.error('   Le cookie doit contenir UNIQUEMENT la valeur, pas les métadonnées');
    console.error('   Exécutez: npm run update-cookie (le script nettoie automatiquement)');
    process.exit(1);
  } else {
    console.log('✅ Cookie propre (pas de métadonnées)');
  }
  
  const preview = cookie.length > 80 
    ? `${cookie.substring(0, 40)}...${cookie.substring(cookie.length - 20)}`
    : cookie;
  console.log(`📋 Aperçu: ${preview}`);
  
  console.log('\n✅ Cookie valide !');
  console.log('💡 Si le problème persiste, vérifiez que :');
  console.log('   1. Le serveur a été redémarré après la mise à jour du cookie');
  console.log('   2. Le cookie n\'est pas expiré (il expire généralement toutes les 24-48h)');
  console.log('   3. Les logs du serveur ne montrent pas d\'erreurs Cloudflare\n');
  
} catch (error) {
  console.error('❌ Erreur lors de la lecture de la configuration:', error.message);
  process.exit(1);
}
