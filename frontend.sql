-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 03, 2015 at 06:59 AM
-- Server version: 5.6.14
-- PHP Version: 5.5.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `frontend`
--
CREATE DATABASE IF NOT EXISTS `frontend` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `frontend`;

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE IF NOT EXISTS `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `isbn` varchar(15) NOT NULL,
  `title` varchar(50) NOT NULL,
  `author` varchar(50) NOT NULL,
  `publisher` varchar(50) NOT NULL,
  `publishdate` date NOT NULL,
  `price` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `isbn` (`isbn`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `isbn`, `title`, `author`, `publisher`, `publishdate`, `price`) VALUES
(3, 'isbn123', 'The Way of Kings', 'Brandon Sanderson', 'TOR', '2015-08-03', '9.99');

-- --------------------------------------------------------

--
-- Table structure for table `info`
--

CREATE TABLE IF NOT EXISTS `info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `process_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  `status` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `info`
--

INSERT INTO `info` (`id`, `start_date`, `end_date`, `process_date`, `update_date`, `status`) VALUES
(1, '2015-08-24 00:00:00', '2015-08-29 00:00:00', '2015-08-24 12:25:49', '2015-08-24 12:29:34', 'done'),
(2, '2015-08-25 00:00:00', '2015-08-27 00:00:00', '2015-08-24 12:27:39', '2015-08-24 12:29:35', 'done'),
(3, '2015-08-26 00:00:00', '2015-08-28 00:00:00', '2015-08-24 12:30:30', '0000-00-00 00:00:00', 'in process'),
(4, '2015-09-01 00:00:00', '2015-09-10 00:00:00', '2015-08-24 12:31:18', '0000-00-00 00:00:00', 'in process'),
(5, '1970-01-01 00:00:00', '1970-01-01 00:00:00', '2015-08-24 17:37:13', '0000-00-00 00:00:00', 'in process'),
(6, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-08-24 17:38:33', '0000-00-00 00:00:00', 'in process'),
(7, '1970-01-01 00:00:00', '1970-01-01 00:00:00', '2015-08-24 17:40:28', '0000-00-00 00:00:00', 'in process'),
(8, '2015-08-24 00:00:00', '2015-08-25 00:00:00', '2015-08-24 17:41:23', '2015-08-24 17:43:48', 'done');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE IF NOT EXISTS `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `matriks` varchar(15) NOT NULL,
  `ic` varchar(15) NOT NULL,
  `name` varchar(50) NOT NULL,
  `photo` varchar(30) NOT NULL DEFAULT 'default.png',
  PRIMARY KEY (`id`),
  UNIQUE KEY `matriks` (`matriks`,`ic`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `matriks`, `ic`, `name`, `photo`) VALUES
(1, 'ss123456', '123456121234', 'ali bin abu', 'default.png'),
(5, 'a', 'a', 'a', 'default.png'),
(6, 'b', 'b', 'b', 'default.png');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(15) NOT NULL,
  `password` varchar(15) NOT NULL,
  `name` varchar(50) NOT NULL,
  `usertype` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `login`, `password`, `name`, `usertype`) VALUES
(1, 'q', 'q', 'mr queue', 'admin');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
