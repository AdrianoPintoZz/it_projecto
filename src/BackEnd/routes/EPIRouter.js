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

// Listar todos os EPIs
router.get('/', (req, res) => {
    db.query('SELECT * FROM epi', (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar EPIs", message: err.message });
        }
        res.json(results);
    });
});

// Adicionar EPI
router.post("/", upload.single('imagem'), (req, res) => {
    const { numero_peca, nome, descricao } = req.body;
    const imagemPath = req.file ? req.file.filename : null;

    if (!nome || !numero_peca || !descricao || !imagemPath) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const sql = "INSERT INTO epi (numero_peca, nome, descricao, imagem) VALUES (?, ?, ?, ?)";
    db.query(sql, [numero_peca, nome, descricao, imagemPath], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "EPI adicionado com sucesso!", numero_peca });
    });
});

// Atualizar EPI
router.put("/:numero_peca", (req, res) => {
    const numero_peca = req.params.numero_peca;
    const { nome, descricao } = req.body;

    const sql = `
        UPDATE epi
        SET nome = ?, descricao = ?
        WHERE numero_peca = ?
    `;

    db.query(sql, [nome, descricao, numero_peca], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao atualizar EPI." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "EPI não encontrado." });
        }
        res.json({ message: "EPI atualizado com sucesso." });
    });
});

module.exports = router;