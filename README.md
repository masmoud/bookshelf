# BookShelf

BookShelf est une application web permettant de rechercher, découvrir et sauvegarder des livres dans une bibliothèque personnelle.

Le projet utilise l'API publique Open Library pour récupérer les informations des livres et Supabase pour gérer l'authentification des utilisateurs ainsi que la persistance de leurs favoris.

## Aperçu

_Captures d'écran à ajouter après la réalisation du projet._

## Fonctionnalités

### Recherche et découverte

- Affichage d'une sélection de livres.
- Recherche par titre ou auteur.
- Affichage des résultats sous forme de cartes.
- Gestion des résultats inexistants.

### Fiches détaillées

- Affichage de la couverture du livre.
- Titre et auteurs.
- Date de première publication.
- Nombre d'éditions lorsque disponible.
- Description et sujets lorsque disponibles.

### Authentification

- Création d'un compte utilisateur.
- Connexion avec email et mot de passe.
- Déconnexion.
- Gestion des sessions avec Supabase Auth.
- Protection des pages nécessitant une authentification.
- Redirection vers la page initialement demandée après connexion.

### Favoris

- Ajouter un livre aux favoris.
- Retirer un livre des favoris.
- Consulter sa liste de favoris.
- Synchronisation des favoris entre les pages.
- Persistance des données avec Supabase PostgreSQL.
- Accès aux favoris réservé aux utilisateurs authentifiés.

### Gestion des états

- États de chargement.
- Gestion des erreurs API et Supabase.
- Affichage de messages lorsque aucun résultat ou favori n'est disponible.
- Gestion des données manquantes.

## Technologies

- **Next.js** – Framework React et gestion du routage.
- **React** – Construction des interfaces.
- **TypeScript** – Typage et sécurité du code.
- **Tailwind CSS** – Mise en forme et responsive design.
- **Supabase Auth** – Authentification et gestion des sessions.
- **Supabase PostgreSQL** – Stockage des favoris.
- **Supabase Row Level Security (RLS)** – Protection des données utilisateurs.
- **Open Library API** – Récupération des données des livres.
- **Lucide React** – Icônes de l'interface.

## API

Le projet utilise l'API publique Open Library.

Documentation : https://openlibrary.org/developers/api

Quelques endpoints utilisés :

| Endpoint                        | Utilisation                        |
| ------------------------------- | ---------------------------------- |
| `/search.json?q=harry+potter`   | Recherche de livres                |
| `/search.json?title=the+hobbit` | Recherche par titre                |
| `/works/{id}.json`              | Informations détaillées d'un livre |
| `/authors/{id}.json`            | Informations sur un auteur         |
| `/works/{id}/editions.json`     | Informations sur les éditions      |

Les couvertures sont récupérées avec :

`https://covers.openlibrary.org/b/id/{coverId}-L.jpg`

Toutes les informations ne sont pas nécessairement disponibles pour chaque livre. L'application gère donc les données manquantes.

## Base de données et sécurité

Supabase est utilisé pour l'authentification et le stockage des favoris.

La table `favorites` contient notamment :

- `id` : identifiant du favori.
- `user_id` : identifiant de l'utilisateur.
- `book_id` : identifiant du livre provenant d'Open Library.
- `created_at` : date d'ajout du favori.

Une contrainte d'unicité empêche un utilisateur d'ajouter plusieurs fois le même livre.

La sécurité des données est assurée par Row Level Security (RLS), afin que chaque utilisateur puisse uniquement consulter, ajouter et supprimer ses propres favoris.

## Installation

### Prérequis

- Node.js
- pnpm
- Un projet Supabase

### Cloner le projet

```bash
git clone https://github.com/masmoud/bookshelf.git
cd bookshelf
```

### Installer les dépendances

```bash
pnpm install
```

### Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Les valeurs sont disponibles dans les paramètres du projet Supabase.

### Lancer le serveur de développement

```bash
pnpm dev
```

L'application sera accessible à l'adresse :

http://localhost:3000

### Commandes disponibles

```bash
pnpm build    # Construire l'application
pnpm start    # Lancer l'application en production
pnpm lint     # Vérifier le code
```

## Structure du projet

```text
src/
├── app/
│   ├── books/
│   ├── favorites/
│   ├── login/
│   └── signup/
├── components/
│   ├── books/
│   ├── layout/
│   └── ui/
├── hooks/
├── lib/
│   └── supabase/
├── types/
└── utils/
proxy.ts
```

- `app` : pages et routage.
- `components` : composants réutilisables de l'interface.
- `hooks` : hooks personnalisés pour la gestion des données et des interactions.
- `lib` : communication avec les API et configuration des services.
- `types` : définitions TypeScript.
- `utils` : fonctions utilitaires.
- `proxy.ts` : synchronisation des sessions Supabase et protection des routes.

## Roadmap

- [x] Initialisation du projet Next.js et Tailwind CSS.
- [x] Mise en place de la structure des dossiers.
- [x] Définition des types TypeScript.
- [x] Connexion à l'API Open Library.
- [x] Affichage des livres sur la page d'accueil.
- [x] Création des composants BookCard et BookList.
- [x] Implémentation de la recherche.
- [ ] Ajout des filtres et du tri.
- [x] Création des pages de détails.
- [x] Implémentation du système de favoris.
- [x] Persistance des favoris avec Supabase PostgreSQL.
- [x] Mise en place de l'authentification avec Supabase.
- [x] Protection des pages privées.
- [x] Gestion des états de chargement et d'erreur.
- [ ] Amélioration du responsive design.
- [ ] Tests et corrections.
- [ ] Déploiement.

## Objectifs pédagogiques

Ce projet permet de mettre en pratique :

- La récupération et l'exploitation de données depuis une API REST.
- La création de composants réutilisables avec React.
- L'utilisation des hooks React et des hooks personnalisés.
- La gestion des états et des effets.
- Le typage des données avec TypeScript.
- Le routage dynamique avec Next.js.
- L'authentification et la gestion des sessions.
- L'intégration d'une base de données PostgreSQL avec Supabase.
- La sécurisation des données avec Row Level Security.
- La gestion des erreurs et des opérations asynchrones.
- La conception d'une interface responsive.

## Auteur

Développé par **Mohamed Amoussa** dans le cadre d'un projet personnel de développement web.
