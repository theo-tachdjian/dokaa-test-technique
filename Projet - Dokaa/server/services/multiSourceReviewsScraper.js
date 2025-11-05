// Scraper multi-sources pour récupérer les VRAIS avis de consommateurs
// Essaie plusieurs sources : Google Maps, Deliveroo, Yelp
// C'est VITAL pour le projet - on doit trouver des vrais avis

const { isValidReview, cleanReview } = require('./reviewValidator');
const { parseReviewsFromHTML } = require('./reviewParser');
const googleMapsNetworkInterceptor = require('./googleMapsNetworkInterceptor');
const directReviewsScraper = require('./directReviewsScraper');

let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  puppeteer = null;
}

class MultiSourceReviewsScraper {
  constructor() {
    this.browser = null;
    this.defaultGotoTimeoutMs = 45000; // Plus de temps
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

  // Source 1 : Google Maps (le plus fiable) - SCRAPING DIRECT ET AGRESSIF
  async scrapeFromGoogleMaps(restaurantName, city, address) {
    // PRIORITÉ : Scraping direct avec mode visible pour vraiment trouver les avis
    try {
      console.log(`\n🎯 [PRIORITÉ] Scraping DIRECT de ${restaurantName}...\n`);
      const directReviews = await directReviewsScraper.scrapeReviews(restaurantName, city);
      if (directReviews && directReviews.length > 0) {
        console.log(`\n✅ ${directReviews.length} AVIS RÉELS RÉCUPÉRÉS VIA SCRAPING DIRECT !\n`);
        return directReviews;
      }
    } catch (error) {
      console.log(`⚠ Scraping direct échoué: ${error.message}`);
    }
    
    // Fallback : interception réseau
    try {
      const apiReviews = await googleMapsNetworkInterceptor.interceptReviews(restaurantName, city);
      if (apiReviews && apiReviews.length > 0) {
        console.log(`[GOOGLE MAPS] ✓ ${apiReviews.length} avis récupérés via interception réseau`);
        return apiReviews;
      }
    } catch (error) {
      console.log(`[GOOGLE MAPS] Interception réseau échouée`);
    }
    
    // Fallback : scraping DOM classique
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

      console.log(`[GOOGLE MAPS] Recherche: ${restaurantName} ${city}`);
      
      const searchQuery = encodeURIComponent(`${restaurantName} ${city} France`);
      const searchUrl = `https://www.google.com/maps/search/${searchQuery}`;
      
      await page.goto(searchUrl, {
        waitUntil: 'networkidle2',
        timeout: this.defaultGotoTimeoutMs
      });

      await page.waitForTimeout(4000);

      // Cliquer sur le premier résultat
      await page.evaluate(() => {
        const firstLink = document.querySelector('a[href*="/maps/place/"]');
        if (firstLink) firstLink.click();
      });

      await page.waitForTimeout(5000); // Plus de temps pour que la page se charge

      // Récupérer le HTML brut de la page
      const pageHTML = await page.content();
      
      // Parser le HTML pour extraire les vrais avis
      const parsedReviews = parseReviewsFromHTML(pageHTML);
      
      if (parsedReviews && parsedReviews.length > 0) {
        console.log(`[GOOGLE MAPS] ✓ ${parsedReviews.length} avis extraits depuis le HTML`);
        return parsedReviews;
      }

      // Méthode de fallback : essayer de scraper directement
      const reviews = await page.evaluate(() => {
        // Chercher et cliquer sur le bouton "Avis" ou section reviews
        const reviewsButton = Array.from(document.querySelectorAll('button, a')).find(el => {
          const text = el.textContent.toLowerCase();
          return (text.includes('avis') || text.includes('review')) && (text.includes('étoile') || text.match(/\d+/));
        });

        if (reviewsButton) {
          reviewsButton.click();
        }

        // Attendre que les avis se chargent
        return new Promise((resolve) => {
          setTimeout(() => {
            let reviews = [];

            // Méthode 1 : Chercher les containers d'avis
            const reviewContainers = document.querySelectorAll('[data-review-id], .jftiEf, .MyEned, .wiI7pd');
            
            if (reviewContainers.length > 0) {
              reviews = Array.from(reviewContainers).slice(0, 10).map((el, idx) => {
                // Extraire le texte du commentaire
                const commentEl = el.querySelector('.wiI7pd, .MyEned, [class*="text"]');
                const comment = commentEl ? commentEl.textContent.trim() : el.textContent.trim();

                // Extraire la note
                const ratingEl = el.querySelector('[aria-label*="star"], [aria-label*="étoile"], [class*="rating"]');
                let rating = 5;
                if (ratingEl) {
                  const ariaLabel = ratingEl.getAttribute('aria-label') || '';
                  const match = ariaLabel.match(/(\d+)/);
                  if (match) rating = parseInt(match[1]);
                }

                // Extraire l'auteur
                const authorEl = el.querySelector('[class*="author"], [class*="name"], .d4r55');
                const author = authorEl ? authorEl.textContent.trim() : `Google User ${idx + 1}`;

                // Extraire la date
                const dateEl = el.querySelector('span[class*="date"], time');
                let date = new Date().toISOString().split('T')[0];
                if (dateEl) {
                  const dateText = dateEl.textContent || dateEl.getAttribute('datetime');
                  if (dateText) {
                    const parsed = new Date(dateText);
                    if (!isNaN(parsed.getTime())) date = parsed.toISOString().split('T')[0];
                  }
                }

                  const cleanedComment = comment.replace(/\s+/g, ' ').trim();
                  
                  return {
                    id: `google-${idx}-${Date.now()}`,
                    rating: rating,
                    comment: cleanedComment.substring(0, 500),
                    date: date,
                    author: author,
                    source: 'google'
                  };
                }).filter(r => {
                  // Utiliser le validateur pour s'assurer que c'est un vrai avis
                  return isValidReview(r.comment);
                }).map(r => {
                  // Nettoyer le commentaire
                  r.comment = cleanReview(r.comment);
                  return r;
                });
            }

            // FILTRER les avis pour ne garder que les vrais avis de consommateurs
            reviews = reviews.filter(review => {
              const comment = review.comment.toLowerCase();
              
              // Exclure les textes qui ne sont PAS des avis
              const excludePatterns = [
                'cookie', 'cookies', 'confidentialité', 'privacy', 'politique',
                'conditions', 'données', 'paramètres', 'settings',
                'accepter', 'refuser', 'tout refuser', 'tout accepter',
                'function', 'var ', 'window', 'document', 'script',
                'javascript', 'attribute', 'data-noaft', 'visible',
                'use strict', 'cliquez', 'click', 'consulter',
                'page g', 'plus d\'options', 'gérer', 'manage'
              ];
              
              // Si le commentaire contient un de ces mots, ce n'est pas un avis
              for (const pattern of excludePatterns) {
                if (comment.includes(pattern)) {
                  return false;
                }
              }
              
              // Vérifier que c'est un vrai avis (doit contenir des mots liés à la restauration)
              const restaurantWords = [
                'restaurant', 'plat', 'repas', 'manger', 'délicieux',
                'bon', 'excellent', 'service', 'cuisine', 'goût',
                'qualité', 'recommand', 'reviendrai', 'satisfait',
                'personnel', 'ambiance', 'prix', 'commande', 'livraison'
              ];
              
              // Si ça ressemble à un avis (contient des mots de restauration OU fait plus de 30 caractères avec ponctuation)
              const hasRestaurantWords = restaurantWords.some(word => comment.includes(word));
              const looksLikeReview = comment.length > 30 && (comment.includes('.') || comment.includes('!') || comment.includes('?'));
              
              return hasRestaurantWords || looksLikeReview;
            });

            resolve(reviews);
          }, 5000);
        });
      });

      // Si on a des avis parsés, les utiliser
      if (parsedReviews && parsedReviews.length > 0) {
        return parsedReviews;
      }
      
      // Sinon, utiliser les avis scrappés directement
      if (reviews && reviews.length > 0) {
        console.log(`[GOOGLE MAPS] ✓ ${reviews.length} avis trouvés`);
        return reviews;
      }
      
    } catch (error) {
      console.error(`[GOOGLE MAPS] Erreur:`, error.message);
    } finally {
      if (page) await page.close();
    }
    
    // Si rien n'a fonctionné, retourner vide plutôt que des faux avis
    console.log(`[GOOGLE MAPS] ⚠ Aucun avis valide trouvé`);
    return [];
  }

