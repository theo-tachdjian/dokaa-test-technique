const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3001';

async function resetCircuitBreaker() {
  try {
    console.log('\n🔄 Réinitialisation du circuit breaker...\n');
    const response = await axios.post(`${API_URL}/api/restaurants/reset-circuit-breaker`);
    
    if (response.data.success) {
      console.log('✅ Circuit breaker réinitialisé avec succès !');
      console.log('💡 Vous pouvez maintenant réessayer vos requêtes.\n');
    } else {
      console.error('❌ Erreur lors de la réinitialisation:', response.data.error);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation du circuit breaker:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.error || error.message}`);
    } else {
      console.error(`   Message: ${error.message}`);
    }
    console.error('\n💡 Assurez-vous que le serveur est démarré (npm run dev)\n');
    process.exit(1);
  }
}

resetCircuitBreaker();
