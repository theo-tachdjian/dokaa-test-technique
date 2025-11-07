const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { FULL_TEXT_SEARCH_QUERY } = require('./deliverooGraphQLQuery');

let DELIVEROO_GRAPHQL_URL = 'https://api.fr.deliveroo.com/consumer/graphql/';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Origin': 'https://deliveroo.fr',
  'Referer': 'https://deliveroo.fr/fr/',
};

class DeliverooGraphQL {
  constructor() {
    this.headers = { ...DEFAULT_HEADERS };
    this.config = null;
    this.loadConfig();
    
    this.rateLimitState = {
      consecutiveFailures: 0,
      lastFailureTime: null,
      circuitOpen: false,
      circuitOpenUntil: null
    };
    this.MAX_CONSECUTIVE_FAILURES = 2; 
    this.CIRCUIT_OPEN_DURATION = 30 * 60 * 1000; 
    
    this.lastRateLimitError = null;
  }

  resetCircuitBreaker() {
    this.rateLimitState.consecutiveFailures = 0;
    this.rateLimitState.lastFailureTime = null;
    this.rateLimitState.circuitOpen = false;
    this.rateLimitState.circuitOpenUntil = null;
    console.log('✅ Circuit breaker réinitialisé manuellement');
  }

  getCircuitBreakerState() {
    const now = Date.now();
    const isOpen = this.rateLimitState.circuitOpen && 
                   this.rateLimitState.circuitOpenUntil && 
                   now < this.rateLimitState.circuitOpenUntil;
    const remainingMinutes = isOpen && this.rateLimitState.circuitOpenUntil 
      ? Math.ceil((this.rateLimitState.circuitOpenUntil - now) / 60000)
      : 0;
    
    return {
      isOpen,
      consecutiveFailures: this.rateLimitState.consecutiveFailures,
      remainingMinutes,
      lastFailureTime: this.rateLimitState.lastFailureTime
    };
  }

  loadConfig() {
    const configPath = path.join(__dirname, 'deliverooGraphQLConfig.json');
    if (fs.existsSync(configPath)) {
      try {
        this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (this.config.headers) {
          this.headers = { ...DEFAULT_HEADERS, ...this.config.headers };
        }
        if (this.config.url) {
          DELIVEROO_GRAPHQL_URL = this.config.url;
        }
        console.log('✓ Configuration GraphQL chargée depuis deliverooGraphQLConfig.json');
        
        if (this.config.headers?.Cookie) {
          const cookie = this.config.headers.Cookie;
          const cookiePreview = cookie.length > 50 
            ? cookie.substring(0, 30) + '...' + cookie.substring(cookie.length - 20) 
            : cookie;
          console.log('Cookie chargé: ' + cookiePreview + '');
          console.log('� Longueur: ' + cookie.length + ' caractères');
          
          if (this.lastRateLimitError) {
            console.log('� Réinitialisation du flag de rate limiting (nouveau cookie)');
            this.lastRateLimitError = null;
          }
        }
      } catch (error) {
        console.warn('⚠ Impossible de charger la configuration:', error.message);
      }
    } else {
      console.log('ℹ Utilisation des headers par défaut. Créez deliverooGraphQLConfig.json pour personnaliser.');
    }
  }

  setHeaders(customHeaders) {
    this.headers = { ...this.headers, ...customHeaders };
  }

