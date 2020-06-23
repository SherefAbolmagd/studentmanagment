-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jun 23, 2020 at 10:48 AM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 5.6.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `studentmanagement`
--
CREATE DATABASE IF NOT EXISTS `studentmanagement` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `studentmanagement`;

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `modelNumber` varchar(100) DEFAULT NULL,
  `carName` varchar(100) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `carType` varchar(100) DEFAULT NULL,
  `tankCapacity` varchar(100) DEFAULT NULL,
  `topSpeed` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`id`, `modelNumber`, `carName`, `color`, `carType`, `tankCapacity`, `topSpeed`) VALUES
(1, '01-2020', 'Mazda RX 8', 'Blue', 'Automatic', '100 L', '3000'),
(2, '02-2020', 'Honda civic', 'Yellow', 'Automatic', '70 L', '20000'),
(10, '04-2020', 'Ferrari', 'Red', 'Automatic', '100 L', '5000');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `login` varchar(15) NOT NULL,
  `password` varchar(15) NOT NULL,
  `name` varchar(50) NOT NULL,
  `usertype` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `login`, `password`, `name`, `usertype`) VALUES
(1, 'q', 'q', 'mr queue', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
