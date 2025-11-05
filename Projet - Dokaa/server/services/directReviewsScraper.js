// Scraper DIRECT pour récupérer les VRAIS avis - approche plus agressive et précise
// On va vraiment chercher les vrais avis, pas se contenter du premier texte trouvé

let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  puppeteer = null;
}

class DirectReviewsScraper {
  constructor() {
    this.browser = null;
    this.defaultGotoTimeoutMs = 60000; // Plus de temps
  }

  async init() {
    if (!puppeteer) {
      throw new Error('Puppeteer n\'est pas installé');
    }
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: false, // Mode visible pour voir ce qui se passe
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--disable-dev-shm-usage',
          '--window-size=1920,1080'
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

  // Scraper DIRECT depuis Google Maps avec une approche très précise
  async scrapeReviews(restaurantName, city) {
    let page = null;
    
    try {
      const browser = await this.init();
      page = await browser.newPage();

      await page.setViewport({ width: 1920, height: 1080 });
      
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
        window.chrome = { runtime: {} };
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      });

      console.log(`\n🔍 [SCRAPING DIRECT] Recherche: ${restaurantName} à ${city}\n`);

      // Étape 1 : Rechercher le restaurant
      const searchQuery = encodeURIComponent(`${restaurantName} ${city} France`);
      const searchUrl = `https://www.google.com/maps/search/${searchQuery}`;
      
      console.log(`📍 Ouverture de: ${searchUrl}`);
      await page.goto(searchUrl, {
        waitUntil: 'networkidle0',
        timeout: this.defaultGotoTimeoutMs
      });

      await page.waitForTimeout(5000);

      // Étape 2 : Cliquer sur le premier résultat
      console.log(`🔍 Clic sur le premier résultat...`);
      await page.evaluate(() => {
        const firstResult = document.querySelector('a[href*="/maps/place/"]');
        if (firstResult) {
          firstResult.scrollIntoView();
          firstResult.click();
        }
      });

      await page.waitForTimeout(5000);

      // Étape 3 : Trouver et cliquer sur le bouton "Avis"
      console.log(`🔍 Recherche du bouton "Avis"...`);
      const reviewsButtonClicked = await page.evaluate(() => {
        // Chercher tous les boutons/textes qui contiennent "avis" ou "review"
        const allButtons = Array.from(document.querySelectorAll('button, a, div[role="button"], span'));
        
        for (const btn of allButtons) {
          const text = btn.textContent.toLowerCase();
          if ((text.includes('avis') || text.includes('review')) && 
              (text.match(/\d+/) || text.includes('étoile') || text.includes('star'))) {
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => btn.click(), 500);
            return true;
          }
        }
        return false;
      });

      if (reviewsButtonClicked) {
        console.log(`✓ Bouton "Avis" cliqué`);
        await page.waitForTimeout(5000);
      }

      // Étape 4 : Scraper les VRAIS avis avec des sélecteurs très précis
      console.log(`🔍 Extraction des avis...`);
      const reviews = await page.evaluate(() => {
        const reviews = [];
        
        // Méthode 1 : Chercher les containers d'avis Google Maps (sélecteurs officiels)
        // Les vrais avis sont dans des divs avec des classes spécifiques
        const selectors = [
          '[data-review-id]',
          '.jftiEf',
          '.MyEned',
          '.wiI7pd',
          '[class*="review-text"]',
          '[class*="reviewContent"]',
          '[jsaction*="review"]'
        ];
        
        let reviewElements = [];
        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            reviewElements = Array.from(elements);
            console.log(`✓ Trouvé ${elements.length} éléments avec ${selector}`);
            break;
          }
        }
        
        // Si rien trouvé, chercher dans tout le DOM
        if (reviewElements.length === 0) {
          console.log('⚠ Aucun élément trouvé avec les sélecteurs standards, recherche dans tout le DOM...');
          
          // Chercher tous les divs qui contiennent du texte qui ressemble à un avis
          const allDivs = document.querySelectorAll('div');
          reviewElements = Array.from(allDivs).filter(div => {
            const text = div.textContent.trim();
            // Filtrer pour ne garder que ceux qui ressemblent à des avis
            return text.length > 50 && 
                   text.length < 1000 &&
                   !text.includes('http') &&
                   !text.includes('%') &&
                   !text.includes('function') &&
                   !text.includes('cookie') &&
                   (text.includes('restaurant') || 
                    text.includes('plat') || 
                    text.includes('service') ||
                    text.includes('bon') ||
                    text.includes('excellent') ||
                    text.includes('délicieux') ||
                    text.includes('recommand'));
          });
        }
        
