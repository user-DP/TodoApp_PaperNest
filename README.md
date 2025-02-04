# Application Todo

## Description

Ceci est un projet d'application de liste de tâches (todo).

## Prérequis

- Node.js (^18.19.1 || ^20.11.1 || ^22.0.0)
- npm ou yarn
- Docker (optionnel)

## Installation et Configuration

### Sans Docker

1. Cloner le dépôt :

```bash
git clone https://github.com/user-DP/TodoApp_PaperNest.git
cd todo-app-papernest
```

2. Installer les dépendances :

```bash
npm install
# ou
yarn install
```

3. Démarrer l'application :

```bash
npm start
# ou
yarn start
```

L'application sera accessible à l'adresse `http://localhost:4200`

### Avec Docker

1. Cloner le dépôt :

```bash
git clone https://github.com/user-DP/TodoApp_PaperNest.git
cd todo-app-papernest
```

2. Construire et exécuter avec Docker :

```bash
docker-compose up --build
```

L'application sera accessible à l'adresse `http://localhost:4200`
