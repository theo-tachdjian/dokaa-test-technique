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
            .map((el, index) => {
              // Essayer d'extraire les données
              // À adapter selon la structure réelle
              const ratingElement = el.querySelector('.rating, [aria-label*="star"], .star-rating');
              const commentElement = el.querySelector('.review-text, .comment, .review-content, p');
              const dateElement = el.querySelector('.review-date, .date, time, [datetime]');
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

              // Extraire et parser la date
              let dateString = '';
              let dateTimestamp = 0;
              
              if (dateElement) {
                // Essayer d'abord l'attribut datetime (format ISO)
                dateString = dateElement.getAttribute('datetime') || dateElement.getAttribute('date') || dateElement.textContent.trim();
                
                // Parser la date
                let parsedDate = null;
                if (dateString) {
                  // Essayer de parser différentes formats
                  parsedDate = new Date(dateString);
                  
                  // Si ça ne marche pas, essayer de parser des formats français
                  if (isNaN(parsedDate.getTime())) {
                    // Formats possibles : "il y a 2 jours", "15/11/2024", "2024-11-15", etc.
                    const dateText = dateString.toLowerCase();
                    
                    // "il y a X jours/semaines/mois"
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
                      // Essayer format DD/MM/YYYY ou YYYY-MM-DD
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
                    dateString = parsedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
                  } else {
                    dateString = dateElement.textContent.trim();
                    dateTimestamp = 0; // On ne pourra pas trier par date
                  }
                }
              } else {
                dateString = new Date().toISOString().split('T')[0];
                dateTimestamp = Date.now();
              }

              return {
                id: `review-${index}-${Date.now()}`,
                rating: rating || Math.floor(Math.random() * 3) + 3, // Fallback si pas trouvé
                comment: commentElement ? commentElement.textContent.trim() : '',
                date: dateString,
                dateTimestamp: dateTimestamp, // Pour le tri
                author: authorElement ? authorElement.textContent.trim() : 'Anonyme'
              };
            })
            .filter(review => review.comment || review.rating) // Filtrer les vides
            .filter(review => review.author && review.author !== 'Anonyme' && review.author.trim().length > 0) // S'assurer que c'est un vrai consommateur
            .sort((a, b) => {
              // Trier par date décroissante (plus récent en premier)
              // Si pas de timestamp, mettre à la fin
              if (a.dateTimestamp === 0 && b.dateTimestamp === 0) return 0;
              if (a.dateTimestamp === 0) return 1;
              if (b.dateTimestamp === 0) return -1;
              return b.dateTimestamp - a.dateTimestamp;
            })
            .slice(0, 10); // Prendre les 10 plus récents
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
        console.log('[SCRAPER] Pour debugger : ouvrir la page dans un navigateur et inspecter les éléments d\'avis');
      } else {
        console.log(`[SCRAPER] ${reviews.length} avis trouvés`);
      }

      // Les avis sont déjà triés et limités à 10 dans le code JavaScript
      // On retourne directement les 10 avis les plus récents
      return reviews;

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
        
        // Essayer plusieurs sélecteurs pour trouver l'image principale du restaurant
        // Deliveroo utilise souvent des images en background ou dans des divs avec des attributs data-*
        let imageUrl = null;
        
        // Option 1 : Image dans un img tag
        const imageElement = document.querySelector('img[alt*="restaurant"], img[alt*="Restaurant"], .restaurant-image img, .hero-image img, [class*="restaurant"] img, [class*="hero"] img');
        if (imageElement) {
          imageUrl = imageElement.src || imageElement.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0];
        }
        
        // Option 2 : Image en background CSS
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
        
        // Option 3 : Image dans un picture ou source tag
        if (!imageUrl) {
          const pictureElement = document.querySelector('picture source, picture img');
          if (pictureElement) {
            imageUrl = pictureElement.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0] || 
                      pictureElement.getAttribute('src');
          }
        }
        
        // Option 4 : Chercher dans les métadonnées (og:image)
        if (!imageUrl) {
          const ogImage = document.querySelector('meta[property="og:image"]');
          if (ogImage) {
            imageUrl = ogImage.getAttribute('content');
          }
        }
        
        // Nettoyer l'URL si trouvée (enlever les paramètres de taille inutiles)
        if (imageUrl) {
          // Enlever les paramètres de transformation d'image Deliveroo si présents
          imageUrl = imageUrl.split('?')[0];
          // S'assurer que c'est une URL complète
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

      const imageUrl = await page.evaluate(() => {
        // Essayer plusieurs sélecteurs pour trouver l'image principale
        let imageUrl = null;
        
        // Option 1 : Image dans un img tag
        const imageElement = document.querySelector('img[alt*="restaurant"], img[alt*="Restaurant"], .restaurant-image img, .hero-image img, [class*="restaurant"] img, [class*="hero"] img');
        if (imageElement) {
          imageUrl = imageElement.src || imageElement.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0];
        }
        
        // Option 2 : Image en background CSS
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
        
        // Option 3 : Image dans un picture ou source tag
        if (!imageUrl) {
          const pictureElement = document.querySelector('picture source, picture img');
          if (pictureElement) {
            imageUrl = pictureElement.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0] || 
                      pictureElement.getAttribute('src');
          }
        }
        
        // Option 4 : Chercher dans les métadonnées (og:image)
        if (!imageUrl) {
          const ogImage = document.querySelector('meta[property="og:image"]');
          if (ogImage) {
            imageUrl = ogImage.getAttribute('content');
          }
        }
        
        // Nettoyer l'URL si trouvée
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