        // Extraire les avis
        reviewElements.slice(0, 10).forEach((el, idx) => {
          // Extraire le texte - plusieurs méthodes
          let comment = '';
          
          // Méthode A : Chercher un span avec classe spécifique pour le texte
          const textSpan = el.querySelector('.wiI7pd, .MyEned, [class*="text"], [class*="comment"]');
          if (textSpan) {
            comment = textSpan.textContent.trim();
          } else {
            // Méthode B : Prendre le texte direct mais filtrer
            const allText = el.textContent;
            // Extraire seulement les phrases complètes
            const sentences = allText.split(/[.!?]/)
              .map(s => s.trim())
              .filter(s => {
                const sLower = s.toLowerCase();
                return s.length > 20 && 
                       s.length < 300 &&
                       !sLower.includes('http') &&
                       !sLower.includes('%') &&
                       !sLower.includes('function') &&
                       !sLower.includes('cookie') &&
                       !sLower.includes('aria-label') &&
                       !sLower.includes('jsname') &&
                       (sLower.includes('restaurant') || 
                        sLower.includes('plat') || 
                        sLower.includes('service') ||
                        sLower.includes('bon') ||
                        sLower.includes('excellent') ||
                        sLower.includes('délicieux') ||
                        sLower.includes('recommand') ||
                        sLower.includes('je ') ||
                        sLower.includes('nous ') ||
                        sLower.includes('très'));
              });
            comment = sentences.join('. ');
          }
          
          // Nettoyer le commentaire
          comment = comment
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s.,!?;:'"àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ-]/g, '')
            .trim();
          
          // Ignorer si ce n'est pas un vrai avis
          if (comment.length < 30 || 
              comment.includes('http') ||
              comment.includes('%') ||
              comment.includes('function') ||
              comment.match(/^[a-z0-9_]+$/i)) {
            return;
          }
          
          // Extraire la note
          let rating = 4;
          const ratingEl = el.querySelector('[aria-label*="star"], [aria-label*="étoile"], [class*="rating"]');
          if (ratingEl) {
            const ariaLabel = ratingEl.getAttribute('aria-label') || '';
            const match = ariaLabel.match(/(\d+)/);
            if (match) rating = parseInt(match[1]);
          }
          
          // Extraire l'auteur
          let author = `Client ${idx + 1}`;
          const authorEl = el.querySelector('[class*="author"], [class*="name"], .d4r55');
          if (authorEl) {
            const authorText = authorEl.textContent.trim();
            if (authorText && authorText.length < 50 && !authorText.includes('http')) {
              author = authorText;
            }
          }
          
          // Extraire la date
          let date = new Date().toISOString().split('T')[0];
          const dateEl = el.querySelector('span[class*="date"], time, [class*="date"]');
          if (dateEl) {
            const dateText = dateEl.textContent || dateEl.getAttribute('datetime');
            if (dateText) {
              const parsed = new Date(dateText);
              if (!isNaN(parsed.getTime())) date = parsed.toISOString().split('T')[0];
            }
          }
          
          if (comment && comment.length >= 30) {
            reviews.push({
              id: `direct-${idx}-${Date.now()}`,
              rating: rating,
              comment: comment.substring(0, 500),
              date: date,
              author: author,
              source: 'google-direct'
            });
          }
        });
        
        console.log(`✓ ${reviews.length} avis extraits`);
        return reviews;
      });

      if (reviews && reviews.length > 0) {
        console.log(`\n✅ ${reviews.length} AVIS RÉELS RÉCUPÉRÉS !\n`);
        return reviews;
      } else {
        console.log(`\n⚠ Aucun avis trouvé\n`);
        return [];
      }

    } catch (error) {
      console.error(`\n❌ Erreur:`, error.message);
      return [];
    } finally {
      if (page) await page.close();
    }
  }
}

// Instance singleton
const scraper = new DirectReviewsScraper();

module.exports = scraper;

