# Setup initial - Première installation

## Installation rapide

```bash
# 1. Installer les dépendances backend
cd server
npm install
cp env.example .env  # Puis éditer .env si besoin
cd ..

# 2. Installer les dépendances frontend
cd client
npm install
cp env.local.example .env.local  # Puis éditer si besoin
cd ..
```

## Lancer le projet

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

## Tester la connexion

1. Ouvrir http://localhost:3000
2. Cliquer sur "Tester la connexion"
3. Devrait afficher "✅ Backend connecté !"

Si ça ne marche pas, vérifier :
- Les deux serveurs sont bien lancés
- Les ports 3000 et 3001 sont libres
- Le fichier `.env` du server contient `FRONTEND_URL=http://localhost:3000`

