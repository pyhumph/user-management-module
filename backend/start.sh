#!/bin/bash

echo "Configuring MariaDB to listen on port 5051..."
cat > /etc/mysql/mariadb.conf.d/99-custom-port.cnf << 'EOF'
[mysqld]
port=5051
EOF

echo "Starting MariaDB..."
service mariadb start

until mysqladmin ping --silent; do
  echo "Waiting for MariaDB..."
  sleep 2
done

echo "MariaDB ready. Setting up database..."
mysql -u root < /init.sql
mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('Humph2026!Secure'); FLUSH PRIVILEGES;"

echo "Configuring Nginx for frontend on port 5052..."
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 5052;
    root /frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

nginx -t && service nginx start

echo "Starting Node.js backend on port 5050..."
cd /app && node server.js &

echo "==============================="
echo "All services running:"
echo "  Backend API : port 5050"
echo "  Frontend    : port 5052"
echo "==============================="

wait