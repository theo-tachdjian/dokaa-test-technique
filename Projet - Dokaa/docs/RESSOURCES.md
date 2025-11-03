# Ressources et APIs - Guide complet

## Stratégies pour obtenir les données Deliveroo

### Important : Pas d'API publique Deliveroo

Deliveroo **ne fournit pas d'API publique** pour accéder aux restaurants et avis. Vous devrez donc utiliser le **web scraping**.

## Outils de scraping recommandés

### 1. Puppeteer (Recommandé)

**Avantages :**
- Contrôle complet d'un navigateur Chrome/Chromium
- Gère le JavaScript dynamique (essentiel pour les sites modernes)
- Excellente documentation
- Grande communauté

**Documentation :**
- Site officiel : https://pptr.dev/
- GitHub : https://github.com/puppeteer/puppeteer
- Guide rapide : https://pptr.dev/guides/getting-started

**Installation :**
```bash
npm install puppeteer
```

**Exemple minimal :**
```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://deliveroo.fr');
  // ... votre code
  await browser.close();
})();
```

### 2. Playwright (Alternative moderne)

**Avantages :**
- Multi-navigateurs (Chrome, Firefox, Safari)
- API plus moderne
- Auto-wait intégré (moins de problèmes de timing)

**Documentation :**
- Site officiel : https://playwright.dev/
- Guide : https://playwright.dev/docs/intro

**Installation :**
```bash
npm install playwright
npx playwright install chromium
```

### 3. Cheerio (Pour HTML statique)

**Avantages :**
- Léger et rapide
- Syntaxe jQuery-like
- Bon pour HTML déjà chargé

**Limitations :**
- Ne gère pas JavaScript dynamique
- Si les avis sont chargés en AJAX, ne fonctionnera pas

**Documentation :**
- https://cheerio.js.org/

## APIs alternatives (non spécifiques Deliveroo)

### Google Places API

**Utilité :** Trouver des restaurants en général, mais pas spécifiquement sur Deliveroo

**Documentation :**
- https://developers.google.com/maps/documentation/places/web-service

**Limites :**
- Nécessite une clé API
- Payant après crédits gratuits
- Ne retourne pas les restaurants Deliveroo spécifiquement

### Yelp Fusion API

**Utilité :** Accès aux restaurants et avis, mais pas Deliveroo

**Documentation :**
- https://www.yelp.com/developers/documentation/v3

## Stratégie recommandée pour ce projet

### Phase 1 : Exploration manuelle

1. **Visiter le site Deliveroo**
   - Aller sur https://deliveroo.fr
   - Effectuer une recherche de restaurant
   - Ouvrir la page d'un restaurant
   - Identifier où se trouvent les avis

2. **Outil : DevTools du navigateur**
   - Ouvrir F12 (DevTools)
   - Inspecter les éléments de la page
   - Identifier les sélecteurs CSS/classes
   - Regarder le Network tab pour voir les appels API internes (si existants)

### Phase 2 : Script de test

Créer un script simple pour tester le scraping d'une page :

```javascript
// test-scraper.js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // false pour voir
  const page = await browser.newPage();
  
  // Exemple d'URL (à adapter)
  await page.goto('https://deliveroo.fr/fr/restaurants/paris/restaurant-test');
  
  // Attendre que les avis se chargent
  await page.waitForSelector('.review-item', { timeout: 10000 });
  
  // Extraire les données
  const reviews = await page.evaluate(() => {
    // À adapter selon la structure réelle
    return Array.from(document.querySelectorAll('.review-item'))
      .slice(0, 10)
      .map(el => ({
        rating: el.querySelector('.rating')?.textContent,
        comment: el.querySelector('.comment')?.textContent,
        // ...
      }));
  });
  
  console.log(reviews);
  await browser.close();
})();
```

### Phase 3 : Implémentation dans l'API

Intégrer le scraping dans votre service Express.

## 🔐 Bonnes pratiques de scraping

### 1. Respecter robots.txt

Vérifier : https://deliveroo.fr/robots.txt

### 2. User-Agent approprié

```javascript
await page.setUserAgent(
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
);
```

### 3. Délais entre requêtes

```javascript
// Attendre entre les requêtes
await page.waitForTimeout(1000); // 1 seconde
```

### 4. Timeouts

```javascript
await page.goto(url, { 
  waitUntil: 'networkidle2',
  timeout: 30000 
});
```

