# Guide de démarrage rapide

## Setup en 5 minutes

### 1. Créer le projet frontend (Next.js)

```bash
npx create-next-app@latest client --typescript --tailwind --app --no-src-dir
cd client
npm install
```

### 2. Créer le projet backend (Express)

```bash
cd ..
mkdir server
cd server
npm init -y
npm install express cors dotenv
npm install puppeteer axios
npm install -D nodemon @types/node @types/express
```

### 3. Configuration backend

**package.json** (server/package.json) :
```json
{
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  }
}
```

**index.js** (server/index.js) :
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 4. Configuration frontend

**.env.local** (client/.env.local) :
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Test de communication

**client/app/page.tsx** :
```typescript
'use client';

export default function Home() {
  const testAPI = async () => {
    const res = await fetch('http://localhost:3001/api/health');
    const data = await res.json();
    console.log(data);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Backoffice Deliveroo</h1>
      <button 
        onClick={testAPI}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test API
      </button>
    </main>
  );
}
```

### 6. Lancer les deux serveurs

**Terminal 1 (Backend) :**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend) :**
```bash
cd client
npm run dev
```

Visiter http://localhost:3000 et cliquer sur "Test API". Vérifier la console.

## Structure recommandée initiale

```
projet-dokaa/
├── client/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── lib/
│   └── package.json
├── server/
│   ├── index.js
│   ├── routes/
│   ├── services/
│   └── package.json
└── docs/
```

## Prochaines étapes

1. Créer la structure de dossiers
2. Implémenter la barre de recherche (avec données mockées)
3. Créer le service de scraping
4. Intégrer le scraping dans l'API
5. Créer l'interface d'affichage

## Résolution de problèmes

### Erreur CORS
Ajouter dans `server/index.js` :
```javascript
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

### Puppeteer ne s'installe pas
```bash
# Windows
npm install puppeteer --ignore-scripts

# Ou utiliser puppeteer-core et installer Chrome séparément
```

### Port déjà utilisé
Changer le port dans `.env` ou `package.json`

## Documentation complète

Consultez les autres fichiers dans `docs/` :
- `ARCHITECTURE.md` - Architecture complète
- `TECHNOLOGIES.md` - Guide des technologies
- `APIS_ET_SCRAPING.md` - Guide de scraping
- `RESSOURCES.md` - Ressources et liens utiles
- `EXEMPLES_CODE.md` - Exemples de code prêts à l'emploi

Bon développement !

