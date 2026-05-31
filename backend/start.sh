#!/bin/bash

echo "Starting MySQL..."
usermod -d /var/lib/mysql mysql
service mysql start

until mysqladmin ping --silent; do
  echo "Waiting for MySQL..."
  sleep 2
done

echo "MySQL ready. Setting up database..."
mysql -u root < /init.sql
mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Humph2026!Secure'; FLUSH PRIVILEGES;"

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
echo "  Backend API : http://YOUR_VPS_IP:5050"
echo "  Frontend    : http://YOUR_VPS_IP:5052"
echo "==============================="

wait