      // Source 2 : Deliveroo (si on a l'URL)
  async scrapeFromDeliveroo(deliverooUrl) {
    if (!deliverooUrl) return [];
    
    let page = null;
    try {
      const browser = await this.init();
      page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      console.log(`[DELIVEROO] Scraping: ${deliverooUrl}`);
      
      await page.goto(deliverooUrl, {
        waitUntil: 'networkidle2',
        timeout: this.defaultGotoTimeoutMs
      });

      await page.waitForTimeout(5000);

      const reviews = await page.evaluate(() => {
        let reviews = [];

        // Chercher les avis Deliveroo - sélecteurs plus précis
        const reviewElements = document.querySelectorAll(
          '[data-testid*="review"], ' +
          '[class*="ReviewCard"], ' +
          '[class*="review-item"], ' +
          '.customer-review, ' +
          '[class*="customer-review"]'
        );
        
        if (reviewElements.length > 0) {
          reviews = Array.from(reviewElements).slice(0, 10).map((el, idx) => {
            const commentEl = el.querySelector('[class*="comment"], [class*="text"], p, [class*="review-text"]');
            let comment = commentEl ? commentEl.textContent.trim() : el.textContent.trim();

            // Nettoyer le commentaire
            comment = comment.replace(/\s+/g, ' ').trim();

            const ratingEl = el.querySelector('[class*="rating"], [class*="star"], [aria-label*="star"]');
            let rating = 5;
            if (ratingEl) {
              const ratingText = ratingEl.textContent || ratingEl.getAttribute('aria-label') || '';
              const match = ratingText.match(/(\d+)/);
              if (match) rating = parseInt(match[1]);
            }

            const authorEl = el.querySelector('[class*="author"], [class*="name"], [class*="reviewer"]');
            const author = authorEl ? authorEl.textContent.trim() : `Deliveroo User ${idx + 1}`;

            return {
              id: `deliveroo-${idx}-${Date.now()}`,
              rating: rating,
              comment: comment.substring(0, 500),
              date: new Date().toISOString().split('T')[0],
              author: author,
              source: 'deliveroo'
            };
          }).filter(r => {
            // Filtrer les vrais avis
            if (!r.comment || r.comment.length < 20) return false;
            
            const commentLower = r.comment.toLowerCase();
            
            // Exclure les textes non pertinents
            const excludePatterns = [
              'cookie', 'confidentialité', 'privacy', 'function', 'var ',
              'window', 'document', 'script', 'accepter', 'refuser'
            ];
            
            for (const pattern of excludePatterns) {
              if (commentLower.includes(pattern)) return false;
            }
            
            // Doit ressembler à un avis de restaurant
            const restaurantWords = ['restaurant', 'plat', 'repas', 'manger', 'délicieux', 'bon', 'excellent', 'service', 'cuisine', 'commande', 'livraison'];
            const hasRestaurantWords = restaurantWords.some(word => commentLower.includes(word));
            
            return hasRestaurantWords || (r.comment.length > 30 && (r.comment.includes('.') || r.comment.includes('!')));
          });
        }

        return reviews;
      });

      if (reviews && reviews.length > 0) {
        console.log(`[DELIVEROO] ✓ ${reviews.length} avis trouvés`);
        return reviews;
      }

    } catch (error) {
      console.error(`[DELIVEROO] Erreur:`, error.message);
    } finally {
      if (page) await page.close();
    }
    return [];
  }

