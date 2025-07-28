const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const db = require('../models/db');

const imagensDir = "src/imagens";
if (!fs.existsSync(imagensDir)) {
    fs.mkdirSync(imagensDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/imagens/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage });

router.get('/versoes/:titulo', (req, res) => {
  const { titulo } = req.params;
  const sql = `
    SELECT titulo, versao, video_id, imagem, updated_on, status
    FROM instrucoes
    WHERE titulo = ?
    ORDER BY versao DESC
  `;
  db.query(sql, [titulo], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar versões da instrução' });
    }
    res.json(results); 
  });
});

router.post("/", upload.single("imagem"), async (req, res) => {
    const { titulo, descricao, versao, video_id, categoria_id } = req.body;
    const imagem = req.file ? req.file.filename : null;

    if (!titulo || !descricao || !video_id || !imagem) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    const sql = "INSERT INTO instrucoes (titulo, versao, descricao, video_id, imagem, categoria_id) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [titulo, versao, descricao, video_id, imagem, categoria_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Instrução adicionada com sucesso!" });
    });
});

router.get("/", (req, res) => {
  const sql = `
    SELECT i.*, c.categoria AS categoria_nome
    FROM instrucoes i
    LEFT JOIN categorias_instrucoes c ON i.categoria_id = c.id
  `;
  db.query(sql, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(results);
  });
});

router.get('/:titulo/:versao', (req, res) => {
  const { titulo, versao } = req.params;
  const sql = "SELECT * FROM instrucoes WHERE titulo = ? AND versao = ?";
  db.query(sql, [titulo, versao], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar instrução' });
    if (results.length === 0) return res.status(404).json({ error: 'Instrução não encontrada' });
    res.json(results[0]);
  });
});

router.get('/:videoId', (req, res) => {
  const { videoId } = req.params;
  const sql = "SELECT * FROM instrucoes WHERE video_id = ?";
  db.query(sql, [parseInt(videoId)], (err, results) => {
    if (err) {
      console.error('Erro na query SQL:', err);
      return res.status(500).json({ error: 'Erro na base de dados' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Instrução não encontrada para o vídeo' });
    }

    res.json(results[0]);
  });
});

router.put('/atualizar/:titulo/:versao', (req, res) => {
  const { descricao, status } = req.body;
  const { titulo, versao } = req.params;
  db.query(
    'UPDATE instrucoes SET descricao = ?, status = ? WHERE titulo = ? AND versao = ?',
    [descricao, status, titulo, versao],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Erro no servidor' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Instrução não encontrada' });
      }
      res.status(200).json({ message: 'Instrução atualizada com sucesso' });
    }
  );
});

module.exports = router;
