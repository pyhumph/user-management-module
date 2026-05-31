FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    mysql-server \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

COPY init.sql /init.sql
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]