


let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  console.warn('⚠️  Puppeteer non disponible. Installation nécessaire pour le scraping.');
  puppeteer = null;
}

class TripAdvisorScraper {
  constructor() {
    this.browser = null;
    this.defaultGotoTimeoutMs = 30000;
    this.maxRetries = 2;
    this.retryDelayMs = 2000;
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

  
  async searchRestaurantAddress(restaurantName, city) {
    let page = null;
    
    try {
      const browser = await this.init();
      page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      console.log(`[TRIPADVISOR] Recherche adresse: ${restaurantName} à ${city}`);
      
      
      const searchQuery = encodeURIComponent(`${restaurantName} ${city}`);
      const searchUrl = `https://www.tripadvisor.fr/Search?q=${searchQuery}&geo=187147&ssrc=A`;
      
      
      for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
        try {
          await page.goto(searchUrl, {
            waitUntil: 'domcontentloaded',
            timeout: this.defaultGotoTimeoutMs
          });
          break;
        } catch (err) {
          if (attempt === this.maxRetries) throw err;
          console.warn(`[TRIPADVISOR] goto retry ${attempt + 1}/${this.maxRetries}: ${err.message}`);
          await page.waitForTimeout(this.retryDelayMs * (attempt + 1));
        }
      }

      await page.waitForTimeout(3000);

      
      const result = await page.evaluate(() => {
        
        const firstResult = document.querySelector('[data-test-target="restaurant-card"] a, .result-card a, .listing_title a');
        
        if (!firstResult) {
          return null;
        }

        
        const href = firstResult.getAttribute('href');
        return {
          url: href ? (href.startsWith('http') ? href : `https://www.tripadvisor.fr${href}`) : null,
          name: firstResult.textContent?.trim() || null
        };
      });

      if (!result || !result.url) {
        console.log('[TRIPADVISOR] Aucun résultat trouvé pour la recherche');
        return null;
      }

      
      console.log(`[TRIPADVISOR] Accès à la page restaurant: ${result.url}`);
      
      await page.goto(result.url, {
        waitUntil: 'domcontentloaded',
        timeout: this.defaultGotoTimeoutMs
      });

      await page.waitForTimeout(2000);

      const restaurantInfo = await page.evaluate(() => {
      
      let address = null;
      
      
      const addressElement1 = document.querySelector('[data-test-target="address"]');
      if (addressElement1) {
        const addressLink = addressElement1.querySelector('a');
        address = addressLink ? addressLink.textContent.trim() : addressElement1.textContent.trim();
      }
      
      
      if (!address) {
        const addressElement2 = document.querySelector('.address a, .restaurantAddress, .restaurantDetails .address');
        if (addressElement2) {
          address = addressElement2.textContent.trim();
        }
      }
      
      
      if (!address) {
        const allLinks = document.querySelectorAll('a[href*="maps.google"], a[href*="maps"]');
        for (const link of allLinks) {
          const text = link.textContent.trim();
          if (text && text.match(/\d+.*(rue|avenue|boulevard|place)/i)) {
            address = text;
            break;
          }
        }
      }
      
      
      let rating = null;
      const ratingElement = document.querySelector('[data-test-target="reviews-header"] .overallRating, .overallRating, [class*="overallRating"], .rating span');
      if (ratingElement) {
        const ratingText = ratingElement.textContent || ratingElement.getAttribute('aria-label') || '';
        const match = ratingText.match(/(\d+[,\.]\d+)/);
        if (match) {
          rating = parseFloat(match[1].replace(',', '.'));
        } else {
          // Chercher dans les classes (ex: bubble_50 = 5.0)
          const classList = ratingElement.className || '';
          const bubbleMatch = classList.match(/bubble_(\d+)/);
          if (bubbleMatch) {
            rating = parseInt(bubbleMatch[1]) / 10;
          }
        }
      }

        return {
          address: address,
          rating: rating
        };
      });

      if (restaurantInfo.address) {
        console.log(`[TRIPADVISOR] Adresse trouvée: ${restaurantInfo.address}`);
        return restaurantInfo;
      }

      return null;

    } catch (error) {
      console.error('[TRIPADVISOR] Erreur lors de la recherche d\'adresse:', error.message);
      return null;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  // Scraper les 10 avis les plus récents depuis TripAdvisor
  async scrapeRestaurantReviews(restaurantName, city) {
    let page = null;
    
    try {
      const browser = await this.init();
      page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      console.log(`[TRIPADVISOR] Recherche avis: ${restaurantName} à ${city}`);
      
      
      const searchQuery = encodeURIComponent(`${restaurantName} ${city}`);
      const searchUrl = `https://www.tripadvisor.fr/Search?q=${searchQuery}&geo=187147&ssrc=A`;
      
      
      for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
        try {
          await page.goto(searchUrl, {
            waitUntil: 'domcontentloaded',
            timeout: this.defaultGotoTimeoutMs
          });
          break;
        } catch (err) {
          if (attempt === this.maxRetries) throw err;
          console.warn(`[TRIPADVISOR] goto retry ${attempt + 1}/${this.maxRetries}: ${err.message}`);
          await page.waitForTimeout(this.retryDelayMs * (attempt + 1));
        }
      }

      await page.waitForTimeout(3000);

      
      const restaurantUrl = await page.evaluate(() => {
        const firstResult = document.querySelector('[data-test-target="restaurant-card"] a, .result-card a, .listing_title a');
        if (!firstResult) return null;
        const href = firstResult.getAttribute('href');
        return href ? (href.startsWith('http') ? href : `https://www.tripadvisor.fr${href}`) : null;
      });

      if (!restaurantUrl) {
        console.log('[TRIPADVISOR] Aucun restaurant trouvé');
        return [];
      }

      
      const reviewsUrl = restaurantUrl.replace(/\/Restaurant_Review/, '/Restaurant_Review').replace(/\.html$/, '') + '#REVIEWS';
      
      console.log(`[TRIPADVISOR] Accès aux avis: ${reviewsUrl}`);
      
      await page.goto(reviewsUrl, {
        waitUntil: 'domcontentloaded',
        timeout: this.defaultGotoTimeoutMs
      });

      await page.waitForTimeout(5000); 

      
      const reviews = await page.evaluate(async () => {
        
        const moreReviewsButton = document.querySelector('[data-test-target="reviews-tab"] a, .taLnk.ulBlueLinks');
        if (moreReviewsButton) {
          moreReviewsButton.click();
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        
        let reviewElements = document.querySelectorAll('[data-test-target="HR_CC_CARD"]');
        
        if (reviewElements.length === 0) {
          reviewElements = document.querySelectorAll('.review-container');
        }
        
        if (reviewElements.length === 0) {
          reviewElements = document.querySelectorAll('.ui_column.is-9 .review');
        }
        
        if (reviewElements.length === 0) {
          reviewElements = document.querySelectorAll('.prw_rup_prw_reviews_text_summary_hsx');
        }
        
        if (reviewElements.length === 0) {
          
          reviewElements = document.querySelectorAll('[class*="bubble"]').length > 0 
            ? Array.from(document.querySelectorAll('[class*="bubble"]')).map(el => el.closest('.review, .review-container, [class*="review"]'))
              .filter(el => el !== null)
            : [];
        }
        
        if (reviewElements.length === 0) {
          return [];
        }

        return Array.from(reviewElements)
          .slice(0, 10)
          .map((el, index) => {
            
            const ratingElement = el.querySelector('.ui_bubble_rating, [class*="bubble"], [class*="rating"]');
            let rating = null;
            if (ratingElement) {
              const classList = ratingElement.className;
              
              const bubbleMatch = classList.match(/bubble_(\d+)/);
              if (bubbleMatch) {
                rating = parseInt(bubbleMatch[1]) / 10; 
              } else {
                
                const ratingText = ratingElement.textContent || ratingElement.getAttribute('aria-label') || '';
                const match = ratingText.match(/(\d+)/);
                if (match) {
                  rating = parseInt(match[1]);
                  if (rating > 5) rating = rating / 10;
                }
              }
            }

            // Extraire le commentaire - essayer plusieurs sélecteurs
            let comment = '';
            const commentSelectors = [
              '.partial_entry',
              '.reviewText',
              '.prw_reviews_text_summary_hsx',
              '[data-test-target="review-text"]',
              '.reviewText span',
              '.reviewText p',
              '.comment'
            ];
            
            for (const selector of commentSelectors) {
              const commentElement = el.querySelector(selector);
              if (commentElement) {
                comment = commentElement.textContent.trim();
                if (comment.length > 10) break; 
              }
            }

            
            const dateElement = el.querySelector('.ratingDate, .review-date, time');
            let dateString = '';
            let dateTimestamp = 0;
            
            if (dateElement) {
              dateString = dateElement.getAttribute('title') || dateElement.textContent.trim();
              const datetime = dateElement.getAttribute('datetime');
              
              if (datetime) {
                const parsedDate = new Date(datetime);
                if (!isNaN(parsedDate.getTime())) {
                  dateTimestamp = parsedDate.getTime();
                  dateString = parsedDate.toISOString().split('T')[0];
                }
              } else {
                
                const dateText = dateString.toLowerCase();
                const daysAgoMatch = dateText.match(/il y a (\d+)\s*(jour|jours|semaine|semaines|mois)/);
                if (daysAgoMatch) {
                  const amount = parseInt(daysAgoMatch[1]);
                  const unit = daysAgoMatch[2];
                  const parsedDate = new Date();
                  
                  if (unit.includes('jour')) {
                    parsedDate.setDate(parsedDate.getDate() - amount);
                  } else if (unit.includes('semaine')) {
                    parsedDate.setDate(parsedDate.getDate() - (amount * 7));
                  } else if (unit.includes('mois')) {
                    parsedDate.setMonth(parsedDate.getMonth() - amount);
                  }
                  
                  dateTimestamp = parsedDate.getTime();
                  dateString = parsedDate.toISOString().split('T')[0];
                }
              }
            }

            
            let author = 'Anonyme';
            const authorSelectors = [
              '.info_text > div',
              '.username',
              '.memberOverlayLink',
              '[data-test-target="reviewer-name"]',
              '.reviewer-name',
              '.member_info .username'
            ];
            
            for (const selector of authorSelectors) {
              const authorElement = el.querySelector(selector);
              if (authorElement) {
                const authorText = authorElement.textContent.trim();
                if (authorText && authorText.length > 0 && authorText !== 'Anonyme') {
                  author = authorText;
                  break;
                }
              }
            }

            return {
              id: `tripadvisor-${index}-${Date.now()}`,
              rating: rating || 4,
              comment: comment,
              date: dateString || new Date().toISOString().split('T')[0],
              dateTimestamp: dateTimestamp,
              author: author
            };
          })
          .filter(review => review.comment && review.comment.length > 10) 
          .filter(review => review.author && review.author !== 'Anonyme') 
          .sort((a, b) => {
            
            if (a.dateTimestamp === 0 && b.dateTimestamp === 0) return 0;
            if (a.dateTimestamp === 0) return 1;
            if (b.dateTimestamp === 0) return -1;
            return b.dateTimestamp - a.dateTimestamp;
          })
          .slice(0, 10); 
      });

      if (reviews.length > 0) {
        console.log(`[TRIPADVISOR] ${reviews.length} avis trouvés depuis TripAdvisor`);
      } else {
        console.log('[TRIPADVISOR] Aucun avis trouvé avec les sélecteurs actuels');
      }

      return reviews;

    } catch (error) {
      console.error('[TRIPADVISOR] Erreur lors du scraping des avis:', error.message);
      return [];
    } finally {
      if (page) {
        await page.close();
      }
    }
  }
}

module.exports = new TripAdvisorScraper();

