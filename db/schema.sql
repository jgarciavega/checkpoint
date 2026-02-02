-- db/schema.sql
-- Esquema sugerido para la base 'checkpoint'.
-- Ejecuta esto en MySQL Workbench si necesitas crear la tabla 'registros'.

CREATE DATABASE IF NOT EXISTS `checkpoint` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `checkpoint`;

CREATE TABLE IF NOT EXISTS `registros` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `numeroUnidad` VARCHAR(100),
  `conductor` VARCHAR(200),
  `empresa` VARCHAR(200),
  `modelo` VARCHAR(100),
  `placas` VARCHAR(50),
  `anio` VARCHAR(10),
  `poliza` VARCHAR(100),
  `movimiento` VARCHAR(100),
  `folio` VARCHAR(100),
  `fecha` DATETIME,
  `payload` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
