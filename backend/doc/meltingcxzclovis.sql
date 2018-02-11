-- phpMyAdmin SQL Dump
-- version 4.7.3
-- https://www.phpmyadmin.net/
--
-- Hôte : meltingcxzclovis.mysql.db
-- Généré le :  Dim 11 fév. 2018 à 15:08
-- Version du serveur :  5.6.34-log
-- Version de PHP :  7.0.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `meltingcxzclovis`
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

--
-- Déchargement des données de la table `Comment`
--

INSERT INTO `Comment` (`id`, `target_id`, `author_id`, `content`, `note`) VALUES
(1, 1, 2, 'Blah Blah Blah !', 2),
(2, 1, 2, 'Blah Blah Blah !', 2),
(3, 1, 2, 'Blah Blah Blah !', 2),
(4, 1, 2, 'Blah Blaj Blah', 3),
(5, 1, 2, 'blah blah blah', 3),
(6, 1, 2, 'blah blah blah', 3),
(7, 11, 22, 'C\'était treès cool', 3);

-- --------------------------------------------------------

--
-- Structure de la table `Meta`
--

CREATE TABLE `Meta` (
  `id` int(11) NOT NULL,
  `last_timed_verification` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `Meta`
--

INSERT INTO `Meta` (`id`, `last_timed_verification`) VALUES
(1, 1518357495);

-- --------------------------------------------------------

--
-- Structure de la table `Notification`
--

CREATE TABLE `Notification` (
  `id` int(11) NOT NULL,
  `User_id` int(11) NOT NULL,
  `type` varchar(11) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `new` int(11) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Notification`
--

INSERT INTO `Notification` (`id`, `User_id`, `type`, `content`, `new`) VALUES
(19, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(20, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(21, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(22, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(23, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(24, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(25, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(26, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(27, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(28, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(29, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(30, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(31, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(32, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(33, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(34, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(35, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(36, 22, '0', 'Votre payement concernant la recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value a été refusé... Vous serez remboursé sous peu. Vous pouvez contacter notre service client pour en savoir plus.', 0),
(37, 22, '0', 'Votre payement concernant la recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value a été refusé... Vous serez remboursé sous peu. Vous pouvez contacter notre service client pour en savoir plus.', 0),
(38, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(39, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(40, 22, '0', 'Votre payement concernant la recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value a été traité ! Vous allez recevoir un mail contenant le numéro de votre hôte.', 0),
(41, 11, '0', 'Une réservation concernant la recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value a été payée ! Vous allez recevoir un mail contenant le numéro de votre invité !', 0),
(42, 11, '0', 'clovis-portron1 a lancé une procédure de réservation relative à votre recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value.', 0),
(43, 22, '0', 'Votre payement concernant la recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value a été traité ! Vous allez recevoir un mail contenant le numéro de votre hôte.', 0),
(44, 11, '0', 'Une réservation concernant la recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value a été payée ! Vous allez recevoir un mail contenant le numéro de votre invité !', 0),
(45, 11, 'success', 'Votre ancien invité clovis-portron1 a lancé la procédure de finalisation de sa réservation! Vous devriez bientôt reçevoir votre compensation !', 0),
(46, 22, 'success', 'Votre réservation concernant la recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value a été finalisée. Votre hôte va recevoir votre compensation et vous remercie !', 1),
(47, 11, 'success', 'Vous avez reçu une compensation relative à la recette tag.refs.place.valuetag.refs.place.valuetag.refs.place.valuetag.refs.place.value ! Allez jeter un oeil à votre compte Paypal !', 0);

-- --------------------------------------------------------

--
-- Structure de la table `Origin`
--

CREATE TABLE `Origin` (
  `id` int(11) NOT NULL,
  `name` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Origin`
--

INSERT INTO `Origin` (`id`, `name`) VALUES
(6, 'Française'),
(9, 'Exotique'),
(12, 'Afghanne'),
(13, 'Albanaise'),
(14, 'Algérienne'),
(15, 'Allemande'),
(16, 'Américaine'),
(17, 'Angolaise'),
(18, 'Argentine'),
(19, 'Arméniene'),
(20, 'Australienne'),
(21, 'Autrichienne'),
(23, 'Bahaméenne'),
(24, 'Bangladaise'),
(25, 'Belge....'),
(26, 'Biélorusse'),
(27, 'Bolivienne'),
(28, 'Brésilienne'),
(29, 'Britannique'),
(30, 'Bulgare'),
(31, 'Cambodgienne'),
(32, 'Camerounaise'),
(33, 'Canadienne'),
(34, 'Chilienne'),
(35, 'Chinoise'),
(36, 'Colombienne'),
(37, 'Congolaise'),
(38, 'Croate'),
(39, 'Cubaine'),
(40, 'Danoise'),
(41, 'Dominicaine'),
(42, 'Ecossaise'),
(43, 'Egyptienne'),
(44, 'Equatorienne'),
(45, 'Espagnole'),
(46, 'Estonienne'),
(47, 'Ethiopienne'),
(48, 'Européenne'),
(49, 'Finlandaise'),
(50, 'Grec....'),
(51, 'Guatemala'),
(52, 'Guinéenne'),
(53, 'Haïtienne'),
(54, 'Hollandaise'),
(55, 'Hongroise'),
(56, 'Indienne'),
(57, 'Indonésienne'),
(58, 'Irakienne'),
(59, 'Iranienne'),
(60, 'Irlandaise'),
(61, 'Islandaise'),
(62, 'Israélienne'),
(63, 'Italienne'),
(64, 'Ivoirienne'),
(65, 'Jamaïcainne'),
(66, 'Japonaise'),
(67, 'Jordanienne'),
(68, 'Kenyan'),
(69, 'Laotienne'),
(70, 'Libanaise'),
(71, 'Libyenne'),
(72, 'Liechtenstein'),
(73, 'Lituanienne'),
(74, 'Luxembourgeoise'),
(75, 'Macédonienne'),
(76, 'Madagascar'),
(77, 'Malaisienne'),
(78, 'Malienne'),
(79, 'Maltaise'),
(80, 'Marocainne'),
(81, 'Mauritanienne'),
(82, 'Mauritienne'),
(83, 'Mexicainne'),
(84, 'Monégasque'),
(85, 'Mongole'),
(86, 'Mozambique'),
(87, 'Néo-Zélandaise'),
(88, 'Népalaise'),
(89, 'Nigérienne'),
(90, 'Nord Coréenne'),
(91, 'Norvégienne'),
(92, 'Pakistanaise'),
(93, 'Palestinienne'),
(94, 'Panaméenne'),
(95, 'Palestinienne'),
(96, 'Panaméenne'),
(97, 'Paraguayenne'),
(98, 'Sénégalaise'),
(99, 'Serbe.'),
(100, 'Serbo-Croate'),
(101, 'Sri-Lankaise'),
(102, 'Sud-Africaine'),
(103, 'Sud Coréenne'),
(104, 'Suédoise'),
(105, 'Suisse'),
(106, 'Syrienne'),
(107, 'Taïwanaise'),
(108, 'Tanzanienne'),
(109, 'Tchèque'),
(110, 'Thaïlandaise'),
(111, 'Tunisienne'),
(112, 'Turc..'),
(113, 'Ukranienne'),
(114, 'Uruguayenne'),
(115, 'Vénézuélienne'),
(116, 'Vietnamienne'),
(117, 'Yéménite'),
(118, 'Yougoslave'),
(119, 'Zimbabwéenne'),
(120, 'Asiatique'),
(121, 'Africaine');

-- --------------------------------------------------------

--
-- Structure de la table `Pins`
--

CREATE TABLE `Pins` (
  `id` int(11) NOT NULL,
  `name` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Pins`
--

INSERT INTO `Pins` (`id`, `name`) VALUES
(6, 'Bio.'),
(19, 'Crudivorienne'),
(22, 'En direct du producteur'),
(20, 'Flexitarienne'),
(10, 'Gastronomique'),
(7, 'Halal'),
(16, 'Lacto-végétarienne'),
(21, 'Local'),
(8, 'Moléculaire'),
(11, 'Note à note'),
(15, 'Ovo-végétarienne'),
(13, 'Pesco-végétarienne'),
(18, 'Pollo-végétarienne'),
(12, 'Solaire'),
(9, 'Traditionnelle'),
(17, 'Végan'),
(14, 'Végétarienne');

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
  `place` varchar(400) NOT NULL,
  `verified` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Recipe`
--

INSERT INTO `Recipe` (`id`, `name`, `description`, `picture`, `User_id`, `origin`, `items`, `date_start`, `date_end`, `price`, `latitude`, `longitude`, `places`, `pins`, `place`, `verified`) VALUES
(5, 'Quiche lorraine', 'J\'aimerai vos partager la quiche lorraine créée par ma maman. Rien de bien compliqué : tout est dans la cuisson.', 'https://www.papillesetpupilles.fr/wp-content/uploads/2005/07/Quiche-Lorraine.jpg', 10, 'Française', 'Farine;Oeuf;Lait;Crême entière épaisse;Fromage rappé;Dés de jambon;;', 1510268400, 1510614000, 5, 44.8477, -0.586388, 6, NULL, 'Bordeaux', 0),
(6, 'Nems de ma grand-mère', 'Recette transmise de ma grand-mère lorsque j\'étais petite. Bon, elle n\'était pas chinoise mais ça déchire.', 'http://img.cac.pmdstatic.net/fit/http.3A.2F.2Fwww.2Ecuisineactuelle.2Efr.2Fvar.2Fcui.2Fstorage.2Fimages.2Frecettes-de-cuisine.2Fviande.2Fporc.2Fnems-prisma_recipe-273465.2F2359456-1-fre-FR.2Fnems.2Ejpg/1200x600/crop-from/center/nems.jpg', 10, 'Asiatique;Chinoise', 'Porc;Oignon;Carotte;Champignon chinois;Soja;Oeufs;Sauce chinoise;Galette de riz', 1510354800, 1510700400, 4, 44.8477, -0.586388, 6, 'Bio.', 'Evreux', 0),
(7, 'Un test en ligne - cuisson du chaton', 'Brochette de chaton façon tajine avec des raisins et la menthe', 'https://www.google.fr/search?q=chaton+mignon&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjApOmK6M3XAhUEQBoKHX5RDAcQ_AUICigB&biw=1920&bih=949#imgrc=y5tuTgDndH7QTM:', 10, 'Algérienne', 'Chaton ;herbe a chat', 1511218800, 1511391600, 5, 44.8477, -0.586388, 8, 'Halal', 'Bordeaux', 0),
(9, 'Gloubi-Boulga', 'Recette réservée aux amis de Casimir ! ;-) (Compléments donnés par Valérie Gauthier) Le Gloubi-boulga est le plat préféré des Casimirus. C\'est dans l\'épisode du même nom, diffusé le 30 septembre 1974, que Casimir évoque pour la première fois son met favori. L\'origine de ce plat est située dans l\'enfance de Christophe Izard... Pendant la guerre, il était hébergé par une vieille dame russe, qui pour le faire tenir tranquille, lui faisait touiller du sucre et des jaunes d\'oeufs dans un saladier. Elle appelait cette préparation du \'goguel-moguel\'. A la libération, en découvrant le chocolat, il s\'invente un goûter très nourissant composé de chocolat râpé, bananes écrasées et confiture de fraise. Le Gloubi-boulga s\'inspire du premier plat pour le nom et du second pour la recette, légèrement améliorée à la sauce casimirus... avec de la moutarde et de la saucisse de Toulouse! Retrouvez cette recette et son histoire sur le site de Casimir.', 'https://i.imgur.com/amMvFsq.jpg', 11, 'Française', 'Confiture de fraises;Banane mûres à point, bien écrasées;Chocolat râpé;Moutarde de dijon très forte;1 saucisse de Toulouse crue mais tiède', 1518476400, 1518390000, 12, 45.9, -1.03333, 10, 'En direct du producteur', 'Moëze', 0);

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
  `done` int(11) NOT NULL,
  `txn_id` varchar(400) DEFAULT NULL,
  `ended_at` int(11) DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL,
  `paid_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Reservation`
--

INSERT INTO `Reservation` (`id`, `host_id`, `guest_id`, `Recipe_id`, `paid`, `done`, `txn_id`, `ended_at`, `created_at`, `paid_at`) VALUES
(31, 11, 22, 8, 1, 0, '9BA78092G7872564S', 1518117219, 1518115933, 1518115933);

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
  `address` varchar(1000) NOT NULL,
  `forgot_password` int(11) DEFAULT '0',
  `paypal` varchar(400) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `User`
--

INSERT INTO `User` (`id`, `username`, `password`, `picture`, `geolocation`, `phone`, `banned`, `rights`, `discease`, `preference`, `favorite`, `mail`, `pins`, `age`, `banner`, `description`, `firstname`, `lastname`, `address`, `forgot_password`, `paypal`) VALUES
(10, 'charlene', '15f83296a55bb6f9bb77329a5c6ad8b7', 'https://www.facebook.com/photo.php?fbid=10213968021053345&set=a.1602089250851.2078176.1194661384&type=3&theater', '44.847735,-0.5863879', '0609348536', 0, 2, 'Aucune', 'Française', NULL, 'charlene.verrier@gmail.com', NULL, 25, 'https://www.facebook.com/photo.php?fbid=10214444503565110&set=a.3976070598901.2173105.1194661384&type=3&theater', 'roll soufflé.\nGummies cake bonbon sesame snaps fruitcake chocolate cake lemon drops carrot cake. Ice cream oat cake gummies. Dessert icing oat cake. Cupcake chocolate bar danish sweet roll oat cake. Brownie dragée gummi bears pastry jelly gingerbread wafer lollipop. Jujubes sweet gummi bears. Chocolate bar carrot cake jelly beans pie bear claw candy canes chupa chups. Pie cake chocolate icing. Pie brownie chocolate pie cake pie icing cupcake. Croissant pie toffee. Cheesecake muffin cake jelly beans marzipan cake tart caramels chocolate cake. Gummi bears dessert pudding halvah croissant marzipan. Fruitcake gummies donut lollipop icing halvah. Icing bonbon jelly beans oat cake dessert cookie', 'Charlène', 'Verrier', '75 rue Emile Fourcand 33000 Bordeaux', 0, NULL),
(11, 'clovis-portron', '1e7e1ffa9c17090a4faf82859f5cd36c', 'https://i.imgur.com/lothrHG.jpg', '', '0761889039', 0, 2, 'Accariens', 'Afghanne;Albanaise', NULL, 'portron.cl@gmail.com', 'Bio.;Flexitarienne', 21, 'https://i.imgur.com/0Ny4OUh.jpg', 'Test test   Test test   Test test   Test test   Test test   Test test   Test test   Test test   Test test   Test test   Test test   Test test   Test test   Test test   Test test   Test test \'(\'(', 'Clovis', 'Portron', '6 rue chateaubriand 33400 Talence', 0, 'test2794@test.test'),
(22, 'clovis-portron1', '1e7e1ffa9c17090a4faf82859f5cd36c', NULL, '', '0761889039', 0, 1, NULL, NULL, NULL, 'chaipokoi@gmail.com', NULL, 21, NULL, 'gdhdhsgdhjs  gdhdhsgdhjs  gdhdhsgdhjs  gdhdhsgdhjs  gdhdhsgdhjs  gdhdhsgdhjs  gdhdhsgdhjs  gdhdhsgdhjs  gdhdhsgdhjs  gdhdhsgdhjs  gdhdhsgdhjs  gdhdhsgdhjs  gdhdhsgdhjs  gdhdhsgdhjs', 'Clovis', 'Portron', 'gdhdhsgdhjs  gdhdhsgdhjs  gdhdhsgdhjs  gdhdhsgdhjs  gdhdhsgdhjs', 1, NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Comment`
--
ALTER TABLE `Comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `target_id` (`target_id`),
  ADD KEY `author_id` (`author_id`);

--
-- Index pour la table `Meta`
--
ALTER TABLE `Meta`
  ADD PRIMARY KEY (`id`);

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
  ADD KEY `host_id` (`host_id`),
  ADD KEY `Recipe_id` (`Recipe_id`) USING BTREE;

--
-- Index pour la table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `mail` (`mail`),
  ADD UNIQUE KEY `paypal` (`paypal`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Comment`
--
ALTER TABLE `Comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT pour la table `Meta`
--
ALTER TABLE `Meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `Notification`
--
ALTER TABLE `Notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;
--
-- AUTO_INCREMENT pour la table `Origin`
--
ALTER TABLE `Origin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;
--
-- AUTO_INCREMENT pour la table `Pins`
--
ALTER TABLE `Pins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT pour la table `Recipe`
--
ALTER TABLE `Recipe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT pour la table `Report`
--
ALTER TABLE `Report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `Reservation`
--
ALTER TABLE `Reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT pour la table `User`
--
ALTER TABLE `User`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
--
-- Contraintes pour les tables déchargées
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
  ADD CONSTRAINT `Reservation_ibfk_1` FOREIGN KEY (`host_id`) REFERENCES `User` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
