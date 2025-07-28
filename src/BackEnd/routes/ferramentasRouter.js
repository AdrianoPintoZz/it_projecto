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

router.get('/', (req, res) => {
    db.query('SELECT * FROM ferramentas', (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar ferramentas", message: err.message });
        }
        res.json(results);
    });
});

router.post("/", upload.single('imagem'), (req, res) => {
    const { numero_peca, nome, id_categoria_ferr, descricao } = req.body;
    const imagemPath = req.file ? req.file.filename : null; 

    if (!nome || !numero_peca || !id_categoria_ferr || !descricao || !imagemPath) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const sql = "INSERT INTO ferramentas (numero_peca, nome, id_categoria_ferr, descricao, imagem) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [numero_peca,nome, id_categoria_ferr, descricao, imagemPath], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Ferramenta adicionada com sucesso!",  numero_peca: numero_peca });
    });
});


router.put("/:numero_peca", (req, res) => {
  const numero_peca = req.params.numero_peca;
  const { nome,  categoria_id, descricao } = req.body;

  const sql = `
    UPDATE ferramentas
    SET nome = ?, id_categoria_ferr = ?, descricao = ?
    WHERE numero_peca = ?
  `;

  db.query(sql, [nome, categoria_id, descricao, numero_peca], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar ferramenta:", err);
      return res.status(500).json({ error: "Erro ao atualizar ferramenta." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ferramenta não encontrada." });
    }

    res.json({ message: "Ferramenta atualizada com sucesso." });
  });
});


module.exports = router;