  // Source 3 : Yelp (si disponible)
  async scrapeFromYelp(restaurantName, city) {
    let page = null;
    try {
      const browser = await this.init();
      page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      console.log(`[YELP] Recherche: ${restaurantName} ${city}`);
      
      const searchQuery = encodeURIComponent(`${restaurantName} ${city}`);
      const searchUrl = `https://www.yelp.fr/search?find_desc=${searchQuery}&find_loc=${city}`;
      
      await page.goto(searchUrl, {
        waitUntil: 'networkidle2',
        timeout: this.defaultGotoTimeoutMs
      });

      await page.waitForTimeout(3000);

      // Cliquer sur le premier résultat
      await page.evaluate(() => {
        const firstResult = document.querySelector('a[href*="/biz/"]');
        if (firstResult) firstResult.click();
      });

      await page.waitForTimeout(3000);

      const reviews = await page.evaluate(() => {
        const reviewElements = document.querySelectorAll('[class*="review"], .comment, .review-content');
        
        return Array.from(reviewElements).slice(0, 10).map((el, idx) => {
          const commentEl = el.querySelector('[class*="comment"], p, [class*="text"]');
          const comment = commentEl ? commentEl.textContent.trim() : el.textContent.trim();

          const ratingEl = el.querySelector('[class*="rating"], [class*="star"]');
          let rating = 5;
          if (ratingEl) {
            const match = ratingEl.className.match(/(\d+)/);
            if (match) rating = parseInt(match[1]);
          }

          return {
            id: `yelp-${idx}-${Date.now()}`,
            rating: rating,
            comment: comment.substring(0, 500),
            date: new Date().toISOString().split('T')[0],
            author: `Yelp User ${idx + 1}`,
            source: 'yelp'
          };
        }).filter(r => r.comment && r.comment.length > 10);
      });

      if (reviews && reviews.length > 0) {
        console.log(`[YELP] ✓ ${reviews.length} avis trouvés`);
        return reviews;
      }

    } catch (error) {
      console.error(`[YELP] Erreur:`, error.message);
    } finally {
      if (page) await page.close();
    }
    return [];
  }

