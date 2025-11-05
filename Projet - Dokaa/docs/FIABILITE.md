# Système de fiabilité des données

Pour garantir que le backoffice affiche uniquement des données fiables, j'ai mis en place un système de validation complet qui vérifie plusieurs aspects.

## Ce qui est vérifié

### Pour les restaurants

1. **URL Deliveroo valide**
   - Vérifie que l'URL correspond bien au domaine Deliveroo (deliveroo.fr, deliveroo.com, etc.)
   - Vérifie que l'URL suit le format attendu pour un restaurant Deliveroo
   - Format attendu : `https://deliveroo.fr/fr/restaurants/[region]/[slug]`

2. **Adresse valide**
   - Vérifie qu'une adresse est présente
   - Vérifie qu'elle contient un numéro de rue
   - Vérifie qu'elle contient un nom de rue (rue, avenue, boulevard, etc.)
   - Vérifie qu'elle contient un code postal français (5 chiffres)

3. **Note valide**
   - Vérifie que la note est un nombre
   - Vérifie que la note est entre 0 et 5

4. **Données complètes**
   - Vérifie la présence d'une image
   - Vérifie la présence d'une ville
   - Vérifie la présence d'un nom

### Pour les avis

1. **Source de l'avis**
   - Détecte automatiquement si l'avis provient de Deliveroo, Google, ou TripAdvisor
   - Basé sur l'URL du restaurant et le contenu du commentaire

2. **Validité de l'avis**
   - Vérifie que la note est valide (0-5)
   - Vérifie que la date est valide
   - Vérifie la présence d'un auteur et d'un commentaire

## Score de fiabilité

Chaque restaurant reçoit un score de fiabilité de 0 à 100% basé sur :

- **100%** : Toutes les vérifications passent (URL Deliveroo valide, adresse valide, note, image, ville)
- **80-99%** : La plupart des vérifications passent
- **< 80%** : Des données manquent ou sont invalides

## Indicateurs visuels

### Badges de vérification

- **✓ Vérifié Deliveroo** : Restaurant avec URL Deliveroo valide et score de fiabilité ≥ 80%
- **⚠ À vérifier** : Restaurant qui nécessite une vérification manuelle
- **X% fiable** : Score de fiabilité affiché pour les restaurants < 90%

### Badges de source pour les avis

- **✓ Deliveroo** : Avis provenant de Deliveroo
- **Google** : Avis provenant de Google
- **TripAdvisor** : Avis provenant de TripAdvisor
- **Source inconnue** : Source non détectée

## Utilisation

### Côté backend

Le service `validator.js` est utilisé automatiquement dans toutes les routes :

```javascript
const validator = require('../services/validator');

// Valider un restaurant
const validation = validator.validateRestaurant(restaurant);
// Retourne : { valid, errors, warnings, verified, reliabilityScore, needsVerification }

// Valider un avis
const reviewValidation = validator.validateReview(review, restaurantUrl);
// Retourne : { valid, errors, warnings, verified, source }
```

### Côté frontend

Les métadonnées de validation sont incluses dans les réponses API sous `_validation` :

```typescript
interface Restaurant {
  // ... autres propriétés
  _validation?: {
    reliabilityScore?: number;
    verified?: {
      address?: boolean;
      deliverooUrl?: boolean;
      rating?: boolean;
      image?: boolean;
    };
    needsVerification?: boolean;
    warnings?: string[];
  };
}
```

Les badges de vérification s'affichent automatiquement dans :
- `RestaurantCard` : Badge compact
- Page détail restaurant : Badge + informations détaillées
- `ReviewCard` : Badge indiquant la source de l'avis

## Améliorations futures

- Vérification réelle de l'existence du restaurant sur Deliveroo (requête HTTP)
- Géolocalisation des adresses pour vérifier qu'elles existent
- Vérification que les coordonnées GPS correspondent à l'adresse
- Système de cache pour les validations
- Alertes automatiques pour les restaurants nécessitant une vérification

## Notes importantes

- Les validations sont faites côté serveur pour garantir la sécurité
- Les métadonnées de validation sont incluses dans chaque réponse API
- Les restaurants avec un score < 80% sont marqués comme nécessitant une vérification
- Les avis sont automatiquement étiquetés avec leur source détectée

