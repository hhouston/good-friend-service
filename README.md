# thank you

backend service for thank you app

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

sudo systemctl enable docker.
docker compose up -d
