CREATE DATABASE IF NOT EXISTS user_management;
USE user_management;

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

INSERT IGNORE INTO roles (name) VALUES ('admin'), ('manager'), ('user');

-- Seed test accounts (password for all: "password")
INSERT IGNORE INTO users (name, email, password, role_id) VALUES
  ('Admin User',   'admin@test.com',   '$2b$10$sir664FHj61BfzyQ.zpCBu6E8NkVuf4AAQl.YfXZ/S3WP.qX.PC4y', (SELECT id FROM roles WHERE name = 'admin')),
  ('Manager User', 'manager@test.com', '$2b$10$sir664FHj61BfzyQ.zpCBu6E8NkVuf4AAQl.YfXZ/S3WP.qX.PC4y', (SELECT id FROM roles WHERE name = 'manager')),
  ('Regular User', 'user@test.com',    '$2b$10$sir664FHj61BfzyQ.zpCBu6E8NkVuf4AAQl.YfXZ/S3WP.qX.PC4y', (SELECT id FROM roles WHERE name = 'user'));