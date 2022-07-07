FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install prettier -g

RUN npm install

COPY . .

# RUN npm run build

EXPOSE 7002

CMD [ "node", "build/server.js" ]