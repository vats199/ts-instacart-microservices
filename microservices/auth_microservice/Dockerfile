FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g typescript

RUN npm install -g ts-node

RUN npm install

COPY . .

EXPOSE 7001

CMD [ "npm", "start" ]