  // Méthode principale : essaie toutes les sources
  async scrapeAllSources(restaurantName, city, address = null, deliverooUrl = null) {
    console.log(`\n🔍 Recherche d'avis RÉELS pour: ${restaurantName} (${city})`);
    console.log(`   Sources: Google Maps, Deliveroo, Yelp\n`);

    let allReviews = [];

    // Source 1 : Google Maps (priorité absolue)
    console.log('   → Tentative Google Maps...');
    const googleReviews = await this.scrapeFromGoogleMaps(restaurantName, city, address);
    if (googleReviews.length > 0) {
      allReviews = googleReviews;
      console.log(`   ✓ ${googleReviews.length} avis récupérés depuis Google Maps\n`);
      return allReviews;
    }

    // Source 2 : Deliveroo
    if (deliverooUrl) {
      console.log('   → Tentative Deliveroo...');
      const deliverooReviews = await this.scrapeFromDeliveroo(deliverooUrl);
      if (deliverooReviews.length > 0) {
        allReviews = deliverooReviews;
        console.log(`   ✓ ${deliverooReviews.length} avis récupérés depuis Deliveroo\n`);
        return allReviews;
      }
    }

    // Source 3 : Yelp
    console.log('   → Tentative Yelp...');
    const yelpReviews = await this.scrapeFromYelp(restaurantName, city);
    if (yelpReviews.length > 0) {
      allReviews = yelpReviews;
      console.log(`   ✓ ${yelpReviews.length} avis récupérés depuis Yelp\n`);
      return allReviews;
    }

    console.log(`   ✗ Aucun avis trouvé sur aucune source\n`);
    return [];
  }
}

// Instance singleton
const scraper = new MultiSourceReviewsScraper();

module.exports = scraper;

