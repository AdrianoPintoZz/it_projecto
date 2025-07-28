const express = require('express');
const router = express.Router();
const db = require('../models/db');


router.post('/adicionar', (req, res) => {
    const { titulo, versao, numero_peca, start_time, status, tipo } = req.body;
  
    const sql = `
      INSERT INTO destaques 
        (titulo, versao, numero_peca, start_time, status, tipo)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    db.query(sql, [titulo, versao, numero_peca, start_time, status, tipo], (err, result) => {
      if (err) {
        console.error("Erro ao adicionar destaque:", err);
        return res.status(500).json({ error: "Erro ao adicionar destaque" });
      }
  
      res.status(201).json({ message: "Destaque adicionado com sucesso" });
    });
  });


  router.get('/:titulo/:versao', (req, res) => {
    const { titulo, versao } = req.params;

    const sql = `
        SELECT * FROM destaques
        WHERE titulo = ? AND versao = ?
    `;

    db.query(sql, [titulo, versao], (err, results) => {
        if (err) {
            console.error("Erro ao buscar destaques:", err);
            return res.status(500).json({ error: "Erro ao buscar destaques" });
        }
        res.json(results);
    });
  });

  router.get('/componente/:titulo/:versao', (req, res) => {
    const { titulo, versao } = req.params;
  
    const sql = `
      SELECT * FROM destaques
      WHERE titulo = ? AND versao = ? AND tipo = ?
    `;
  
    db.query(sql, [titulo, versao, "componente"], (err, result) => {
      if (err) {
        console.error("Erro ao buscar destaques:", err);
        return res.status(500).json({ error: "Erro ao buscar destaques" });
      }
      res.json(result);
    });
  });

  router.get('/ferramenta/:titulo/:versao', (req, res) => {
    const { titulo, versao } = req.params;
  
    const sql = `
      SELECT * FROM destaques
      WHERE titulo = ? AND versao = ? AND tipo = ?
    `;
  
    db.query(sql, [titulo, versao, "ferramenta"], (err, result) => {
      if (err) {
        console.error("Erro ao buscar destaques:", err);
        return res.status(500).json({ error: "Erro ao buscar destaques" });
      }
      res.json(result);
    });
  });

  router.get('/SingleDestaque/ferramenta/:titulo/:versao/:start_time', (req, res) => {
    const { titulo, versao, start_time } = req.params;
  
    const sql = `
      SELECT * FROM destaques
      WHERE titulo = ?
        AND versao = ?
        AND start_time BETWEEN (? - 10) AND ?
        AND tipo = 'ferramenta'
      ORDER BY start_time DESC
    `;
  
    db.query(sql, [titulo, versao, start_time, start_time], (err, result) => {
      if (err) {
        console.error("Erro ao buscar destaques ferramenta:", err);
        return res.status(500).json({ error: "Erro ao buscar destaque ferramenta" });
      }
      res.json(result);
    });
  });
  

  router.get('/SingleDestaque/componente/:titulo/:versao/:start_time', (req, res) => {
    const { titulo, versao, start_time } = req.params;
  
    const sql = `
      SELECT * FROM destaques
      WHERE titulo = ?
        AND versao = ?
        AND start_time BETWEEN (? - 10) AND ?
        AND tipo = 'componente'
      ORDER BY start_time DESC
    `;
  
    db.query(sql, [titulo, versao, start_time, start_time], (err, result) => {
      if (err) {
        console.error("Erro ao buscar destaque:", err);
        return res.status(500).json({ error: "Erro ao buscar destaque" });
      }
      res.json(result);
    });
  });
  


  router.delete('/DeleteDestaque/:titulo/:versao/:numero_peca/:start_time', (req, res) => {
    const { titulo, versao, numero_peca, start_time } = req.params;
  
    const sql = `
      DELETE FROM destaques
      WHERE titulo = ? AND versao = ? AND numero_peca = ? AND start_time = ?
    `;
  
    db.query(sql, [titulo, versao, numero_peca, start_time], (err, result) => {
      if (err) {
        console.error("Erro ao apagar destaque:", err);
        return res.status(500).json({ error: "Erro ao apagar destaque" });
      }
      console.log("DELETE recebida:", req.params);
      res.status(200).json({ message: "Destaque apagado com sucesso" });
    });
  });
  
  
  
  
module.exports = router;
