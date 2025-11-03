# Tests et CI/CD - Mes notes

Bon, je veux mettre en place des tests et du CI/CD pour que le projet soit vraiment pro. Ça montre que je sais faire du code testé et déployable.

## Tests à implémenter

### Tests unitaires

Pour tester les fonctions et composants individuellement :

**Frontend :**
- Vitest ou Jest (Jest est plus classique, Vitest plus rapide)
- React Testing Library pour les composants
- Tests des hooks personnalisés (useSearch, etc.)
- Tests des fonctions utilitaires

**Backend :**
- Jest ou Vitest aussi
- Tests des routes Express
- Tests du service de scraping (avec mocks pour Puppeteer)
- Tests du cache

### Tests d'intégration

Pour tester que tout fonctionne ensemble :

- Tests end-to-end avec Playwright ou Cypress
- Tests des endpoints API complets
- Tests du flux complet : recherche → restaurant → avis

### Ce que je dois tester

**Backend :**
- Les routes `/api/restaurants/search` retournent bien des résultats
- Les routes `/api/restaurants/:id/reviews` scrapent correctement
- Le cache fonctionne
- Les erreurs sont bien gérées

**Frontend :**
- La barre de recherche fonctionne avec debounce
- Les composants s'affichent correctement
- Les appels API sont bien faits
- Les états de chargement/erreur sont gérés

## Outils que je vais utiliser

### Tests unitaires

**Jest** (probablement)
- Standard dans l'écosystème React/Node
- Bonne intégration avec Next.js
- Facile à configurer

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

**Ou Vitest** (alternative plus moderne)
- Plus rapide
- API similaire à Jest
- Meilleure intégration avec Vite

### Tests E2E

**Playwright** (je vais probablement utiliser ça)
- Déjà dans le projet pour le scraping peut-être
- Tests cross-browser
- Très bon pour les tests d'intégration

```bash
npm install -D @playwright/test
```

**Ou Cypress** (alternative)
- Interface graphique sympa
- Bonne communauté

## Structure des tests

```
projet-dokaa/
├── client/
│   ├── __tests__/           # Tests unitaires
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   └── e2e/                  # Tests E2E
│
├── server/
│   ├── __tests__/           # Tests unitaires
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── e2e/                  # Tests d'intégration API
```

## CI/CD

### GitHub Actions (gratuit et simple)

Créer `.github/workflows/test.yml` :

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd server && npm install
          cd ../client && npm install
      
      - name: Run backend tests
        run: cd server && npm test
      
      - name: Run frontend tests
        run: cd client && npm test
      
      - name: Run E2E tests
        run: npm run test:e2e
```

### Autres options

**GitLab CI** : Si le repo est sur GitLab
**CircleCI** : Alternative populaire
**Vercel/Netlify** : Pour le déploiement automatique (avec Next.js)

## Ce que je vais tester en priorité

1. **Backend - Service de scraping**
   - Que le scraper retourne bien les données
   - Gestion des erreurs (restaurant introuvable, timeout)
   - Que le cache fonctionne

2. **Backend - Routes API**
   - Que les routes répondent correctement
   - Validation des paramètres
   - Codes HTTP appropriés

3. **Frontend - Composants**
   - Barre de recherche avec debounce
   - Affichage des restaurants
   - Affichage des avis
   - États de chargement

4. **Intégration**
   - Flux complet de recherche à affichage des avis
   - Communication frontend/backend

## Configuration

### Jest config (server)

```javascript
// server/jest.config.js
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.test.js']
};
```

### Vitest config (client)

```javascript
// client/vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

## Quand tester

- Avant chaque commit (via pre-commit hook avec husky)
- À chaque push (via CI)
- Avant de merger une PR

## Coverage

Je vais viser un coverage raisonnable :
- Backend : 70-80% minimum (les routes et services principaux)
- Frontend : 60-70% (les composants et hooks importants)

Pas besoin de 100%, mais les parties critiques doivent être testées.

## Notes

- Les tests de scraping seront mockés (pas besoin de lancer un vrai navigateur à chaque fois)
- Pour les tests E2E, je vais peut-être utiliser un serveur de test
- Le CI va aussi vérifier que le code compile sans erreur
- Peut-être ajouter du linting (ESLint) dans le pipeline

## Priorité dans le planning

Je vais intégrer les tests au fur et à mesure :
- Jour 2-3 : Mettre en place la structure de tests
- Jour 4 : Tests unitaires backend
- Jour 6 : Tests unitaires frontend
- Jour 7 : Tests E2E et CI/CD

Ou peut-être après avoir fait le MVP fonctionnel, je rajoute les tests.

