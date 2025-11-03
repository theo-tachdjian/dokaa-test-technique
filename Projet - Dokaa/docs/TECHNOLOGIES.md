# Technologies - Guide de référence

## Stack technique du projet

### Frontend

#### Next.js 13+ (App Router)

**Pourquoi Next.js ?**
- Bonus demandé dans le test
- SSR/SSG pour de meilleures performances
- Routing intégré très simple
- API Routes si besoin
- Optimisation images automatique

**Ressources à lire :**
- [Documentation officielle Next.js](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Next.js App Router Tutorial](https://nextjs.org/learn)

**Commandes utiles :**
```bash
npx create-next-app@latest client --typescript --tailwind --app
cd client
npm run dev  # Développement sur http://localhost:3000
```

#### Tailwind CSS

**Pourquoi image.pngje trouve ou le code pour lier git à cursor ?wind ?**
- Bonus demandé dans le test
- Développement rapide
- Design moderne facilement
- Pas besoin de créer des fichiers CSS séparés

**Ressources à lire :**
- [Documentation Tailwind](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)
- [Awesome Tailwind](https://github.com/aniftyco/awesome-tailwindcss)

**Configuration :**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f97316', // Orange Deliveroo
      }
    }
  }
}
```

#### React 18+

**Concepts importants :**
- Hooks personnalisés (useSearch, useRestaurant)
- État local avec useState
- Effets avec useEffect
- Gestion d'erreurs avec Error Boundaries

**Ressources :**
- [React Documentation](https://react.dev/)
- [React Hooks Guide](https://react.dev/reference/react)

### Backend

#### Node.js

**Version recommandée :** Node.js 18+ (LTS)

**Node.js :**
- Stack JavaScript unifiée
- Excellentes librairies pour le scraping
- Performance pour I/O asynchrones

#### Express.js

**Express :**
- Framework minimal et flexible
- Grande communauté
- Middleware facile à intégrer
- Standard de l'écosystème Node

**Ressources :**
- [Express Documentation](https://expressjs.com/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

**Structure de base :**
```javascript
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/restaurants/search', async (req, res) => {
  // Logique de recherche
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

### Scraping

#### Puppeteer (Recommandé)

**Pourquoi Puppeteer ?**
- Contrôle complet du navigateur
- Gère JavaScript dynamique
- Écosystème mature
- Bonne documentation

**Installation :**
```bash
npm install puppeteer
```

**Ressources :**
- [Puppeteer Documentation](https://pptr.dev/)
- [Puppeteer Examples](https://github.com/puppeteer/puppeteer/tree/main/examples)

**Points importants :**
- Utiliser `headless: true` en production
- Toujours fermer le navigateur (`browser.close()`)
- Gérer les timeouts
- Utiliser `waitForSelector` pour attendre le chargement

#### Playwright (Alternative)

**Pourquoi Playwright ?**
- Multi-navigateurs (Chrome, Firefox, Safari)
- API moderne
- Meilleure gestion des réseaux
- Auto-wait intégré

**Installation :**
```bash
npm install playwright
npx playwright install chromium
```

**Ressources :**
- [Playwright Documentation](https://playwright.dev/)

#### Cheerio (HTML statique)

**Quand l'utiliser ?**
- HTML déjà chargé (pas de JS dynamique)
- Plus léger que Puppeteer
- Syntaxe jQuery-like familière

**Limitation :**
- Ne gère pas JavaScript
- Si les avis sont chargés dynamiquement, utiliser Puppeteer

## Outils de développement

### TypeScript (Recommandé)

**Pourquoi ?**
- Type safety
- Meilleure autocomplétion
- Moins d'erreurs en runtime

**Setup Next.js avec TypeScript :**
```bash
npx create-next-app@latest --typescript
```

### ESLint + Prettier

**Configuration :**
```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "prettier"]
}
```

### Git

**Workflow recommandé :**
```bash
git init
git add .
git commit -m "Initial commit"
```

## Gestionnaire de paquets

**npm** ou **yarn** ou **pnpm**

Recommandation : **pnpm** (plus rapide, meilleure gestion des dépendances)

```bash
npm install -g pnpm
pnpm install
```

## Alternatives considérées

### Frontend
- **Vite + React** : Plus rapide en dev, mais pas de SSR
- **Remix** : Alternative à Next.js, très performant

### Backend
- **Fastify** : Plus rapide qu'Express, API similaire
- **NestJS** : Plus structuré, mais peut-être overkill pour ce projet

### Scraping
- **Selenium** : Plus lourd, moins performant
- **Scrapy** : Python uniquement

## Ressources générales à lire

### Architecture
- [REST API Design Best Practices](https://restfulapi.net/)
- [Web Scraping Best Practices](https://www.scraperapi.com/blog/web-scraping-best-practices/)

### Next.js
- [Next.js Patterns](https://nextjs.org/docs/pages/building-your-application/routing)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)

### React
- [React Patterns](https://reactpatterns.com/)
- [React Performance](https://react.dev/learn/render-and-commit)

### Express
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## Points clés à maîtriser

1. **Next.js App Router** : Comprendre la différence avec Pages Router
2. **Server Components vs Client Components** : Quand utiliser quoi
3. **Async/await** : Essentiel pour le scraping
4. **Error handling** : Gérer les erreurs gracieusement
5. **Debouncing** : Pour la recherche en temps réel
6. **Caching** : Optimiser les performances

## Commandes rapides

```bash
# Créer le projet Next.js
npx create-next-app@latest client --typescript --tailwind --app

# Setup Express
mkdir server && cd server
npm init -y
npm install express cors dotenv
npm install -D nodemon

# Installer Puppeteer
npm install puppeteer

# Lancer en développement
npm run dev  # Frontend
npm run dev  # Backend (avec nodemon)
```

## Points d'attention

1. **CORS** : Configurer correctement pour que frontend et backend communiquent
2. **Environment variables** : Ne jamais commiter les secrets
3. **Rate limiting** : Respecter les sites scrapés
4. **Error handling** : Toujours gérer les cas d'erreur
5. **Performance** : Éviter les requêtes inutiles

