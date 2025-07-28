const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const db = require('../models/db');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');

router.post("/register", async (req, res) => {
  const { email,name, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
    const connection = db;
const sql = "INSERT INTO users (email, nome, password, role) VALUES (?, ?, ?, ?)";
const values = [email, name, hashedPassword, role];

connection.query(sql, values, (err, results) => {
  if (err) {
    console.error("Erro ao inserir utilizador:", err);
    return res.status(500).json({ message: "Erro ao registar utilizador." });
  }
  res.status(201).json({ message: "Utilizador registado com sucesso" });
});

});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = db;
    connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ error: "Erro ao procurar utilizador" });
      if (results.length === 0) return res.status(401).json({ error: "Credenciais inválidas" });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: "Credenciais inválidas" });

      const token = jwt.sign({ email: user.email, role: user.role }, "segredo_super_secreto", { expiresIn: "1h" });
      res.json({ user, token });
    });
  } catch (err) {
    res.status(500).json({ error: "Erro no login" });
  }
});

router.get("/", (req, res) => {
  const sql = "SELECT nome, email, role FROM users ORDER BY nome ASC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar utilizadores:", err);
      return res.status(500).json({ error: "Erro ao listar utilizadores." });
    }
    res.json(results);
  });
});


router.put("/:email/:role", (req, res) => {
  const { email, role } = req.params;

  const sql = "UPDATE users SET role = ? WHERE email = ?";
  db.query(sql, [role, email], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar a role:", err);
      return res.status(500).json({ error: "Erro ao atualizar a role." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }

    res.json({ message: "Role atualizada com sucesso." });
  });
});


  





module.exports = router;