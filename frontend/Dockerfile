FROM node:24-alpine

WORKDIR /usr/src/app

COPY frontend/package*.json ./

RUN npm install -g @angular/cli && npm install

COPY frontend/ .

EXPOSE 4200

CMD ["npm", "start"]
