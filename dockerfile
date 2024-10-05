FROM node:20-alpine

WORKDIR /node.js/artifacter-node

COPY package*.json ./

RUN apk add install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

RUN npm install

COPY ./ .

EXPOSE 3000

CMD ["npm", "run", "dev"]