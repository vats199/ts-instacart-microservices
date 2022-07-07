FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

COPY tsconfig*.json ./

RUN npm install prettier -g

RUN npm install

COPY . .

npm run build

EXPOSE 7001

CMD [ "node", "build/server.js" ]