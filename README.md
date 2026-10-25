# Stage Burkina

**Stage Burkina** est un projet d'application web destiné à faciliter la consultation d'offres de stage au Burkina Faso et la mise en relation entre étudiants et entreprises.

**Déploiement configuré dans les paramètres du dépôt : [stage-burkina.vercel.app](https://stage-burkina.vercel.app/).** La disponibilité de la démo et la connexion entre frontend et API restent à vérifier ; ce README décrit d'abord les fonctionnalités présentes dans le code.

Le dépôt contient une application frontend et une API backend séparées. Il ne faut pas considérer le projet comme une plateforme de production sans tests et vérifications supplémentaires.

## Fonctionnalités présentes dans le code

- Inscription et connexion avec les rôles `STUDENT` et `COMPANY`.
- Consultation de la liste des offres et de leurs détails.
- Création, modification et suppression d'offres par les comptes entreprise.
- Candidature à une offre par un compte étudiant.
- Consultation des candidatures de l'étudiant et des candidatures reçues par l'entreprise.
- Mise à jour du statut d'une candidature : `pending`, `accepted` ou `rejected`.
- Gestion du profil étudiant ou entreprise.
- Authentification par jeton JWT et validation des entrées.

## Stack technique

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### Backend

- Node.js
- Express 5
- Prisma ORM
- PostgreSQL
- JWT pour l'authentification
- bcryptjs pour le hachage des mots de passe
- Zod pour la validation des données

## Architecture

```text
.
├── frontend/              # Application Next.js
│   ├── app/                # Pages et routes de l'application
│   ├── components/         # Composants d'interface
│   ├── context/            # Contexte d'authentification
│   ├── services/api.ts     # Client HTTP vers l'API
│   └── types/              # Types TypeScript
└── backend/                # API Express
    ├── prisma/             # Schéma et migrations Prisma
    └── src/
        ├── controllers/
        ├── middlewares/
        ├── routes/
        ├── services/
        └── utils/
```

## Prérequis

- Node.js compatible avec Next.js 16 (Node.js 20.9 ou supérieur recommandé)
- npm
- Une instance PostgreSQL accessible depuis le backend

## Installation locale

### 1. Récupérer le projet

```bash
git clone https://github.com/XAlbert07/-StageBurkina.git
cd ./-StageBurkina
```

### 2. Configurer et démarrer le backend

Dans le dossier `backend`, installe les dépendances :

```bash
cd backend
npm install
```

Crée un fichier `.env` dans `backend/` avec les paramètres adaptés à ta base PostgreSQL :

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/stage_burkina?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=5000
```

Remplace `USER` et `PASSWORD` par les identifiants de ta base. Ne publie jamais les secrets du fichier `.env`.

Assure-toi que PostgreSQL est démarré et que la base `stage_burkina` existe, puis exécute :

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

L'API écoute par défaut sur [http://localhost:5000](http://localhost:5000). Pour vérifier qu'elle répond, ouvre [http://localhost:5000/health](http://localhost:5000/health).

### 3. Configurer et démarrer le frontend

Ouvre un second terminal à la racine du dépôt, puis :

```bash
cd frontend
npm install
```

Crée un fichier `.env.local` dans `frontend/` :

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Démarre Next.js :

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

Le frontend utilise `http://localhost:5000` par défaut si `NEXT_PUBLIC_API_URL` n'est pas défini.

## Principales routes de l'API

| Méthode | Route | Accès |
| --- | --- | --- |
| `GET` | `/health` | Public — vérification de l'API |
| `POST` | `/api/auth/register` | Public — inscription |
| `POST` | `/api/auth/login` | Public — connexion |
| `GET` | `/api/offers` | Public — liste des offres actives |
| `GET` | `/api/offers/:id` | Public — détail d'une offre |
| `POST` | `/api/offers` | Entreprise authentifiée |
| `PUT` | `/api/offers/:id` | Entreprise authentifiée |
| `DELETE` | `/api/offers/:id` | Entreprise authentifiée |
| `POST` | `/api/applications` | Étudiant authentifié |
| `GET` | `/api/applications/student` | Étudiant authentifié |
| `GET` | `/api/applications/company` | Entreprise authentifiée |
| `PATCH` | `/api/applications/:id/status` | Entreprise authentifiée |
| `GET` | `/api/profile/me` | Utilisateur authentifié |
| `PUT` | `/api/profile/me` | Utilisateur authentifié |

Les routes protégées attendent un jeton JWT dans l'en-tête `Authorization: Bearer <token>`. Les droits dépendent du rôle associé au compte.

## Notes de développement

- Le frontend et le backend doivent fonctionner dans deux terminaux différents.
- La base de données et les variables d'environnement doivent être configurées avant d'utiliser les fonctions d'authentification et de candidature.
- Vérifie les flux principaux et les règles d'accès avant tout déploiement public.
- Ne committe pas les fichiers `.env` ou `.env.local`, ni aucun secret.

## État du projet

Cette documentation décrit l'organisation et les routes trouvées dans le code. Le niveau de préparation à la production, la couverture de tests et la configuration de déploiement doivent être évalués séparément.
