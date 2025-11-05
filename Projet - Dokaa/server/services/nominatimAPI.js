



const axios = require('axios');

class NominatimAPI {
  constructor() {
    this.baseUrl = 'https://nominatim.openstreetmap.org/search';
    this.userAgent = 'DokaaBackoffice/1.0'; 
    this.delayBetweenRequests = 1000; 
    this.lastRequestTime = 0;
  }

  
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.delayBetweenRequests) {
      await new Promise(resolve => setTimeout(resolve, this.delayBetweenRequests - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
  }

  
  async searchRestaurantAddress(restaurantName, city) {
    try {
      await this.waitForRateLimit();

      
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
        
        
        const address = this.formatAddress(result.address, result);
        
        console.log(`[NOMINATIM] ✓ Adresse trouvée: ${address}`);
        
        return {
          address: address,
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          rating: null 
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

  
  formatAddress(addressDetails, result) {
    
    if (result.display_name) {
      
      const parts = result.display_name.split(',');
      if (parts.length >= 3) {
        
        return parts.slice(0, 2).join(', ').trim() + ', ' + parts[parts.length - 2].trim();
      }
      return result.display_name;
    }

    
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
      
      
      await new Promise(resolve => setTimeout(resolve, 1200));
    }
    
    return results;
  }
}


const nominatimAPI = new NominatimAPI();

module.exports = nominatimAPI;

