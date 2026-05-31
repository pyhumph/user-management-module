FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

COPY backend/sources.list /etc/apt/sources.list.d/ubuntu.sources

RUN apt-get update && apt-get install -y \
    mariadb-server \
    nginx \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

COPY backend/init.sql /init.sql
COPY backend/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]