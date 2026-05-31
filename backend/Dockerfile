FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

COPY backend/sources.list /etc/apt/sources.list.d/ubuntu.sources

RUN apt-get update && apt-get install -y \
    mysql-server \
    nodejs \
    npm \
    nginx \
    && apt-get clean

# Install Node 20 properly
RUN npm install -g n && n 20

# Backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .

# Frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

COPY backend/init.sql /init.sql
COPY backend/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]