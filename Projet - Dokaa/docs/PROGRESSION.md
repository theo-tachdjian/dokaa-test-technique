# Progression du projet - Jour par jour

Voici ce que j'ai fait jusqu'à maintenant. Je vais mettre à jour ce fichier au fur et à mesure pour avoir une vue d'ensemble de ce qui a été fait.

## Jour 1 - Setup et documentation

Objectif du jour : mettre en place la structure de base et comprendre ce qu'il faut faire.

### Documentation

J'ai commencé par faire de la documentation pour bien comprendre le projet :
- README principal avec la vue d'ensemble
- Index de la documentation pour naviguer facilement
- Guide de démarrage rapide (QUICK_START.md)
- Architecture détaillée du projet
- Guide des technologies utilisées
- Documentation sur les APIs et le scraping (parce que c'est le point délicat)
- Exemples de code pour avoir une base

Bon, c'est peut-être beaucoup de doc pour un test technique, mais j'aime bien avoir tout bien organisé. Et puis ça montre que je sais structurer un projet.

### Setup technique

- Initialisation du projet frontend avec Next.js (TypeScript, Tailwind)
- Initialisation du projet backend avec Express
- Configuration de base : CORS, routes, health check
- Fichiers d'environnement (.env.example)
- Structure des dossiers propre

**Ce qui fonctionne :**
- Le backend démarre sur le port 3001
- Le frontend démarre sur le port 3000
- Ils communiquent ensemble (j'ai testé avec un bouton simple)

**Temps passé :** Environ 3-4h (surtout la doc, le setup c'est rapide)

---

## Jour 2 - Interface et données mockées

Objectif du jour : créer l'interface de base avec des données mockées pour pouvoir tester avant de faire le scraping.

### Backend

**Routes API :**
- `/api/restaurants/search?q=...` - Recherche de restaurants
- `/api/restaurants/:id` - Détails d'un restaurant
- `/api/restaurants/:id/reviews` - Les 10 derniers avis

**Service mock :**
- Fichier `mockData.js` avec 4 restaurants et leurs avis
- Données réalistes pour pouvoir développer le frontend tranquillement

Bon, c'est du mock, mais au moins ça permet de travailler sur le frontend sans galérer avec le scraping tout de suite.

### Frontend

**Structure des composants :**
- `SearchBar.tsx` - Barre de recherche avec icône et loading
- `SearchResults.tsx` - Affichage des résultats de recherche
- `RestaurantCard.tsx` - Carte pour chaque restaurant (image, nom, note, statut)
- `useSearch.ts` - Hook custom avec debounce (300ms)

**Pages :**
- Page d'accueil (`app/page.tsx`) avec la recherche
- Page détail restaurant (`app/restaurants/[id]/page.tsx`) avec les infos et les avis

**Client API :**
- Fichier `lib/api.ts` avec les fonctions pour appeler le backend
- Types TypeScript pour `Restaurant` et `Review`

**Design :**
- Tailwind CSS configuré
- Design basique mais propre (j'suis pas graphiste mais ça fait le job)
- Responsive (mobile et desktop)

**Ce qui fonctionne :**
- Recherche en temps réel (avec debounce)
- Affichage des résultats
- Navigation vers la page détail
- Affichage des infos restaurant et des avis

**Temps passé :** Environ 4-5h (frontend, ça prend toujours plus de temps que prévu)

---

## Jour 3 - Scraping et optimisations

Objectif du jour : mettre en place le système de scraping (même si pas encore activé) et améliorer le code.

### Backend - Scraping

**Service de scraping (`server/services/scraper.js`) :**
- Installation de Puppeteer
- Classe `DeliverooScraper` avec gestion du navigateur
- Fonction `scrapeRestaurantReviews()` pour récupérer les avis
- Fonction `scrapeRestaurantInfo()` pour les infos restaurant
- Gestion d'erreurs pour éviter que ça plante (important)
- Script de test (`test-scraper.js`) pour tester manuellement

**Note importante :** Les sélecteurs CSS sont des exemples. Il faudra les adapter selon la structure réelle de Deliveroo. Pour l'instant, le scraping est commenté dans les routes, j'utilise toujours les données mockées.

**Système de cache (`server/services/cache.js`) :**
- Cache simple en mémoire avec `Map`
- TTL différent : 24h pour les restaurants, 1h pour les avis
- Méthodes basiques : get, set, clear
- Stats pour le debug

**Intégration dans les routes :**
- Vérification du cache avant de scraper
- Code prêt pour activer le scraping (juste à décommenter)
- Cache automatique des réponses

**Améliorations :**
- Middleware de gestion d'erreurs plus robuste
- Logger simple pour le debug
- Graceful shutdown (fermeture propre du navigateur Puppeteer)

### Frontend - Améliorations

**Refactoring composants avis :**
- `ReviewsList.tsx` - Liste avec gestion des états (loading, empty)
- `ReviewCard.tsx` - Composant réutilisable pour un avis
- Meilleure séparation des responsabilités

**Composants UI :**
- `LoadingSpinner.tsx` - Spinner réutilisable avec différentes tailles

**Utilitaires :**
- `lib/utils.ts` avec `debounce()` et `formatDate()`
- Fonctions réutilisables pour le reste du projet

**Ce qui fonctionne :**
- Tout continue de fonctionner avec les données mockées
- Le code est mieux organisé
- Prêt pour intégrer le scraping réel

**Temps passé :** Environ 7-8h (scraping c'est long à mettre en place, surtout quand on teste)

---

## Ce qui reste à faire

### Pour activer le scraping réel
1. Ouvrir quelques pages Deliveroo avec DevTools
2. Identifier les vrais sélecteurs CSS pour les avis et les infos
3. Adapter les sélecteurs dans `scraper.js`
4. Tester sur quelques restaurants réels
5. Gérer les cas où les sélecteurs changent (Deliveroo pourrait modifier leur HTML)

### Améliorations possibles
- Rate limiting pour éviter de spammer les serveurs
- Retry logic en cas d'échec de scraping
- Meilleure gestion des timeouts
- Logs plus détaillés pour debugger
- Tests unitaires et d'intégration
- CI/CD avec GitHub Actions

### Fonctionnalités manquantes
- Page de recherche plus avancée (filtres, tri)
- Pagination si beaucoup de résultats
- Gestion d'erreurs plus user-friendly côté frontend
- Animations/transitions (pas prioritaire mais ça fait joli)
