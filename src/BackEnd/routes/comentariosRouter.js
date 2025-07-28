const express = require("express");
const db = require("../models/db");
const router = express.Router();


router.post("/", (req, res) => {
  const { titulo, versao, email, username, estrelas, comentario } = req.body;

  const sql = `INSERT INTO comentarios (titulo, versao, email, username, estrelas, comentario)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [titulo, versao, email, username, estrelas, comentario], (err, result) => {
    if (err) {
      console.error("Erro ao inserir comentário:", err);
      return res.status(500).json({ error: "Erro ao adicionar comentário." });
    }
    res.status(201).json({ message: "Comentário adicionado com sucesso." });
  });
});


router.get("/:titulo/:versao", (req, res) => {
  const { titulo, versao } = req.params;

  const sql = `SELECT username, estrelas, comentario, createdAt
               FROM comentarios WHERE titulo = ? AND versao = ?
               ORDER BY createdAt DESC`;
  db.query(sql, [titulo, versao], (err, results) => {
    if (err) {
      console.error("Erro ao obter comentários:", err);
      return res.status(500).json({ error: "Erro ao buscar comentários." });
    }
    res.json(results);
  });
});


module.exports = router;