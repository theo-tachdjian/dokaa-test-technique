// Intercepteur réseau pour récupérer les avis Google Maps depuis les appels API
// Plus fiable que le scraping HTML car on récupère directement les données JSON

let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  puppeteer = null;
}

class GoogleMapsNetworkInterceptor {
  constructor() {
    this.browser = null;
    this.defaultGotoTimeoutMs = 45000;
  }

  async init() {
    if (!puppeteer) {
      throw new Error('Puppeteer n\'est pas installé');
    }
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--disable-dev-shm-usage'
        ]
      });
    }
    return this.browser;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // Intercepter les appels réseau pour récupérer les avis en JSON
  async interceptReviews(restaurantName, city) {
    let page = null;
    
    try {
      const browser = await this.init();
      page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
        window.chrome = { runtime: {} };
      });

      // Intercepter les requêtes réseau
      const reviewsData = [];
      const interceptor = this; // Garder référence à l'instance
      
      page.on('response', async (response) => {
        const url = response.url();
        
        // Google Maps utilise plusieurs endpoints pour les avis
        if (url.includes('reviews') || url.includes('review') || url.includes('places') || url.includes('data')) {
          try {
            const contentType = response.headers()['content-type'] || '';
            
            if (contentType.includes('json') || url.includes('.json') || url.includes('data=')) {
              const text = await response.text();
              
              // Essayer de parser le JSON
              try {
                const json = JSON.parse(text);
                
                // Chercher les avis dans la structure JSON
                const reviews = interceptor.extractReviewsFromJSON(json);
                if (reviews && reviews.length > 0) {
                  reviewsData.push(...reviews);
                }
              } catch (e) {
                // Pas du JSON valide, essayer d'extraire depuis le texte
                const reviews = interceptor.extractReviewsFromText(text);
                if (reviews && reviews.length > 0) {
                  reviewsData.push(...reviews);
                }
              }
            }
          } catch (error) {
            // Ignorer les erreurs de parsing
          }
        }
      });

      console.log(`[GOOGLE MAPS API] Recherche: ${restaurantName} ${city}`);
      
      const searchQuery = encodeURIComponent(`${restaurantName} ${city} France`);
      const searchUrl = `https://www.google.com/maps/search/${searchQuery}`;
      
      await page.goto(searchUrl, {
        waitUntil: 'networkidle2',
        timeout: this.defaultGotoTimeoutMs
      });

      await page.waitForTimeout(3000);

      // Cliquer sur le premier résultat
      await page.evaluate(() => {
        const firstLink = document.querySelector('a[href*="/maps/place/"]');
        if (firstLink) firstLink.click();
      });

      await page.waitForTimeout(5000);

      // Essayer de cliquer sur "Avis" pour déclencher le chargement
      await page.evaluate(() => {
        const reviewsButton = Array.from(document.querySelectorAll('button, a, div[role="button"]')).find(el => {
          const text = el.textContent.toLowerCase();
          return (text.includes('avis') || text.includes('review')) && (text.match(/\d+/) || text.includes('étoile'));
        });
        if (reviewsButton) {
          reviewsButton.click();
        }
      });

      // Attendre que les requêtes réseau se chargent
      await page.waitForTimeout(8000);

      // Si on a récupéré des avis via l'interception réseau, les retourner
      if (reviewsData.length > 0) {
        console.log(`[GOOGLE MAPS API] ✓ ${reviewsData.length} avis récupérés depuis les appels API`);
        return reviewsData.slice(0, 10);
      }

      // Fallback : essayer d'extraire depuis le DOM avec des sélecteurs plus précis
      const domReviews = await page.evaluate(() => {
        const reviews = [];
        
        // Chercher les vrais containers d'avis Google Maps
        // Les avis sont souvent dans des divs avec des classes spécifiques
        const reviewContainers = document.querySelectorAll(
          '[data-review-id], ' +
          '[jsaction*="review"], ' +
          '.jftiEf, ' +
          '.MyEned, ' +
          '.wiI7pd, ' +
          '[class*="review-text"], ' +
          '[class*="reviewContent"]'
        );
        
        reviewContainers.forEach((container, idx) => {
          if (idx >= 10) return;
          
          // Chercher le texte de l'avis - plusieurs méthodes
          let comment = '';
          
          // Méthode 1 : Chercher dans les spans avec classe spécifique
          const textEl = container.querySelector('.wiI7pd, .MyEned, [class*="text"], [class*="comment"]');
          if (textEl) {
            comment = textEl.textContent.trim();
          } else {
            // Méthode 2 : Prendre tout le texte mais filtrer
            const allText = container.textContent;
            // Extraire seulement les phrases qui ressemblent à des avis
            const sentences = allText.split(/[.!?]/).filter(s => {
              const sLower = s.toLowerCase().trim();
              return sLower.length > 20 && 
                     !sLower.includes('cookie') && 
                     !sLower.includes('confidentialité') &&
                     !sLower.includes('function') &&
                     (sLower.includes('restaurant') || 
                      sLower.includes('plat') || 
                      sLower.includes('service') ||
                      sLower.includes('bon') ||
                      sLower.includes('excellent') ||
                      sLower.includes('délicieux'));
            });
            comment = sentences.join('. ');
          }
          
          // Nettoyer le commentaire
          comment = comment.replace(/\s+/g, ' ').trim();
          
          // Ignorer si c'est du code ou du texte non pertinent
          if (comment.length < 20 || 
              comment.includes('function') || 
              comment.includes('cookie') ||
              comment.includes('data-') ||
              comment.match(/^[a-z_]+$/i)) {
            return;
          }
          
          // Extraire la note
          const ratingEl = container.querySelector('[aria-label*="star"], [aria-label*="étoile"], [class*="rating"]');
          let rating = 4;
          if (ratingEl) {
            const ariaLabel = ratingEl.getAttribute('aria-label') || '';
            const match = ariaLabel.match(/(\d+)/);
            if (match) rating = parseInt(match[1]);
          }
          
          // Extraire l'auteur
          const authorEl = container.querySelector('[class*="author"], [class*="name"], .d4r55');
          const author = authorEl ? authorEl.textContent.trim() : `Client ${idx + 1}`;
          
          // Extraire la date
          const dateEl = container.querySelector('span[class*="date"], time, [class*="date"]');
          let date = new Date().toISOString().split('T')[0];
          if (dateEl) {
            const dateText = dateEl.textContent || dateEl.getAttribute('datetime');
            if (dateText) {
              const parsed = new Date(dateText);
              if (!isNaN(parsed.getTime())) date = parsed.toISOString().split('T')[0];
            }
          }
          
          if (comment && comment.length > 20) {
            reviews.push({
              id: `google-dom-${idx}-${Date.now()}`,
              rating: rating,
              comment: comment.substring(0, 500),
              date: date,
              author: author,
              source: 'google'
            });
          }
        });
        
        return reviews;
      });

      if (domReviews && domReviews.length > 0) {
        console.log(`[GOOGLE MAPS DOM] ✓ ${domReviews.length} avis extraits depuis le DOM`);
        return domReviews;
      }

    } catch (error) {
      console.error(`[GOOGLE MAPS API] Erreur:`, error.message);
    } finally {
      if (page) await page.close();
    }
    
    return [];
  }

  // Extraire les avis depuis une structure JSON
  extractReviewsFromJSON(json) {
    const reviews = [];
    
    // Parcourir récursivement la structure JSON pour trouver les avis
    const findReviews = (obj, path = '') => {
      if (!obj || typeof obj !== 'object') return;
      
      // Chercher des patterns typiques d'avis
      if (obj.text || obj.comment || obj.reviewText || obj.description) {
        const text = obj.text || obj.comment || obj.reviewText || obj.description;
        if (text && typeof text === 'string' && text.length > 20) {
          reviews.push({
            id: `google-json-${reviews.length}-${Date.now()}`,
            rating: obj.rating || obj.starRating || obj.ratingValue || 4,
            comment: text.substring(0, 500),
            date: obj.date || obj.reviewDate || new Date().toISOString().split('T')[0],
            author: obj.authorName || obj.author || obj.reviewer || `Client ${reviews.length + 1}`,
            source: 'google'
          });
        }
      }
      
      // Parcourir les propriétés
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          findReviews(obj[key], `${path}.${key}`);
        }
      }
    };
    
    findReviews(json);
    return reviews.slice(0, 10);
  }

  // Extraire les avis depuis du texte brut
  extractReviewsFromText(text) {
    const reviews = [];
    
    // Chercher des patterns JSON dans le texte
    const jsonMatches = text.match(/\{[^{}]*"(?:text|comment|reviewText|description)"[^{}]*\}/g);
    if (jsonMatches) {
      jsonMatches.forEach(match => {
        try {
          const json = JSON.parse(match);
          const review = this.extractReviewsFromJSON(json);
          if (review && review.length > 0) {
            reviews.push(...review);
          }
        } catch (e) {
          // Ignorer
        }
      });
    }
    
    return reviews;
  }
}

// Instance singleton
const interceptor = new GoogleMapsNetworkInterceptor();

module.exports = interceptor;

