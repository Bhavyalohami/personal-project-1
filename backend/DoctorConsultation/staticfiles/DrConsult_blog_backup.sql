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

LOCK TABLES `DrConsult_blogs` WRITE;
/*!40000 ALTER TABLE `DrConsult_blogs` DISABLE KEYS */;
INSERT INTO `DrConsult_blogs` VALUES 
(4,'Why we are better than others?','How do you create compelling presentations that wow your colleagues and impress your managers?','2024-08-26','Dr. Ryan Grouse','Heart Specialists','blogs/blog1.png'),
(5,'7 ways to live healthy lives','Linear helps streamline software projects, sprints, tasks, and bug tracking. Here’s how to get...','2024-08-26','Dr. Marilyn Levin','Heart Specialists','blogs/blog2.png'),
(6,'Ai in Brain Surgery','The rise of Super AIs has been met by a rise in tools for creating, testing, and manag...','2024-08-26','Dr. Leo Arcand','Brain Surgeon','blogs/blog3.png'),
(7,'How our treatments is beneficial for you?','How do you create compelling presentations that wow your colleagues and impress your managers?','2024-08-26','Dr. Rama S. Subramaniam','Eye Specialists','blogs/rb1.png'),
(8,'Migrating to Linear 101','<p>Linear helps streamline software projects, sprints, tasks, and bug tracking. Here’s how to get...</p>','2024-08-26','Dr. Maxterm BaImer','Heart Specialists','blogs/existing-image_u760Afa.jpg'),
(9,'Special Baby Carefsdf','<p>The rise of Super AIs has been met by a rise in tools for creating, testing, and manag...</p>','2024-08-26','Dr. Lana Steiner','Brain Surgeon','blogs/existing-image_YJ9cq91.jpg');
/*!40000 ALTER TABLE `DrConsult_blogs` ENABLE KEYS */;
UNLOCK TABLES;

