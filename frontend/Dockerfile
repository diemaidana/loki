FROM node:24-alpine

WORKDIR /usr/src/app

# Copiamos los package.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Instalamos Angular CLI global
RUN npm install -g @angular/cli

# Copiamos el resto del proyecto
COPY . .

EXPOSE 4200

CMD ["npm", "start"]
