#!/bin/sh

# Start MySQL
mkdir -p /var/lib/mysql
mysql_install_db --user=root --datadir=/var/lib/mysql > /dev/null 2>&1

mysqld_safe --datadir=/var/lib/mysql &

# Wait for MySQL to be ready
echo "Waiting for MySQL to start..."
until mysqladmin ping --silent; do
  sleep 2
done

echo "MySQL is ready"

# Run init SQL
mysql -u root < /app/init.sql

# Set root password
mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'Humph2026!Secure'; FLUSH PRIVILEGES;"

# Start Node.js backend
echo "Starting Node.js backend..."
node server.js