### 5. Gestion d'erreurs

```javascript
try {
  await page.goto(url);
} catch (error) {
  console.error('Erreur lors du chargement:', error);
  // Retourner une erreur gracieuse
}
```

## Ressources d'apprentissage

### Scraping Web

1. **Web Scraping with Node.js**
   - https://www.freecodecamp.org/news/web-scraping-with-node-js/
   - Tutoriel complet avec exemples

2. **Puppeteer Tutorials**
   - https://www.youtube.com/results?search_query=puppeteer+tutorial
   - Vidéos YouTube pour apprendre visuellement

3. **Scraping Ethics**
   - https://www.scraperapi.com/blog/web-scraping-best-practices/
   - Bonnes pratiques et éthique

### Next.js

1. **Official Docs**
   - https://nextjs.org/docs
   - Documentation complète

2. **Next.js Learn**
   - https://nextjs.org/learn
   - Cours interactif gratuit

3. **Next.js Examples**
   - https://github.com/vercel/next.js/tree/canary/examples
   - Exemples de code

### Tailwind CSS

1. **Official Docs**
   - https://tailwindcss.com/docs
   - Documentation complète

2. **Tailwind UI**
   - https://tailwindui.com/
   - Composants pré-construits (payant mais avec exemples)

3. **Awesome Tailwind**
   - https://github.com/aniftyco/awesome-tailwindcss
   - Ressources et outils

### Express.js

1. **Official Docs**
   - https://expressjs.com/
   - Documentation officielle

2. **Express Best Practices**
   - https://expressjs.com/en/advanced/best-practice-performance.html
   - Guide de performance

## 🎓 Cours et tutoriels recommandés

### Gratuits

1. **Next.js Tutorial (Vercel)**
   - https://nextjs.org/learn
   - Cours interactif gratuit

2. **Web Scraping with Puppeteer (YouTube)**
   - Rechercher "puppeteer tutorial"
   - Plusieurs tutoriels gratuits

3. **Tailwind CSS Crash Course**
   - YouTube : "Tailwind CSS tutorial"
   - Apprendre rapidement

### Payants (si budget disponible)

1. **Udemy - Next.js courses**
   - Cours complets et structurés
   - Prix souvent en promo

2. **Frontend Masters**
   - Cours de qualité
   - Abonnement mensuel

## Outils utiles

### Développement

1. **Postman** ou **Insomnia**
   - Tester les APIs
   - https://www.postman.com/

2. **React Developer Tools**
   - Extension Chrome pour déboguer React
   - Chrome Web Store

3. **Redux DevTools** (si besoin)
   - Pour la gestion d'état
   - Chrome Web Store

### Scraping

1. **Browser DevTools**
   - Intégré dans Chrome/Firefox
   - Indispensable pour identifier les sélecteurs

2. **SelectorGadget** (Extension Chrome)
   - Aide à trouver les sélecteurs CSS
   - Chrome Web Store

## Checklist de recherche

Avant de commencer à coder :

- [ ] J'ai exploré manuellement le site Deliveroo
- [ ] J'ai identifié la structure des URLs
- [ ] J'ai trouvé où se trouvent les avis
- [ ] J'ai testé un script de scraping simple
- [ ] J'ai compris comment Puppeteer fonctionne
- [ ] J'ai lu la documentation de Next.js
- [ ] J'ai regardé des exemples Tailwind
- [ ] J'ai compris l'architecture Express

## 💡 Conseils finaux

1. **Commencez simple** : Utilisez des données mockées pour développer le frontend d'abord
2. **Testez fréquemment** : Ne pas attendre d'avoir tout codé pour tester
3. **Documentez** : Notez vos découvertes (sélecteurs, structures, etc.)
4. **Gérez les erreurs** : Pensez aux cas limites (pas d'avis, restaurant introuvable, etc.)
5. **Restez éthique** : Respectez les sites que vous scrapez

## Prêt à commencer ?

1. Consultez `ARCHITECTURE.md` pour voir comment tout s'articule
2. Lisez `TECHNOLOGIES.md` pour maîtriser les outils
3. Suivez `APIS_ET_SCRAPING.md` pour implémenter le scraping
4. Utilisez `EXEMPLES_CODE.md` pour avoir du code prêt à l'emploi

**Bonne chance !**

