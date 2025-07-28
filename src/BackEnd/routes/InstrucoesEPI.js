const express = require('express');
const router = express.Router();
const db = require('../models/db');


router.get('/', (req, res) => {
    db.query('SELECT * FROM instrucao_epi', (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar dados' });
        res.json(results);
    });
});


router.post("/adicionar", (req, res) => {
    const { titulo, versao, epis } = req.body;
    const values = epis.map(epi => [titulo, versao, epi]);
    const sql = "INSERT INTO instrucao_epi (titulo, versao, numero_peca) VALUES ?";
    db.query(sql, [values], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao associar EPIs" });
        }
        res.json({ success: true });
    });
});


router.delete('/:numero_peca/:titulo/:versao', (req, res) => {
    const { numero_peca, titulo, versao } = req.params;
    const sql = `
        DELETE FROM instrucao_epi 
        WHERE numero_peca = ? AND titulo = ? AND versao = ?
    `;
    db.query(sql, [numero_peca, titulo, versao], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao eliminar' });
        res.json({ message: 'Relação eliminada com sucesso!' });
    });
});


router.get('/EpiNotIn/:titulo/:versao', (req, res) => {
    const titulo = decodeURIComponent(req.params.titulo);
    const versao = req.params.versao;
    const sql = `
        SELECT e.*
        FROM epi e
        WHERE e.numero_peca NOT IN (
            SELECT numero_peca 
            FROM instrucao_epi 
            WHERE titulo = ? AND versao = ?
        )
    `;
    db.query(sql, [titulo, versao], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar EPIs não associadas" });
        }
        res.json(results);
    });
});

// EPIs associados a uma instrução/versão
router.get('/EpiIn/:titulo/:versao', (req, res) => {
    const titulo = decodeURIComponent(req.params.titulo);
    const versao = req.params.versao;
    const sql = `
        SELECT e.*
        FROM epi e
        WHERE e.numero_peca IN (
            SELECT numero_peca 
            FROM instrucao_epi 
            WHERE titulo = ? AND versao = ?
        )
    `;
    db.query(sql, [titulo, versao], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar EPIs associadas" });
        }
        res.json(results);
    });
});

module.exports = router;