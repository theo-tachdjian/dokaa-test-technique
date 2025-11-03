# Backoffice Deliveroo - Test Technique Dokaa

## Vue d'ensemble du projet

Pour ce test technique, je dois créer un backoffice qui permet de rechercher des restaurants Deliveroo et d'afficher leurs avis. Ça a l'air assez clair, même si le scraping risque d'être le point délicat.

## Objectifs

- Barre de recherche pour chercher un restaurant Deliveroo
- Quand on clique sur un restaurant, afficher ses infos
- Afficher les 10 derniers avis (je vais devoir les scraper depuis leur site)
- Faire un truc propre niveau design, même si je ne suis pas graphiste

## Stack technique

- **Front-end** : React avec Next.js et Tailwind CSS. J'ai choisi Next.js parce que je connais bien React et ça fait une bonne impression.
- **Back-end** : Node.js avec Express, classique mais efficace
- **Scraping** : Je vais probablement partir sur Puppeteer, ça a l'air le plus adapté pour gérer le JS dynamique. Cheerio serait plus simple mais je pense que Deliveroo charge les avis en JS.
- **Pas de BDD** : C'est noté dans le brief, donc pas besoin de MongoDB ou quoi que ce soit (pour le moment)

## Structure du projet

```
projet-dokaa/
├── client/              # Application Next.js
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
├── server/              # API Express
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── index.js
├── docs/                # Documentation
│   ├── APIS_ET_SCRAPING.md
│   ├── ARCHITECTURE.md
│   ├── TECHNOLOGIES.md
└── README.md
```

## Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation rapide

Voir [SETUP.md](./SETUP.md) pour les instructions détaillées.

```bash
# 1. Installer les dépendances backend
cd server
npm install
cp env.example .env
cd ..

# 2. Installer les dépendances frontend  
cd client
npm install
cp env.local.example .env.local
cd ..
```

### Lancement

**Terminal 1 - Backend :**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd client
npm run dev
```

Ouvrir http://localhost:3000 et tester la connexion backend.

## Documentation

**Commencez par lire [docs/INDEX.md](./docs/INDEX.md) pour naviguer dans toute la documentation !**

### Documents disponibles

- **[Index de la documentation](./docs/INDEX.md)** - Navigation et vue d'ensemble
- **[Guide de démarrage rapide](./docs/QUICK_START.md)** - Setup en 5 minutes
- **[Architecture](./docs/ARCHITECTURE.md)** - Structure détaillée du projet
- **[Technologies](./docs/TECHNOLOGIES.md)** - Guide des technologies utilisées
- **[APIs et Scraping](./docs/APIS_ET_SCRAPING.md)** - Stratégies pour récupérer les données
- **[Ressources](./docs/RESSOURCES.md)** - Documentation, tutoriels et outils utiles
- **[Exemples de code](./docs/EXEMPLES_CODE.md)** - Code prêt à l'emploi (scraping, composants, routes)
- **[Tests et CI/CD](./docs/TESTS_ET_CI.md)** - Stratégie de tests et pipeline CI/CD

## Fonctionnalités

### Barre de recherche
- Recherche en temps réel avec debounce (je vais mettre 300ms, ça devrait être ok)
- Suggestions de restaurants (si j'arrive à faire fonctionner la recherche)
- Gestion des erreurs (faut pas que ça plante si la recherche est caput)

### Affichage restaurant
- Les infos de base : nom, adresse, note moyenne
- Une image si j'arrive à la récupérer
- Savoir s'il est ouvert ou fermé (ça peut être utile)

### Affichage des avis
- Les 10 derniers avis comme demandé
- Note, commentaire, date - je vais voir ce que je peux récupérer
- Auteur si c'est disponible sur le site

## Note importante

Le scraping, faut faire gaffe. Je vais respecter les robots.txt et pas spammer leurs serveurs. C'est juste pour le test technique, pas pour faire tourner ça en prod.
