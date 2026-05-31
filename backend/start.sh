#!/bin/bash

# Start MySQL
service mysql start

# Wait for MySQL to be ready
echo "Waiting for MySQL..."
until mysqladmin ping --silent; do
  sleep 2
done

echo "MySQL is ready"

# Run init SQL
mysql -u root < /init.sql

# Set root password
mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Humph2026!Secure'; FLUSH PRIVILEGES;"

echo "Starting Node.js backend..."
node /app/server.js