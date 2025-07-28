const express = require('express');
const router = express.Router();
const db = require('../models/db');


router.get('/', (req, res) => {
    db.query('SELECT * FROM legendas', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});



router.post("/", (req, res) => {
    let { video_id, start_time, content } = req.body;

    console.log("📥 Dados recebidos no backend:", req.body);


    console.log("📤 Dados processados para inserir:", { video_id, start_time, content });

    const sql = "INSERT INTO legendas (video_id, start_time, content) VALUES (?, ?, ?)";

    db.query(sql, [video_id, start_time, content], (err, result) => {
        if (err) {
            console.error("❌ ERRO NO BANCO:", err.message);
            return res.status(500).json({ error: err.message });
        }

        console.log("✅ Legenda inserida com sucesso! ID:", result.insertId);
        res.status(201).json({ message: "Legenda adicionada com sucesso!", id: result.insertId });
    });
});

router.delete("/:video_id/:start_time", (req, res) => {
    const { video_id, start_time } = req.params;
  
    const sql = "DELETE FROM legendas WHERE video_id = ? AND start_time = ?";
    db.query(sql, [video_id, start_time], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao apagar legenda", message: err.message });
      }
      console.log("DELETE recebida:", req.params);
      res.status(200).json({ message: "Legenda apagada com sucesso!" });
    });
  });
  
  

router.get("/video/:video_id", (req, res) => {
    const video_id = req.params.video_id;
    const sql = "SELECT * FROM legendas WHERE video_id = ? ORDER BY start_time ASC";

    db.query(sql, [video_id], (err, results) => {
        if (err) {
            console.error("❌ Erro ao buscar legendas:", err.message);
            return res.status(500).json({ error: "Erro ao buscar legendas" });
        }

        console.log("📄 Legendas encontradas:", results);
        res.json(results);
    });
});

router.put("/:video_id/:start_time", (req, res) => {
    const { video_id, start_time } = req.params;
    const { content } = req.body;
  
    const sql = "UPDATE legendas SET content = ? WHERE video_id = ? AND start_time = ?";
    db.query(sql, [content, video_id, start_time], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao atualizar legenda", message: err.message });
      }
      res.status(200).json({ message: "Legenda atualizada com sucesso!" });
    });
  });


  router.get('/legenda/:videoId/:start_time', (req, res) => {
    const { videoId, start_time } = req.params;

    const sql = `
        SELECT * FROM legendas
        WHERE video_id = ? AND start_time <= ?
        ORDER BY start_time DESC
        LIMIT 1
    `;

    db.query(sql, [videoId, start_time], (err, results) => {
        if (err) {
            console.error('Erro ao buscar legenda:', err);
            return res.status(500).json({ error: 'Erro ao buscar legenda' });
        }

        res.json(results[0] || null);
    });
});

  



module.exports = router;