const express = require('express');
const router = express.Router();
const db = require('../models/db');


router.post("/adicionar", (req, res) => {
    const { titulo, versao, componentes } = req.body;

    const values = componentes.map(comp => [titulo, versao, comp]);

    const sql = "INSERT INTO instrucao_componentes (titulo, versao, numero_peca) VALUES ?";

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Erro ao adicionar componentes:", err);
            return res.status(500).json({ error: "Erro ao associar componentes" });
        }
        res.json({ success: true });
    });
});


router.delete('/:numero_peca/:titulo/:versao', (req, res) => {
    const { numero_peca, titulo, versao } = req.params;

    const sql = `
        DELETE FROM instrucao_componentes
        WHERE numero_peca = ? AND titulo = ? AND versao = ?
    `;

    db.query(sql, [numero_peca, titulo, versao], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao eliminar' });
        res.json({ message: 'Relação eliminada com sucesso!' });
    });
});



router.get('/ComponentesNotIn/:titulo/:versao', (req, res) => {
    const titulo = decodeURIComponent(req.params.titulo);
    const versao = req.params.versao;
    const sql = `
        SELECT c.*
        FROM componentes c
        WHERE c.numero_peca NOT IN (
            SELECT numero_peca 
            FROM instrucao_componentes 
            WHERE titulo = ? AND versao = ?
        )
    `;
    db.query(sql, [titulo, versao], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao buscar componentes não associadas" });
        }
        res.json(results);
    });
});


router.get('/ComponentesIn/:titulo/:versao', (req, res) => {
    const titulo = decodeURIComponent(req.params.titulo);
    const versao = req.params.versao;

    const sql = `
        SELECT c.* FROM componentes c
            WHERE c.numero_peca IN (
                SELECT numero_peca
                FROM instrucao_componentes
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