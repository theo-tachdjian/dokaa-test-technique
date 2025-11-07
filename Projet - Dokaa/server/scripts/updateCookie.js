
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const configPath = path.join(__dirname, '../services/deliverooGraphQLConfig.json');

function extractCookieValue(cookieString) {
  let cleaned = cookieString.trim();
  
  if (cleaned.includes('Cookie:')) {
    cleaned = cleaned.split('Cookie:')[1].trim();
  }
  if (cleaned.includes('Cookie=')) {
    cleaned = cleaned.split('Cookie=')[1].trim();
  }
  
  if (cleaned.includes('_cf_bm=') || cleaned.includes('__cf_bm=')) {
    const parts = cleaned.split(';');
    const cookieValue = parts[0].trim();
    
    if (cookieValue.startsWith('_cf_bm=') || cookieValue.startsWith('__cf_bm=')) {
      return cookieValue;
    }
  }
  
  return cleaned;
}

console.log('\n🍪 Mise à jour du cookie Cloudflare\n');
console.log('📋 Instructions rapides:');
console.log('1. Ouvrez https://deliveroo.fr dans Chrome');
console.log('2. Appuyez sur F12 → Network → Fetch/XHR');
console.log('3. Rechargez la page (F5)');
console.log('4. Cliquez sur une requête GraphQL');
console.log('5. Headers → Request Headers → Copiez la valeur de "Cookie"');
console.log('   (Vous pouvez copier juste la valeur ou toute la ligne "Cookie: ...")\n');

rl.question('Collez le cookie ici (ou appuyez sur Entrée pour annuler): ', (cookie) => {
  if (!cookie || cookie.trim() === '') {
    console.log('❌ Annulé');
    rl.close();
    return;
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    const cleanCookie = extractCookieValue(cookie);
    
    config.headers.Cookie = cleanCookie;
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    
    console.log('\n✅ Cookie mis à jour avec succès!');
    console.log(`📝 Cookie utilisé: ${cleanCookie.substring(0, 50)}...`);
    console.log('🔄 Le serveur va redémarrer automatiquement (nodemon)');
    console.log('   Si ce n\'est pas le cas, redémarrez manuellement avec Ctrl+C puis npm run dev\n');
  } catch (error) {
    console.error('\n❌ Erreur lors de la mise à jour:', error.message);
    console.error('💡 Vérifiez que le cookie est bien formaté');
  }
  
  rl.close();
});
