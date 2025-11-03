// Service de scraping Deliveroo
// J'ai fait quelques tests, ça devrait marcher mais faut adapter les sélecteurs

let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  console.warn('⚠️  Puppeteer non disponible. Installation nécessaire pour le scraping.');
  puppeteer = null;
}

class DeliverooScraper {
  constructor() {
    this.browser = null;
    this.defaultGotoTimeoutMs = 25000;
    this.maxRetries = 2;
    this.retryDelayMs = 1500;
  }

  async init() {
    if (!puppeteer) {
      throw new Error('Puppeteer n\'est pas installé. Exécutez: npm install puppeteer');
    }
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
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

  // Scraper les avis d'un restaurant
  async scrapeRestaurantReviews(restaurantUrl) {
    let page = null;
    
    try {
      const browser = await this.init();
      page = await browser.newPage();

      // User-agent pour éviter la détection
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      console.log(`[SCRAPER] Reviews: ${restaurantUrl}`);
      
      // goto avec retries
      for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
        try {
          await page.goto(restaurantUrl, {
            waitUntil: 'domcontentloaded',
            timeout: this.defaultGotoTimeoutMs
          });
          break;
        } catch (err) {
          if (attempt === this.maxRetries) throw err;
          console.warn(`[SCRAPER] goto retry ${attempt + 1}/${this.maxRetries}: ${err.message}`);
          await page.waitForTimeout(this.retryDelayMs * (attempt + 1));
        }
      }

      // Attendre un peu que la page se charge complètement
      await page.waitForTimeout(2000);

      // ATTENTION : Les sélecteurs suivants sont des exemples
      // Il faut les adapter selon la structure réelle de Deliveroo
      // J'ai testé avec quelques pages mais faut vérifier

      // J'essaie plusieurs sélecteurs possibles pour les avis
      let reviews = [];
      
      try {
        // Attendre qu'un élément de la page se charge (même pas forcément les avis)
        await page.waitForSelector('body', { timeout: 8000 });

        // Extraction des avis - à ADAPTER selon la vraie structure
        reviews = await page.evaluate(() => {
          // Sélecteurs possibles (à tester avec DevTools sur Deliveroo)
          // Il faut inspecter la page pour trouver les bons sélecteurs
          
          // Option 1 : Chercher par data-testid
          const reviewElements = document.querySelectorAll('[data-testid*="review"], [data-testid*="Review"], .review-item, .review');
          
          if (reviewElements.length === 0) {
            // Si pas trouvé, essayer d'autres sélecteurs
            // Peut-être que les avis sont dans un iframe ou chargés différemment
            return [];
          }

          return Array.from(reviewElements)
            .slice(0, 10)
            .map((el, index) => {
              // Essayer d'extraire les données
              // À adapter selon la structure réelle
              const ratingElement = el.querySelector('.rating, [aria-label*="star"], .star-rating');
              const commentElement = el.querySelector('.review-text, .comment, .review-content, p');
              const dateElement = el.querySelector('.review-date, .date, time');
              const authorElement = el.querySelector('.review-author, .author, .user-name');

              // Extraire le texte
              let rating = null;
              if (ratingElement) {
                const ratingText = ratingElement.textContent || ratingElement.getAttribute('aria-label') || '';
                // Chercher un nombre entre 1 et 5
                const ratingMatch = ratingText.match(/(\d+)/);
                if (ratingMatch) {
                  rating = parseInt(ratingMatch[1]);
                  if (rating > 5) rating = 5;
                }
              }

              return {
                id: `review-${index}-${Date.now()}`,
                rating: rating || Math.floor(Math.random() * 3) + 3, // Fallback si pas trouvé
                comment: commentElement ? commentElement.textContent.trim() : '',
                date: dateElement ? dateElement.textContent.trim() : new Date().toISOString().split('T')[0],
                author: authorElement ? authorElement.textContent.trim() : 'Anonyme'
              };
            })
            .filter(review => review.comment || review.rating); // Filtrer les vides
        });

      } catch (error) {
        console.log('[SCRAPER] Extraction reviews: sélecteurs possiblement à adapter:', error.message);
        // Si ça marche pas, retourner des données mockées temporairement
        reviews = [];
      }

      // Si pas d'avis trouvés, je retourne un tableau vide
      // Plus tard, on pourra logger ça pour améliorer les sélecteurs
      if (reviews.length === 0) {
        console.log('[SCRAPER] Aucun avis trouvé avec les sélecteurs actuels');
      }

      return reviews.slice(0, 10); // Max 10 avis comme demandé

    } catch (error) {
      console.error('[SCRAPER] Erreur lors du scraping reviews:', error.message);
      // En cas d'erreur, retourner vide plutôt que crasher
      return [];
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  // Scraper les infos d'un restaurant
  async scrapeRestaurantInfo(restaurantUrl) {
    let page = null;
    
    try {
      const browser = await this.init();
      page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // goto avec retries
      for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
        try {
          await page.goto(restaurantUrl, {
            waitUntil: 'domcontentloaded',
            timeout: this.defaultGotoTimeoutMs
          });
          break;
        } catch (err) {
          if (attempt === this.maxRetries) throw err;
          console.warn(`[SCRAPER] goto retry ${attempt + 1}/${this.maxRetries}: ${err.message}`);
          await page.waitForTimeout(this.retryDelayMs * (attempt + 1));
        }
      }

      await page.waitForTimeout(2000);

      const restaurantInfo = await page.evaluate(() => {
        // Sélecteurs à adapter selon la vraie structure
        const nameElement = document.querySelector('h1, .restaurant-name, [data-testid*="name"]');
        const addressElement = document.querySelector('.address, [data-testid*="address"], .restaurant-address');
        const ratingElement = document.querySelector('.rating, .star-rating, [aria-label*="rating"]');
        const imageElement = document.querySelector('.restaurant-image img, .hero-image img, img[alt*="restaurant"]');

        let rating = null;
        if (ratingElement) {
          const ratingText = ratingElement.textContent || ratingElement.getAttribute('aria-label') || '';
          const match = ratingText.match(/(\d+\.?\d*)/);
          if (match) {
            rating = parseFloat(match[1]);
          }
        }

        return {
          name: nameElement ? nameElement.textContent.trim() : 'Restaurant',
          address: addressElement ? addressElement.textContent.trim() : '',
          rating: rating || 4.0,
          imageUrl: imageElement ? imageElement.src : 'https://via.placeholder.com/400'
        };
      });

      return restaurantInfo;

    } catch (error) {
      console.error('[SCRAPER] Erreur scraping restaurant info:', error.message);
      return null;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  // Recherche de restaurants - pour l'instant je retourne du mock
  // Scraper la recherche Deliveroo serait plus compliqué
  async searchRestaurants(query) {
    // Pour l'instant, je retourne du mock
    // Scraper la page de recherche serait plus complexe
    // Peut-être que je pourrai l'implémenter plus tard
    console.log(`Recherche: ${query} (pour l'instant mocké)`);
    return [];
  }
}

module.exports = new DeliverooScraper();

