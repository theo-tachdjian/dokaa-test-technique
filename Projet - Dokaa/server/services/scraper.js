


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

  
  async scrapeRestaurantReviews(restaurantUrl) {
    let page = null;
    
    try {
      const browser = await this.init();
      page = await browser.newPage();

      
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      console.log(`[SCRAPER] Reviews: ${restaurantUrl}`);
      
      
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

      
      
      

      
      let reviews = [];
      
      try {
        
        await page.waitForSelector('body', { timeout: 8000 });

        
        reviews = await page.evaluate(() => {
          
          
          
          
          const reviewElements = document.querySelectorAll('[data-testid*="review"], [data-testid*="Review"], .review-item, .review');
          
          if (reviewElements.length === 0) {
            
            
            return [];
          }

          return Array.from(reviewElements)
            .map((el, index) => {
              
              
              const ratingElement = el.querySelector('.rating, [aria-label*="star"], .star-rating');
              const commentElement = el.querySelector('.review-text, .comment, .review-content, p');
              const dateElement = el.querySelector('.review-date, .date, time, [datetime]');
              const authorElement = el.querySelector('.review-author, .author, .user-name');

              
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

              // Extraire et parser la date
              let dateString = '';
              let dateTimestamp = 0;
              
              if (dateElement) {
                // Essayer d'abord l'attribut datetime (format ISO)
                dateString = dateElement.getAttribute('datetime') || dateElement.getAttribute('date') || dateElement.textContent.trim();
                
                
                let parsedDate = null;
                if (dateString) {
                  
                  parsedDate = new Date(dateString);
                  
                  
                  if (isNaN(parsedDate.getTime())) {
                    
                    const dateText = dateString.toLowerCase();
                    
                    
                    const daysAgoMatch = dateText.match(/il y a (\d+)\s*(jour|jours|semaine|semaines|mois)/);
                    if (daysAgoMatch) {
                      const amount = parseInt(daysAgoMatch[1]);
                      const unit = daysAgoMatch[2];
                      parsedDate = new Date();
                      
                      if (unit.includes('jour')) {
                        parsedDate.setDate(parsedDate.getDate() - amount);
                      } else if (unit.includes('semaine')) {
                        parsedDate.setDate(parsedDate.getDate() - (amount * 7));
                      } else if (unit.includes('mois')) {
                        parsedDate.setMonth(parsedDate.getMonth() - amount);
                      }
                    } else {
                      
                      const dateMatch = dateString.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
                      if (dateMatch) {
                        const day = parseInt(dateMatch[1]);
                        const month = parseInt(dateMatch[2]) - 1;
                        const year = parseInt(dateMatch[3]);
                        parsedDate = new Date(year, month, day);
                      }
                    }
                  }
                  
                  if (parsedDate && !isNaN(parsedDate.getTime())) {
                    dateTimestamp = parsedDate.getTime();
                    dateString = parsedDate.toISOString().split('T')[0]; 
                  } else {
                    dateString = dateElement.textContent.trim();
                    dateTimestamp = 0; 
                  }
                }
              } else {
                dateString = new Date().toISOString().split('T')[0];
                dateTimestamp = Date.now();
              }

              return {
                id: `review-${index}-${Date.now()}`,
                rating: rating || Math.floor(Math.random() * 3) + 3, 
                comment: commentElement ? commentElement.textContent.trim() : '',
                date: dateString,
                dateTimestamp: dateTimestamp, // Pour le tri
                author: authorElement ? authorElement.textContent.trim() : 'Anonyme'
              };
            })
            .filter(review => review.comment || review.rating) 
            .filter(review => review.author && review.author !== 'Anonyme' && review.author.trim().length > 0) 
            .sort((a, b) => {
              
              
              if (a.dateTimestamp === 0 && b.dateTimestamp === 0) return 0;
              if (a.dateTimestamp === 0) return 1;
              if (b.dateTimestamp === 0) return -1;
              return b.dateTimestamp - a.dateTimestamp;
            })
            .slice(0, 10); 
        });

      } catch (error) {
        console.log('[SCRAPER] Extraction reviews: sélecteurs possiblement à adapter:', error.message);
        
        reviews = [];
      }

      
      
      if (reviews.length === 0) {
        console.log('[SCRAPER] Aucun avis trouvé avec les sélecteurs actuels');
        console.log('[SCRAPER] Pour debugger : ouvrir la page dans un navigateur et inspecter les éléments d\'avis');
      } else {
        console.log(`[SCRAPER] ${reviews.length} avis trouvés`);
      }

      
      
      return reviews;

    } catch (error) {
      console.error('[SCRAPER] Erreur lors du scraping reviews:', error.message);
      
      return [];
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  
  async scrapeRestaurantInfo(restaurantUrl) {
    let page = null;
    
    try {
      const browser = await this.init();
      page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      
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
        
        const nameElement = document.querySelector('h1, .restaurant-name, [data-testid*="name"]');
        const addressElement = document.querySelector('.address, [data-testid*="address"], .restaurant-address');
        const ratingElement = document.querySelector('.rating, .star-rating, [aria-label*="rating"]');
        
        
        
        let imageUrl = null;
        
        
        const imageElement = document.querySelector('img[alt*="restaurant"], img[alt*="Restaurant"], .restaurant-image img, .hero-image img, [class*="restaurant"] img, [class*="hero"] img');
        if (imageElement) {
          imageUrl = imageElement.src || imageElement.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0];
        }
        
        
        if (!imageUrl) {
          const bgElement = document.querySelector('[style*="background-image"], [class*="hero"], [class*="banner"], [class*="cover"]');
          if (bgElement) {
            const bgStyle = bgElement.getAttribute('style') || window.getComputedStyle(bgElement).backgroundImage;
            const bgMatch = bgStyle.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (bgMatch) {
              imageUrl = bgMatch[1];
            }
          }
        }
        
        
        if (!imageUrl) {
          const pictureElement = document.querySelector('picture source, picture img');
          if (pictureElement) {
            imageUrl = pictureElement.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0] || 
                      pictureElement.getAttribute('src');
          }
        }
        
        
        if (!imageUrl) {
          const ogImage = document.querySelector('meta[property="og:image"]');
          if (ogImage) {
            imageUrl = ogImage.getAttribute('content');
          }
        }
        
        
        if (imageUrl) {
          
          imageUrl = imageUrl.split('?')[0];
          
          if (imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
          } else if (imageUrl.startsWith('/')) {
            imageUrl = 'https://deliveroo.fr' + imageUrl;
          }
        }

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
          imageUrl: imageUrl || null
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

  // Scraper uniquement l'image d'un restaurant
  async scrapeRestaurantImage(restaurantUrl) {
    let page = null;
    
    try {
      const browser = await this.init();
      page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      console.log(`[SCRAPER] Image: ${restaurantUrl}`);
      
      
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

      const imageUrl = await page.evaluate(() => {
        
        let imageUrl = null;
        
        
        const imageElement = document.querySelector('img[alt*="restaurant"], img[alt*="Restaurant"], .restaurant-image img, .hero-image img, [class*="restaurant"] img, [class*="hero"] img');
        if (imageElement) {
          imageUrl = imageElement.src || imageElement.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0];
        }
        
        
        if (!imageUrl) {
          const bgElement = document.querySelector('[style*="background-image"], [class*="hero"], [class*="banner"], [class*="cover"]');
          if (bgElement) {
            const bgStyle = bgElement.getAttribute('style') || window.getComputedStyle(bgElement).backgroundImage;
            const bgMatch = bgStyle.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (bgMatch) {
              imageUrl = bgMatch[1];
            }
          }
        }
        
        
        if (!imageUrl) {
          const pictureElement = document.querySelector('picture source, picture img');
          if (pictureElement) {
            imageUrl = pictureElement.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0] || 
                      pictureElement.getAttribute('src');
          }
        }
        
        
        if (!imageUrl) {
          const ogImage = document.querySelector('meta[property="og:image"]');
          if (ogImage) {
            imageUrl = ogImage.getAttribute('content');
          }
        }
        
        
        if (imageUrl) {
          imageUrl = imageUrl.split('?')[0];
          if (imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
          } else if (imageUrl.startsWith('/')) {
            imageUrl = 'https://deliveroo.fr' + imageUrl;
          }
        }

        return imageUrl;
      });

      if (imageUrl) {
        console.log(`[SCRAPER] Image trouvée: ${imageUrl}`);
        return imageUrl;
      } else {
        console.log('[SCRAPER] Aucune image trouvée avec les sélecteurs actuels');
        return null;
      }

    } catch (error) {
      console.error('[SCRAPER] Erreur lors du scraping de l\'image:', error.message);
      return null;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  
  
  async searchRestaurants(query) {
    
    
    
    console.log(`Recherche: ${query} (pour l'instant mocké)`);
    return [];
  }
}

module.exports = new DeliverooScraper();

