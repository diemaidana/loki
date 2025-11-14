FROM node:24-alpine

WORKDIR /usr/src/app

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
