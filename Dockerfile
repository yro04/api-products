FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g ts-node nodemon

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]