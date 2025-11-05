// Service pour récupérer les vraies adresses depuis OpenStreetMap (Nominatim)
// API gratuite, pas besoin de clé, données réelles
// https://nominatim.org/release-docs/develop/api/Search/

const axios = require('axios');

class NominatimAPI {
  constructor() {
    this.baseUrl = 'https://nominatim.openstreetmap.org/search';
    this.userAgent = 'DokaaBackoffice/1.0'; // Requis par Nominatim
    this.delayBetweenRequests = 1000; // 1 seconde entre les requêtes (politesse)
    this.lastRequestTime = 0;
  }

  // Attendre entre les requêtes pour respecter la politique de rate limiting
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.delayBetweenRequests) {
      await new Promise(resolve => setTimeout(resolve, this.delayBetweenRequests - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
  }

  // Rechercher une adresse réelle pour un restaurant
  async searchRestaurantAddress(restaurantName, city) {
    try {
      await this.waitForRateLimit();

      // Construire la requête de recherche
      const query = `${restaurantName}, ${city}, France`;
      
      console.log(`[NOMINATIM] Recherche: ${query}`);

      const response = await axios.get(this.baseUrl, {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 1,
          countrycodes: 'fr'
        },
        headers: {
          'User-Agent': this.userAgent
        },
        timeout: 10000
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        
        // Construire l'adresse complète depuis les détails
        const address = this.formatAddress(result.address, result);
        
        console.log(`[NOMINATIM] ✓ Adresse trouvée: ${address}`);
        
        return {
          address: address,
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          rating: null // Nominatim ne fournit pas de notes
        };
      } else {
        console.log(`[NOMINATIM] ⚠ Aucun résultat trouvé pour: ${query}`);
        return null;
      }

    } catch (error) {
      console.error(`[NOMINATIM] Erreur:`, error.message);
      return null;
    }
  }

  // Formater l'adresse depuis les données Nominatim
  formatAddress(addressDetails, result) {
    // Si on a déjà une adresse complète dans display_name
    if (result.display_name) {
      // Extraire juste la partie adresse (avant la ville)
      const parts = result.display_name.split(',');
      if (parts.length >= 3) {
        // Prendre les 2-3 premières parties (rue + numéro)
        return parts.slice(0, 2).join(', ').trim() + ', ' + parts[parts.length - 2].trim();
      }
      return result.display_name;
    }

    // Sinon, construire depuis address
    const parts = [];
    
    if (addressDetails.road) {
      if (addressDetails.house_number) {
        parts.push(`${addressDetails.house_number} ${addressDetails.road}`);
      } else {
        parts.push(addressDetails.road);
      }
    }
    
    if (addressDetails.postcode && addressDetails.city) {
      parts.push(`${addressDetails.postcode} ${addressDetails.city}`);
    } else if (addressDetails.city) {
      parts.push(addressDetails.city);
    }
    
    return parts.length > 0 ? parts.join(', ') : result.display_name || 'Adresse non trouvée';
  }

  // Rechercher plusieurs restaurants en batch (avec délais)
  async searchMultipleRestaurants(restaurants) {
    const results = [];
    
    for (const restaurant of restaurants) {
      const addressInfo = await this.searchRestaurantAddress(restaurant.name, restaurant.city);
      if (addressInfo) {
        results.push({
          id: restaurant.id,
          address: addressInfo.address,
          latitude: addressInfo.latitude,
          longitude: addressInfo.longitude
        });
      }
      
      // Attendre un peu entre chaque restaurant pour ne pas surcharger
      await new Promise(resolve => setTimeout(resolve, 1200));
    }
    
    return results;
  }
}

// Instance singleton
const nominatimAPI = new NominatimAPI();

module.exports = nominatimAPI;

