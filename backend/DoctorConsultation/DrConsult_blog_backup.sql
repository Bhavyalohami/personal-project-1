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