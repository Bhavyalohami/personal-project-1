-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: sample
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `DrConsult_admin`
--

DROP TABLE IF EXISTS `DrConsult_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_admin` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image` varchar(100) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `address` longtext NOT NULL,
  `gender` varchar(10) NOT NULL,
  `city` varchar(150) NOT NULL,
  `state` varchar(60) NOT NULL,
  `country` varchar(60) NOT NULL,
  `zipcode` varchar(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_admin`
--

LOCK TABLES `DrConsult_admin` WRITE;
/*!40000 ALTER TABLE `DrConsult_admin` DISABLE KEYS */;
INSERT INTO `DrConsult_admin` VALUES (1,'admin/existing-image_TbAGNAu.jpg','Shivam','CEO','Dr. Shivam','Mantri','admin@google.com','9636543505','A-501, high street near main block par','male','Kota','Rajasthan','USA','304050');
/*!40000 ALTER TABLE `DrConsult_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_blogs`
--

DROP TABLE IF EXISTS `DrConsult_blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_blogs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(122) NOT NULL,
  `text` varchar(200) NOT NULL,
  `date` date NOT NULL,
  `author` varchar(122) NOT NULL,
  `category` varchar(122) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_blogs`
--

LOCK TABLES `DrConsult_blogs` WRITE;
/*!40000 ALTER TABLE `DrConsult_blogs` DISABLE KEYS */;
INSERT INTO `DrConsult_blogs` VALUES (4,'Why we are better than others?','How do you create compelling presentations that wow your colleagues and impress your managers?','2024-08-26','Dr. Ryan Grouse','Heart Specialists','blogs/blog1.png'),(5,'7 ways to live healthy lives','Linear helps streamline software projects, sprints, tasks, and bug tracking. Here’s how to get...','2024-08-26','Dr. Marilyn Levin','Heart Specialists','blogs/blog2.png'),(6,'Ai in Brain Surgery','The rise of Super AIs has been met by a rise in tools for creating, testing, and manag...','2024-08-26','Dr. Leo Arcand','Brain Surgeon','blogs/blog3.png'),(7,'How our treatments is beneficial for you?','How do you create compelling presentations that wow your colleagues and impress your managers?','2024-08-26','Dr. Rama S. Subramaniam','Eye Specialists','blogs/rb1.png'),(8,'Migrating to Linear 101','<p>Linear helps streamline software projects, sprints, tasks, and bug tracking. Here’s how to get...</p>','2024-08-26','Dr. Maxterm BaImer','Heart Specialists','blogs/existing-image_u760Afa.jpg'),(9,'Special Baby Carefsdf','<p>The rise of Super AIs has been met by a rise in tools for creating, testing, and manag...</p>','2024-08-26','Dr. Lana Steiner','Brain Surgeon','blogs/existing-image_YJ9cq91.jpg');
/*!40000 ALTER TABLE `DrConsult_blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_booking`
--

DROP TABLE IF EXISTS `DrConsult_booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_booking` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(122) NOT NULL,
  `age` varchar(30) NOT NULL,
  `contact` varchar(10) NOT NULL,
  `email` varchar(122) NOT NULL,
  `city` varchar(122) NOT NULL,
  `date` date NOT NULL,
  `time` varchar(30) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `problem` longtext NOT NULL,
  `department` varchar(122) NOT NULL,
  `doctor` varchar(122) NOT NULL,
  `location` varchar(122) NOT NULL,
  `username` varchar(60) NOT NULL,
  `today_appointments_count` int NOT NULL,
  `sub_slot_id` bigint DEFAULT NULL,
  `status` varchar(10) NOT NULL,
  `is_patient` tinyint(1) NOT NULL,
  `patient_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `DrConsult_booking_sub_slot_id_941d6f8c_fk_DrConsult` (`sub_slot_id`),
  KEY `DrConsult_booking_patient_id_3714e4ae_fk_DrConsult_patient_id` (`patient_id`),
  CONSTRAINT `DrConsult_booking_patient_id_3714e4ae_fk_DrConsult_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `DrConsult_patient` (`id`),
  CONSTRAINT `DrConsult_booking_sub_slot_id_941d6f8c_fk_DrConsult` FOREIGN KEY (`sub_slot_id`) REFERENCES `DrConsult_subslotmodel` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_booking`
--

LOCK TABLES `DrConsult_booking` WRITE;
/*!40000 ALTER TABLE `DrConsult_booking` DISABLE KEYS */;
INSERT INTO `DrConsult_booking` VALUES (2,'Bhavya Lohami','26-35','9636543502','shivam.mantri@logicspice.com','Bundi','2024-10-04','09:20 - 09:40','Male','demo','Diagnostic testing','Leo Arcand','Pratap nagar sector 11','leo',0,280,'confirmed',0,NULL),(3,'shivam mantri','25','9636543505','shivam.mantri@logicspice.com','jaipur','2024-10-15','13:00 - 13:15','Male','demo booking','Diagnostic testing','Leo Arcand','Pratap nagar sector 11','leo',0,286,'cancelled',0,NULL),(4,'Rahul Prajapat','26','9636542505','shivam.mantri@logicspice.com','jaipur','2024-10-15','13:15 - 13:30','Male','fever and cold','Diagnostic testing','Leo Arcand','Pratap nagar sector 11','leo',0,287,'cancelled',0,NULL),(5,'Shivam','1','1234567890','shivam.mantri@logicspice.com','Jaipur','2024-10-15','14:45 - 15:00','Female','Demo-appointment','Diagnostic testing','Leo Arcand','Pratap nagar sector 11','leo',0,293,'cancelled',0,NULL),(6,'Bhavya Lohami','Under 18','1234567890','shivam.mantri@logicspice.com','Jaipur','2024-10-06','16:15 - 16:30','Male','Appointment-Check','Diagnostic testing','Leo Arcand','Pratap nagar sector 11','leo',0,170,'cancelled',0,NULL),(7,'shivam mantri','18-25','9636543502','shivam.mantri@logicspice.com','jaipur','2024-10-15','13:30 - 13:45','Male','fever','Diagnostic testing','Leo Arcand','Pratap nagar sector 11','leo',0,288,'cancelled',0,NULL),(9,'Bhavya Lohami','21','0987654321','bhavya.lohami@logicspice.com','Jaipur','2024-10-16','09:45 - 10:00','Male','Demo-Booking','Diagnostic testing','Leo Arcand','Pratap nagar sector 11','leo',0,297,'cancelled',0,NULL),(10,'Shivam Mantri','Under 18','9636543505','shivam.mantri@logicspice.com','Jaipur','2024-10-16','10:45 - 11:00','Female','hhh','Diagnostic testing','Leo Arcand','Pratap nagar sector 11','leo',0,301,'cancelled',0,NULL),(11,'Shivam Mantri','Under 18','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-10-16','09:30 - 09:45','Female','rggr','Diagnostic testing','Leo Arcand','Pratap nagar sector 11','leo',0,296,'cancelled',0,NULL),(12,'Rahul','22','1234567890','rahul.prajapat@logicspice.com','Jaipur','2024-10-16','09:15 - 09:30','Male','sedhfewf','Diagnostic testing','Leo Arcand','Pratap nagar sector 11','leo',0,295,'cancelled',0,NULL),(18,'Shivam','Under 18','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-10-26','19:20 - 19:40','Female','thgth','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,395,'cancelled',0,NULL),(19,'Shivam','Under 18','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-10-24','03:00 - 03:10','Female','Fever','Diagnostic testing','Leo Arcand','Pratap nagar sector 11','leo',0,528,'confirmed',0,NULL),(23,'Bhavya Lohami','25','2541369874','bhavya.lohami@logicspice.com','rawatbhata','2024-10-24','14:00 - 14:15','Male','fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,387,'confirmed',0,NULL),(24,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-26','18:20 - 18:40','Male','hi son','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,392,'confirmed',0,NULL),(25,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-26','18:20 - 18:40','Male','hi son','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,392,'confirmed',0,NULL),(26,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-26','18:20 - 18:40','Male','hi son','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,392,'confirmed',0,NULL),(27,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-26','18:20 - 18:40','Male','Hi Son','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,392,'confirmed',0,NULL),(28,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-26','18:20 - 18:40','Male','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,392,'confirmed',0,NULL),(29,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-26','18:20 - 18:40','Male','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,392,'confirmed',0,NULL),(30,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-26','18:20 - 18:40','Male','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,392,'confirmed',0,NULL),(31,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-26','18:20 - 18:40','Male','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,392,'confirmed',0,NULL),(32,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-26','18:20 - 18:40','Male','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,392,'confirmed',0,NULL),(33,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-26','18:20 - 18:40','Male','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,392,'confirmed',0,NULL),(34,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-26','18:20 - 18:40','Male','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,392,'confirmed',0,NULL),(35,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-26','18:20 - 18:40','Male','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,392,'confirmed',0,NULL),(36,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-27','09:20 - 09:40','Male','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,404,'confirmed',0,NULL),(37,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-27','01:45 - 02:00','Male','Cold','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,409,'confirmed',0,NULL),(38,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-27','07:40 - 08:00','Male','Body Pain','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,399,'cancelled',0,NULL),(39,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-27','09:00 - 09:20','Male','rg3r','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,403,'cancelled',0,NULL),(40,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-24','13:45 - 14:00','Male','fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,386,'confirmed',0,NULL),(41,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-27','07:40 - 08:00','Male','fweffef','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,399,'confirmed',0,NULL),(42,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','2024-10-27','09:40 - 10:00','Male','fe2fr3f','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,405,'confirmed',0,NULL),(43,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-10-27','07:00 - 07:20','Female','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,397,'cancelled',0,NULL),(44,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-10-27','08:00 - 08:15','Female','Cold','Diagnostic testing','Leo Arcand','Pratap nagar sector 11','leo',0,552,'confirmed',0,NULL),(45,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-10-27','01:00 - 01:15','Female','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,406,'cancelled',0,NULL),(46,'Bhavya Lohami','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-10-29','09:20 - 09:40','Male','rterg','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,422,'cancelled',0,NULL),(47,'Bhavya Lohami','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-10-28','11:00 - 11:15','Male','Cold','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,414,'cancelled',0,NULL),(48,'Bhavya Lohami','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-10-27','08:30 - 08:45','Male','ewfwef','Diagnostic testing','Leo Arcand','Pratap nagar sector 11','leo',0,554,'confirmed',0,NULL),(49,'Bhavya Lohami','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-10-29','08:00 - 08:20','Male','Body Pain','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,418,'cancelled',0,NULL),(50,'Bhavya Lohami','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-10-29','08:40 - 09:00','Male','wefcwefc','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,420,'cancelled',0,NULL),(51,'shivam mantri','18-25','9636543502','shivam.mantri@logicspice.com','jaipur','2024-10-28','10:15 - 10:30','Male','Demo','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,411,'confirmed',0,NULL),(52,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-07','10:00 - 10:15','Male','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,876,'confirmed',0,NULL),(53,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-07','09:00 - 09:15','Male','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,872,'confirmed',0,NULL),(54,'shivam mantri','18-25','9636543505','shivam.mantri@logicspice.com','jaipur','2024-11-07','09:15 - 09:30','Male','Regular Check-up','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,873,'confirmed',0,NULL),(55,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-07','10:45 - 11:00','Male','Head-ache','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,879,'confirmed',0,NULL),(56,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-07','10:30 - 10:45','Male','wefwf','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,878,'confirmed',0,NULL),(57,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-07','09:45 - 10:00','Male','egv','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,875,'confirmed',0,NULL),(58,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-07','10:15 - 10:30','Male','erf','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,877,'confirmed',0,NULL),(59,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-07','09:30 - 09:45','Male','ftht','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,874,'confirmed',0,NULL),(60,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-07','12:50 - 13:00','Male','fwfe','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,885,'confirmed',0,NULL),(61,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-07','13:40 - 13:50','Male','rehrth','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,890,'cancelled',0,NULL),(62,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-07','13:30 - 13:40','Male','fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,889,'confirmed',0,NULL),(63,'shivam mantri','18-25','9636543502','shivam.mantri@logicspice.com','jaipur','2024-11-07','12:00 - 12:10','Male','fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,880,'confirmed',0,NULL),(64,'shivam mantri','18-25','9636543502','shivam.mantri@logicspice.com','jaipur','2024-11-07','12:10 - 12:20','Male','fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,881,'confirmed',0,NULL),(65,'shivam mantri','18-25','9636543502','shivam.mantri@logicspice.com','jaipur','2024-11-07','12:20 - 12:30','Male','fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,882,'confirmed',0,NULL),(66,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-07','13:10 - 13:20','Male','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,887,'confirmed',0,NULL),(67,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-07','13:50 - 14:00','Male','regfrw','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,891,'confirmed',0,NULL),(68,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-07','13:00 - 13:10','Male','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,886,'confirmed',0,NULL),(69,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-07','13:20 - 13:30','Male','Headache','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,888,'confirmed',1,1),(70,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-07','12:30 - 12:40','Male','Fever','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,883,'confirmed',0,NULL),(71,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','2024-11-08','10:20 - 10:40','Male','hi','Diagnostic testing','Leo Arcand','Pratap nagar sector 11','leo',0,342,'cancelled',1,1),(72,'shivam mantri','18-25','9636543502','shivam.mantri@logicspice.com','jaipur','2024-11-08','10:40 - 10:50','Male','Regular Check-Up','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,896,'cancelled',1,1),(73,'shivam mantri','18-25','9636543502','shivam.mantri@logicspice.com','Kota','2024-11-08','13:00 - 13:20','Male','Regular Check-Up','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,916,'confirmed',1,1),(74,'shivam mantri','18-25','9636543502','shivam.mantri@logicspice.com','jaipur','2024-11-08','13:20 - 13:40','Male','Regular Check-Up','Diagnostic testing','Ryan Gouse','Pratap nagar sector 11','ryan',0,917,'confirmed',0,NULL);
/*!40000 ALTER TABLE `DrConsult_booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_cancelledbooking`
--

DROP TABLE IF EXISTS `DrConsult_cancelledbooking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_cancelledbooking` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(122) NOT NULL,
  `age` varchar(30) NOT NULL,
  `contact` varchar(10) NOT NULL,
  `email` varchar(122) NOT NULL,
  `city` varchar(122) NOT NULL,
  `location` varchar(122) NOT NULL,
  `department` varchar(122) NOT NULL,
  `doctor` varchar(122) NOT NULL,
  `date` date NOT NULL,
  `time` varchar(30) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `problem` longtext NOT NULL,
  `cancelled_at` datetime(6) NOT NULL,
  `booking_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_id` (`booking_id`),
  CONSTRAINT `DrConsult_cancelledb_booking_id_20aa88ef_fk_DrConsult` FOREIGN KEY (`booking_id`) REFERENCES `DrConsult_booking` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_cancelledbooking`
--

LOCK TABLES `DrConsult_cancelledbooking` WRITE;
/*!40000 ALTER TABLE `DrConsult_cancelledbooking` DISABLE KEYS */;
INSERT INTO `DrConsult_cancelledbooking` VALUES (4,'Shivam','Under 18','8875002260','shivam.mantri@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Ryan Gouse','2024-10-26','19:20 - 19:40','Female','thgth','2024-10-22 10:16:55.947397',18),(6,'Rahul','22','1234567890','rahul.prajapat@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Leo Arcand','2024-10-16','09:15 - 09:30','Male','sedhfewf','2024-10-22 10:30:27.900261',12),(7,'Shivam Mantri','Under 18','8875002260','shivam.mantri@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Leo Arcand','2024-10-16','09:30 - 09:45','Female','rggr','2024-10-22 10:54:31.250926',11),(8,'Shivam Mantri','Under 18','9636543505','shivam.mantri@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Leo Arcand','2024-10-16','10:45 - 11:00','Female','hhh','2024-10-22 11:43:40.267686',10),(9,'Bhavya Lohami','21','0987654321','bhavya.lohami@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Leo Arcand','2024-10-16','09:45 - 10:00','Male','Demo-Booking','2024-10-22 11:45:56.165429',9),(10,'shivam mantri','18-25','9636543502','shivam.mantri@logicspice.com','jaipur','Pratap nagar sector 11','Diagnostic testing','Leo Arcand','2024-10-15','13:30 - 13:45','Male','fever','2024-10-22 11:46:50.578286',7),(11,'Bhavya Lohami','Under 18','1234567890','shivam.mantri@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Leo Arcand','2024-10-06','16:15 - 16:30','Male','Appointment-Check','2024-10-22 11:49:22.006982',6),(12,'Shivam','1','1234567890','shivam.mantri@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Leo Arcand','2024-10-15','14:45 - 15:00','Female','Demo-appointment','2024-10-22 11:53:37.282529',5),(13,'Rahul Prajapat','26','9636542505','shivam.mantri@logicspice.com','jaipur','Pratap nagar sector 11','Diagnostic testing','Leo Arcand','2024-10-15','13:15 - 13:30','Male','fever and cold','2024-10-22 11:57:01.611498',4),(14,'Bhavya Lohami','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Leo Arcand','2024-10-27','08:30 - 08:45','Male','ewfwef','2024-10-25 09:39:20.606851',48),(16,'Bhavya Lohami','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Ryan Gouse','2024-10-29','08:40 - 09:00','Male','wefcwefc','2024-10-25 09:53:28.678473',50),(17,'Bhavya Lohami','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Ryan Gouse','2024-10-29','08:00 - 08:20','Male','Body Pain','2024-10-25 11:12:15.168639',49),(18,'Bhavya Lohami','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Ryan Gouse','2024-10-28','11:00 - 11:15','Male','Cold','2024-10-25 11:14:22.840953',47),(19,'Bhavya Lohami','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Ryan Gouse','2024-10-29','09:20 - 09:40','Male','rterg','2024-10-25 11:25:42.292427',46),(20,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Ryan Gouse','2024-10-27','01:00 - 01:15','Female','Fever','2024-10-25 11:28:15.936986',45),(21,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Ryan Gouse','2024-10-27','07:00 - 07:20','Female','Fever','2024-10-25 11:30:01.917959',43),(22,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Ryan Gouse','2024-10-27','09:00 - 09:20','Male','rg3r','2024-10-28 05:04:08.477636',39),(23,'Bhavya Lohami','18-25','8875002260','bhavya.lohami@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Ryan Gouse','2024-10-27','07:40 - 08:00','Male','Body Pain','2024-10-28 05:28:58.304512',38),(24,'shivam mantri','25','9636543505','shivam.mantri@logicspice.com','jaipur','Pratap nagar sector 11','Diagnostic testing','Leo Arcand','2024-10-15','13:00 - 13:15','Male','demo booking','2024-10-28 06:07:48.548673',3),(25,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Leo Arcand','2024-11-08','10:20 - 10:40','Male','hi','2024-11-07 11:33:52.407500',71),(26,'Shivam','18-25','8875002260','shivam.mantri@logicspice.com','Jaipur','Pratap nagar sector 11','Diagnostic testing','Ryan Gouse','2024-11-07','13:40 - 13:50','Male','rehrth','2024-11-08 05:37:18.512738',61),(27,'shivam mantri','18-25','9636543502','shivam.mantri@logicspice.com','jaipur','Pratap nagar sector 11','Diagnostic testing','Ryan Gouse','2024-11-08','10:40 - 10:50','Male','Regular Check-Up','2024-11-08 07:06:05.265863',72);
/*!40000 ALTER TABLE `DrConsult_cancelledbooking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_configuration`
--

DROP TABLE IF EXISTS `DrConsult_configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_configuration` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `new_logo` varchar(100) DEFAULT NULL,
  `new_favicon` varchar(100) DEFAULT NULL,
  `facebook_url` varchar(200) NOT NULL,
  `twitter_url` varchar(200) NOT NULL,
  `instagram_url` varchar(200) NOT NULL,
  `linkedin_url` varchar(200) NOT NULL,
  `timings_weekday` varchar(50) NOT NULL,
  `timings_weekend` varchar(50) NOT NULL,
  `slogan_title` varchar(50) NOT NULL,
  `slogan_text` varchar(200) NOT NULL,
  `company_name` varchar(50) NOT NULL,
  `contact_number` varchar(10) NOT NULL,
  `email_address` varchar(150) NOT NULL,
  `address` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_configuration`
--

LOCK TABLES `DrConsult_configuration` WRITE;
/*!40000 ALTER TABLE `DrConsult_configuration` DISABLE KEYS */;
INSERT INTO `DrConsult_configuration` VALUES (1,'logos/logo_6ATbGG5.png','favicons/favicon_Inbp9bb.ico','https://www.facebook.com/','https://www.x.com/','https://www.instagram.com/','https://www.linkedin.com/','8:00 pm - 12:00 pm','11:00am - 2:00 pm','We are Here to make you Feel Better','Experience the difference of personalized care at LS- Doctor’s                 Consultation, where we are dedicated to Caring for Life, One                 Patient at a Time','Logicspice','7854501170','Info@doctorsconsultation.com','Level 1, 12 Sample St, Sydney NSW 2000');
/*!40000 ALTER TABLE `DrConsult_configuration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_consultationquerym`
--

DROP TABLE IF EXISTS `DrConsult_consultationquerym`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_consultationquerym` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(122) NOT NULL,
  `email` varchar(122) NOT NULL,
  `contact` varchar(10) NOT NULL,
  `intrest` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_consultationquerym`
--

LOCK TABLES `DrConsult_consultationquerym` WRITE;
/*!40000 ALTER TABLE `DrConsult_consultationquerym` DISABLE KEYS */;
INSERT INTO `DrConsult_consultationquerym` VALUES (1,'Shivam','shivam@gmail.com','9636543505','health'),(2,'Shivam','shivam@gmail.com','9636543505','health'),(3,'Shivam','shivam@gmail.com','9636543505','health'),(4,'Shivam','shivam@gmail.com','9636543505','health'),(5,'Shivam','shivam@gmail.com','9636543505','health'),(6,'Shivam','shivam@gmail.com','9636543505','health'),(7,'Shivam','shivam@gmail.com','9636543505','health'),(8,'Shivam','shivam@gmail.com','9636543505','health'),(9,'Shivam','shivam@gmail.com','9636543505','health'),(10,'Shivam','shivam@gmail.com','9636543505','health'),(11,'Shivam','shivam@gmail.com','9636543505','health'),(12,'Shivam','shivam@gmail.com','9636543505','health'),(13,'Shivam','shivam@gmail.com','9636543505','health'),(14,'Shivam','shivam@gmail.com','9636543505','health'),(15,'Shivam','shivam@gmail.com','9636543505','health'),(16,'Shivam','shivam@gmail.com','9636543505','health'),(18,'Dr. Admin','qewf@gmail.com','41435454','Mental'),(19,'Dr. Admin','qewf@gmail.com','41435454','Mental'),(20,'Dr. Admin','qewf@gmail.com','41435454','Mental'),(21,'bhavya','f@gmail.com','6566546451','fwe'),(22,'Leo','shivam@gmail.com','9636543505','health'),(23,'Shivam','shivam@gmail.com','9636543505','health'),(24,'Dr. Admin','qewf@gmail.com','441435454','Pshycology'),(25,'Shivam','shivam@gmail.com','9636543505','health'),(26,'Dr. Admin','qewf@gmail.com','454756','pshycology'),(27,'Shivam','shivam@gmail.com','9636543505','health'),(28,'Shivam','shivam.mantri@logicspice.com','9636543505','health'),(29,'Shivam','shivam.mantri@logicspice.com','9636543505','health'),(30,'Shivam','shivam.mantri@logicspice.com','9636543505','health');
/*!40000 ALTER TABLE `DrConsult_consultationquerym` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_contact`
--

DROP TABLE IF EXISTS `DrConsult_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_contact` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(122) NOT NULL,
  `email` varchar(122) NOT NULL,
  `subject` varchar(122) NOT NULL,
  `message` longtext NOT NULL,
  `phone` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_contact`
--

LOCK TABLES `DrConsult_contact` WRITE;
/*!40000 ALTER TABLE `DrConsult_contact` DISABLE KEYS */;
INSERT INTO `DrConsult_contact` VALUES (20,'Bhavya Lohami','admin@google.com','rgeg','dfgdgdrtg','1234567890'),(21,'Rahul Prajapat','rahul@gmail.com','health','sawdaswd','1234567890'),(22,'Bhavya Lohami','admin@gmail.com','Health Issue','I\'m having severe headache.','1234567890'),(23,'Rahul Prajapat','mantrishivam1906@gmail.com','health','Cold','9636543505');
/*!40000 ALTER TABLE `DrConsult_contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_customuser`
--

DROP TABLE IF EXISTS `DrConsult_customuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_customuser` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `is_vendor` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_customuser`
--

LOCK TABLES `DrConsult_customuser` WRITE;
/*!40000 ALTER TABLE `DrConsult_customuser` DISABLE KEYS */;
INSERT INTO `DrConsult_customuser` VALUES (2,'pbkdf2_sha256$600000$CrcFdfvKfsiMgbdTwEhXsU$ZiaGF4NxGupiMpmce6WtS/pSDlZkSRZPXL/7NRWbMGQ=','2024-11-12 05:38:14.833557',1,'bhavya','','','bhavya.lohami@logicspice.com',1,1,'2024-11-12 05:37:30.942684',0);
/*!40000 ALTER TABLE `DrConsult_customuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_customuser_groups`
--

DROP TABLE IF EXISTS `DrConsult_customuser_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_customuser_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customuser_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `DrConsult_customuser_groups_customuser_id_group_id_98d6419e_uniq` (`customuser_id`,`group_id`),
  KEY `DrConsult_customuser_groups_group_id_68050623_fk_auth_group_id` (`group_id`),
  CONSTRAINT `DrConsult_customuser_customuser_id_92760abe_fk_DrConsult` FOREIGN KEY (`customuser_id`) REFERENCES `DrConsult_customuser` (`id`),
  CONSTRAINT `DrConsult_customuser_groups_group_id_68050623_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_customuser_groups`
--

LOCK TABLES `DrConsult_customuser_groups` WRITE;
/*!40000 ALTER TABLE `DrConsult_customuser_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `DrConsult_customuser_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_customuser_user_permissions`
--

DROP TABLE IF EXISTS `DrConsult_customuser_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_customuser_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customuser_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `DrConsult_customuser_use_customuser_id_permission_0db63e9d_uniq` (`customuser_id`,`permission_id`),
  KEY `DrConsult_customuser_permission_id_5782cec0_fk_auth_perm` (`permission_id`),
  CONSTRAINT `DrConsult_customuser_customuser_id_f675bc32_fk_DrConsult` FOREIGN KEY (`customuser_id`) REFERENCES `DrConsult_customuser` (`id`),
  CONSTRAINT `DrConsult_customuser_permission_id_5782cec0_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_customuser_user_permissions`
--

LOCK TABLES `DrConsult_customuser_user_permissions` WRITE;
/*!40000 ALTER TABLE `DrConsult_customuser_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `DrConsult_customuser_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_dateslotmodel`
--

DROP TABLE IF EXISTS `DrConsult_dateslotmodel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_dateslotmodel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `slot_number` int NOT NULL,
  `start_time` time(6) NOT NULL,
  `end_time` time(6) NOT NULL,
  `duration` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `doctor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `DrConsult_dateslotmodel_doctor_id_44e08169_fk_DrConsult_staff_id` (`doctor_id`),
  CONSTRAINT `DrConsult_dateslotmodel_doctor_id_44e08169_fk_DrConsult_staff_id` FOREIGN KEY (`doctor_id`) REFERENCES `DrConsult_staff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_dateslotmodel`
--

LOCK TABLES `DrConsult_dateslotmodel` WRITE;
/*!40000 ALTER TABLE `DrConsult_dateslotmodel` DISABLE KEYS */;
INSERT INTO `DrConsult_dateslotmodel` VALUES (3,'2024-10-03',1,'17:00:00.000000','19:00:00.000000',20,1,'2024-10-08 07:06:17.551323',2),(6,'2024-10-04',1,'03:00:00.000000','06:00:00.000000',15,1,'2024-10-10 05:40:04.515577',3),(8,'2024-10-06',1,'15:00:00.000000','18:00:00.000000',15,1,'2024-10-10 06:25:58.267209',3),(9,'2024-10-13',1,'13:00:00.000000','15:00:00.000000',15,1,'2024-10-10 06:58:43.016644',2),(11,'2024-10-03',2,'03:00:00.000000','05:00:00.000000',20,1,'2024-10-14 06:52:13.164320',3),(12,'2024-10-04',2,'08:00:00.000000','10:00:00.000000',20,1,'2024-10-14 07:19:20.495788',3),(13,'2024-10-15',1,'13:00:00.000000','15:00:00.000000',15,1,'2024-10-15 06:11:49.111994',3),(14,'2024-10-16',1,'09:00:00.000000','11:00:00.000000',15,1,'2024-10-16 05:08:24.299721',3),(15,'2024-10-18',1,'08:00:00.000000','10:00:00.000000',10,1,'2024-10-18 06:08:06.153910',3),(16,'2024-10-18',2,'12:00:00.000000','15:00:00.000000',15,1,'2024-10-18 06:10:04.535747',3),(31,'2024-11-08',1,'09:00:00.000000','11:00:00.000000',20,1,'2024-10-18 11:39:26.489680',3),(32,'2024-10-19',1,'18:00:00.000000','20:00:00.000000',20,1,'2024-10-18 12:20:07.015551',2),(33,'2024-10-20',1,'07:00:00.000000','10:00:00.000000',20,1,'2024-10-18 12:20:07.051993',2),(34,'2024-10-20',2,'01:00:00.000000','02:00:00.000000',15,1,'2024-10-18 12:20:07.089186',2),(35,'2024-10-21',1,'10:00:00.000000','12:00:00.000000',15,1,'2024-10-18 12:20:07.116513',2),(36,'2024-10-22',1,'08:00:00.000000','10:00:00.000000',20,1,'2024-10-18 12:20:07.158483',2),(37,'2024-10-23',1,'10:00:00.000000','12:00:00.000000',20,1,'2024-10-18 12:20:07.186208',2),(38,'2024-10-24',1,'13:00:00.000000','15:00:00.000000',15,1,'2024-10-18 12:20:07.238759',2),(39,'2024-10-26',1,'18:00:00.000000','20:00:00.000000',20,1,'2024-10-18 12:20:07.306504',2),(40,'2024-10-27',1,'07:00:00.000000','10:00:00.000000',20,1,'2024-10-18 12:20:07.364099',2),(41,'2024-10-27',2,'01:00:00.000000','02:00:00.000000',15,1,'2024-10-18 12:20:07.425774',2),(42,'2024-10-28',1,'10:00:00.000000','12:00:00.000000',15,1,'2024-10-18 12:20:07.453952',2),(43,'2024-10-29',1,'08:00:00.000000','10:00:00.000000',20,1,'2024-10-18 12:20:07.494705',2),(44,'2024-10-30',1,'10:00:00.000000','12:00:00.000000',20,1,'2024-10-18 12:20:07.529300',2),(45,'2024-10-31',1,'13:00:00.000000','15:00:00.000000',15,1,'2024-10-18 12:20:07.574560',2),(46,'2024-10-22',2,'14:00:00.000000','16:00:00.000000',20,1,'2024-10-21 09:00:02.169666',12),(47,'2024-10-25',1,'18:00:00.000000','20:00:00.000000',30,1,'2024-10-21 09:05:01.795293',12),(48,'2024-10-21',2,'03:00:00.000000','05:00:00.000000',15,1,'2024-10-21 09:54:49.996823',13),(49,'2024-10-22',3,'11:00:00.000000','13:00:00.000000',20,1,'2024-10-21 09:54:50.032939',13),(50,'2024-10-24',2,'20:00:00.000000','22:00:00.000000',20,1,'2024-10-21 09:54:50.067736',13),(51,'2024-10-26',2,'10:00:00.000000','12:00:00.000000',30,1,'2024-10-21 09:54:50.096870',13),(52,'2024-10-27',3,'01:00:00.000000','02:00:00.000000',10,1,'2024-10-21 09:54:50.114019',13),(53,'2024-10-28',2,'03:00:00.000000','05:00:00.000000',15,1,'2024-10-21 09:54:50.134843',13),(54,'2024-10-29',2,'11:00:00.000000','13:00:00.000000',20,1,'2024-10-21 09:54:50.189537',13),(55,'2024-10-31',2,'20:00:00.000000','22:00:00.000000',20,1,'2024-10-21 09:54:50.227205',13),(56,'2024-10-24',3,'03:00:00.000000','04:00:00.000000',10,1,'2024-10-21 11:56:29.538378',3),(57,'2024-10-27',4,'04:00:00.000000','06:00:00.000000',15,1,'2024-10-23 04:15:01.515745',12),(58,'2024-10-29',3,'14:00:00.000000','16:00:00.000000',20,1,'2024-10-23 04:15:01.548334',12),(59,'2024-10-27',5,'07:00:00.000000','09:00:00.000000',15,1,'2024-10-25 06:37:52.205618',3),(60,'2024-11-01',1,'18:00:00.000000','20:00:00.000000',30,1,'2024-10-28 04:05:02.462065',12),(61,'2024-11-03',1,'04:00:00.000000','06:00:00.000000',15,1,'2024-10-28 04:05:02.501910',12),(62,'2024-11-05',1,'14:00:00.000000','16:00:00.000000',20,1,'2024-10-28 04:05:02.536225',12),(63,'2024-11-07',1,'09:00:00.000000','11:00:00.000000',15,1,'2024-11-07 05:16:29.343979',2),(64,'2024-11-07',2,'12:00:00.000000','14:00:00.000000',10,1,'2024-11-07 07:24:15.165108',2),(65,'2024-11-08',2,'10:00:00.000000','12:00:00.000000',10,1,'2024-11-08 05:16:35.020023',2),(66,'2024-11-09',1,'10:00:00.000000','12:00:00.000000',10,1,'2024-11-08 05:17:28.358117',3),(67,'2024-11-08',3,'13:00:00.000000','15:00:00.000000',20,1,'2024-11-08 06:14:28.396650',2);
/*!40000 ALTER TABLE `DrConsult_dateslotmodel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_defaultslot`
--

DROP TABLE IF EXISTS `DrConsult_defaultslot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_defaultslot` (
  `id` int NOT NULL AUTO_INCREMENT,
  `day_of_week` varchar(10) NOT NULL,
  `slot_number` int NOT NULL,
  `start_time` time(6) NOT NULL,
  `end_time` time(6) NOT NULL,
  `duration` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `doctor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `DrConsult_defaultslot_doctor_id_cae7d800_fk_DrConsult_staff_id` (`doctor_id`),
  CONSTRAINT `DrConsult_defaultslot_doctor_id_cae7d800_fk_DrConsult_staff_id` FOREIGN KEY (`doctor_id`) REFERENCES `DrConsult_staff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_defaultslot`
--

LOCK TABLES `DrConsult_defaultslot` WRITE;
/*!40000 ALTER TABLE `DrConsult_defaultslot` DISABLE KEYS */;
INSERT INTO `DrConsult_defaultslot` VALUES (1,'Sunday',1,'07:00:00.000000','10:00:00.000000',20,1,'2024-10-07 09:22:35.864315',2),(2,'Sunday',1,'06:00:00.000000','07:00:00.000000',15,1,'2024-10-07 09:47:49.973303',3),(4,'Monday',1,'07:00:00.000000','09:00:00.000000',20,1,'2024-10-07 10:14:04.822685',3),(5,'Monday',2,'20:00:00.000000','22:00:00.000000',10,1,'2024-10-07 12:30:55.087926',3),(6,'Monday',1,'10:00:00.000000','12:00:00.000000',15,1,'2024-10-08 07:03:41.986925',2),(7,'Sunday',2,'01:00:00.000000','02:00:00.000000',15,1,'2024-10-08 08:29:51.328867',2),(8,'Tuesday',1,'08:00:00.000000','10:00:00.000000',20,1,'2024-10-10 07:27:25.425390',2),(9,'Wednesday',1,'10:00:00.000000','12:00:00.000000',20,1,'2024-10-10 07:27:41.717838',2),(10,'Thursday',1,'13:00:00.000000','15:00:00.000000',15,1,'2024-10-10 07:28:09.378955',2),(11,'Saturday',1,'18:00:00.000000','20:00:00.000000',20,1,'2024-10-10 07:28:30.889549',2),(12,'Friday',1,'11:00:00.000000','13:00:00.000000',20,1,'2024-10-11 11:44:47.145979',3),(13,'Tuesday',1,'09:00:00.000000','12:00:00.000000',20,1,'2024-10-19 05:19:47.068486',3),(14,'Wednesday',1,'09:00:00.000000','12:00:00.000000',20,1,'2024-10-19 05:20:07.938488',3),(15,'Thursday',1,'09:00:00.000000','11:00:00.000000',20,1,'2024-10-19 05:21:09.645909',3),(16,'Sunday',1,'04:00:00.000000','06:00:00.000000',15,1,'2024-10-21 07:36:56.333758',12),(17,'Tuesday',1,'14:00:00.000000','16:00:00.000000',20,1,'2024-10-21 07:37:17.796619',12),(18,'Friday',1,'18:00:00.000000','20:00:00.000000',30,1,'2024-10-21 07:37:32.948266',12),(19,'Sunday',1,'01:00:00.000000','02:00:00.000000',10,1,'2024-10-21 09:52:53.481630',13),(20,'Monday',1,'03:00:00.000000','05:00:00.000000',15,1,'2024-10-21 09:53:06.378728',13),(21,'Tuesday',1,'11:00:00.000000','13:00:00.000000',20,1,'2024-10-21 09:53:22.786285',13),(22,'Saturday',1,'10:00:00.000000','12:00:00.000000',30,1,'2024-10-21 09:53:37.764052',13),(23,'Thursday',1,'20:00:00.000000','22:00:00.000000',20,1,'2024-10-21 09:53:57.858373',13);
/*!40000 ALTER TABLE `DrConsult_defaultslot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_holidaymodel`
--

DROP TABLE IF EXISTS `DrConsult_holidaymodel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_holidaymodel` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `doctor_id` bigint NOT NULL,
  `comment` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `DrConsult_holidaymodel_doctor_id_3e645e6b_fk_DrConsult_staff_id` (`doctor_id`),
  CONSTRAINT `DrConsult_holidaymodel_doctor_id_3e645e6b_fk_DrConsult_staff_id` FOREIGN KEY (`doctor_id`) REFERENCES `DrConsult_staff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_holidaymodel`
--

LOCK TABLES `DrConsult_holidaymodel` WRITE;
/*!40000 ALTER TABLE `DrConsult_holidaymodel` DISABLE KEYS */;
INSERT INTO `DrConsult_holidaymodel` VALUES (6,'2024-11-21','2024-10-08 11:58:37.933173',2,NULL),(25,'2024-10-12','2024-10-11 10:47:06.028115',2,NULL),(27,'2024-10-02','2024-10-11 10:47:06.045444',2,NULL),(29,'2024-10-02','2024-10-11 12:17:08.130227',3,NULL),(30,'2024-10-12','2024-10-11 12:17:08.135898',3,NULL),(43,'2024-10-31','2024-10-23 06:23:44.175045',3,'Diwali'),(47,'2024-11-03','2024-10-23 08:00:07.368594',3,'Bhai Duj'),(48,'2024-11-01','2024-10-23 09:26:33.051379',2,'Diwali'),(51,'2024-10-30','2024-10-23 10:21:05.809556',3,'Small Diwali'),(55,'2024-10-25','2024-10-24 11:47:20.304850',2,NULL),(56,'2024-10-31','2024-10-24 12:35:03.972167',2,'Diwali'),(57,'2024-11-03','2024-10-24 12:35:29.485021',2,'Bhai Duj');
/*!40000 ALTER TABLE `DrConsult_holidaymodel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_managedepartment`
--

DROP TABLE IF EXISTS `DrConsult_managedepartment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_managedepartment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_managedepartment`
--

LOCK TABLES `DrConsult_managedepartment` WRITE;
/*!40000 ALTER TABLE `DrConsult_managedepartment` DISABLE KEYS */;
INSERT INTO `DrConsult_managedepartment` VALUES (3,'Diagnostic testing',1),(4,'Psychological Department',1);
/*!40000 ALTER TABLE `DrConsult_managedepartment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_managelocation`
--

DROP TABLE IF EXISTS `DrConsult_managelocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_managelocation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `url` varchar(500) NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_managelocation`
--

LOCK TABLES `DrConsult_managelocation` WRITE;
/*!40000 ALTER TABLE `DrConsult_managelocation` DISABLE KEYS */;
INSERT INTO `DrConsult_managelocation` VALUES (1,'Pratap nagar sector 11','https://www.google.com/maps/place/Pratap+Nagar,+Jaipur,+Rajasthan/@26.8027192,75.6779842,12z/data=!3m1!4b1!4m10!1m2!2m1!1spratap+nagar+map+url!3m6!1s0x396dc98e1f33788b:0x9a2730f2d96e4e45!8m2!3d26.8036533!4d75.8084579!15sChRwcmF0YXAgbmFnYXIgbWFwIHVybJIBDHN1YmxvY2FsaXR5MeABAA!16s%2Fm%2F0j_4mrj?entry=ttu&g_ep=EgoyMDI0MDgyOC4wIKXMDSoASAFQAw%3D%3D',1),(2,'Sanganer','https://www.google.com/maps/place/Pratap+Nagar,+Jaipur,+Rajasthan/@26.8027192,75.6779842,12z/data=!3m1!4b1!4m10!1m2!2m1!1spratap+nagar+map+url!3m6!1s0x396dc98e1f33788b:0x9a2730f2d96e4e45!8m2!3d26.8036533!4d75.8084579!15sChRwcmF0YXAgbmFnYXIgbWFwIHVybJIBDHN1YmxvY2FsaXR5MeABAA!16s%2Fm%2F0j_4mrj?entry=ttu&g_ep=EgoyMDI0MDgyOC4wIKXMDSoASAFQAw%3D%3D',1),(3,'Maansarovar','https://www.google.com/maps/place/Pratap+Nagar,+Jaipur,+Rajasthan/@26.8027192,75.6779842,12z/data=!3m1!4b1!4m10!1m2!2m1!1spratap+nagar+map+url!3m6!1s0x396dc98e1f33788b:0x9a2730f2d96e4e45!8m2!3d26.8036533!4d75.8084579!15sChRwcmF0YXAgbmFnYXIgbWFwIHVybJIBDHN1YmxvY2FsaXR5MeABAA!16s%2Fm%2F0j_4mrj?entry=ttu&g_ep=EgoyMDI0MDgyOC4wIKXMDSoASAFQAw%3D%3D',1);
/*!40000 ALTER TABLE `DrConsult_managelocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_managepages`
--

DROP TABLE IF EXISTS `DrConsult_managepages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_managepages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `content` longtext NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_managepages`
--

LOCK TABLES `DrConsult_managepages` WRITE;
/*!40000 ALTER TABLE `DrConsult_managepages` DISABLE KEYS */;
INSERT INTO `DrConsult_managepages` VALUES (1,'Terms Of Service','<p>Welcome to&nbsp;<a href=\"http://localhost:3000/termsofservice\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: inherit;\">www.doctors-consultation.com</a>. By accessing or using our Site and services, you agree to comply with and be bound by these Terms and Conditions (\"Terms\"). Please read them carefully. If you do not agree to these Terms, you should not use our Site.</p><p><strong>Acceptance of Terms</strong></p><p>By using our services, you confirm that you are at least 18 years old or have the consent of a parent or guardian. You agree to these Terms and our Privacy Policy, which is incorporated herein by reference.</p><p><strong>Services Provided</strong></p><p><a href=\"http://localhost:3000/termsofservice\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: inherit;\">www.doctors-consultation.com</a>&nbsp;provides an online platform that allows users to:</p><p>• Schedule consultations with licensed healthcare professionals.</p><p>• Access health-related information and resources.</p><p>• Communicate with healthcare providers through secure messaging.</p><p><strong>User Obligations</strong></p><p>When using our Site, you agree to:</p><p>• Provide accurate, current, and complete information during registration and consultations.</p><p>• Maintain the confidentiality of your account information and password.</p><p>• Notify us immediately of any unauthorized use of your account or any other breach of security.</p><p>• Use our services only for lawful purposes and in accordance with these Terms.</p><p><strong>Appointment Scheduling</strong></p><p>• Appointments can be scheduled through our Site based on the availability of the healthcare professionals.</p><p>• We reserve the right to cancel or reschedule appointments due to unforeseen circumstances or provider availability.</p><p><strong>Fees and Payment</strong></p><p>• Fees for consultations will be clearly stated at the time of booking. Payment is required at the time of booking via our accepted payment methods.</p><p>• All fees are non-refundable unless otherwise stated.</p><p><strong>No Medical Advice</strong></p><p>• The information provided on our Site is for informational purposes only and should not be considered medical advice.</p><p>• Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition.</p><p><strong>Limitation of Liability</strong></p><p>• To the fullest extent permitted by law, [Website Name], its affiliates, and its service providers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or goodwill, arising from or related to your use of our Site or services.</p><p><strong>Indemnification</strong></p><p>You agree to indemnify, defend, and hold harmless [Website Name], its affiliates, and their respective officers, directors, employees, agents, and licensors from any claims, liabilities, damages, losses, and expenses (including reasonable attorneys\' fees) arising out of or related to your use of our Site, violation of these Terms, or violation of any rights of another party.</p><p><strong>Termination</strong></p><p>We reserve the right to terminate or suspend your access to our Site and services, without prior notice or liability, for any reason, including if you breach these Terms.</p><p><strong>Governing Law</strong></p><p>These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.</p>','terms-of-service'),(2,'Privacy Policy','<p><span style=\"background-color: rgb(255, 255, 255);\">Doctor’s Consultation is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website</span><a href=\"https://google.com/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgb(255, 255, 255); color: inherit;\">&nbsp;www.doctor’s-consultation.com</a><span style=\"background-color: rgb(255, 255, 255);\">, use our mobile application, or engage with our services. Please read this policy carefully to understand our views and practices regarding your personal data and how we will treat it.</span></p><p><br></p><p><strong>Information We Collect</strong></p><p>We may collect and process the following data about you:</p><p>• Personal Information:&nbsp;When you register, make a purchase, or interact with our services, we may collect personal information such as your name, email address, phone number, mailing address, payment information, and other details you provide</p><p>• Usage Data:&nbsp;We may collect information about how you use our website and services, including your IP address, browser type, operating system, pages visited, and the date and time of your visit.</p><p>• Cookies and Tracking Technologies:&nbsp;We use cookies, web beacons, and similar technologies to collect information about your interaction with our website and services.</p><p><br></p><p><strong>How We Use Your Information</strong></p><p>We may use the information we collect from you in the following ways:</p><p>• To Provide and Maintain Our Services:&nbsp;To provide, operate, and maintain our website and services.</p><p>• To Improve Our Services:&nbsp;To understand and analyze how you use our services, and to develop new products, services, and features.</p><p>• To Communicate with You:&nbsp;To send you updates, newsletters, marketing materials, and other information that may be of interest to you.</p><p>• For Legal and Security Purposes:&nbsp;To comply with legal obligations, resolve disputes, and enforce our agreements.</p><p><br></p><p><strong>How We Share Your Information</strong></p><p>We may collect and process the following data about you:</p><p>• Service Providers:&nbsp;Third-party vendors and service providers who assist us in providing our services.</p><p>• Business Transfers:&nbsp;In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business.</p><p>• Legal Requirements:&nbsp;If required to do so by law or in response to valid requests by public authorities.</p><p><br></p><p><strong>Data Security</strong></p><p>We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no security system is impenetrable, and we cannot guarantee the absolute security of your data.</p><p><br></p><p><strong>Your Rights</strong></p><p>Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, delete, or restrict its use. To exercise these rights, please contact us at&nbsp;info@doctorsconsulation.com.</p><p><br></p><p><strong>Third-Party Links</strong></p><p>Our website and services may contain links to third-party websites. We are not responsible for the privacy practices or content of these third-party sites.</p>','privacy-policy');
/*!40000 ALTER TABLE `DrConsult_managepages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_notification`
--

DROP TABLE IF EXISTS `DrConsult_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_notification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `message` longtext NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `doctor` varchar(20) NOT NULL,
  `notification_type` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_notification`
--

LOCK TABLES `DrConsult_notification` WRITE;
/*!40000 ALTER TABLE `DrConsult_notification` DISABLE KEYS */;
INSERT INTO `DrConsult_notification` VALUES (1,'New appointment booked for 2024-10-27 at 08:40 - 09:00 with Dr. Ryan Gouse by Bhavya Lohami.','2024-10-24 12:15:04.277908',1,'ryan','Booking'),(2,'New appointment booked for 2024-10-27 at 07:00 - 07:20 with Dr. Ryan Gouse by Shivam.','2024-10-25 06:33:48.888258',1,'ryan','Booking'),(3,'New appointment booked for 2024-10-27 at 08:00 - 08:15 with Dr. Leo Arcand by Shivam.','2024-10-25 06:38:33.512091',1,'leo','Booking'),(4,'New appointment booked for 2024-10-27 at 01:00 - 01:15 with Dr. Ryan Gouse by Shivam.','2024-10-25 07:04:06.644097',1,'ryan','Booking'),(5,'New appointment booked for 2024-10-29 at 09:20 - 09:40 with Dr. Ryan Gouse by Bhavya Lohami.','2024-10-25 07:08:10.772029',1,'ryan','Booking'),(6,'New appointment booked for 2024-10-28 at 11:00 - 11:15 with Dr. Ryan Gouse by Bhavya Lohami.','2024-10-25 07:10:37.729975',1,'ryan','Booking'),(7,'New appointment booked for 2024-10-27 at 08:30 - 08:45 with Dr. Leo Arcand by Bhavya Lohami.','2024-10-25 07:16:21.450173',1,'leo','Booking'),(8,'New appointment booked for 2024-10-29 at 08:00 - 08:20 with Dr. Ryan Gouse by Bhavya Lohami.','2024-10-25 07:39:16.968967',1,'ryan','Booking'),(9,'New appointment booked for 2024-10-29 at 08:40 - 09:00 with Dr. Ryan Gouse by Bhavya Lohami.','2024-10-25 09:10:15.006198',1,'ryan','Booking'),(10,'Booking for 2024-10-27 at 08:30 - 08:45 with Dr. Leo Arcand has been canceled.','2024-10-25 09:39:20.615310',0,'Leo Arcand','Booking'),(11,'Booking for 2024-10-29 at 08:40 - 09:00 with Dr. Ryan Gouse has been canceled.','2024-10-25 09:53:28.685618',0,'Ryan Gouse','Booking'),(12,'Appointment rescheduled for 2024-10-29 at 08:40 - 09:00 with Dr. Ryan Gouse by Bhavya Lohami.','2024-10-25 09:53:28.691807',1,'ryan','Booking'),(13,'Appointment for 2024-10-29 at 09:20 - 09:40 with Dr. Ryan Gouse is cancelled.','2024-10-25 11:25:42.303427',1,'ryan','Booking'),(14,'Appointment for 2024-10-27 at 01:00 - 01:15 with Dr. Ryan Gouse is cancelled.','2024-10-25 11:28:15.946907',1,'ryan','Booking'),(15,'Appointment for 2024-10-27 at 07:00 - 07:20 with Dr. Ryan Gouse is cancelled.','2024-10-25 11:30:01.930894',1,'ryan','cancelled'),(16,'Appointment for 2024-10-27 at 09:40 - 10:00 with Dr. Ryan Gouse is cancelled.','2024-10-25 12:13:08.220790',1,'ryan','cancelled'),(17,'Appointment rescheduled from 2024-10-27 at SubSlotModel object (402) to 2024-10-27 at SubSlotModel object (405) with Dr. Ryan Gouse.','2024-10-25 12:44:38.765711',1,'ryan','rescheduled'),(18,'Appointment rescheduled from 2024-10-27 at SubSlotModel object (405) to 2024-10-27 at SubSlotModel object (402) with Dr. Ryan Gouse.','2024-10-25 12:45:29.270261',1,'ryan','rescheduled'),(19,'Appointment rescheduled from 2024-10-27 at SubSlotModel object (402) to 2024-10-27 at SubSlotModel object (405) with Dr. Ryan Gouse.','2024-10-25 12:46:14.872869',1,'ryan','rescheduled'),(20,'Appointment rescheduled from 2024-10-27 at SubSlotModel object (405) to 2024-10-27 at SubSlotModel object (402) with Dr. Ryan Gouse.','2024-10-25 12:50:04.149736',1,'ryan','rescheduled'),(21,'Appointment rescheduled from 2024-10-27 at SubSlotModel object (402) to 2024-10-27 at SubSlotModel object (405) with Dr. Ryan Gouse.','2024-10-25 12:51:12.247320',1,'ryan','rescheduled'),(22,'Appointment rescheduled from 2024-10-27 at SubSlotModel object (405) to 2024-10-27 at SubSlotModel object (408) with Dr. Ryan Gouse.','2024-10-28 04:58:29.960893',1,'ryan','rescheduled'),(23,'Appointment rescheduled from 2024-10-27 at 01:30:00 - 01:45:00 to 2024-10-27 at 09:40:00 - 10:00:00 with Dr. Ryan Gouse.','2024-10-28 05:00:07.090804',1,'ryan','rescheduled'),(24,'New appointment booked for 2024-10-28 at 10:00 - 10:15 with Dr. Ryan Gouse by shivam mantri.','2024-10-28 05:01:41.648322',1,'ryan','Booking'),(25,'Appointment for 2024-10-27 at 09:00 - 09:20 with Dr. Ryan Gouse is cancelled.','2024-10-28 05:04:08.489931',1,'ryan','cancelled'),(26,'Appointment for 2024-10-27 at 07:40 - 08:00 with Dr. Ryan Gouse is cancelled.','2024-10-28 05:28:58.332953',1,'ryan','cancelled'),(27,'Appointment for 2024-10-15 at 13:00 - 13:15 with Dr. Leo Arcand is cancelled.','2024-10-28 06:07:48.557074',0,'leo','cancelled'),(28,'Appointment rescheduled from 2024-10-28 at 10:00:00 - 10:15:00 to 2024-10-28 at 10:15:00 - 10:30:00 with Dr. Ryan Gouse.','2024-10-28 07:39:27.497656',1,'ryan','rescheduled'),(29,'New appointment booked for 2024-11-07 at 10:00 - 10:15 with Dr. Ryan Gouse by Shivam.','2024-11-07 05:16:44.508025',1,'ryan','Booking'),(30,'New appointment booked for 2024-11-07 at 09:00 - 09:15 with Dr. Ryan Gouse by Shivam.','2024-11-07 05:24:37.479410',0,'ryan','Booking'),(31,'New appointment booked for 2024-11-07 at 09:15 - 09:30 with Dr. Ryan Gouse by shivam mantri.','2024-11-07 05:56:02.138395',0,'ryan','Booking'),(32,'New appointment booked for 2024-11-07 at 10:45 - 11:00 with Dr. Ryan Gouse by Shivam.','2024-11-07 06:34:53.625199',0,'ryan','Booking'),(33,'New appointment booked for 2024-11-07 at 10:30 - 10:45 with Dr. Ryan Gouse by Shivam.','2024-11-07 06:41:57.537027',0,'ryan','Booking'),(34,'New appointment booked for 2024-11-07 at 09:45 - 10:00 with Dr. Ryan Gouse by Shivam.','2024-11-07 06:50:40.585210',1,'ryan','Booking'),(35,'New appointment booked for 2024-11-07 at 10:15 - 10:30 with Dr. Ryan Gouse by Shivam.','2024-11-07 06:51:13.627639',0,'ryan','Booking'),(36,'New appointment booked for 2024-11-07 at 09:30 - 09:45 with Dr. Ryan Gouse by Shivam.','2024-11-07 07:17:30.296637',0,'ryan','Booking'),(37,'New appointment booked for 2024-11-07 at 12:50 - 13:00 with Dr. Ryan Gouse by Shivam.','2024-11-07 07:24:46.120642',0,'ryan','Booking'),(38,'New appointment booked for 2024-11-07 at 13:40 - 13:50 with Dr. Ryan Gouse by Shivam.','2024-11-07 07:26:34.374575',1,'ryan','Booking'),(39,'New appointment booked for 2024-11-07 at 13:30 - 13:40 with Dr. Ryan Gouse by Shivam.','2024-11-07 07:27:00.844780',0,'ryan','Booking'),(40,'New appointment booked for 2024-11-07 at 12:00 - 12:10 with Dr. Ryan Gouse by shivam mantri.','2024-11-07 09:17:22.667547',0,'ryan','Booking'),(41,'New appointment booked for 2024-11-07 at 12:10 - 12:20 with Dr. Ryan Gouse by shivam mantri.','2024-11-07 09:19:46.333906',0,'ryan','Booking'),(42,'New appointment booked for 2024-11-07 at 12:20 - 12:30 with Dr. Ryan Gouse by shivam mantri.','2024-11-07 09:20:50.669999',0,'ryan','Booking'),(43,'New appointment booked for 2024-11-07 at 13:10 - 13:20 with Dr. Ryan Gouse by Shivam.','2024-11-07 09:26:09.502289',1,'ryan','Booking'),(44,'New appointment booked for 2024-11-07 at 13:50 - 14:00 with Dr. Ryan Gouse by Shivam.','2024-11-07 09:32:39.973984',0,'ryan','Booking'),(45,'New appointment booked for 2024-11-07 at 13:00 - 13:10 with Dr. Ryan Gouse by Shivam.','2024-11-07 09:42:54.253141',0,'ryan','Booking'),(46,'New appointment booked for 2024-11-07 at 13:20 - 13:30 with Dr. Ryan Gouse by Shivam.','2024-11-07 09:46:11.836310',1,'ryan','Booking'),(47,'New appointment booked for 2024-11-07 at 12:30 - 12:40 with Dr. Ryan Gouse by Shivam.','2024-11-07 09:48:23.637996',1,'ryan','Booking'),(48,'New appointment booked for 2024-11-08 at 10:20 - 10:40 with Dr. Leo Arcand by Shivam.','2024-11-07 11:30:20.188115',0,'leo','Booking'),(49,'Appointment for 2024-11-08 at 10:20 - 10:40 with Dr. Leo Arcand is cancelled.','2024-11-07 11:33:52.421198',0,'leo','cancelled'),(50,'Appointment for 2024-11-07 at 13:40 - 13:50 with Dr. Ryan Gouse is cancelled.','2024-11-08 05:37:18.531693',0,'ryan','cancelled'),(51,'New appointment booked for 2024-11-08 at 10:40 - 10:50 with Dr. Ryan Gouse by shivam mantri.','2024-11-08 06:02:11.292621',0,'ryan','Booking'),(52,'New appointment booked for 2024-11-08 at 11:50 - 12:00 with Dr. Ryan Gouse by shivam mantri.','2024-11-08 06:15:43.401584',1,'ryan','Booking'),(53,'Appointment rescheduled from 2024-11-08 at 11:50:00 - 12:00:00 to 2024-11-08 at 13:00:00 - 13:20:00 with Dr. Ryan Gouse.','2024-11-08 06:20:30.419736',0,'ryan','rescheduled'),(54,'New appointment booked for 2024-11-08 at 13:20 - 13:40 with Dr. Ryan Gouse by shivam mantri.','2024-11-08 06:56:19.547864',0,'ryan','Booking'),(55,'Appointment for 2024-11-08 at 10:40 - 10:50 with Dr. Ryan Gouse is cancelled.','2024-11-08 07:06:05.275280',0,'ryan','cancelled');
/*!40000 ALTER TABLE `DrConsult_notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_patient`
--

DROP TABLE IF EXISTS `DrConsult_patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_patient` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(122) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `age` varchar(30) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `contact` varchar(10) NOT NULL,
  `email` varchar(122) NOT NULL,
  `address` varchar(122) NOT NULL,
  `city` varchar(122) NOT NULL,
  `state` varchar(60) NOT NULL,
  `zipcode` varchar(6) NOT NULL,
  `blood_group` varchar(10) NOT NULL,
  `username_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_id` (`username_id`),
  CONSTRAINT `DrConsult_patient_username_id_cf31262b_fk_auth_user_id` FOREIGN KEY (`username_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_patient`
--

LOCK TABLES `DrConsult_patient` WRITE;
/*!40000 ALTER TABLE `DrConsult_patient` DISABLE KEYS */;
INSERT INTO `DrConsult_patient` VALUES (1,'Shivam Mantri','2003-06-19','male','21','patients/pp1_dCnRoXM.png','9636543505','shivam.mantri@logicspice.com','Talera','Bundi','Rajasthan','302031','O+',38);
/*!40000 ALTER TABLE `DrConsult_patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_patientdocument`
--

DROP TABLE IF EXISTS `DrConsult_patientdocument`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_patientdocument` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `document_name` varchar(100) NOT NULL,
  `document_file` varchar(100) NOT NULL,
  `upload_date` datetime(6) NOT NULL,
  `patient_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `DrConsult_patientdoc_patient_id_ddf74630_fk_DrConsult` (`patient_id`),
  CONSTRAINT `DrConsult_patientdoc_patient_id_ddf74630_fk_DrConsult` FOREIGN KEY (`patient_id`) REFERENCES `DrConsult_patient` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_patientdocument`
--

LOCK TABLES `DrConsult_patientdocument` WRITE;
/*!40000 ALTER TABLE `DrConsult_patientdocument` DISABLE KEYS */;
INSERT INTO `DrConsult_patientdocument` VALUES (1,'Documnet','patient_documents/Dr_h7zP3I7.docx','2024-11-07 12:49:34.314844',1);
/*!40000 ALTER TABLE `DrConsult_patientdocument` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_services`
--

DROP TABLE IF EXISTS `DrConsult_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_services` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(122) NOT NULL,
  `date` date NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `text` varchar(200) NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_services`
--

LOCK TABLES `DrConsult_services` WRITE;
/*!40000 ALTER TABLE `DrConsult_services` DISABLE KEYS */;
INSERT INTO `DrConsult_services` VALUES (9,'Diagnostic testing','2024-08-26','services/badge.png','Blood tests, imaging studies, and other tests to diagnose health conditions',1),(10,'Diagnostic testing','2024-08-26','services/badge_ujpSqp3.png','Blood tests, imaging studies, and other tests to diagnose health conditions',1),(11,'Rehabilitation services','2024-08-26','services/badge_D9wc33N.png','Physical therapy, occupational therapy, and other services to help patients recover from injuries',0),(12,'Preventive care','2024-08-26','services/badge_9kbFfes.png','Annual checkups, immunizations,and health screenings care preventive',1),(13,'Treatment for acute and chronic conditions','2024-08-26','services/badge_jz4A6Rw.png','Medication management, disease management, and other treatments to improve health outcomes',1),(14,'Mental health services','2024-08-26','services/badge_TmE9ueD.png','Counseling, therapy, and other services to help patients managemental health conditions',1),(15,'Diagnostic testing','2024-08-26','services/badge_JbPdhjo.png','Blood tests, imaging studies, and other tests to diagnose health conditions',0),(16,'Diagnostic testing','2024-08-26','services/badge_wjRfGbq.png','Blood tests, imaging studies, and other tests to diagnose health conditions',0),(17,'Rehabilitation services','2024-08-26','services/badge_R9iFg9H.png','Physical therapy, occupational therapy, and other services to help patients recover from injuries',0),(18,'Preventive care','2024-08-26','services/badge_SJPdIvY.png','Annual checkups, immunizations,and health screenings care preventive',1),(20,'Treatment for acute and chronic conditions','2024-08-26','services/badge_LpGacqJ.png','Medication management, disease management, and other treatments to improve health outcomes',1),(21,'Mental health services','2024-08-26','services/badge_v0O59Me.png','Counseling, therapy, and other services to help patients manage mental health conditions',1);
/*!40000 ALTER TABLE `DrConsult_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_slotgenerationsetting`
--

DROP TABLE IF EXISTS `DrConsult_slotgenerationsetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_slotgenerationsetting` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `number_of_days` int DEFAULT NULL,
  `check_days` tinyint(1) NOT NULL,
  `until_date` date DEFAULT NULL,
  `auto_generate` tinyint(1) NOT NULL,
  `last_generated_at` datetime(6) DEFAULT NULL,
  `doctor_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `DrConsult_slotgenera_doctor_id_e58dd228_fk_DrConsult` (`doctor_id`),
  CONSTRAINT `DrConsult_slotgenera_doctor_id_e58dd228_fk_DrConsult` FOREIGN KEY (`doctor_id`) REFERENCES `DrConsult_staff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_slotgenerationsetting`
--

LOCK TABLES `DrConsult_slotgenerationsetting` WRITE;
/*!40000 ALTER TABLE `DrConsult_slotgenerationsetting` DISABLE KEYS */;
INSERT INTO `DrConsult_slotgenerationsetting` VALUES (1,15,1,NULL,1,'2024-11-08 10:35:03.000000',3),(2,13,1,NULL,1,'2024-11-08 10:35:23.000000',2),(3,5,1,NULL,1,'2024-11-08 10:35:28.000000',12),(4,10,1,NULL,1,'2024-11-08 10:35:33.000000',13);
/*!40000 ALTER TABLE `DrConsult_slotgenerationsetting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_staff`
--

DROP TABLE IF EXISTS `DrConsult_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_staff` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fname` varchar(122) NOT NULL,
  `lname` varchar(122) NOT NULL,
  `email` varchar(122) NOT NULL,
  `role` varchar(200) NOT NULL,
  `date` date NOT NULL,
  `yoe` varchar(20) NOT NULL,
  `address` varchar(300) NOT NULL,
  `city` varchar(122) NOT NULL,
  `code` int NOT NULL,
  `status` int NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `department` varchar(250) NOT NULL,
  `location` varchar(250) NOT NULL,
  `gender` varchar(122) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `username` varchar(122) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `country` varchar(60) NOT NULL,
  `state` varchar(60) NOT NULL,
  `zipcode` varchar(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_staff`
--

LOCK TABLES `DrConsult_staff` WRITE;
/*!40000 ALTER TABLE `DrConsult_staff` DISABLE KEYS */;
INSERT INTO `DrConsult_staff` VALUES (2,'Ryan','Gouse','Ryan@gmail.com','Eye Specialists','2024-09-18','1-2','Pratap Nagar','Jaipur',302033,1,'Staff/owl2_3Y34DRm.png','Diagnostic testing','Pratap nagar sector 11','male',1,'ryan','1234567890','N/A','N/A','N/A'),(3,'Leo','Arcand','leo@gmail.com','Eye Specialists','2024-09-18','2-5','40 E 7th St, New York, NY 10003, USA','New York',100030,1,'Staff/existing-image_e3VrJ6a.jpg','Diagnostic testing','Pratap nagar sector 11','male',1,'leo','1234567890','USA','N','N/A'),(12,'Bhavya','Lohami','bhavya.lohami@logicspice.com','Eye Specialists','2024-10-21','1-2','Mansarovar','Jaipur',321123,1,'Staff/existing-image_u7KoFGX.jpg','Psychological Department','Sanganer','female',1,'bhavya','1234567890','N/A','N/A','N/A'),(13,'Gregory','House','bhavya.lohami@logicspice.com','Orthopedics','2024-10-21','1-2','Vaishali Nagar','Jaipur',321124,1,'Staff/existing-image_U7u77vv.jpg','Psychological Department','Maansarovar','male',1,'gregory','1234567890','USA','N/A','N/A');
/*!40000 ALTER TABLE `DrConsult_staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DrConsult_subslotmodel`
--

DROP TABLE IF EXISTS `DrConsult_subslotmodel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DrConsult_subslotmodel` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `start_time` time(6) NOT NULL,
  `end_time` time(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_booked` tinyint(1) NOT NULL,
  `date_slot_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `DrConsult_subslotmodel_date_slot_id_start_time__3e817973_uniq` (`date_slot_id`,`start_time`,`end_time`),
  CONSTRAINT `DrConsult_subslotmod_date_slot_id_d5c84133_fk_DrConsult` FOREIGN KEY (`date_slot_id`) REFERENCES `DrConsult_dateslotmodel` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=922 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DrConsult_subslotmodel`
--

LOCK TABLES `DrConsult_subslotmodel` WRITE;
/*!40000 ALTER TABLE `DrConsult_subslotmodel` DISABLE KEYS */;
INSERT INTO `DrConsult_subslotmodel` VALUES (165,'15:00:00.000000','15:15:00.000000',1,0,8),(166,'15:15:00.000000','15:30:00.000000',1,0,8),(167,'15:30:00.000000','15:45:00.000000',1,0,8),(168,'15:45:00.000000','16:00:00.000000',1,0,8),(169,'16:00:00.000000','16:15:00.000000',1,0,8),(170,'16:15:00.000000','16:30:00.000000',1,0,8),(171,'16:30:00.000000','16:45:00.000000',1,0,8),(173,'17:00:00.000000','17:15:00.000000',1,0,8),(174,'17:15:00.000000','17:30:00.000000',1,0,8),(175,'17:30:00.000000','17:45:00.000000',1,0,8),(176,'17:45:00.000000','18:00:00.000000',1,0,8),(177,'13:00:00.000000','13:15:00.000000',1,0,9),(178,'13:15:00.000000','13:30:00.000000',1,0,9),(179,'13:30:00.000000','13:45:00.000000',1,0,9),(180,'13:45:00.000000','14:00:00.000000',1,0,9),(181,'14:00:00.000000','14:15:00.000000',1,0,9),(182,'14:15:00.000000','14:30:00.000000',1,0,9),(183,'14:30:00.000000','14:45:00.000000',1,0,9),(184,'14:45:00.000000','15:00:00.000000',1,0,9),(252,'17:00:00.000000','17:20:00.000000',1,0,3),(253,'17:20:00.000000','17:40:00.000000',1,0,3),(254,'17:40:00.000000','18:00:00.000000',1,0,3),(255,'18:00:00.000000','18:20:00.000000',1,0,3),(256,'18:20:00.000000','18:40:00.000000',1,0,3),(257,'18:40:00.000000','19:00:00.000000',1,0,3),(258,'03:00:00.000000','03:15:00.000000',1,0,6),(259,'03:15:00.000000','03:30:00.000000',1,1,6),(260,'03:30:00.000000','03:45:00.000000',1,0,6),(261,'03:45:00.000000','04:00:00.000000',1,0,6),(262,'04:00:00.000000','04:15:00.000000',0,0,6),(263,'04:15:00.000000','04:30:00.000000',1,0,6),(264,'04:30:00.000000','04:45:00.000000',1,0,6),(265,'04:45:00.000000','05:00:00.000000',1,0,6),(266,'05:00:00.000000','05:15:00.000000',1,0,6),(267,'05:15:00.000000','05:30:00.000000',1,0,6),(268,'05:30:00.000000','05:45:00.000000',1,1,6),(269,'05:45:00.000000','06:00:00.000000',1,1,6),(270,'03:00:00.000000','03:20:00.000000',1,0,11),(271,'03:20:00.000000','03:40:00.000000',1,0,11),(272,'03:40:00.000000','04:00:00.000000',1,0,11),(273,'04:00:00.000000','04:20:00.000000',1,0,11),(274,'04:20:00.000000','04:40:00.000000',1,0,11),(275,'04:40:00.000000','05:00:00.000000',1,0,11),(276,'08:00:00.000000','08:20:00.000000',1,0,12),(277,'08:20:00.000000','08:40:00.000000',1,0,12),(278,'08:40:00.000000','09:00:00.000000',1,0,12),(279,'09:00:00.000000','09:20:00.000000',1,0,12),(280,'09:20:00.000000','09:40:00.000000',1,1,12),(281,'09:40:00.000000','10:00:00.000000',1,0,12),(286,'13:00:00.000000','13:15:00.000000',1,0,13),(287,'13:15:00.000000','13:30:00.000000',1,0,13),(288,'13:30:00.000000','13:45:00.000000',1,0,13),(291,'14:15:00.000000','14:30:00.000000',1,0,13),(293,'14:45:00.000000','15:00:00.000000',1,0,13),(294,'09:00:00.000000','09:15:00.000000',0,0,14),(295,'09:15:00.000000','09:30:00.000000',1,0,14),(296,'09:30:00.000000','09:45:00.000000',1,0,14),(297,'09:45:00.000000','10:00:00.000000',1,0,14),(298,'10:00:00.000000','10:15:00.000000',0,0,14),(299,'10:15:00.000000','10:30:00.000000',0,0,14),(300,'10:30:00.000000','10:45:00.000000',0,0,14),(301,'10:45:00.000000','11:00:00.000000',1,0,14),(314,'12:00:00.000000','12:15:00.000000',1,0,16),(315,'12:15:00.000000','12:30:00.000000',1,0,16),(316,'12:30:00.000000','12:45:00.000000',1,0,16),(317,'12:45:00.000000','13:00:00.000000',1,0,16),(318,'13:00:00.000000','13:15:00.000000',1,0,16),(319,'13:15:00.000000','13:30:00.000000',1,0,16),(320,'13:30:00.000000','13:45:00.000000',1,0,16),(321,'13:45:00.000000','14:00:00.000000',1,0,16),(322,'14:00:00.000000','14:15:00.000000',1,0,16),(323,'14:15:00.000000','14:30:00.000000',1,0,16),(324,'14:30:00.000000','14:45:00.000000',1,0,16),(325,'14:45:00.000000','15:00:00.000000',1,0,16),(326,'08:00:00.000000','08:10:00.000000',1,0,15),(327,'08:10:00.000000','08:20:00.000000',1,0,15),(328,'08:20:00.000000','08:30:00.000000',1,0,15),(329,'08:30:00.000000','08:40:00.000000',1,0,15),(330,'08:40:00.000000','08:50:00.000000',1,0,15),(331,'08:50:00.000000','09:00:00.000000',1,0,15),(332,'09:00:00.000000','09:10:00.000000',1,0,15),(333,'09:10:00.000000','09:20:00.000000',1,0,15),(334,'09:20:00.000000','09:30:00.000000',1,0,15),(335,'09:30:00.000000','09:40:00.000000',1,0,15),(336,'09:40:00.000000','09:50:00.000000',1,0,15),(337,'09:50:00.000000','10:00:00.000000',1,0,15),(338,'09:00:00.000000','09:20:00.000000',1,0,31),(339,'09:20:00.000000','09:40:00.000000',1,0,31),(340,'09:40:00.000000','10:00:00.000000',1,0,31),(341,'10:00:00.000000','10:20:00.000000',1,0,31),(342,'10:20:00.000000','10:40:00.000000',1,0,31),(343,'10:40:00.000000','11:00:00.000000',1,0,31),(344,'18:00:00.000000','18:20:00.000000',1,0,32),(345,'18:20:00.000000','18:40:00.000000',1,0,32),(346,'18:40:00.000000','19:00:00.000000',1,0,32),(347,'19:00:00.000000','19:20:00.000000',1,0,32),(348,'19:20:00.000000','19:40:00.000000',1,0,32),(349,'19:40:00.000000','20:00:00.000000',1,0,32),(350,'07:00:00.000000','07:20:00.000000',1,0,33),(351,'07:20:00.000000','07:40:00.000000',1,0,33),(352,'07:40:00.000000','08:00:00.000000',1,0,33),(353,'08:00:00.000000','08:20:00.000000',1,0,33),(354,'08:20:00.000000','08:40:00.000000',1,0,33),(355,'08:40:00.000000','09:00:00.000000',1,0,33),(356,'09:00:00.000000','09:20:00.000000',1,0,33),(357,'09:20:00.000000','09:40:00.000000',1,0,33),(358,'09:40:00.000000','10:00:00.000000',1,0,33),(359,'01:00:00.000000','01:15:00.000000',1,0,34),(360,'01:15:00.000000','01:30:00.000000',1,0,34),(361,'01:30:00.000000','01:45:00.000000',1,0,34),(362,'01:45:00.000000','02:00:00.000000',1,0,34),(363,'10:00:00.000000','10:15:00.000000',1,0,35),(364,'10:15:00.000000','10:30:00.000000',1,0,35),(365,'10:30:00.000000','10:45:00.000000',1,0,35),(366,'10:45:00.000000','11:00:00.000000',1,0,35),(367,'11:00:00.000000','11:15:00.000000',1,0,35),(368,'11:15:00.000000','11:30:00.000000',1,0,35),(369,'11:30:00.000000','11:45:00.000000',1,0,35),(370,'11:45:00.000000','12:00:00.000000',1,0,35),(371,'08:00:00.000000','08:20:00.000000',1,0,36),(372,'08:20:00.000000','08:40:00.000000',1,0,36),(373,'08:40:00.000000','09:00:00.000000',1,0,36),(374,'09:00:00.000000','09:20:00.000000',1,0,36),(375,'09:20:00.000000','09:40:00.000000',1,0,36),(376,'09:40:00.000000','10:00:00.000000',1,0,36),(377,'10:00:00.000000','10:20:00.000000',1,0,37),(378,'10:20:00.000000','10:40:00.000000',1,0,37),(379,'10:40:00.000000','11:00:00.000000',1,0,37),(380,'11:00:00.000000','11:20:00.000000',1,0,37),(381,'11:20:00.000000','11:40:00.000000',1,0,37),(382,'11:40:00.000000','12:00:00.000000',1,0,37),(383,'13:00:00.000000','13:15:00.000000',1,0,38),(384,'13:15:00.000000','13:30:00.000000',1,0,38),(385,'13:30:00.000000','13:45:00.000000',1,0,38),(386,'13:45:00.000000','14:00:00.000000',1,0,38),(387,'14:00:00.000000','14:15:00.000000',1,1,38),(388,'14:15:00.000000','14:30:00.000000',1,0,38),(389,'14:30:00.000000','14:45:00.000000',1,0,38),(390,'14:45:00.000000','15:00:00.000000',1,0,38),(391,'18:00:00.000000','18:20:00.000000',1,0,39),(392,'18:20:00.000000','18:40:00.000000',1,1,39),(393,'18:40:00.000000','19:00:00.000000',1,0,39),(394,'19:00:00.000000','19:20:00.000000',1,0,39),(395,'19:20:00.000000','19:40:00.000000',1,0,39),(396,'19:40:00.000000','20:00:00.000000',1,0,39),(397,'07:00:00.000000','07:20:00.000000',1,0,40),(398,'07:20:00.000000','07:40:00.000000',1,0,40),(399,'07:40:00.000000','08:00:00.000000',1,0,40),(400,'08:00:00.000000','08:20:00.000000',1,0,40),(401,'08:20:00.000000','08:40:00.000000',1,0,40),(402,'08:40:00.000000','09:00:00.000000',1,0,40),(403,'09:00:00.000000','09:20:00.000000',1,0,40),(404,'09:20:00.000000','09:40:00.000000',1,1,40),(405,'09:40:00.000000','10:00:00.000000',1,1,40),(406,'01:00:00.000000','01:15:00.000000',1,0,41),(407,'01:15:00.000000','01:30:00.000000',1,0,41),(408,'01:30:00.000000','01:45:00.000000',1,0,41),(409,'01:45:00.000000','02:00:00.000000',1,1,41),(410,'10:00:00.000000','10:15:00.000000',1,0,42),(411,'10:15:00.000000','10:30:00.000000',1,1,42),(412,'10:30:00.000000','10:45:00.000000',1,0,42),(413,'10:45:00.000000','11:00:00.000000',1,0,42),(414,'11:00:00.000000','11:15:00.000000',1,0,42),(415,'11:15:00.000000','11:30:00.000000',1,0,42),(416,'11:30:00.000000','11:45:00.000000',1,0,42),(417,'11:45:00.000000','12:00:00.000000',1,0,42),(418,'08:00:00.000000','08:20:00.000000',1,0,43),(419,'08:20:00.000000','08:40:00.000000',1,0,43),(420,'08:40:00.000000','09:00:00.000000',1,0,43),(421,'09:00:00.000000','09:20:00.000000',1,0,43),(422,'09:20:00.000000','09:40:00.000000',1,0,43),(423,'09:40:00.000000','10:00:00.000000',1,0,43),(424,'10:00:00.000000','10:20:00.000000',1,0,44),(425,'10:20:00.000000','10:40:00.000000',1,0,44),(426,'10:40:00.000000','11:00:00.000000',1,0,44),(427,'11:00:00.000000','11:20:00.000000',1,0,44),(428,'11:20:00.000000','11:40:00.000000',1,0,44),(429,'11:40:00.000000','12:00:00.000000',1,0,44),(430,'13:00:00.000000','13:15:00.000000',1,0,45),(431,'13:15:00.000000','13:30:00.000000',1,0,45),(432,'13:30:00.000000','13:45:00.000000',1,0,45),(433,'13:45:00.000000','14:00:00.000000',1,0,45),(434,'14:00:00.000000','14:15:00.000000',1,0,45),(435,'14:15:00.000000','14:30:00.000000',1,0,45),(436,'14:30:00.000000','14:45:00.000000',1,0,45),(437,'14:45:00.000000','15:00:00.000000',1,0,45),(464,'14:00:00.000000','14:20:00.000000',1,0,46),(465,'14:20:00.000000','14:40:00.000000',1,0,46),(466,'14:40:00.000000','15:00:00.000000',1,0,46),(467,'15:00:00.000000','15:20:00.000000',1,0,46),(468,'15:20:00.000000','15:40:00.000000',1,0,46),(469,'15:40:00.000000','16:00:00.000000',1,0,46),(470,'18:00:00.000000','18:30:00.000000',1,0,47),(471,'18:30:00.000000','19:00:00.000000',1,0,47),(472,'19:00:00.000000','19:30:00.000000',1,0,47),(473,'19:30:00.000000','20:00:00.000000',1,0,47),(478,'03:00:00.000000','03:15:00.000000',1,0,48),(479,'03:15:00.000000','03:30:00.000000',1,0,48),(480,'03:30:00.000000','03:45:00.000000',1,0,48),(481,'03:45:00.000000','04:00:00.000000',1,0,48),(482,'04:00:00.000000','04:15:00.000000',1,0,48),(483,'04:15:00.000000','04:30:00.000000',1,0,48),(484,'04:30:00.000000','04:45:00.000000',1,0,48),(485,'04:45:00.000000','05:00:00.000000',1,0,48),(486,'11:00:00.000000','11:20:00.000000',1,0,49),(487,'11:20:00.000000','11:40:00.000000',1,0,49),(488,'11:40:00.000000','12:00:00.000000',1,0,49),(489,'12:00:00.000000','12:20:00.000000',1,0,49),(490,'12:20:00.000000','12:40:00.000000',1,0,49),(491,'12:40:00.000000','13:00:00.000000',1,0,49),(492,'20:00:00.000000','20:20:00.000000',1,0,50),(493,'20:20:00.000000','20:40:00.000000',1,0,50),(494,'20:40:00.000000','21:00:00.000000',1,0,50),(495,'21:00:00.000000','21:20:00.000000',1,0,50),(496,'21:20:00.000000','21:40:00.000000',1,0,50),(497,'21:40:00.000000','22:00:00.000000',1,0,50),(498,'10:00:00.000000','10:30:00.000000',1,0,51),(499,'10:30:00.000000','11:00:00.000000',1,0,51),(500,'11:00:00.000000','11:30:00.000000',1,0,51),(501,'11:30:00.000000','12:00:00.000000',1,0,51),(502,'01:00:00.000000','01:10:00.000000',1,0,52),(503,'01:10:00.000000','01:20:00.000000',1,0,52),(504,'01:20:00.000000','01:30:00.000000',1,0,52),(505,'01:30:00.000000','01:40:00.000000',1,0,52),(506,'01:40:00.000000','01:50:00.000000',1,0,52),(507,'01:50:00.000000','02:00:00.000000',1,0,52),(508,'03:00:00.000000','03:15:00.000000',1,0,53),(509,'03:15:00.000000','03:30:00.000000',1,0,53),(510,'03:30:00.000000','03:45:00.000000',1,0,53),(511,'03:45:00.000000','04:00:00.000000',1,0,53),(512,'04:00:00.000000','04:15:00.000000',1,0,53),(513,'04:15:00.000000','04:30:00.000000',1,0,53),(514,'04:30:00.000000','04:45:00.000000',1,0,53),(515,'04:45:00.000000','05:00:00.000000',1,0,53),(516,'11:00:00.000000','11:20:00.000000',1,0,54),(517,'11:20:00.000000','11:40:00.000000',1,0,54),(518,'11:40:00.000000','12:00:00.000000',1,0,54),(519,'12:00:00.000000','12:20:00.000000',1,0,54),(520,'12:20:00.000000','12:40:00.000000',1,0,54),(521,'12:40:00.000000','13:00:00.000000',1,0,54),(522,'20:00:00.000000','20:20:00.000000',1,0,55),(523,'20:20:00.000000','20:40:00.000000',1,0,55),(524,'20:40:00.000000','21:00:00.000000',1,0,55),(525,'21:00:00.000000','21:20:00.000000',1,0,55),(526,'21:20:00.000000','21:40:00.000000',1,0,55),(527,'21:40:00.000000','22:00:00.000000',1,0,55),(528,'03:00:00.000000','03:10:00.000000',1,1,56),(529,'03:10:00.000000','03:20:00.000000',1,0,56),(530,'03:20:00.000000','03:30:00.000000',1,0,56),(531,'03:30:00.000000','03:40:00.000000',1,0,56),(532,'03:40:00.000000','03:50:00.000000',1,0,56),(533,'03:50:00.000000','04:00:00.000000',1,0,56),(534,'04:00:00.000000','04:15:00.000000',1,0,57),(535,'04:15:00.000000','04:30:00.000000',1,0,57),(536,'04:30:00.000000','04:45:00.000000',1,0,57),(537,'04:45:00.000000','05:00:00.000000',1,0,57),(538,'05:00:00.000000','05:15:00.000000',1,0,57),(539,'05:15:00.000000','05:30:00.000000',1,0,57),(540,'05:30:00.000000','05:45:00.000000',1,0,57),(541,'05:45:00.000000','06:00:00.000000',1,0,57),(542,'14:00:00.000000','14:20:00.000000',1,0,58),(543,'14:20:00.000000','14:40:00.000000',1,0,58),(544,'14:40:00.000000','15:00:00.000000',1,0,58),(545,'15:00:00.000000','15:20:00.000000',1,0,58),(546,'15:20:00.000000','15:40:00.000000',1,0,58),(547,'15:40:00.000000','16:00:00.000000',1,0,58),(548,'07:00:00.000000','07:15:00.000000',1,0,59),(549,'07:15:00.000000','07:30:00.000000',1,0,59),(550,'07:30:00.000000','07:45:00.000000',1,0,59),(551,'07:45:00.000000','08:00:00.000000',1,0,59),(552,'08:00:00.000000','08:15:00.000000',1,1,59),(553,'08:15:00.000000','08:30:00.000000',1,0,59),(554,'08:30:00.000000','08:45:00.000000',1,1,59),(555,'08:45:00.000000','09:00:00.000000',1,0,59),(557,'18:00:00.000000','18:30:00.000000',1,0,60),(558,'18:30:00.000000','19:00:00.000000',1,0,60),(559,'19:00:00.000000','19:30:00.000000',1,0,60),(560,'19:30:00.000000','20:00:00.000000',1,0,60),(561,'04:00:00.000000','04:15:00.000000',1,0,61),(562,'04:15:00.000000','04:30:00.000000',1,0,61),(563,'04:30:00.000000','04:45:00.000000',1,0,61),(564,'04:45:00.000000','05:00:00.000000',1,0,61),(565,'05:00:00.000000','05:15:00.000000',1,0,61),(566,'05:15:00.000000','05:30:00.000000',1,0,61),(567,'05:30:00.000000','05:45:00.000000',1,0,61),(568,'05:45:00.000000','06:00:00.000000',1,0,61),(569,'14:00:00.000000','14:20:00.000000',1,0,62),(570,'14:20:00.000000','14:40:00.000000',1,0,62),(571,'14:40:00.000000','15:00:00.000000',1,0,62),(572,'15:00:00.000000','15:20:00.000000',1,0,62),(573,'15:20:00.000000','15:40:00.000000',1,0,62),(574,'15:40:00.000000','16:00:00.000000',1,0,62),(872,'09:00:00.000000','09:15:00.000000',1,1,63),(873,'09:15:00.000000','09:30:00.000000',1,1,63),(874,'09:30:00.000000','09:45:00.000000',1,1,63),(875,'09:45:00.000000','10:00:00.000000',1,1,63),(876,'10:00:00.000000','10:15:00.000000',1,1,63),(877,'10:15:00.000000','10:30:00.000000',1,1,63),(878,'10:30:00.000000','10:45:00.000000',1,1,63),(879,'10:45:00.000000','11:00:00.000000',1,1,63),(880,'12:00:00.000000','12:10:00.000000',1,1,64),(881,'12:10:00.000000','12:20:00.000000',1,1,64),(882,'12:20:00.000000','12:30:00.000000',1,1,64),(883,'12:30:00.000000','12:40:00.000000',1,1,64),(884,'12:40:00.000000','12:50:00.000000',1,0,64),(885,'12:50:00.000000','13:00:00.000000',1,1,64),(886,'13:00:00.000000','13:10:00.000000',1,1,64),(887,'13:10:00.000000','13:20:00.000000',1,1,64),(888,'13:20:00.000000','13:30:00.000000',1,1,64),(889,'13:30:00.000000','13:40:00.000000',1,1,64),(890,'13:40:00.000000','13:50:00.000000',1,0,64),(891,'13:50:00.000000','14:00:00.000000',1,1,64),(892,'10:00:00.000000','10:10:00.000000',1,0,65),(893,'10:10:00.000000','10:20:00.000000',1,0,65),(894,'10:20:00.000000','10:30:00.000000',1,0,65),(895,'10:30:00.000000','10:40:00.000000',1,0,65),(896,'10:40:00.000000','10:50:00.000000',1,0,65),(897,'10:50:00.000000','11:00:00.000000',1,0,65),(898,'11:00:00.000000','11:10:00.000000',1,0,65),(899,'11:10:00.000000','11:20:00.000000',1,0,65),(900,'11:20:00.000000','11:30:00.000000',1,0,65),(901,'11:30:00.000000','11:40:00.000000',1,0,65),(902,'11:40:00.000000','11:50:00.000000',1,0,65),(903,'11:50:00.000000','12:00:00.000000',1,0,65),(904,'10:00:00.000000','10:10:00.000000',1,0,66),(905,'10:10:00.000000','10:20:00.000000',1,0,66),(906,'10:20:00.000000','10:30:00.000000',1,0,66),(907,'10:30:00.000000','10:40:00.000000',1,0,66),(908,'10:40:00.000000','10:50:00.000000',1,0,66),(909,'10:50:00.000000','11:00:00.000000',1,0,66),(910,'11:00:00.000000','11:10:00.000000',1,0,66),(911,'11:10:00.000000','11:20:00.000000',1,0,66),(912,'11:20:00.000000','11:30:00.000000',1,0,66),(913,'11:30:00.000000','11:40:00.000000',1,0,66),(914,'11:40:00.000000','11:50:00.000000',1,0,66),(915,'11:50:00.000000','12:00:00.000000',1,0,66),(916,'13:00:00.000000','13:20:00.000000',1,1,67),(917,'13:20:00.000000','13:40:00.000000',1,1,67),(918,'13:40:00.000000','14:00:00.000000',1,0,67),(919,'14:00:00.000000','14:20:00.000000',1,0,67),(920,'14:20:00.000000','14:40:00.000000',1,0,67),(921,'14:40:00.000000','15:00:00.000000',1,0,67);
/*!40000 ALTER TABLE `DrConsult_subslotmodel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add contact',7,'add_contact'),(26,'Can change contact',7,'change_contact'),(27,'Can delete contact',7,'delete_contact'),(28,'Can view contact',7,'view_contact'),(29,'Can add Token',8,'add_token'),(30,'Can change Token',8,'change_token'),(31,'Can delete Token',8,'delete_token'),(32,'Can view Token',8,'view_token'),(33,'Can add Token',9,'add_tokenproxy'),(34,'Can change Token',9,'change_tokenproxy'),(35,'Can delete Token',9,'delete_tokenproxy'),(36,'Can view Token',9,'view_tokenproxy'),(37,'Can add submit contact',10,'add_submitcontact'),(38,'Can change submit contact',10,'change_submitcontact'),(39,'Can delete submit contact',10,'delete_submitcontact'),(40,'Can view submit contact',10,'view_submitcontact'),(41,'Can add consultation query',11,'add_consultationquery'),(42,'Can change consultation query',11,'change_consultationquery'),(43,'Can delete consultation query',11,'delete_consultationquery'),(44,'Can view consultation query',11,'view_consultationquery'),(45,'Can add configurations',12,'add_configurations'),(46,'Can change configurations',12,'change_configurations'),(47,'Can delete configurations',12,'delete_configurations'),(48,'Can view configurations',12,'view_configurations'),(49,'Can add services',13,'add_services'),(50,'Can change services',13,'change_services'),(51,'Can delete services',13,'delete_services'),(52,'Can view services',13,'view_services'),(53,'Can add configuration',12,'add_configuration'),(54,'Can change configuration',12,'change_configuration'),(55,'Can delete configuration',12,'delete_configuration'),(56,'Can view configuration',12,'view_configuration'),(57,'Can add blogs',14,'add_blogs'),(58,'Can change blogs',14,'change_blogs'),(59,'Can delete blogs',14,'delete_blogs'),(60,'Can view blogs',14,'view_blogs'),(61,'Can add admin',15,'add_admin'),(62,'Can change admin',15,'change_admin'),(63,'Can delete admin',15,'delete_admin'),(64,'Can view admin',15,'view_admin'),(65,'Can add staff',16,'add_staff'),(66,'Can change staff',16,'change_staff'),(67,'Can delete staff',16,'delete_staff'),(68,'Can view staff',16,'view_staff'),(69,'Can add booking',17,'add_booking'),(70,'Can change booking',17,'change_booking'),(71,'Can delete booking',17,'delete_booking'),(72,'Can view booking',17,'view_booking'),(73,'Can add slots',18,'add_slots'),(74,'Can change slots',18,'change_slots'),(75,'Can delete slots',18,'delete_slots'),(76,'Can view slots',18,'view_slots'),(77,'Can add manage pages',19,'add_managepages'),(78,'Can change manage pages',19,'change_managepages'),(79,'Can delete manage pages',19,'delete_managepages'),(80,'Can view manage pages',19,'view_managepages'),(81,'Can add consultation query m',20,'add_consultationquerym'),(82,'Can change consultation query m',20,'change_consultationquerym'),(83,'Can delete consultation query m',20,'delete_consultationquerym'),(84,'Can view consultation query m',20,'view_consultationquerym'),(85,'Can add manage location',21,'add_managelocation'),(86,'Can change manage location',21,'change_managelocation'),(87,'Can delete manage location',21,'delete_managelocation'),(88,'Can view manage location',21,'view_managelocation'),(89,'Can add manage department',22,'add_managedepartment'),(90,'Can change manage department',22,'change_managedepartment'),(91,'Can delete manage department',22,'delete_managedepartment'),(92,'Can view manage department',22,'view_managedepartment'),(93,'Can add slot settings',23,'add_slotsettings'),(94,'Can change slot settings',23,'change_slotsettings'),(95,'Can delete slot settings',23,'delete_slotsettings'),(96,'Can view slot settings',23,'view_slotsettings'),(97,'Can add slot generation setting',24,'add_slotgenerationsetting'),(98,'Can change slot generation setting',24,'change_slotgenerationsetting'),(99,'Can delete slot generation setting',24,'delete_slotgenerationsetting'),(100,'Can view slot generation setting',24,'view_slotgenerationsetting'),(101,'Can add date slot model',25,'add_dateslotmodel'),(102,'Can change date slot model',25,'change_dateslotmodel'),(103,'Can delete date slot model',25,'delete_dateslotmodel'),(104,'Can view date slot model',25,'view_dateslotmodel'),(105,'Can add sub slot model',26,'add_subslotmodel'),(106,'Can change sub slot model',26,'change_subslotmodel'),(107,'Can delete sub slot model',26,'delete_subslotmodel'),(108,'Can view sub slot model',26,'view_subslotmodel'),(109,'Can add default slot',27,'add_defaultslot'),(110,'Can change default slot',27,'change_defaultslot'),(111,'Can delete default slot',27,'delete_defaultslot'),(112,'Can view default slot',27,'view_defaultslot'),(113,'Can add holiday model',28,'add_holidaymodel'),(114,'Can change holiday model',28,'change_holidaymodel'),(115,'Can delete holiday model',28,'delete_holidaymodel'),(116,'Can view holiday model',28,'view_holidaymodel'),(117,'Can add Scheduled task',29,'add_schedule'),(118,'Can change Scheduled task',29,'change_schedule'),(119,'Can delete Scheduled task',29,'delete_schedule'),(120,'Can view Scheduled task',29,'view_schedule'),(121,'Can add task',30,'add_task'),(122,'Can change task',30,'change_task'),(123,'Can delete task',30,'delete_task'),(124,'Can view task',30,'view_task'),(125,'Can add Failed task',31,'add_failure'),(126,'Can change Failed task',31,'change_failure'),(127,'Can delete Failed task',31,'delete_failure'),(128,'Can view Failed task',31,'view_failure'),(129,'Can add Successful task',32,'add_success'),(130,'Can change Successful task',32,'change_success'),(131,'Can delete Successful task',32,'delete_success'),(132,'Can view Successful task',32,'view_success'),(133,'Can add Queued task',33,'add_ormq'),(134,'Can change Queued task',33,'change_ormq'),(135,'Can delete Queued task',33,'delete_ormq'),(136,'Can view Queued task',33,'view_ormq'),(137,'Can add cron job log',34,'add_cronjoblog'),(138,'Can change cron job log',34,'change_cronjoblog'),(139,'Can delete cron job log',34,'delete_cronjoblog'),(140,'Can view cron job log',34,'view_cronjoblog'),(141,'Can add cron job lock',35,'add_cronjoblock'),(142,'Can change cron job lock',35,'change_cronjoblock'),(143,'Can delete cron job lock',35,'delete_cronjoblock'),(144,'Can view cron job lock',35,'view_cronjoblock'),(145,'Can add cancelled booking',36,'add_cancelledbooking'),(146,'Can change cancelled booking',36,'change_cancelledbooking'),(147,'Can delete cancelled booking',36,'delete_cancelledbooking'),(148,'Can view cancelled booking',36,'view_cancelledbooking'),(149,'Can add notification',37,'add_notification'),(150,'Can change notification',37,'change_notification'),(151,'Can delete notification',37,'delete_notification'),(152,'Can view notification',37,'view_notification'),(153,'Can add patient',38,'add_patient'),(154,'Can change patient',38,'change_patient'),(155,'Can delete patient',38,'delete_patient'),(156,'Can view patient',38,'view_patient'),(157,'Can add Patient Document',39,'add_patientdocument'),(158,'Can change Patient Document',39,'change_patientdocument'),(159,'Can delete Patient Document',39,'delete_patientdocument'),(160,'Can view Patient Document',39,'view_patientdocument'),(161,'Can add custom user',40,'add_customuser'),(162,'Can change custom user',40,'change_customuser'),(163,'Can delete custom user',40,'delete_customuser'),(164,'Can view custom user',40,'view_customuser'),(165,'Can change the is_active status of other users',40,'can_change_is_active');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (3,'pbkdf2_sha256$600000$QiZpBGbW23jqvPpuyjpr7S$my10zYsaDZ9QXJ9Q3q2YhNV5CrlDE8Ehe/AH2qsRUTg=','2024-11-11 12:15:23.106768',1,'shivam','','','shivam@gmail.com',1,1,'2024-08-21 06:09:45.367750'),(6,'pbkdf2_sha256$870000$hvetwENVSdXJ2JXHcbzPg9$2aFAsvUufPDM4Wo9ZGvaLc4Tn1RrwdmN2qLR2MBJxd0=',NULL,0,'rahul','','','prajapatrahul1412@gmail.com',1,1,'2024-09-04 05:55:57.667452'),(15,'pbkdf2_sha256$600000$VH38EBO8Vd0oPZQYOwRUyQ$J021tGB3FGNY4ABHDLlxHsH6oPYU0l8Re2xe03BTP+Q=',NULL,0,'ryan','','','Ryan@gmail.com',1,1,'2024-09-18 09:20:03.684619'),(16,'pbkdf2_sha256$600000$Y780kvKhMO4rqVrlJatCF2$waxTDyHV3WqIaRoe3Lk0K1kehxmuJt8b5dcZwPzbM7Y=',NULL,0,'leo','','','leo@gmail.com',1,1,'2024-09-18 10:36:52.117860'),(23,'pbkdf2_sha256$600000$Dy8RgVyfVfif7zsEq0SCia$vG1nku6v1TyKPECW4ZHRvaFPCl+ufuMG8CGHM7AHXc8=',NULL,0,'bhavya','','','bhavya.lohami@logicspice.com',1,1,'2024-10-21 07:33:53.216553'),(24,'pbkdf2_sha256$600000$jbOXRJDpM9zloqQhvMRGCj$0DKAAMZS2mUQVmzHyIpo8mcKsaGjMaAniHTiOEL2a+k=',NULL,0,'gregory','','','bhavya.lohami@logicspice.com',1,1,'2024-10-21 09:50:42.941695'),(26,'pbkdf2_sha256$600000$2T4jMFsvfo6OHZOwInJMb4$Rk5h8gNge0hDqeUdMvTCcmxBl17MLJi7T7XiazCNV/4=',NULL,0,'rax','','','rahul.prajapat@logicspice.com',0,1,'2024-11-05 10:49:12.508153'),(38,'pbkdf2_sha256$600000$4ZzWsWkIheSAPhPO7BG6vT$7NJw9GqSIpPg4kgbhAE9sbSPqgpMReIYKDSKJhqJeBo=',NULL,0,'shiv','','','shivam.mantri@logicspice.com',0,1,'2024-11-06 06:18:48.796949');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken_token`
--

DROP TABLE IF EXISTS `authtoken_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authtoken_token` (
  `key` varchar(40) NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken_token`
--

LOCK TABLES `authtoken_token` WRITE;
/*!40000 ALTER TABLE `authtoken_token` DISABLE KEYS */;
INSERT INTO `authtoken_token` VALUES ('14e0731d19f39ef5931bc554157266bbb18b204f','2024-10-21 07:36:31.421274',23),('1e5bc2ad7075dbcc6de121ed690c88e8a9455fbf','2024-11-11 11:47:18.131047',15),('5a718ea7bb9a252fdaeb8d58c2efa51077c6c1e3','2024-11-08 11:43:44.449584',16),('6f85fb52f346260c98abff3423aef91c3c5b2608','2024-11-07 06:13:21.322716',26),('b685bec6e44e713288ee4a13341ef0a270f35b76','2024-11-08 12:55:08.938874',38),('c86f165d3a03424a3949cd3fc259f1f65f6a91a4','2024-09-17 05:36:05.601832',6),('de52e5d2433baff675fc8ddc50391fb8e178b9a0','2024-10-21 09:52:35.399237',24),('f4e043eac095baf2a1d543811145aa1d727356fe','2024-11-12 05:28:12.704526',3);
/*!40000 ALTER TABLE `authtoken_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (7,'2024-08-21 06:10:34.335594','3','d8102ff651b13c57fb0fd624c51889927a1dae6c',1,'[{\"added\": {}}]',9,3),(8,'2024-08-21 07:40:40.014429','3','f12e3efc1cf5d1dfa0331815bdc1024c07916f06',3,'',9,3),(9,'2024-08-21 07:45:26.104909','3','8df90c34b47fe3719d9f772e4d15fe5d3bab6726',3,'',9,3),(10,'2024-08-21 07:47:36.396195','4','bhavya',1,'[{\"added\": {}}]',4,3),(11,'2024-09-03 11:21:14.513050','5','bhavyaa',1,'[{\"added\": {}}]',4,3),(12,'2024-10-10 08:15:41.399140','1','DrConsult.tasks.generate_slots_for_doctor',3,'',29,3),(13,'2024-10-10 08:22:59.320207','2','DrConsult.tasks.generate_slots_for_doctor',3,'',29,3),(14,'2024-10-10 08:23:44.839548','3','DrConsult.tasks.generate_slots_for_doctor',3,'',29,3),(15,'2024-10-10 08:24:42.274935','4','DrConsult.tasks.generate_slots_for_doctor',3,'',29,3),(16,'2024-10-10 08:30:33.569963','1','OrmQ object (1)',3,'',33,3),(17,'2024-10-10 08:31:28.008037','5','DrConsult.tasks.generate_slots_for_doctor',3,'',29,3),(18,'2024-10-10 08:49:00.626683','6','DrConsult.tasks.generate_slots_for_doctor',3,'',29,3),(19,'2024-10-16 08:59:16.040475','8','OrmQ object (8)',3,'',33,3),(20,'2024-10-16 08:59:16.044872','7','OrmQ object (7)',3,'',33,3),(21,'2024-10-16 08:59:16.049337','6','OrmQ object (6)',3,'',33,3),(22,'2024-10-16 08:59:16.052149','5','OrmQ object (5)',3,'',33,3),(23,'2024-10-16 08:59:16.055483','4','OrmQ object (4)',3,'',33,3),(24,'2024-10-16 08:59:16.059566','3','OrmQ object (3)',3,'',33,3),(25,'2024-10-16 08:59:16.062531','2','OrmQ object (2)',3,'',33,3),(26,'2024-10-16 08:59:35.480308','7','DrConsult.tasks.generate_slots_for_doctor',3,'',29,3),(27,'2024-11-11 12:26:21.655316','25','bhavy',3,'',4,3),(28,'2024-11-11 12:26:36.181717','39','vedant',3,'',4,3),(29,'2024-11-12 04:37:06.934066','1','shivam',1,'[{\"added\": {}}]',40,3);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(8,'authtoken','token'),(9,'authtoken','tokenproxy'),(5,'contenttypes','contenttype'),(35,'django_cron','cronjoblock'),(34,'django_cron','cronjoblog'),(31,'django_q','failure'),(33,'django_q','ormq'),(29,'django_q','schedule'),(32,'django_q','success'),(30,'django_q','task'),(15,'DrConsult','admin'),(14,'DrConsult','blogs'),(17,'DrConsult','booking'),(36,'DrConsult','cancelledbooking'),(12,'DrConsult','configuration'),(11,'DrConsult','consultationquery'),(20,'DrConsult','consultationquerym'),(7,'DrConsult','contact'),(40,'DrConsult','customuser'),(25,'DrConsult','dateslotmodel'),(27,'DrConsult','defaultslot'),(28,'DrConsult','holidaymodel'),(22,'DrConsult','managedepartment'),(21,'DrConsult','managelocation'),(19,'DrConsult','managepages'),(37,'DrConsult','notification'),(38,'DrConsult','patient'),(39,'DrConsult','patientdocument'),(13,'DrConsult','services'),(24,'DrConsult','slotgenerationsetting'),(18,'DrConsult','slots'),(23,'DrConsult','slotsettings'),(16,'DrConsult','staff'),(10,'DrConsult','submitcontact'),(26,'DrConsult','subslotmodel'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_cron_cronjoblock`
--

DROP TABLE IF EXISTS `django_cron_cronjoblock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_cron_cronjoblock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_name` varchar(200) NOT NULL,
  `locked` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_name` (`job_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_cron_cronjoblock`
--

LOCK TABLES `django_cron_cronjoblock` WRITE;
/*!40000 ALTER TABLE `django_cron_cronjoblock` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_cron_cronjoblock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_cron_cronjoblog`
--

DROP TABLE IF EXISTS `django_cron_cronjoblog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_cron_cronjoblog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(64) NOT NULL,
  `start_time` datetime(6) NOT NULL,
  `end_time` datetime(6) NOT NULL,
  `is_success` tinyint(1) NOT NULL,
  `message` longtext NOT NULL,
  `ran_at_time` time(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `django_cron_cronjoblog_code_start_time_ran_at_time_8b50b8fa_idx` (`code`,`start_time`,`ran_at_time`),
  KEY `django_cron_cronjoblog_code_start_time_4fc78f9d_idx` (`code`,`start_time`),
  KEY `django_cron_cronjoblog_code_is_success_ran_at_time_84da9606_idx` (`code`,`is_success`,`ran_at_time`),
  KEY `django_cron_cronjoblog_code_48865653` (`code`),
  KEY `django_cron_cronjoblog_start_time_d68c0dd9` (`start_time`),
  KEY `django_cron_cronjoblog_end_time_7918602a` (`end_time`),
  KEY `django_cron_cronjoblog_ran_at_time_7fed2751` (`ran_at_time`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_cron_cronjoblog`
--

LOCK TABLES `django_cron_cronjoblog` WRITE;
/*!40000 ALTER TABLE `django_cron_cronjoblog` DISABLE KEYS */;
INSERT INTO `django_cron_cronjoblog` VALUES (1,'myapp.slot_generation_cron_job','2024-10-18 10:45:38.051493','2024-10-18 10:45:38.073164',1,'',NULL),(2,'DrConsult.crons.slot_generation_cron_job','2024-10-18 11:01:15.899665','2024-10-18 11:01:15.936753',1,'',NULL),(3,'DrConsult.slot_generation_cron_job','2024-10-18 11:28:56.950135','2024-10-18 11:28:57.165512',1,'',NULL),(4,'DrConsult.slot_generation_cron_job','2024-10-18 12:19:32.787135','2024-10-18 12:19:32.788559',0,'Traceback (most recent call last):\n  File \"/home/ls/Desktop/DrConsultation/lib/python3.12/site-packages/django_cron/management/commands/runcrons.py\", line 82, in run_cron_with_cache_check\n    manager.run(force)\n  File \"/home/ls/Desktop/DrConsultation/lib/python3.12/site-packages/django_cron/__init__.py\", line 275, in run\n    if self.should_run_now(force):\n       ^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"/home/ls/Desktop/DrConsultation/lib/python3.12/site-packages/django_cron/__init__.py\", line 129, in should_run_now\n    if cron_job.schedule.run_monthly_on_days is not None:\n       ^^^^^^^^^^^^^^^^^\nAttributeError: \'SlotGenerationCronJob\' object has no attribute \'schedule\'\n\n',NULL),(5,'DrConsult.corns.slot_generation_cron_job','2024-10-18 12:20:06.989322','2024-10-18 12:20:07.620774',1,'',NULL),(6,'DrConsult.cron.slot_generation_cron_job','2024-10-18 12:43:11.761983','2024-10-18 12:43:11.792127',1,'',NULL);
/*!40000 ALTER TABLE `django_cron_cronjoblog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2024-08-09 11:18:47.197602'),(2,'auth','0001_initial','2024-08-09 11:18:47.963488'),(3,'admin','0001_initial','2024-08-09 11:18:48.090266'),(4,'admin','0002_logentry_remove_auto_add','2024-08-09 11:18:48.098597'),(5,'admin','0003_logentry_add_action_flag_choices','2024-08-09 11:18:48.108261'),(6,'contenttypes','0002_remove_content_type_name','2024-08-09 11:18:48.189915'),(7,'auth','0002_alter_permission_name_max_length','2024-08-09 11:18:48.265440'),(8,'auth','0003_alter_user_email_max_length','2024-08-09 11:18:48.303167'),(9,'auth','0004_alter_user_username_opts','2024-08-09 11:18:48.310779'),(10,'auth','0005_alter_user_last_login_null','2024-08-09 11:18:48.353857'),(11,'auth','0006_require_contenttypes_0002','2024-08-09 11:18:48.356431'),(12,'auth','0007_alter_validators_add_error_messages','2024-08-09 11:18:48.363640'),(13,'auth','0008_alter_user_username_max_length','2024-08-09 11:18:48.416381'),(14,'auth','0009_alter_user_last_name_max_length','2024-08-09 11:18:48.472165'),(15,'auth','0010_alter_group_name_max_length','2024-08-09 11:18:48.489008'),(16,'auth','0011_update_proxy_permissions','2024-08-09 11:18:48.496406'),(17,'auth','0012_alter_user_first_name_max_length','2024-08-09 11:18:48.549321'),(18,'sessions','0001_initial','2024-08-09 11:18:48.578111'),(19,'DrConsult','0001_initial','2024-08-09 11:33:43.524137'),(20,'authtoken','0001_initial','2024-08-09 12:54:47.759284'),(21,'authtoken','0002_auto_20160226_1747','2024-08-09 12:54:47.783892'),(22,'authtoken','0003_tokenproxy','2024-08-09 12:54:47.788128'),(23,'authtoken','0004_alter_tokenproxy_options','2024-08-09 12:54:47.793995'),(24,'DrConsult','0002_submitcontact','2024-08-13 06:48:39.080296'),(25,'DrConsult','0003_consultationquery_delete_submitcontact','2024-08-14 04:31:33.885287'),(26,'DrConsult','0004_alter_consultationquery_contact','2024-08-14 05:28:12.635109'),(27,'DrConsult','0005_alter_consultationquery_contact','2024-08-14 05:33:28.124378'),(28,'DrConsult','0006_configurations_services','2024-08-14 05:59:15.976357'),(29,'DrConsult','0007_services_text','2024-08-14 06:46:57.643774'),(30,'DrConsult','0008_rename_configurations_configuration','2024-08-14 07:04:05.004408'),(31,'DrConsult','0009_delete_configuration','2024-08-14 07:22:01.983336'),(32,'DrConsult','0010_configuration','2024-08-14 07:26:09.611412'),(33,'DrConsult','0011_configuration_slogan_text_and_more','2024-08-14 07:50:41.712385'),(34,'DrConsult','0012_rename_slogan_text_configuration_slogan_textt','2024-08-14 07:50:41.743688'),(35,'DrConsult','0013_delete_configuration','2024-08-14 07:50:41.759391'),(36,'DrConsult','0014_configuration','2024-08-14 07:50:41.781456'),(37,'DrConsult','0015_delete_configuration','2024-08-14 07:50:41.796510'),(38,'DrConsult','0016_configuration','2024-08-14 07:50:41.831146'),(39,'DrConsult','0017_alter_services_date','2024-08-14 09:11:08.724944'),(40,'DrConsult','0018_blogs_alter_configuration_new_favicon_and_more','2024-08-16 05:07:04.816558'),(41,'DrConsult','0019_alter_blogs_image','2024-08-16 05:11:58.181148'),(42,'DrConsult','0020_admin','2024-08-16 06:15:26.657498'),(43,'DrConsult','0021_alter_admin_password','2024-08-16 06:23:50.591642'),(44,'DrConsult','0022_staff','2024-08-16 09:04:17.890846'),(45,'DrConsult','0023_alter_staff_image','2024-08-16 11:51:49.584921'),(46,'DrConsult','0024_customuser','2024-08-21 06:44:26.077301'),(47,'DrConsult','0025_delete_customuser','2024-08-21 06:44:26.134632'),(48,'DrConsult','0026_customuser','2024-08-21 07:36:36.490753'),(49,'DrConsult','0027_delete_customuser','2024-08-21 07:36:36.532458'),(50,'DrConsult','0028_booking','2024-08-22 05:30:18.227556'),(51,'DrConsult','0029_alter_booking_other','2024-08-22 05:33:37.549379'),(52,'DrConsult','0030_slots','2024-08-22 09:04:52.149388'),(53,'DrConsult','0031_alter_booking_age_alter_booking_other','2024-08-23 06:41:29.026954'),(54,'DrConsult','0032_alter_booking_age_alter_booking_other','2024-08-23 06:45:03.744459'),(55,'DrConsult','0033_managepages','2024-08-26 12:34:43.786653'),(56,'DrConsult','0034_managepages_slug','2024-08-27 08:34:45.191943'),(57,'DrConsult','0035_remove_admin_password_alter_managepages_slug','2024-08-27 10:16:40.147389'),(58,'DrConsult','0036_consultationquerym_delete_consultationquery','2024-08-27 13:24:48.819016'),(59,'DrConsult','0037_services_status','2024-08-28 12:31:19.857223'),(60,'DrConsult','0038_managelocation','2024-08-31 06:20:19.864236'),(61,'DrConsult','0039_managedepartment_alter_managelocation_url','2024-08-31 06:32:36.627655'),(62,'DrConsult','0040_staff_department_staff_location','2024-09-02 07:02:32.342302'),(63,'DrConsult','0041_remove_booking_disease_remove_booking_other_and_more','2024-09-02 09:24:16.237594'),(64,'DrConsult','0042_contact_phone','2024-09-03 07:28:12.286424'),(65,'DrConsult','0043_alter_contact_phone','2024-09-03 07:51:48.293294'),(66,'DrConsult','0044_alter_contact_phone','2024-09-03 08:45:36.008085'),(67,'DrConsult','0045_alter_contact_phone','2024-09-03 08:46:51.575058'),(68,'DrConsult','0046_staff_gender_staff_is_staff_staff_username','2024-09-04 05:09:31.122912'),(69,'DrConsult','0047_staff_contact_staff_country_staff_state_and_more','2024-09-04 12:54:10.622697'),(70,'DrConsult','0048_rename_contact_staff_phone','2024-09-04 12:58:30.821062'),(71,'DrConsult','0049_rename_designation_staff_role','2024-09-04 13:01:26.236714'),(72,'DrConsult','0050_slots_username','2024-09-05 06:50:42.513561'),(73,'DrConsult','0051_alter_slots_username','2024-09-05 07:07:28.297031'),(74,'DrConsult','0052_booking_username','2024-09-05 10:29:41.340681'),(75,'DrConsult','0053_booking_today_appointments_count','2024-09-07 06:36:11.051488'),(76,'DrConsult','0054_slotsettings','2024-09-17 11:16:07.970404'),(77,'DrConsult','0055_alter_slotsettings_afternoone_and_more','2024-09-17 12:44:37.543850'),(78,'DrConsult','0056_alter_slotsettings_afternoone_and_more','2024-09-17 12:54:51.618884'),(79,'DrConsult','0057_alter_slotsettings_selected_days','2024-09-18 06:01:31.245097'),(80,'DrConsult','0058_alter_slotsettings_selected_days','2024-09-18 06:03:06.202916'),(81,'DrConsult','0059_alter_slotsettings_selected_days','2024-09-18 06:04:36.881479'),(82,'DrConsult','0060_alter_slotsettings_selected_days','2024-09-18 06:05:43.510087'),(83,'DrConsult','0054_slotgenerationsetting_slotsettings_dateslotmodel_and_more','2024-10-07 05:08:55.166795'),(84,'DrConsult','0055_staff_user','2024-10-07 09:07:59.054300'),(85,'DrConsult','0056_holidaymodel','2024-10-08 05:32:20.474173'),(86,'DrConsult','0057_slotgenerationsetting_doctor_and_more','2024-10-08 11:15:54.501160'),(87,'DrConsult','0058_alter_slotgenerationsetting_until_date','2024-10-08 12:57:08.359920'),(88,'django_q','0001_initial','2024-10-10 05:25:15.475388'),(89,'django_q','0002_auto_20150630_1624','2024-10-10 05:25:15.596642'),(90,'django_q','0003_auto_20150708_1326','2024-10-10 05:25:15.735063'),(91,'django_q','0004_auto_20150710_1043','2024-10-10 05:25:15.747313'),(92,'django_q','0005_auto_20150718_1506','2024-10-10 05:25:15.789916'),(93,'django_q','0006_auto_20150805_1817','2024-10-10 05:25:15.849777'),(94,'django_q','0007_ormq','2024-10-10 05:25:15.873521'),(95,'django_q','0008_auto_20160224_1026','2024-10-10 05:25:15.882302'),(96,'django_q','0009_auto_20171009_0915','2024-10-10 05:25:15.945658'),(97,'django_q','0010_auto_20200610_0856','2024-10-10 05:25:15.959175'),(98,'django_q','0011_auto_20200628_1055','2024-10-10 05:25:15.989286'),(99,'django_q','0012_auto_20200702_1608','2024-10-10 05:25:15.995263'),(100,'django_q','0013_task_attempt_count','2024-10-10 05:25:16.022564'),(101,'django_q','0014_schedule_cluster','2024-10-10 05:25:16.042337'),(102,'DrConsult','0059_alter_slotgenerationsetting_last_generated_at','2024-10-10 08:39:03.102878'),(103,'DrConsult','0060_delete_slots_delete_slotsettings','2024-10-11 06:17:19.729830'),(104,'DrConsult','0061_booking_sub_slot','2024-10-14 09:54:58.387458'),(105,'DrConsult','0062_alter_booking_time','2024-10-14 11:00:03.143733'),(106,'django_cron','0001_initial','2024-10-18 10:45:32.854499'),(107,'django_cron','0002_remove_max_length_from_CronJobLog_message','2024-10-18 10:45:32.867583'),(108,'django_cron','0003_cronjoblock','2024-10-18 10:45:32.898105'),(109,'DrConsult','0063_remove_staff_user','2024-10-21 10:30:50.477947'),(110,'DrConsult','0064_booking_status','2024-10-21 10:53:36.402032'),(111,'DrConsult','0065_alter_booking_status_cancelledbooking','2024-10-22 09:23:33.139879'),(112,'DrConsult','0066_holidaymodel_comment','2024-10-23 05:29:27.416023'),(113,'DrConsult','0067_notification','2024-10-24 09:47:46.601227'),(114,'DrConsult','0068_alter_notification_doctor','2024-10-24 10:22:24.256447'),(115,'DrConsult','0069_alter_notification_doctor','2024-10-24 12:14:01.301422'),(116,'DrConsult','0070_notification_notification_type','2024-10-25 09:29:17.422324'),(117,'DrConsult','0071_booking_is_patient_patient','2024-11-05 12:10:27.259568'),(118,'DrConsult','0072_booking_patient','2024-11-05 12:10:56.594011'),(119,'DrConsult','0073_alter_booking_patient_alter_patient_address_and_more','2024-11-07 05:54:42.611513'),(120,'DrConsult','0074_alter_booking_patient','2024-11-07 08:00:39.625510'),(121,'DrConsult','0075_patientdocument','2024-11-07 12:49:26.152972'),(122,'DrConsult','0076_customuser','2024-11-11 12:36:08.608757');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_q_ormq`
--

DROP TABLE IF EXISTS `django_q_ormq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_q_ormq` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `payload` longtext NOT NULL,
  `lock` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_q_ormq`
--

LOCK TABLES `django_q_ormq` WRITE;
/*!40000 ALTER TABLE `django_q_ormq` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_q_ormq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_q_schedule`
--

DROP TABLE IF EXISTS `django_q_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_q_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `func` varchar(256) NOT NULL,
  `hook` varchar(256) DEFAULT NULL,
  `args` longtext,
  `kwargs` longtext,
  `schedule_type` varchar(1) NOT NULL,
  `repeats` int NOT NULL,
  `next_run` datetime(6) DEFAULT NULL,
  `task` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `minutes` smallint unsigned DEFAULT NULL,
  `cron` varchar(100) DEFAULT NULL,
  `cluster` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `django_q_schedule_chk_1` CHECK ((`minutes` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_q_schedule`
--

LOCK TABLES `django_q_schedule` WRITE;
/*!40000 ALTER TABLE `django_q_schedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_q_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_q_task`
--

DROP TABLE IF EXISTS `django_q_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_q_task` (
  `name` varchar(100) NOT NULL,
  `func` varchar(256) NOT NULL,
  `hook` varchar(256) DEFAULT NULL,
  `args` longtext,
  `kwargs` longtext,
  `result` longtext,
  `started` datetime(6) NOT NULL,
  `stopped` datetime(6) NOT NULL,
  `success` tinyint(1) NOT NULL,
  `id` varchar(32) NOT NULL,
  `group` varchar(100) DEFAULT NULL,
  `attempt_count` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_q_task`
--

LOCK TABLES `django_q_task` WRITE;
/*!40000 ALTER TABLE `django_q_task` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_q_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('2hcyxb38lsh0xfmqpk5kysgiivtyvf7c','.eJxVjEEOwiAQRe_C2hDCQAsu3XsGwsyAVA0kpV013t026UK3_733NxHiupSw9jSHicVVgLj8bhjpleoB-Bnro0lqdZknlIciT9rlvXF6307376DEXvbaGucsJA_OQ0byoB3DCEA6syJUJo56N3DwaEzU5Az7jEOymK1iAvH5AsjTN7o:1slRYf:JPhmSh-lCfaODRA4uU5YmxO-1hwLefh8MvQBnDuzKmU','2024-09-17 11:18:49.864114'),('40cqql6ccij0yrcfly4u5mr0jehfjdyo','.eJxVjEEOwiAQRe_C2pAZKQO4dO8ZyAygVA1NSrsy3l2bdKHb_977LxV5XWpce5njmNVJGXX43YTTo7QN5Du326TT1JZ5FL0peqddX6Zcnufd_Tuo3Ou3RkNBLGHwFgiEEBIicCBih94F7wVgCBbK1ZkhmySJffZBypEdCav3B51PNuU:1t7t2O:VeEDMkSwH0TWKpZ4GEypEit2cqeUjnJDAsQNGVWONFE','2024-11-18 09:06:16.922090'),('5qs1wtmjel1nmc8wgdikh9r1h2b8iv7q','.eJxVjMEOwiAQRP-FsyFld0vBo3e_gcCyStXQpLQn47_bJj3obTLvzbxViOtSwtpkDmNWZwXq9NulyE-pO8iPWO-T5qku85j0ruiDNn2dsrwuh_t3UGIr2xo9ud4lxyzGG4tDx4JgwFGXt4zxxoPrKVkDRIwZLHtwiQ15Fp9Qfb68ozcW:1tAjbS:FG1UEZa1yCYsS5KqUMqHBzpc8vUi4kgDFidL9GGpluU','2024-11-26 05:38:14.841748'),('b2th1acp722i6hqqs0bn283qs6jqzh28','.eJwFwUESgCAIAMC_8ALAFOwzDqCN58xT09_bfaHZfmbba9xt2ppwQpYjK3EKzdWTYaVgRRMxF-2MiKM4pnBit6zRqVwWGBLDuuIB3w9tRhlQ:1t9HnT:4SBALQFFSk--3AlDMA4VGUM-w3RWPJPflwxv2ex6pSU','2024-11-22 05:44:39.670258'),('fvbe9ughf2iwxmhgk0wzydbbcmvq31o7','.eJwFwcsRgCAMBcBeqICACYnNMI9PhrPoybF3d99Q8dyrPntedWGvcIbilBWgCUjKEmNpB4il8BDzTIxs1lUntQaBm3eVyUkHj9Kbhe8HiY0ZsA:1t1Kz0:oRp_ZnAeqTTUGT4uXrFT0KnKaDJUI2QTlG_yHSxm1Bo','2024-10-31 07:31:42.600934'),('kc4g36oyi641eclbjtkyz16r1py6ysnp','.eJwNysENwCAIAMBdmMAAVugyRkDju9ZX093be98Dte171r36VWdbE07ILJKpK4nSMFdCCSpEjiOSW-JW8B92qDE3dOHQYUfPNnIKJ3g_dwoZWA:1sist8:81vJGx8kpeXV-dNqkKg9EIph_OUrPJeRKyEXMoG2M64','2024-09-10 09:53:22.866136'),('nb99fx58ahyxnau6cqutuy69h2gwabh0','.eJwFwcENwCAIAMBdnEBBEbuMQYT4rvXVdPfevaHLeVY_2-6-ZK9whWmuDDhseiTOYHWIK2JFy1A8yWzKQq2Qx4l1RNKaUmnIIJHIw_cDtZQZqg:1t8vBB:qrffXFUVtwthTpBvejvggyGoE22MJRXM6ebIqKYFiVs','2024-11-21 05:35:37.494823'),('t78eckrnyqbfeyjj54afydj2mgjugdn6','.eJwFwcERgCAMBMBeqIAkQoLNMAiX4S3ycuzd3TfUtp9Z98JdZ1sznIG46AVL6Ec2gpcoLDpSlmSmvYyWmMUQ2UmIu6sWAkhUYHAN3w9tbxih:1smBK9:-JcrxxXq4KbLSOJYx81V2uE6VhsCnC7U6D_994eUX4w','2024-09-19 12:10:53.677923'),('tirsv86sghskolr33mjhdecl4bl3wr0m','.eJxVjEEOwiAQRe_C2pAZKQO4dO8ZyAygVA1NSrsy3l2bdKHb_977LxV5XWpce5njmNVJGXX43YTTo7QN5Du326TT1JZ5FL0peqddX6Zcnufd_Tuo3Ou3RkNBLGHwFgiEEBIicCBih94F7wVgCBbK1ZkhmySJffZBypEdCav3B51PNuU:1sz8Aq:3hcFVtAKJljzQJ7jnhfsfwKQKGCCPiOuY2yN0MY9cW4','2024-10-25 05:26:48.767195'),('ygltz7fcfv38gf6qipy6gs9ihvjl5cj7','.eJxVjEEOwiAQRe_C2pAZKQO4dO8ZyAygVA1NSrsy3l2bdKHb_977LxV5XWpce5njmNVJGXX43YTTo7QN5Du326TT1JZ5FL0peqddX6Zcnufd_Tuo3Ou3RkNBLGHwFgiEEBIicCBih94F7wVgCBbK1ZkhmySJffZBypEdCav3B51PNuU:1synqo:Jos0ym4ukmALkAaZQphAqQJAkDL_4uFX-HS94Cjd8rA','2024-10-24 07:44:46.981189');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-12 12:27:16
