FROM node:20-alpine

RUN apk add --no-cache mysql mysql-client

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

COPY init.sql /docker-entrypoint-initdb.d/init.sql

EXPOSE 5000

COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]