let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  console.warn('⚠️  Puppeteer non disponible. Installation nécessaire pour le scraping.');
  puppeteer = null;
}

class GoogleMapsScraper {
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

  
  async searchRestaurantAddress(restaurantName, city) {
    let page = null;
    
    try {
      const browser = await this.init();
      page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
        });
      });

      console.log(`[GOOGLE MAPS] Recherche: ${restaurantName} à ${city}`);
      
      
      const searchQuery = encodeURIComponent(`${restaurantName} ${city} France`);
      const searchUrl = `https://www.google.com/maps/search/${searchQuery}`;
      
      await page.goto(searchUrl, {
        waitUntil: 'networkidle0',
        timeout: this.defaultGotoTimeoutMs
      });

      
      await page.waitForTimeout(3000);

      
      const addressInfo = await page.evaluate(() => {
        
        const addressElement = document.querySelector('[data-value="Address"] span, .Io6YTe, .rogA2c .Io6YTe');
        
        if (addressElement) {
          const address = addressElement.textContent.trim();
          
          
          const ratingElement = document.querySelector('[jsaction="pane.rating.moreReviews"] span, .F7nice span');
          let rating = null;
          if (ratingElement) {
            const ratingText = ratingElement.textContent.trim();
            const match = ratingText.match(/(\d+[,\.]\d+)/);
            if (match) {
              rating = parseFloat(match[1].replace(',', '.'));
            }
          }
          
          return {
            address: address,
            rating: rating
          };
        }
        
        
        const sidePanel = document.querySelector('[role="main"]');
        if (sidePanel) {
          const addressText = sidePanel.textContent;
          
          const addressMatch = addressText.match(/(\d+[,\s]+(?:rue|avenue|boulevard|place|allée|cours|chemin|impasse|route)[^,]+,\s*\d{5}\s+[^,\n]+)/i);
          if (addressMatch) {
            return {
              address: addressMatch[1].trim(),
              rating: null
            };
          }
        }
        
        return null;
      });

      if (addressInfo && addressInfo.address) {
        console.log(`[GOOGLE MAPS] ✓ Adresse trouvée: ${addressInfo.address}`);
        return addressInfo;
      } else {
        console.log(`[GOOGLE MAPS] ⚠ Aucune adresse trouvée`);
        return null;
      }

    } catch (error) {
      console.error(`[GOOGLE MAPS] Erreur:`, error.message);
      return null;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }
}


const scraper = new GoogleMapsScraper();

module.exports = scraper;

