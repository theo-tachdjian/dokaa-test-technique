// Scraper pour récupérer les avis depuis Google Maps (plus fiable que TripAdvisor)
// Google Maps a souvent plus d'avis et est plus accessible

let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  console.warn('⚠️  Puppeteer non disponible. Installation nécessaire pour le scraping.');
  puppeteer = null;
}

class GoogleReviewsScraper {
  constructor() {
    this.browser = null;
    this.defaultGotoTimeoutMs = 30000;
  }

  async init() {
    if (!puppeteer) {
      throw new Error('Puppeteer n\'est pas installé. Exécutez: npm install puppeteer');
    }
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
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

  // Scraper les avis depuis Google Maps
  async scrapeRestaurantReviews(restaurantName, city, address = null) {
    let page = null;
    
    try {
      const browser = await this.init();
      page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Désactiver les détections de bot
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
        });
      });

      console.log(`[GOOGLE REVIEWS] Recherche: ${restaurantName} à ${city}`);
      
      // Construire l'URL de recherche Google Maps
      const searchQuery = encodeURIComponent(`${restaurantName} ${city} France`);
      const searchUrl = `https://www.google.com/maps/search/${searchQuery}`;
      
      await page.goto(searchUrl, {
        waitUntil: 'networkidle0',
        timeout: this.defaultGotoTimeoutMs
      });

      await page.waitForTimeout(3000);

      // Cliquer sur le premier résultat pour ouvrir le panneau latéral
      await page.evaluate(() => {
        const firstResult = document.querySelector('[data-value="Directions"]')?.closest('a') || 
                           document.querySelector('a[href*="/maps/place/"]');
        if (firstResult) {
          firstResult.click();
        }
      });

      await page.waitForTimeout(2000);

      // Scraper les avis
      const reviews = await page.evaluate(() => {
        // Chercher le bouton "Avis" ou "Reviews" et cliquer dessus
        const reviewsButton = Array.from(document.querySelectorAll('button, a')).find(el => {
          const text = el.textContent.toLowerCase();
          return text.includes('avis') || text.includes('review') || text.includes('étoile');
        });

        if (reviewsButton) {
          reviewsButton.click();
        }

        // Attendre un peu pour que les avis se chargent
        return new Promise((resolve) => {
          setTimeout(() => {
            // Sélecteurs pour les avis Google Maps
            const reviewElements = document.querySelectorAll('[data-review-id], .wiI7pd, .MyEned, .review-text');
            
            if (reviewElements.length === 0) {
              // Essayer d'autres sélecteurs
              const altElements = document.querySelectorAll('[class*="review"], [class*="Review"]');
              if (altElements.length > 0) {
                resolve(Array.from(altElements).slice(0, 10).map((el, index) => {
                  const text = el.textContent.trim();
                  const ratingElement = el.querySelector('[aria-label*="star"], [aria-label*="étoile"]');
                  let rating = 5;
                  if (ratingElement) {
                    const ariaLabel = ratingElement.getAttribute('aria-label');
                    const match = ariaLabel.match(/(\d+)/);
                    if (match) {
                      rating = parseInt(match[1]);
                    }
                  }
                  
                  return {
                    id: `google-${index}-${Date.now()}`,
                    rating: rating,
                    comment: text.substring(0, 500),
                    date: new Date().toISOString().split('T')[0],
                    author: `Google User ${index + 1}`
                  };
                }));
                return;
              }
            }

            const reviews = Array.from(reviewElements).slice(0, 10).map((el, index) => {
              // Extraire le commentaire
              const commentElement = el.querySelector('.wiI7pd, .MyEned, .review-text, [class*="text"]');
              const comment = commentElement ? commentElement.textContent.trim() : el.textContent.trim();
              
              // Extraire la note
              const ratingElement = el.querySelector('[aria-label*="star"], [aria-label*="étoile"], [class*="rating"]');
              let rating = 5;
              if (ratingElement) {
                const ariaLabel = ratingElement.getAttribute('aria-label') || '';
                const match = ariaLabel.match(/(\d+)/);
                if (match) {
                  rating = parseInt(match[1]);
                }
              }
              
              // Extraire la date (si disponible)
              const dateElement = el.querySelector('span[class*="date"], time');
              let date = new Date().toISOString().split('T')[0];
              if (dateElement) {
                const dateText = dateElement.textContent || dateElement.getAttribute('datetime');
                if (dateText) {
                  const parsedDate = new Date(dateText);
                  if (!isNaN(parsedDate.getTime())) {
                    date = parsedDate.toISOString().split('T')[0];
                  }
                }
              }

              // Extraire l'auteur
              const authorElement = el.querySelector('[class*="author"], [class*="name"]');
              const author = authorElement ? authorElement.textContent.trim() : `Google User ${index + 1}`;

              return {
                id: `google-${index}-${Date.now()}`,
                rating: rating,
                comment: comment.substring(0, 500),
                date: date,
                author: author
              };
            }).filter(review => review.comment && review.comment.length > 10);

            resolve(reviews);
          }, 3000);
        });
      });

      if (reviews && reviews.length > 0) {
        console.log(`[GOOGLE REVIEWS] ✓ ${reviews.length} avis trouvés`);
        return reviews;
      } else {
        console.log(`[GOOGLE REVIEWS] ⚠ Aucun avis trouvé`);
        return [];
      }

    } catch (error) {
      console.error(`[GOOGLE REVIEWS] Erreur:`, error.message);
      return [];
    } finally {
      if (page) {
        await page.close();
      }
    }
  }
}

// Instance singleton
const scraper = new GoogleReviewsScraper();

module.exports = scraper;

