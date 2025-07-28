const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM instrucao_ferramentas';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar dados' });
        res.json(results);
    });
});


router.post("/adicionar", (req, res) => {
    const { titulo, versao, ferramentas } = req.body;

    const values = ferramentas.map(ferr => [titulo, versao, ferr]);

    const sql = "INSERT INTO instrucao_ferramentas (titulo, versao, numero_peca) VALUES ?";

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Erro ao adicionar ferramentas:", err);
            return res.status(500).json({ error: "Erro ao associar ferramentas" });
        }
        res.json({ success: true });
    });
});


router.delete('/:numero_peca/:titulo/:versao', (req, res) => {
    const { numero_peca, titulo, versao } = req.params;

    const sql = `
        DELETE FROM instrucao_ferramentas 
        WHERE numero_peca = ? AND titulo = ? AND versao = ?
    `;

    db.query(sql, [numero_peca, titulo, versao], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao eliminar' });
        res.json({ message: 'Relação eliminada com sucesso!' });
    });
});



router.get('/FerramentasNotIn/:titulo/:versao', (req, res) => {
    const titulo = decodeURIComponent(req.params.titulo);
    const versao = req.params.versao;
    const sql = `
        SELECT f.*
        FROM ferramentas f
        WHERE f.numero_peca NOT IN (
            SELECT numero_peca 
            FROM instrucao_ferramentas 
            WHERE titulo = ? AND versao = ?
        )
    `;
    db.query(sql, [titulo, versao], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao buscar ferramentas não associadas" });
        }
        res.json(results);
    });
});


router.get('/FerramentasIn/:titulo/:versao', (req, res) => {
    const titulo = decodeURIComponent(req.params.titulo);
    const versao = req.params.versao;
    const sql = `
        SELECT f.*
        FROM ferramentas f
        WHERE f.numero_peca IN (
            SELECT numero_peca 
            FROM instrucao_ferramentas 
            WHERE titulo = ? AND versao = ?
        )
    `;
    db.query(sql, [titulo, versao], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao buscar ferramentas não associadas" });
        }
        res.json(results);
    });
});



module.exports = router;