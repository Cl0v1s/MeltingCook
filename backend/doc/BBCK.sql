-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Lun 14 Août 2017 à 11:00
-- Version du serveur :  5.7.17-0ubuntu0.16.04.1
-- Version de PHP :  7.0.15-0ubuntu0.16.04.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `BBCK`
--

-- --------------------------------------------------------

--
-- Structure de la table `Comment`
--

CREATE TABLE `Comment` (
  `id` int(11) NOT NULL,
  `target_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `content` varchar(400) NOT NULL,
  `note` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Notification`
--

CREATE TABLE `Notification` (
  `id` int(11) NOT NULL,
  `User_id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `new` int(11) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Origin`
--

CREATE TABLE `Origin` (
  `id` int(11) NOT NULL,
  `name` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `Origin`
--

INSERT INTO `Origin` (`id`, `name`) VALUES
(1, 'Française');

-- --------------------------------------------------------

--
-- Structure de la table `Pins`
--

CREATE TABLE `Pins` (
  `id` int(11) NOT NULL,
  `name` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `Pins`
--

INSERT INTO `Pins` (`id`, `name`) VALUES
(1, 'Halal');

-- --------------------------------------------------------

--
-- Structure de la table `Recipe`
--

CREATE TABLE `Recipe` (
  `id` int(11) NOT NULL,
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
  `place` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `Recipe`
--

INSERT INTO `Recipe` (`id`, `name`, `description`, `picture`, `User_id`, `origin`, `items`, `date_start`, `date_end`, `price`, `latitude`, `longitude`, `places`, `pins`, `place`) VALUES
(1, 'Gloubiboulga', 'La recette préférée de Casimir Il en mange tout le temps ce gros porc.', 'http://img0.encyclopedie-incomplete.com/local/cache-vignettes/L468xH340/casimir_hippolyte_gloubiboulga-c017e.jpg', 1, 'Française', 'Saucisse de morteau;Caca;prout', 1502229600, 1503612000, 1, 44.8026, -0.588054, 1, 'Halal', '45.9;-1.033333'),
(2, 'Un bon gros caca', 'Du bon gros caca en boite comme on l\'aime tous, cuisiné avec amour putain', 'http://borkborkiamdoggo.com/wp-content/uploads/2016/12/alex-g-did-me-a-scare-is-not-a-trump-is-a-doggofoxxo.jpg', 1, 'Française', 'Caca', 1502834400, 1504130400, 12, 44.8026, -0.588054, 42, 'Halal', 'Hénin-Beaumont');

-- --------------------------------------------------------

--
-- Structure de la table `Report`
--

CREATE TABLE `Report` (
  `id` int(11) NOT NULL,
  `target_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `state` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Reservation`
--

CREATE TABLE `Reservation` (
  `id` int(11) NOT NULL,
  `host_id` int(11) NOT NULL,
  `guest_id` int(11) NOT NULL,
  `Recipe_id` int(11) NOT NULL,
  `paid` int(11) NOT NULL,
  `done` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `User`
--

CREATE TABLE `User` (
  `id` int(11) NOT NULL,
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
  `address` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `User`
--

INSERT INTO `User` (`id`, `username`, `password`, `picture`, `geolocation`, `phone`, `banned`, `rights`, `discease`, `preference`, `favorite`, `mail`, `pins`, `age`, `banner`, `description`, `firstname`, `lastname`, `address`) VALUES
(1, 'rootroot', '1e7e1ffa9c17090a4faf82859f5cd36c', 'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/20621947_1829981903684148_5355777241776376439_n.jpg?oh=ac0ecb91e99fa04621db17b624a5e07d&oe=59EEAE2B', '44.802614,-0.588054', '0761889039', 0, 2, 'caca;accariens', 'Française', NULL, 'portron.cl@gmail.com', 'Nulle', 0, 'https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/20293989_1817665278249144_526222910380555977_n.jpg?oh=7b40ff9037adfa605656671e507b998b&oe=5A322986', 'Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca', 'Portron', 'Clovis', 'Les Grenouillères'),
(2, 'clocloc', '1e7e1ffa9c17090a4faf82859f5cd36c', 'https://pbs.twimg.com/media/Co3jneoUkAEGml1.jpg', '44.802614,-0.588054', '0761889039', 0, 1, 'zbleh', 'zbleh', NULL, 'portron.cl@gmail.com', 'zbleh', 19, 'https://pbs.twimg.com/media/Co3jneoUkAEGml1.jpg', 'zbleh djsqkdjlqsj djslqdjljql lsjdkl jkldjl sqjdlqs dqs', '', '', ''),
(7, 'rootroot1', '1e7e1ffa9c17090a4faf82859f5cd36c', 'https://ih1.redbubble.net/image.240262109.3755/poster%2C210x230%2Cf8f8f8-pad%2C210x230%2Cf8f8f8.lite-1.jpg', '44.828261,-0.5751322', '0761889039', 0, 1, 'Caca', 'Caca', NULL, 'portron.cl@gmail.com', 'Caca', 21, 'https://ih1.redbubble.net/image.240262109.3755/poster%2C210x230%2Cf8f8f8-pad%2C210x230%2Cf8f8f8.lite-1.jpg', 'Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca', '', '', ''),
(9, 'rootroot2', '1e7e1ffa9c17090a4faf82859f5cd36c', 'https://ih1.redbubble.net/image.240262109.3755/poster%2C210x230%2Cf8f8f8-pad%2C210x230%2Cf8f8f8.lite-1.jpg', '44.828261,-0.5751322', '0761889039', 0, 1, 'Caca', 'Caca', NULL, 'portron.cl@gmail.com', 'Caca', 21, 'https://ih1.redbubble.net/image.240262109.3755/poster%2C210x230%2Cf8f8f8-pad%2C210x230%2Cf8f8f8.lite-1.jpg', 'Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca  Caca', '', '', '');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `Comment`
--
ALTER TABLE `Comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `target_id` (`target_id`),
  ADD KEY `author_id` (`author_id`);

--
-- Index pour la table `Notification`
--
ALTER TABLE `Notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `User_id` (`User_id`);

--
-- Index pour la table `Origin`
--
ALTER TABLE `Origin`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Pins`
--
ALTER TABLE `Pins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `Recipe`
--
ALTER TABLE `Recipe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `User_id` (`User_id`);

--
-- Index pour la table `Report`
--
ALTER TABLE `Report`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `author_id` (`author_id`),
  ADD KEY `target_id` (`target_id`);

--
-- Index pour la table `Reservation`
--
ALTER TABLE `Reservation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `guest_id` (`guest_id`),
  ADD UNIQUE KEY `Recipe_id` (`Recipe_id`),
  ADD KEY `host_id` (`host_id`);

--
-- Index pour la table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `Comment`
--
ALTER TABLE `Comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Notification`
--
ALTER TABLE `Notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Origin`
--
ALTER TABLE `Origin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `Pins`
--
ALTER TABLE `Pins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `Recipe`
--
ALTER TABLE `Recipe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT pour la table `Report`
--
ALTER TABLE `Report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Reservation`
--
ALTER TABLE `Reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `User`
--
ALTER TABLE `User`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `Comment`
--
ALTER TABLE `Comment`
  ADD CONSTRAINT `Comment_ibfk_1` FOREIGN KEY (`target_id`) REFERENCES `User` (`id`),
  ADD CONSTRAINT `Comment_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `User` (`id`);

--
-- Contraintes pour la table `Notification`
--
ALTER TABLE `Notification`
  ADD CONSTRAINT `Notification_ibfk_1` FOREIGN KEY (`User_id`) REFERENCES `User` (`id`);

--
-- Contraintes pour la table `Recipe`
--
ALTER TABLE `Recipe`
  ADD CONSTRAINT `Recipe_ibfk_1` FOREIGN KEY (`User_id`) REFERENCES `User` (`id`);

--
-- Contraintes pour la table `Report`
--
ALTER TABLE `Report`
  ADD CONSTRAINT `Report_ibfk_1` FOREIGN KEY (`target_id`) REFERENCES `User` (`id`),
  ADD CONSTRAINT `Report_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `User` (`id`);

--
-- Contraintes pour la table `Reservation`
--
ALTER TABLE `Reservation`
  ADD CONSTRAINT `Reservation_ibfk_1` FOREIGN KEY (`host_id`) REFERENCES `User` (`id`),
  ADD CONSTRAINT `Reservation_ibfk_2` FOREIGN KEY (`guest_id`) REFERENCES `User` (`id`),
  ADD CONSTRAINT `Reservation_ibfk_3` FOREIGN KEY (`Recipe_id`) REFERENCES `Recipe` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