  async query(graphQLQuery, variables = {}) {
    
    const url = DELIVEROO_GRAPHQL_URL;
    try {
      const response = await axios.post(
        url,
        {
          query: graphQLQuery,
          variables: variables
        },
        {
          headers: this.headers,
          timeout: 10000,
          validateStatus: function (status) {
            return status < 500;
          }
        }
      );

      if (typeof response.data === 'string' && 
          (response.data.includes('Cloudflare') || 
           response.data.includes('Just a moment') ||
           response.data.includes('Checking your browser'))) {
        console.error('\n❌ BLOQUÉ PAR CLOUDFLARE ❌');
        console.error('📋 La réponse est une page HTML Cloudflare au lieu de JSON');
        console.error('💡 Le cookie Cloudflare est expiré ou invalide');
        console.error('💡 Pour le mettre à jour rapidement:');
        console.error('   1. Exécutez: npm run update-cookie');
        console.error('   2. Ou suivez docs/COPIER_HEADERS_DEVTOLS.md');
        console.error('   3. Redémarrez le serveur après la mise à jour\n');
        const error = new Error('Blocked by Cloudflare - Cookie expired');
        error.response = { status: 403, data: response.data };
        throw error;
      }

      if (response.data.errors) {
        const errorMessages = response.data.errors.map(e => e.message).join(', ');
        const firstError = response.data.errors[0]?.message || '';
        
        if (errorMessages.includes('Veuillez réessayer') || 
            errorMessages.includes('try again')) {
          console.error('\n❌ ERREUR DELIVEROO - Rate limiting ❌');
          console.error('Message: ' + firstError + '');
          console.error('💡 Cela peut être dû à :');
          console.error('   1. Rate limiting (trop de requêtes) - Attendez 5-10 minutes');
          console.error('   2. Cookie Cloudflare expiré - Exécutez: npm run update-cookie');
          console.error('   3. Protection anti-bot de Deliveroo');
          console.error('⚠️  Circuit breaker désactivé - Les requêtes continueront malgré les erreurs\n');
        } else if (response.status === 403) {
          console.error('\n❌ COOKIE CLOUDFLARE EXPIRÉ ❌');
          console.error('💡 Pour le mettre à jour rapidement:');
          console.error('   1. Exécutez: npm run update-cookie');
          console.error('   2. Ou suivez docs/COPIER_HEADERS_DEVTOLS.md\n');
        }
        
        throw new Error('GraphQL Error: ' + JSON.stringify(response.data.errors));
      }

      if (!response.data.data) {
        if (response.status === 200 && !response.data.data) {
          console.error('\n❌ COOKIE CLOUDFLARE EXPIRÉ (réponse vide) ❌');
          console.error('💡 Pour le mettre à jour rapidement:');
          console.error('   1. Exécutez: npm run update-cookie');
          console.error('   2. Ou suivez docs/COPIER_HEADERS_DEVTOLS.md');
          console.error('   3. Redémarrez le serveur après la mise à jour\n');
        }
        
        console.error('📋 Réponse reçue:', JSON.stringify(response.data, null, 2).substring(0, 500));
        
        throw new Error('Invalid GraphQL response: missing data field');
      }

      return response.data.data;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        console.error('Erreur requete GraphQL Deliveroo (' + status + '):', error.response.statusText);
        console.error('URL utilisée: ' + url + '');
        
        if (status === 403 || (status === 200 && error.response.data && typeof error.response.data === 'string' && error.response.data.includes('Cloudflare'))) {
          console.error('\n❌ BLOQUÉ PAR CLOUDFLARE ❌');
          console.error('💡 Le Cookie Cloudflare est expiré ou invalide.');
          console.error('📋 Pour le mettre à jour :');
          console.error('   1. Ouvrez https://deliveroo.fr dans Chrome');
          console.error('   2. Ouvrez DevTools (F12) → Network → Fetch/XHR');
          console.error('   3. Rechargez la page (F5)');
          console.error('   4. Cliquez sur une requête GraphQL → Headers');
          console.error('   5. Copiez la valeur du header "Cookie"');
          console.error('   6. Mettez à jour server/services/deliverooGraphQLConfig.json');
          console.error('');
        } else if (status === 404) {
          console.error('L URL GraphQL est incorrecte. Verifiez l URL dans Postman et copiez-la dans deliverooGraphQLConfig.json');
        } else if (status === 422) {
          console.error('💡 Erreur 422: Vérifiez que les headers sont corrects dans deliverooGraphQLConfig.json');
          if (error.response.data) {
            console.error('Détails:', JSON.stringify(error.response.data, null, 2));
          }
        }
      } else {
        console.error('Erreur requête GraphQL Deliveroo:', error.message);
      }
      throw error;
    }
  }

  async getAllRestaurants(city, geohash = null, retryCount = 0, force = false) {
    if (!force && retryCount === 0 && this.lastRateLimitError && Date.now() - this.lastRateLimitError < 300000) { 
      console.log('Rate limiting actif pour ' + city + ' - Le cache sera utilisé');
      const error = new Error('Rate limiting actif - Utilisation du cache');
      error.isRateLimit = true;
      throw error;
    }

    const searchQuery = FULL_TEXT_SEARCH_QUERY;
    const { getGeohashForCity, getNeighborhoodForCity } = require('./cityGeohashMap');

    const useGeohash = geohash || getGeohashForCity(city);
    const citySlug = city.toLowerCase().replace(/\s+/g, '-');
    const neighborhoodSlug = getNeighborhoodForCity(city);

    const location = {
      geohash: useGeohash,
      city_uname: city,
      neighborhood_uname: neighborhoodSlug,
      postcode: ''
    };

    const uuid = this.generateUUID();
    
    const variables = {
      ui_blocks: ['BANNER'],
      ui_layouts: ['LIST'],
      ui_targets: ['PARAMS', 'RESTAURANT', 'MENU_ITEM'],
      ui_themes: ['BANNER_CARD', 'BANNER_EMPTY', 'BANNER_MARKETING_A', 'BANNER_MARKETING_B', 'BANNER_MARKETING_C', 'BANNER_PICKUP_SHOWCASE', 'BANNER_SERVICE_ADVISORY'],
      location: location,
      options: {
        query: '',
        recent_searches: [],
        web_column_count: 1
      },
      url: 'https://deliveroo.fr/fr/restaurants/' + city + '/' + neighborhoodSlug + '?geohash=' + useGeohash,
      uuid: uuid,
      ui_features: ['UNAVAILABLE_RESTAURANTS', 'UI_CARD_BORDER', 'UI_CAROUSEL_COLOR', 'UI_PROMOTION_TAG', 'UI_BACKGROUND', 'ILLUSTRATION_BADGES', 'SCHEDULED_RANGES', 'UI_SPAN_TAGS', 'UI_SPAN_COUNTDOWN', 'UI_CARD_BADGES', 'UI_CAROUSEL_BACKGROUND_IMAGE', 'CARD_ILLUSTRATION_BADGE', 'HOME_MAP_VIEW'],
      include_token: false
    };

    try {
      const response = await this.query(searchQuery, variables);
      this.lastRateLimitError = null; 
      const restaurants = this.parseRestaurantsFromResponse(response);
      console.log(restaurants.length + ' restaurants trouves pour ' + city + ' (geohash: ' + useGeohash + ')');
      return restaurants;
    } catch (error) {
      const errorMessage = error.message || '';
      
      if (errorMessage.includes('Veuillez réessayer') || errorMessage.includes('try again')) {
        this.lastRateLimitError = Date.now();
        console.log('Rate limiting detecte pour ' + city + ' - Le cache sera utilise');
        const rateLimitError = new Error('Rate limiting détecté');
        rateLimitError.isRateLimit = true;
        throw rateLimitError;
      }
      
      console.error('Erreur pour ' + city + ' (geohash: ' + useGeohash + '):', errorMessage);
      throw error; 
    }
  }

  parseRestaurantsFromResponse(graphQLResponse) {
    const restaurants = [];
    
    if (!graphQLResponse?.results?.layoutGroups) {
      return restaurants;
    }

    for (const layoutGroup of graphQLResponse.results.layoutGroups) {
      if (!layoutGroup.data) continue;

      for (const layout of layoutGroup.data) {
        if (layout.typeName !== 'UILayoutList' || !layout.blocks) continue;

        for (const block of layout.blocks) {
          if (block.typeName !== 'UICard' || !block.target?.restaurant) continue;

          const restaurant = block.target.restaurant;
          const content = block.uiContent?.default;
          const expandedContent = block.uiContent?.expanded;

          let rating = null;
          let ratingCount = null;
          let distance = null;
          let deliveryTime = null;
          
          let imageUrl = content?.image || 
                        expandedContent?.image ||
                        block.image ||
                        content?.responsiveImage?.desktop ||
                        content?.responsiveImage?.mobile ||
                        content?.images?.default ||
                        content?.images?.image ||
                        null;
          
          if (imageUrl && !imageUrl.startsWith('http')) {
            if (imageUrl.startsWith('//')) {
              imageUrl = 'https:' + imageUrl;
            } else if (imageUrl.startsWith('/')) {
              imageUrl = 'https://deliveroo.fr' + imageUrl;
            }
          }

          if (content?.uiLines) {
            for (const line of content.uiLines) {
              if (line.typeName !== 'UITextLine' || !line.spans) continue;

              for (const span of line.spans) {
                if (span.typeName === 'UISpanText') {
                  const text = span.text || '';
                  
                  if (text.match(/^\d+\.\d+$/)) {
                    rating = parseFloat(text);
                  } else if (text.match(/^\(\d+\)$/)) {
                    ratingCount = parseInt(text.replace(/[()]/g, ''));
                  } else if (text.match(/^\d+\.\d+ km$/)) {
                    distance = text;
                  } else if (text.match(/^\d+ min$/)) {
                    deliveryTime = text;
                  }
                }
              }
            }
          }

          const slug = restaurant.links?.self?.href || '';
          const slugParts = slug.split('/').filter(p => p);
          const cityFromSlug = slugParts.length >= 3 && slugParts[1] === 'restaurants' ? slugParts[2] : null;
          
          let partnerDrnId = restaurant.partner_drn_id || 
                              restaurant.partnerDrnId || 
                              restaurant.links?.self?.partner_drn_id ||
                              restaurant.target?.partner_drn_id ||
                              restaurant.target?.restaurant?.partner_drn_id;
          
          if (!partnerDrnId && restaurant.target?.params) {
            for (const param of restaurant.target.params) {
              if (param.id === 'partner_drn_id' || param.id === 'partnerDrnId') {
                partnerDrnId = param.value;
                break;
              }
            }
          }
          
          if (!partnerDrnId && block.target) {
            partnerDrnId = block.target.partner_drn_id || 
                          block.target.partnerDrnId ||
                          block.target.restaurant?.partner_drn_id;
          }
          
          if (!partnerDrnId) {
            partnerDrnId = restaurant.id;
            if (restaurants.length < 3) {
              console.log('Pas de partner_drn_id trouvé pour ' + restaurant.name + ' (ID: ' + restaurant.id + ')');
              console.log('   Structure disponible:', {
                hasRestaurant: !!restaurant,
                hasLinks: !!restaurant.links,
                hasTarget: !!restaurant.target,
                hasBlockTarget: !!block.target,
                restaurantKeys: Object.keys(restaurant).slice(0, 15)
              });
              console.log('Utilisation de l ID comme fallback (format nombre, pas UUID)');
            }
          } else if (restaurants.length < 3) {
            console.log('partner_drn_id trouvé pour ' + restaurant.name + ': ' + partnerDrnId + '');
          }
          
          if (restaurants.length < 3) {
            if (imageUrl) {
              console.log('Image trouvée pour ' + restaurant.name + ': ' + imageUrl.substring(0, 80) + '...');
            } else {
              console.log('Aucune image trouvée pour ' + restaurant.name + '');
              if (content) {
                console.log('   Content keys:', Object.keys(content).slice(0, 10));
                if (content.responsiveImage) console.log('   responsiveImage:', content.responsiveImage);
                if (content.images) console.log('   images:', content.images);
              }
            }
          }
          
          restaurants.push({
            id: restaurant.id,
            name: restaurant.name,
            slug: slug,
            city: cityFromSlug || null,
            address: null,
            rating: rating,
            ratingCount: ratingCount,
            distance: distance,
            deliveryTime: deliveryTime,
            imageUrl: imageUrl,
            image: imageUrl, 
            cuisine: null,
            status: 'open',
            url: slug ? 'https://deliveroo.fr' + slug : null,
            partner_drn_id: partnerDrnId 
          });
        }
      }
    }

    return restaurants;
  }

  async searchRestaurants(query, city, geohash = null, retryCount = 0, force = false) {
    if (!force && retryCount === 0 && this.lastRateLimitError && Date.now() - this.lastRateLimitError < 300000) { 
      console.log('⚠️  Rate limiting actif - Le cache sera utilisé');
      const error = new Error('Rate limiting actif - Utilisation du cache');
      error.isRateLimit = true;
      throw error;
    }

    const searchQuery = FULL_TEXT_SEARCH_QUERY;
    const { getGeohashForCity, getNeighborhoodForCity } = require('./cityGeohashMap');

    const useGeohash = geohash || getGeohashForCity(city);
    const citySlug = city.toLowerCase().replace(/\s+/g, '-');
    const neighborhoodSlug = getNeighborhoodForCity(city);

    const location = {
      geohash: useGeohash,
      city_uname: city,
      neighborhood_uname: neighborhoodSlug,
      postcode: ''
    };

    const uuid = this.generateUUID();
    const queryText = query || '';
    
    const variables = {
      ui_blocks: ['BANNER'],
      ui_layouts: ['LIST'],
      ui_targets: ['PARAMS', 'RESTAURANT', 'MENU_ITEM'],
      ui_themes: ['BANNER_CARD', 'BANNER_EMPTY', 'BANNER_MARKETING_A', 'BANNER_MARKETING_B', 'BANNER_MARKETING_C', 'BANNER_PICKUP_SHOWCASE', 'BANNER_SERVICE_ADVISORY'],
      location: location,
      options: {
        query: queryText,
        recent_searches: queryText ? [
          {
            search_term: queryText.toLowerCase(),
            pill_id: 'all',
            date_time: new Date().toISOString()
          }
        ] : [],
        web_column_count: 1
      },
      url: queryText ? 'https://deliveroo.fr/fr/restaurants/' + city + '/' + slug : null,
      uuid: uuid,
      ui_features: ['UNAVAILABLE_RESTAURANTS', 'LIMIT_QUERY_RESULTS', 'UI_CARD_BORDER', 'UI_CAROUSEL_COLOR', 'UI_PROMOTION_TAG', 'UI_BACKGROUND', 'ILLUSTRATION_BADGES', 'SCHEDULED_RANGES', 'UI_SPAN_TAGS', 'UI_SPAN_COUNTDOWN', 'UI_CARD_BADGES', 'TEXT_SEARCH_COMBINED_VIEW', 'UI_CAROUSEL_BACKGROUND_IMAGE', 'CARD_ILLUSTRATION_BADGE', 'HOME_MAP_VIEW'],
      include_token: false
    };

    try {
      const response = await this.query(searchQuery, variables);
      this.lastRateLimitError = null; 
      const restaurants = this.parseRestaurantsFromResponse(response);
      return restaurants;
    } catch (error) {
      const errorMessage = error.message || '';
      
      if (errorMessage.includes('Veuillez réessayer') || errorMessage.includes('try again')) {
        this.lastRateLimitError = Date.now();
        console.log('⚠️  Rate limiting détecté - Le cache sera utilisé');
        const rateLimitError = new Error('Rate limiting détecté');
        rateLimitError.isRateLimit = true;
        throw rateLimitError;
      }
      
      console.error('Erreur recherche pour "' + query + '" dans ' + city + ':', errorMessage);
      throw error; 
    }
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async getRestaurantDetails(slug, city) {
    const detailsQuery = `
      query GetRestaurant($slug: String!, $city: String!) {
        restaurant(slug: $slug, city: $city) {
          id
          name
          slug
          address
          rating
          imageUrl
          cuisine
          status
          url
          partnerDrnId: partner_drn_id
        }
      }
    `;

    try {
      const result = await this.query(detailsQuery, {
        slug: slug,
        city: city
      });
      
      if (result?.restaurant) {
        const restaurant = result.restaurant;
        if (restaurant.partnerDrnId && !restaurant.partner_drn_id) {
          restaurant.partner_drn_id = restaurant.partnerDrnId;
        }
        if (restaurant.partner_drn_id) {
          console.log('partner_drn_id trouvé pour ' + restaurant.name + ': ' + restaurant.partner_drn_id + '');
        } else {
          console.log('Pas de partner_drn_id dans la réponse pour ' + restaurant.name + '');
          if (restaurant.url || restaurant.slug) {
            console.log('Tentative extraction partner_drn_id depuis l URL...');
            const extractedId = await this.extractPartnerDrnIdFromUrl(restaurant.url || 'https://deliveroo.fr/fr/restaurants/' + city + '/' + slug);
            if (extractedId) {
              restaurant.partner_drn_id = extractedId;
              console.log('partner_drn_id extrait depuis l URL: ' + extractedId);
            }
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Erreur getRestaurantDetails pour ' + slug + ', ' + city + ':', error.message);
      throw error;
    }
  }

  async extractPartnerDrnIdFromUrl(url) {
    try {
      
      console.log('Extraction depuis URL: ' + url.substring(0, 80) + '...');
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cookie': this.headers.Cookie || ''
        },
        timeout: 15000,
        validateStatus: () => true,
        maxRedirects: 5
      });

      if (response.status !== 200) {
        console.log('Statut HTTP ' + response.status + ' pour l URL');
        return null;
      }

      const html = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      
      if (!html || html.length < 100) {
        console.log('️ HTML trop court ou vide');
        return null;
      }
      
      const uuidPatterns = [
        /["']partner[_-]?drn[_-]?id["']\s*[:=]\s*["']([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})["']/gi,
        /partner[_-]?drn[_-]?id["']?\s*[:=]\s*["']([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})["']/gi,
        /"partner_drn_id"\s*:\s*"([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})"/gi,
        /(?:__INITIAL_STATE__|__NEXT_DATA__|window\.__APP__)[^}]*partner[_-]?drn[_-]?id["']?\s*[:=]\s*["']([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})["']/gi,
        /partner[^"']{0,100}["']([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})["']/gi
      ];
      
      for (const pattern of uuidPatterns) {
        const matches = [...html.matchAll(pattern)];
        for (const match of matches) {
          if (match[1]) {
            const uuid = match[1].toLowerCase();
            if (uuid.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/)) {
              console.log('partner_drn_id extrait depuis la page HTML: ' + uuid + '');
              return uuid;
            }
          }
        }
      }
      
      const contextPattern = /partner[^"']{0,200}["']([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})["']/gi;
      const contextMatches = [...html.matchAll(contextPattern)];
      for (const match of contextMatches) {
        if (match[1]) {
          const uuid = match[1].toLowerCase();
          if (uuid.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/)) {
            console.log('partner_drn_id trouvé via pattern contextuel: ' + uuid + '');
            return uuid;
          }
        }
      }

      const jsonPattern = /<script[^>]*type=["']application\/json["'][^>]*>(.*?)<\/script>/gis;
      let jsonMatch;
      while ((jsonMatch = jsonPattern.exec(html)) !== null) {
        try {
          const jsonData = JSON.parse(jsonMatch[1]);
          const partnerId = this.findPartnerDrnIdInObject(jsonData);
          if (partnerId) {
            console.log('partner_drn_id trouvé dans les données JSON: ' + partnerId + '');
            return partnerId;
          }
        } catch (e) {
        }
      }
      
      const scriptPattern = /<script[^>]*>(.*?)<\/script>/gis;
      let scriptMatch;
      while ((scriptMatch = scriptPattern.exec(html)) !== null) {
        const scriptContent = scriptMatch[1];
        const statePatterns = [
          /window\.__INITIAL_STATE__\s*=\s*({[^}]*partner[^}]*})/gi,
          /__NEXT_DATA__\s*=\s*({[^}]*partner[^}]*})/gi,
          /window\.__APP__\s*=\s*({[^}]*partner[^}]*})/gi
        ];
        
        for (const pattern of statePatterns) {
          const match = scriptContent.match(pattern);
          if (match && match[1]) {
            try {
              const jsonData = JSON.parse(match[1]);
              const partnerId = this.findPartnerDrnIdInObject(jsonData);
              if (partnerId) {
                console.log('partner_drn_id trouvé dans les scripts JavaScript: ' + partnerId + '');
                return partnerId;
              }
            } catch (e) {
            }
          }
        }
        
        const directPattern = /partner[_-]?drn[_-]?id["']?\s*[:=]\s*["']([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})["']/gi;
        const directMatch = scriptContent.match(directPattern);
        if (directMatch && directMatch[1]) {
          const uuid = directMatch[1].toLowerCase();
          if (uuid.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/)) {
            console.log('partner_drn_id trouvé directement dans le script: ' + uuid + '');
            return uuid;
          }
        }
      }
      
      const partnerContextPatterns = [
        /"partner"\s*:\s*{[^}]*"id"\s*:\s*"([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})"/gi,
        /"partner"\s*:\s*{[^}]*"drn_id"\s*:\s*"([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})"/gi,
        /partner[^}]*{[^}]*id["']?\s*:\s*["']([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})["']/gi
      ];
      
      for (const pattern of partnerContextPatterns) {
        const matches = [...html.matchAll(pattern)];
        for (const match of matches) {
          if (match[1]) {
            const uuid = match[1].toLowerCase();
            if (uuid.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/)) {
              console.log('partner_drn_id trouvé dans un contexte "partner": ' + uuid + '');
              return uuid;
            }
          }
        }
      }
      
      const anyUuidPattern = /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/gi;
      const allUuids = [...html.matchAll(anyUuidPattern)];
      if (allUuids.length > 0) {
        console.log('' + allUuids.length + ' UUID(s) trouvé(s) dans la page');
        
        let bestUuid = null;
        let bestDistance = Infinity;
        
        for (const match of allUuids) {
          const uuid = match[1].toLowerCase();
          const uuidIndex = match.index;
          
          const contextStart = Math.max(0, uuidIndex - 200);
          const contextEnd = Math.min(html.length, uuidIndex + match[0].length + 200);
          const context = html.substring(contextStart, contextEnd).toLowerCase();
          
          const partnerIndex = context.indexOf('partner');
          const restaurantIndex = context.indexOf('restaurant');
          
          if (partnerIndex >= 0 || restaurantIndex >= 0) {
            const distance = Math.min(
              partnerIndex >= 0 ? Math.abs(partnerIndex - (uuidIndex - contextStart)) : Infinity,
              restaurantIndex >= 0 ? Math.abs(restaurantIndex - (uuidIndex - contextStart)) : Infinity
            );
            
            if (distance < bestDistance) {
              bestDistance = distance;
              bestUuid = uuid;
            }
          }
        }
        
        if (bestUuid && bestDistance < 100) {
          console.log('UUID trouvé près de "partner"/"restaurant" (distance: ' + bestDistance + '): ' + bestUuid + '');
          return bestUuid;
        } else {
          console.log('Aucun UUID n est suffisamment proche de partner ou restaurant');
          if (allUuids.length > 0) {
            console.log('Premier UUID trouvé: ' + allUuids[0][1] + ' (non utilisé car contexte incertain)');
          }
        }
      }

      return null;
    } catch (error) {
      console.log('Erreur extraction partner_drn_id depuis URL: ' + error.message + '');
      return null;
    }
  }

  findPartnerDrnIdInObject(obj, depth = 0) {
    if (depth > 5) return null; 
    
    if (typeof obj !== 'object' || obj === null) return null;

    for (const key of Object.keys(obj)) {
      if ((key.includes('partner') && key.includes('drn') && key.includes('id')) || 
          key === 'partner_drn_id' || key === 'partnerDrnId') {
        const value = obj[key];
        if (typeof value === 'string' && value.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i)) {
          return value;
        }
      }
    }

    for (const value of Object.values(obj)) {
      if (typeof value === 'object' && value !== null) {
        const found = this.findPartnerDrnIdInObject(value, depth + 1);
        if (found) return found;
      }
    }

    return null;
  }

  async getRestaurantReviews(partnerDrnId, retryCount = 0, bypassCircuitBreaker = false) {
    const { RESTAURANT_REVIEWS_QUERY } = require('./deliverooGraphQLReviewsQuery');
    
    const trackingUUID = this.generateUUID();
    
    const variables = {
      options: {
        partner_drn_id: partnerDrnId,
        pagination: {
          limit: 10,
          offset: 0
        },
        params: []
      },
      trackingUUID: trackingUUID,
      include_token: false
    };

    try {
      console.log('Tentative récupération avis pour partner_drn_id: ' + partnerDrnId + ' (tentative ' + retryCount + 1 + ')');
      console.log('Format: ' + partnerDrnId.includes('-') ? ' UUID' : ' Nombre (peut ne pas fonctionner)' + '');
      
      if (retryCount > 0) {
        const delay = Math.min(2000 * Math.pow(2, retryCount - 1), 20000);
        console.log('Attente ' + delay + 'ms avant de réessayer (backoff exponentiel)...');
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      let result;
      if (bypassCircuitBreaker) {
        console.log('️ Contournement du circuit breaker pour récupérer les avis');
        result = await this.queryDirect(RESTAURANT_REVIEWS_QUERY, variables);
      } else {
        result = await this.query(RESTAURANT_REVIEWS_QUERY, variables);
      }
      
      if (!result?.reviewData?.layouts || result.reviewData.layouts.length === 0) {
        console.log('Reponse GraphQL recue (vide):', JSON.stringify(result, null, 2).substring(0, 500));
      }
      
      const reviews = this.parseReviewsFromResponse(result);
      console.log('' + reviews.length + ' avis extraits pour partner_drn_id ' + partnerDrnId + '');
      return reviews;
    } catch (error) {
      const errorMessage = error.message || '';
      
      if ((errorMessage.includes('Veuillez réessayer') || errorMessage.includes('try again') || errorMessage.includes('Rate limiting')) && retryCount < 5) {
        console.log('Rate limiting détecté - Réessai avec backoff exponentiel... (' + retryCount + 1 + '/5)');
        this.lastRateLimitError = Date.now();
        return this.getRestaurantReviews(partnerDrnId, retryCount + 1, bypassCircuitBreaker);
      } else if (retryCount >= 5) {
        console.log('Rate limiting persistant après 5 tentatives - Abandon');
        this.lastRateLimitError = Date.now();
        return [];
      }
      
      console.error('Erreur recuperation avis pour partner_drn_id ' + partnerDrnId + ':', errorMessage);
      if (error.response) {
        console.error('Details de l erreur:', JSON.stringify(error.response.data, null, 2).substring(0, 500));
      }
      return [];
    }
  }

  async queryDirect(graphQLQuery, variables = {}) {
    const url = DELIVEROO_GRAPHQL_URL;
    try {
      const response = await axios.post(
        url,
        {
          query: graphQLQuery,
          variables: variables
        },
        {
          headers: this.headers,
          timeout: 10000,
          validateStatus: function (status) {
            return status < 500;
          }
        }
      );

      if (typeof response.data === 'string' && 
          (response.data.includes('Cloudflare') || 
           response.data.includes('Just a moment') ||
           response.data.includes('Checking your browser'))) {
        const error = new Error('Blocked by Cloudflare - Cookie expired');
        error.response = { status: 403, data: response.data };
        throw error;
      }

      if (response.data.errors) {
        throw new Error('GraphQL Error: ' + JSON.stringify(response.data.errors));
      }

      if (!response.data.data) {
        throw new Error('Invalid GraphQL response: missing data field');
      }

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  parseReviewsFromResponse(graphQLResponse) {
    const reviews = [];
    
    console.log('Parsing de la réponse GraphQL...');
    console.log('Structure recue:', {
      hasReviewData: !!graphQLResponse?.reviewData,
      hasLayouts: !!graphQLResponse?.reviewData?.layouts,
      layoutsCount: graphQLResponse?.reviewData?.layouts?.length || 0
    });
    
    if (!graphQLResponse?.reviewData?.layouts) {
      console.log('️ Pas de layouts dans la réponse');
      return reviews;
    }

    for (const layout of graphQLResponse.reviewData.layouts) {
      console.log('Layout trouvé: ' + layout.typeName + '');
      
      if (layout.typeName === 'PartnerReviewsLayout' && layout.reviews) {
        console.log('PartnerReviewsLayout trouvé avec ' + layout.reviews.length + ' avis');
        
        for (const review of layout.reviews) {
          const rating = review.starRating?.appliedStars || review.starRating?.totalStars || 0;
          const comment = review.textComment || '';
          const date = review.date || '';
          const author = review.reviewer?.displayName || review.reviewer?.username || 'Anonyme';
          
          console.log('Avis extrait:', { id: review.id, rating, author: author.substring(0, 20) });
          
          reviews.push({
            id: review.id || 'review-' + reviews.length,
            rating: rating,
            comment: comment,
            date: date,
            author: author
          });
        }
      }
    }

    console.log('Total de ' + reviews.length + ' avis parsés');
    return reviews;
  }
}

module.exports = new DeliverooGraphQL();
