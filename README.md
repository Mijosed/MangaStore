# MangaStore 🍜

Un site e-commerce moderne pour la vente de mangas, développé avec Nuxt 3, Vue.js et TypeScript.

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

## 🚀 Installation

1. Clonez le repository
2. Installez les dépendances :

```bash
npm install
```

3. Configurez les variables d'environnement :
   - Créez un fichier `.env` à la racine du projet
   - Configurez vos variables selon le fichier `.env.example`

4. Lancez le serveur de développement :

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🧪 Tests

Pour exécuter les tests :

```bash
npm test -- test/components/StarRating.test.ts
```

## 🛠️ Technologies utilisées

- **Nuxt 3** - Framework Vue.js full-stack
- **Vue.js 3** - Framework frontend
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Vitest** - Framework de test
- **Supabase** - Base de données et authentification

## 📁 Structure du projet

- `components/` - Composants Vue réutilisables
- `pages/` - Pages de l'application
- `composables/` - Fonctions composables Vue
- `stores/` - Gestion d'état avec Pinia
- `types/` - Définitions TypeScript
- `middleware/` - Middleware Nuxt
- `server/` - API endpoints côté serveur

## 🏪 Fonctionnalités

- Catalogue de mangas avec filtres et recherche
- Panier d'achat et gestion des commandes
- Authentification utilisateur
- Interface d'administration
- Paiement intégré
- Système de notation et avis
