-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         5.7.32-0ubuntu0.18.04.1 - (Ubuntu)
-- SO del servidor:              Linux
-- HeidiSQL Versión:             11.1.0.6116
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para prueba-zinobe-2021
CREATE DATABASE IF NOT EXISTS `prueba-zinobe-2021` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `prueba-zinobe-2021`;

-- Volcando estructura para tabla prueba-zinobe-2021.requests
CREATE TABLE IF NOT EXISTS `requests` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `metadata` json DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_requests_usersZinobe` (`user_id`),
  CONSTRAINT `FK_requests_usersZinobe` FOREIGN KEY (`user_id`) REFERENCES `usersZinobe` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Volcando datos para la tabla prueba-zinobe-2021.requests: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `requests` ENABLE KEYS */;

-- Volcando estructura para tabla prueba-zinobe-2021.usersZinobe
CREATE TABLE IF NOT EXISTS `usersZinobe` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(225) COLLATE utf8_unicode_ci DEFAULT NULL,
  `document` varchar(225) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` text COLLATE utf8_unicode_ci NOT NULL,
  `country` varchar(225) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pass` longtext COLLATE utf8_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Volcando datos para la tabla prueba-zinobe-2021.usersZinobe: ~6 rows (aproximadamente)
/*!40000 ALTER TABLE `usersZinobe` DISABLE KEYS */;
/*!40000 ALTER TABLE `usersZinobe` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
