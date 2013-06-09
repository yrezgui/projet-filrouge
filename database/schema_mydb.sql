-- phpMyAdmin SQL Dump
-- version 3.3.9.1
-- http://www.phpmyadmin.net
--
-- Serveur: localhost
-- Généré le : Dim 27 Janvier 2013 à 20:16
-- Version du serveur: 5.5.19
-- Version de PHP: 5.2.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `mydb`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
  `idUser` int(10) NOT NULL,
  PRIMARY KEY (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `admin`
--

INSERT INTO `admin` (`idUser`) VALUES
(78);

-- --------------------------------------------------------

--
-- Structure de la table `medic`
--

CREATE TABLE IF NOT EXISTS `medic` (
  `idUser` int(10) NOT NULL,
  `idService` int(3) NOT NULL,
  `idSpeciality` int(3) NOT NULL,
  PRIMARY KEY (`idUser`),
  KEY `fk_medic_service1_idx` (`idService`),
  KEY `fk_medic_speciality1_idx` (`idSpeciality`),
  KEY `fk_medic_user1_idx` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `medic`
--

INSERT INTO `medic` (`idUser`, `idService`, `idSpeciality`) VALUES
(74, 1, 1),
(82, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `patient`
--

CREATE TABLE IF NOT EXISTS `patient` (
  `idUser` int(10) NOT NULL,
  PRIMARY KEY (`idUser`),
  KEY `fk_table1_user1_idx` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `patient`
--

INSERT INTO `patient` (`idUser`) VALUES
(66),
(67),
(68),
(69),
(70),
(71),
(72),
(73),
(76);

-- --------------------------------------------------------

--
-- Structure de la table `rendezvous`
--

CREATE TABLE IF NOT EXISTS `rendezvous` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `idPatient` int(10) NOT NULL,
  `idMedic` int(10) NOT NULL,
  `date` date NOT NULL,
  `timetable` time NOT NULL,
  `comment` TEXT NULL,

  PRIMARY KEY (`id`),
  KEY `idPatient` (`idPatient`),
  KEY `idMedic` (`idMedic`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `rendezvous`
--

INSERT INTO `rendezvous` (`id`, `idPatient`, `idMedic`, `date`, `timetable`) VALUES
(1, 72, 74, '2013-01-28', '08:00:00');
INSERT INTO `rendezvous` (`id`, `idPatient`, `idMedic`, `date`, `timetable`) VALUES
(2, 66, 74, '2013-01-28', '08:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `secretary`
--

CREATE TABLE IF NOT EXISTS `secretary` (
  `idUser` int(10) NOT NULL,
  PRIMARY KEY (`idUser`),
  KEY `fk_table1_user2_idx` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `secretary`
--


-- --------------------------------------------------------

--
-- Structure de la table `service`
--

CREATE TABLE IF NOT EXISTS `service` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `service`
--

INSERT INTO `service` (`id`, `name`) VALUES
(1, 'cardilogie');

-- --------------------------------------------------------

--
-- Structure de la table `speciality`
--

CREATE TABLE IF NOT EXISTS `speciality` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `speciality`
--

INSERT INTO `speciality` (`id`, `name`) VALUES
(1, 'cardiologue');

-- --------------------------------------------------------

--
-- Structure de la table `token`
--

CREATE TABLE IF NOT EXISTS `token` (
  `token` varchar(48) NOT NULL,
  `expiration` datetime NOT NULL,
  `idUser` int(10) NOT NULL,
  `type` enum('patient','secretary','medic','admin') NOT NULL,
  UNIQUE KEY `token` (`token`),
  KEY `idUser` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `token`
--

INSERT INTO `token` (`token`, `expiration`, `idUser`, `type`) VALUES
('c84d9dbdcc42b4025fd523395fab16c128ffd0ff11eee69a', '2013-01-27 13:02:02', 74, 'medic'),
('d96f1aefa80f5362dc9df901df7bbdc22933f57ecac7d962', '2013-01-27 13:03:01', 78, 'admin');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `password` varchar(100) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `birthdate` date DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `gender` enum('male','female') NOT NULL DEFAULT 'male',
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=83 ;

--
-- Contenu de la table `user`
--

INSERT INTO `user` (`id`, `password`, `firstname`, `lastname`, `birthdate`, `email`, `gender`, `active`) VALUES
(56, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'cedric', 'TEST', '1992-08-07', 'fafffa@test.fr', 'male', 1),
(57, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'test', 'TEST', '1992-08-07', 'nytffa@test.fr', 'male', 1),
(58, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'test', 'TEST', '1992-08-07', 'zzfa@test.fr', 'male', 1),
(59, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'test', 'TEST', '1992-08-07', 'azeaezfa@test.fr', 'male', 1),
(60, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'test', 'TEST', '1992-08-07', 'azazeaeezfa@test.fr', 'male', 1),
(61, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Test', 'TEST', '1992-07-08', 'rfzfzfzf@gmail.com', 'male', 1),
(62, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Test', 'TEST', '1992-07-08', 'fghrnzfzf@gmail.com', 'male', 1),
(63, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Test', 'TEST', '1992-07-08', 'vebebbzfzf@gmail.com', 'male', 1),
(65, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Test', 'TEST', '1992-07-08', 'geegegbzfzf@gmail.com', 'male', 1),
(66, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Test', 'TEST', '1992-07-08', 'azaef@gmail.com', 'male', 1),
(67, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Test', 'TEST', '1992-07-08', 'acczvzef@gmail.com', 'male', 1),
(68, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Test', 'TEST', '1992-07-08', 'aeadczvzef@gmail.com', 'male', 1),
(69, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Test', 'TEST', '1992-07-08', 'fafaczvzef@gmail.com', 'male', 1),
(70, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Test', 'TEST', '1992-07-08', 'azdvafa@gmail.com', 'male', 1),
(71, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Test', 'TEST', '1992-07-08', 'tezvzfa@gmail.com', 'male', 1),
(72, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Test', 'TEST', '1992-07-08', 'zfzvverzfa@gmail.com', 'male', 1),
(73, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'Test', 'TEST', '1992-07-08', 'zfzvzrzfa@gmail.com', 'male', 1),
(74, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'cedric', 'ferretti', '1992-08-07', 'ferretticedric@gmail.com', 'male', 1),
(76, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'cedric', 'ferretti', '1992-08-07', 'test@gmail.com', 'male', 1),
(78, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'cedric', 'ferretti', '1992-08-07', 'popo@gmail.com', 'male', 1),
(79, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'clara', 'morgane', '1981-01-25', 'efzff@gmail.com', 'female', 1),
(81, 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'clara', 'morgane', '1981-01-25', 'clara.m@gmail.com', 'female', 1),
(82, '7f7a4841a2ffba86abcd0718714b8d38b8556872', 'clara editer', 'morgane', '2012-12-21', 'test@test.com', 'female', 0);

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `medic`
--
ALTER TABLE `medic`
  ADD CONSTRAINT `fk_medic_service1` FOREIGN KEY (`idService`) REFERENCES `service` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_medic_speciality1` FOREIGN KEY (`idSpeciality`) REFERENCES `speciality` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_medic_user1` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `patient`
--
ALTER TABLE `patient`
  ADD CONSTRAINT `fk_table1_user1` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `rendezvous`
--
ALTER TABLE `rendezvous`
  ADD CONSTRAINT `rendezvous_ibfk_1` FOREIGN KEY (`idPatient`) REFERENCES `patient` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rendezvous_ibfk_2` FOREIGN KEY (`idMedic`) REFERENCES `medic` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `secretary`
--
ALTER TABLE `secretary`
  ADD CONSTRAINT `fk_table1_user2` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `token_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
