# thank you

backend service for thank you app

## Install

git clone https://github.com/hhouston/good-friend-service.git
cd good-friend-service
yarn

## Config

Create file config/local.json. email hmhouston7@gmail.com for contents

## Run Locally

yarn run server
docker compose up -d

## PM2

yarn clean
yarn build
yarn server:prod

pm2 list
pm2 stop
pm2 restart <num of pod>
pm2 start <num of pod>
pm2 delete <num of pod>

## Docker

sudo systemctl enable docker
docker compose up -d
