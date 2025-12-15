CREATE SCHEMA IF NOT EXISTS spaceinvaders_schema;
CREATE USER IF NOT EXISTS 'spaceinvaders_db_user'@'%' IDENTIFIED BY 'spaceinvaders_pass';
GRANT ALL PRIVILEGES ON spaceinvaders_schema.* TO 'spaceinvaders_db_user'@'%';
FLUSH PRIVILEGES;
