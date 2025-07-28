-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 28-Jul-2025 às 14:39
-- Versão do servidor: 8.0.40
-- versão do PHP: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `it_projecto`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `categorias_instrucoes`
--

DROP TABLE IF EXISTS `categorias_instrucoes`;
CREATE TABLE IF NOT EXISTS `categorias_instrucoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoria` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categoria` (`categoria`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `categoria_comp`
--

DROP TABLE IF EXISTS `categoria_comp`;
CREATE TABLE IF NOT EXISTS `categoria_comp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `categoria_ferr`
--

DROP TABLE IF EXISTS `categoria_ferr`;
CREATE TABLE IF NOT EXISTS `categoria_ferr` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `comentarios`
--

DROP TABLE IF EXISTS `comentarios`;
CREATE TABLE IF NOT EXISTS `comentarios` (
  `titulo` varchar(80) NOT NULL,
  `versao` int NOT NULL,
  `email` varchar(150) NOT NULL,
  `username` varchar(100) NOT NULL,
  `estrelas` int DEFAULT NULL,
  `comentario` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`titulo`,`versao`,`email`,`createdAt`),
  KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `componentes`
--

DROP TABLE IF EXISTS `componentes`;
CREATE TABLE IF NOT EXISTS `componentes` (
  `numero_peca` varchar(50) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `id_categoria_comp` int NOT NULL,
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `nome` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`numero_peca`),
  UNIQUE KEY `numero_peca` (`numero_peca`),
  KEY `id_familia` (`id_categoria_comp`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `componentes_imagens`
--

DROP TABLE IF EXISTS `componentes_imagens`;
CREATE TABLE IF NOT EXISTS `componentes_imagens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_peca` varchar(50) DEFAULT NULL,
  `caminho` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `numero_peca` (`numero_peca`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `destaques`
--

DROP TABLE IF EXISTS `destaques`;
CREATE TABLE IF NOT EXISTS `destaques` (
  `titulo` varchar(100) NOT NULL,
  `versao` int NOT NULL,
  `numero_peca` varchar(50) NOT NULL,
  `start_time` int NOT NULL,
  `status` tinyint(1) DEFAULT '0',
  `tipo` enum('componente','ferramenta') NOT NULL,
  PRIMARY KEY (`titulo`,`versao`,`numero_peca`,`start_time`,`tipo`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `epi`
--

DROP TABLE IF EXISTS `epi`;
CREATE TABLE IF NOT EXISTS `epi` (
  `numero_peca` varchar(50) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` text,
  `imagem` varchar(255) DEFAULT NULL,
  `created_on` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`numero_peca`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `ferramentas`
--

DROP TABLE IF EXISTS `ferramentas`;
CREATE TABLE IF NOT EXISTS `ferramentas` (
  `numero_peca` varchar(50) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` text,
  `imagem` varchar(255) DEFAULT NULL,
  `id_categoria_ferr` int NOT NULL,
  `created_on` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`numero_peca`),
  KEY `fk_categoria` (`id_categoria_ferr`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `instrucao_componentes`
--

DROP TABLE IF EXISTS `instrucao_componentes`;
CREATE TABLE IF NOT EXISTS `instrucao_componentes` (
  `titulo` varchar(100) NOT NULL,
  `versao` int NOT NULL,
  `numero_peca` varchar(50) NOT NULL,
  PRIMARY KEY (`titulo`,`versao`,`numero_peca`),
  KEY `numero_peca` (`numero_peca`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `instrucao_epi`
--

DROP TABLE IF EXISTS `instrucao_epi`;
CREATE TABLE IF NOT EXISTS `instrucao_epi` (
  `numero_peca` varchar(50) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `versao` int NOT NULL,
  PRIMARY KEY (`numero_peca`,`titulo`,`versao`),
  KEY `titulo` (`titulo`,`versao`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `instrucao_ferramentas`
--

DROP TABLE IF EXISTS `instrucao_ferramentas`;
CREATE TABLE IF NOT EXISTS `instrucao_ferramentas` (
  `numero_peca` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `versao` int NOT NULL,
  PRIMARY KEY (`numero_peca`,`titulo`,`versao`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `instrucoes`
--

DROP TABLE IF EXISTS `instrucoes`;
CREATE TABLE IF NOT EXISTS `instrucoes` (
  `titulo` varchar(100) NOT NULL,
  `versao` int NOT NULL,
  `descricao` text,
  `video_id` int DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `created_on` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `categoria_id` int DEFAULT NULL,
  `status` enum('ativa','desativada','em_processo') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'em_processo',
  PRIMARY KEY (`titulo`,`versao`),
  KEY `fk_categoria_instrucao` (`categoria_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `legendas`
--

DROP TABLE IF EXISTS `legendas`;
CREATE TABLE IF NOT EXISTS `legendas` (
  `video_id` int NOT NULL,
  `start_time` int NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`video_id`,`start_time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `email` varchar(191) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','criador_instrucoes','admin') DEFAULT 'user',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `videos`
--

DROP TABLE IF EXISTS `videos`;
CREATE TABLE IF NOT EXISTS `videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `caminho` varchar(255) NOT NULL,
  `data_upload` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
