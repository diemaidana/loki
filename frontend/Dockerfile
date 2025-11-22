FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

RUN npm install -g @angular/cli

COPY . .

EXPOSE 4200

CMD ["npm", "start"]
