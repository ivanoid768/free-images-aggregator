FROM node:14.15

WORKDIR /usr/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 4000
ENTRYPOINT ./start.sh
