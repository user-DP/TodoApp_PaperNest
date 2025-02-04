FROM node:20-alpine

WORKDIR /app

# Installation des dépendances globales
RUN npm install -g @angular/cli@19

# Copie des fichiers de configuration
COPY package*.json ./
COPY angular.json ./
COPY tailwind.config.js ./
COPY tsconfig*.json ./

# Installation des dépendances du projet
RUN npm install

# Copie du code source
COPY src/ ./src/

EXPOSE 4200

# Démarrage du serveur de développement
CMD ["ng", "serve", "--host", "0.0.0.0"]