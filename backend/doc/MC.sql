-- MySQL dump 10.16  Distrib 10.1.23-MariaDB, for debian-linux-gnueabihf (armv7l)
--
-- Host: localhost    Database: MC
-- ------------------------------------------------------
-- Server version	10.1.23-MariaDB-9+deb9u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `target_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `content` varchar(400) NOT NULL,
  `note` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `target_id` (`target_id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `Comment_ibfk_1` FOREIGN KEY (`target_id`) REFERENCES `User` (`id`),
  CONSTRAINT `Comment_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
INSERT INTO `Comment` VALUES (1,1,2,'Blah Blah Blah !',2),(2,1,2,'Blah Blah Blah !',2),(3,1,2,'Blah Blah Blah !',2),(4,1,2,'Blah Blaj Blah',3),(5,1,2,'blah blah blah',3),(6,1,2,'blah blah blah',3);
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Meta`
--

DROP TABLE IF EXISTS `Meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `last_timed_verification` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Meta`
--

LOCK TABLES `Meta` WRITE;
/*!40000 ALTER TABLE `Meta` DISABLE KEYS */;
/*!40000 ALTER TABLE `Meta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notification`
--

DROP TABLE IF EXISTS `Notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `User_id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `new` int(11) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `User_id` (`User_id`),
  CONSTRAINT `Notification_ibfk_1` FOREIGN KEY (`User_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notification`
--

LOCK TABLES `Notification` WRITE;
/*!40000 ALTER TABLE `Notification` DISABLE KEYS */;
INSERT INTO `Notification` VALUES (1,1,0,'cloclo a lancé une procédure de réservation relative à votre recette Recette de test.',0),(2,1,0,'cloclo a lancé une procédure de réservation relative à votre recette Recette de test.',0),(3,1,0,'cloclo a lancé une procédure de réservation relative à votre recette Recette de test.',0),(4,1,0,'cloclo a lancé une procédure de réservation relative à votre recette Recette de test.',0),(5,1,0,'cloclo a lancé une procédure de réservation relative à votre recette Recette de test.',0),(6,1,0,'cloclo a lancé une procédure de réservation relative à votre recette Recette de test.',0),(7,1,0,'cloclo a lancé une procédure de réservation relative à votre recette Recette de test.',0),(8,1,0,'cloclo a lancé une procédure de réservation relative à votre recette Recette de test.',0),(9,1,0,'cloclo a lancé une procédure de réservation relative à votre recette Une autre recette de test.',0),(10,1,0,'cloclo a lancé une procédure de réservation relative à votre recette Une autre recette de test.',0),(11,1,0,'cloclo a lancé une procédure de réservation relative à votre recette Une autre recette de test.',0),(12,1,0,'cloclo a lancé une procédure de réservation relative à votre recette Une autre recette de test.',0),(13,2,0,'Votre réservation concernant la recette Recette de test a été annulée. Vous serez remboursé sous peu selon les conditions MeltingCook.',0),(14,1,0,'Une réservation concernant la recette Recette de test a été annulée.',0),(15,1,0,'cloclo a lancé une procédure de réservation relative à votre recette Une autre recette de test.',0),(16,1,0,'Votre ancien invité cloclo a lancé la procédure de finalisation de sa réservation! Vous devriez bientôt reçevoir votre compensation !',0),(17,2,0,'Votre réservation concernant la recette Une autre recette de test a été finalisée. Votre hôte va recevoir votre compensation et vous remercie !',0),(18,1,0,'Vous avez reçu une compensation relative à la recette Une autre recette de test ! Allez jeter un oeil à votre compte Paypal !',0);
/*!40000 ALTER TABLE `Notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Origin`
--

DROP TABLE IF EXISTS `Origin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Origin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(400) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Origin`
--

LOCK TABLES `Origin` WRITE;
/*!40000 ALTER TABLE `Origin` DISABLE KEYS */;
INSERT INTO `Origin` VALUES (1,'Française');
/*!40000 ALTER TABLE `Origin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pins`
--

DROP TABLE IF EXISTS `Pins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Pins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(400) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pins`
--

LOCK TABLES `Pins` WRITE;
/*!40000 ALTER TABLE `Pins` DISABLE KEYS */;
INSERT INTO `Pins` VALUES (1,'Halal');
/*!40000 ALTER TABLE `Pins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Recipe`
--

DROP TABLE IF EXISTS `Recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Recipe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(400) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `picture` varchar(400) NOT NULL,
  `User_id` int(11) NOT NULL,
  `origin` varchar(400) NOT NULL,
  `items` varchar(1000) NOT NULL,
  `date_start` int(11) NOT NULL,
  `date_end` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `places` int(11) NOT NULL,
  `pins` varchar(1000) DEFAULT NULL,
  `place` varchar(400) NOT NULL,
  `verified` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `User_id` (`User_id`),
  CONSTRAINT `Recipe_ibfk_1` FOREIGN KEY (`User_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Recipe`
--

LOCK TABLES `Recipe` WRITE;
/*!40000 ALTER TABLE `Recipe` DISABLE KEYS */;
INSERT INTO `Recipe` VALUES (1,'Gloubiboulga','La recette préférée de Casimir Il en mange tout le temps ce gros porc.','http://img0.encyclopedie-incomplete.com/local/cache-vignettes/L468xH340/casimir_hippolyte_gloubiboulga-c017e.jpg',1,'Française','Saucisse de morteau;Caca;prout',1502229600,1503612000,1,44.8026,-0.588054,1,'Halal','45.9;-1.033333',0),(2,'Un bon gros caca','Du bon gros caca en boite comme on l\'aime tous, cuisiné avec amour putain','http://borkborkiamdoggo.com/wp-content/uploads/2016/12/alex-g-did-me-a-scare-is-not-a-trump-is-a-doggofoxxo.jpg',1,'Française','Caca',1502834400,1504130400,12,44.8026,-0.588054,42,'Halal','Hénin-Beaumont',0),(3,'Recette de test','Ceci est une authentique recette de test ! C\'est fou non ?','https://pbs.twimg.com/profile_images/937626330249728000/5lLvVCtZ_400x400.jpg',1,'Française','Du code;Du savoir-faire;De la débrouille',1512514800,1514588400,12,44.7835,-0.592012,2,'Halal','Bordeaux',0),(4,'Une autre recette de test','Une autre recette de testUne autre recette de testUne autre recette de testUne autre recette de testUne autre recette de testUne autre recette de testUne autre recette de testUne autre recette de testUne autre recette de testUne autre recette de testUne autre recette de test','http://gamingway.fr/wp-content/uploads/2017/04/clavier_mecanique_rgb_keyz_meca_the_g_lab_g-lab_avis_test_materiel-2.jpg',1,'Française','Du savoir faire;Du café;Encore du café',1515711600,1517353200,1,44.7835,-0.592012,2,'Halal','Talence',0),(5,'Recette de test','Recette de yesy kdkqsdsq qsdslqdj djsqldjlsqld qldjklqsjdklsqdqs','https://i.ytimg.com/vi/emks-wCjeEg/maxresdefault.jpg',1,'Française','Test',1517439600,1517612400,12,44.7835,-0.592012,12,'Halal','Ozan (01190)',0),(6,'Un eautre test','sd;qdlqsd kjdhjkjqsdhkjqshd jdhkjqsdhkjq hjdhqsdsdqs','https://tpc.googlesyndication.com/daca_images/simgad/10488446704168320102?w=400&h=209',1,'Française','test;',1517353200,1517612400,12,44.7835,-0.592012,12,'Halal','Ozan (01190)',0),(7,'dsqdsqdsq','dsqdqsdqsdqsdsqdqsdsdqdsqdsqdsqdsqdsqsdqdsdqsdsdqsdsqdsqdqs','https://tpc.googlesyndication.com/daca_images/simgad/10488446704168320102?w=400&h=209',1,'Française','caca',1517439600,1517612400,12,46.3833,4.91667,12,'Halal','Ozan (01190)',0);
/*!40000 ALTER TABLE `Recipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Report`
--

DROP TABLE IF EXISTS `Report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `target_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `state` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `author_id` (`author_id`),
  KEY `target_id` (`target_id`),
  CONSTRAINT `Report_ibfk_1` FOREIGN KEY (`target_id`) REFERENCES `User` (`id`),
  CONSTRAINT `Report_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Report`
--

LOCK TABLES `Report` WRITE;
/*!40000 ALTER TABLE `Report` DISABLE KEYS */;
/*!40000 ALTER TABLE `Report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reservation`
--

DROP TABLE IF EXISTS `Reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Reservation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `host_id` int(11) NOT NULL,
  `guest_id` int(11) NOT NULL,
  `Recipe_id` int(11) NOT NULL,
  `paid` int(11) NOT NULL,
  `done` int(11) NOT NULL,
  `txn_id` varchar(400) DEFAULT NULL,
  `ended_at` int(11) DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL,
  `paid_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Recipe_id` (`Recipe_id`),
  KEY `host_id` (`host_id`),
  CONSTRAINT `Reservation_ibfk_1` FOREIGN KEY (`host_id`) REFERENCES `User` (`id`),
  CONSTRAINT `Reservation_ibfk_3` FOREIGN KEY (`Recipe_id`) REFERENCES `Recipe` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reservation`
--

LOCK TABLES `Reservation` WRITE;
/*!40000 ALTER TABLE `Reservation` DISABLE KEYS */;
INSERT INTO `Reservation` VALUES (11,1,2,4,1,2,NULL,1515859450,1515858143,NULL);
/*!40000 ALTER TABLE `Reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(32) NOT NULL,
  `picture` varchar(400) DEFAULT NULL,
  `geolocation` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `banned` int(11) DEFAULT '0',
  `rights` int(11) DEFAULT '1',
  `discease` varchar(1000) DEFAULT NULL,
  `preference` varchar(1000) DEFAULT NULL,
  `favorite` varchar(400) DEFAULT NULL,
  `mail` varchar(400) NOT NULL,
  `pins` varchar(1000) DEFAULT NULL,
  `age` int(11) NOT NULL,
  `banner` varchar(400) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `firstname` varchar(400) NOT NULL,
  `lastname` varchar(400) NOT NULL,
  `address` varchar(1000) NOT NULL,
  `forgot_password` int(11) DEFAULT '0',
  `paypal` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `paypal` (`paypal`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'rootroot','1e7e1ffa9c17090a4faf82859f5cd36c','https://pbs.twimg.com/profile_images/937626330249728000/5lLvVCtZ_400x400.jpg','44.7834739,-0.5920118999999999','0761889039',0,2,'caca;accariens','Française',NULL,'portron.cl@gmail.com','Nulle',21,'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/20293989_1817665278249144_526222910380555977_n.jpg?oh=7b40ff9037adfa605656671e507b998b&oe=5A322986','Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca','Portron','Clovis','Les Grenouillères',0,NULL),(2,'cloclo','1e7e1ffa9c17090a4faf82859f5cd36c','https://pbs.twimg.com/media/Co3jneoUkAEGml1.jpg','44.802614,-0.588054','0761889039',0,1,'zbleh','zbleh',NULL,'portron.cl@gmail.com','zbleh',19,'https://pbs.twimg.com/media/Co3jneoUkAEGml1.jpg','zbleh djsqkdjlqsj djslqdjljql lsjdkl jkldjl sqjdlqs dqs','','','',0,NULL),(7,'rootroot1','1e7e1ffa9c17090a4faf82859f5cd36c','https://ih1.redbubble.net/image.240262109.3755/poster%2C210x230%2Cf8f8f8-pad%2C210x230%2Cf8f8f8.lite-1.jpg','44.828261,-0.5751322','0761889039',0,1,'Caca','Caca',NULL,'portron.cl@gmail.com','Caca',21,'https://ih1.redbubble.net/image.240262109.3755/poster%2C210x230%2Cf8f8f8-pad%2C210x230%2Cf8f8f8.lite-1.jpg','Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca','','','',0,NULL),(9,'rootroot2','1e7e1ffa9c17090a4faf82859f5cd36c','https://ih1.redbubble.net/image.240262109.3755/poster%2C210x230%2Cf8f8f8-pad%2C210x230%2Cf8f8f8.lite-1.jpg','44.828261,-0.5751322','0761889039',0,1,'Caca','Caca',NULL,'portron.cl@gmail.com','Caca',21,'https://ih1.redbubble.net/image.240262109.3755/poster%2C210x230%2Cf8f8f8-pad%2C210x230%2Cf8f8f8.lite-1.jpg','Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca','','','',0,NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-02-05 19:03:38
