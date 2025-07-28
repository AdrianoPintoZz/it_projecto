const express = require('express');
const router = express.Router();
const db = require('../models/db');


    router.get("/", (req, res) => {
        db.query("SELECT * FROM categoria_comp", (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao buscar categoria de componentes", message: err.message });
            }
            res.json(results);
        });
    });

    router.post('/', (req, res) => {
        const { nome} = req.body;


        const sql = "INSERT INTO categoria_comp (nome) VALUES (?)";
        db.query(sql, [nome], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: "Categoria de Componentes adicionada com sucesso!", id: result.insertId });
        });
    });

    router.post('/categoria', (req, res) => {
        const { nome } = req.body;

        if (!nome) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        const sql = "INSERT INTO categoria_ferr (nome) VALUES (?)";
        db.query(sql, [nome], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: "Categoria de ferramenta adicionada com sucesso!", id: result.insertId });
        });
    });

    router.get("/getCategorias", (req, res) => {
        db.query("SELECT * FROM categoria_ferr", (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao buscar categorias de ferramenta", message: err.message });
            }
            res.json(results);
        });
    });

    router.post('/categoria_instrucao', (req, res) => {
        const { categoria } = req.body;

        if (!categoria) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        const sql = "INSERT INTO categorias_instrucoes (categoria) VALUES (?)";
        db.query(sql, [categoria], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: "Categoria adicionada com sucesso!", id: result.insertId });
        });
    });

    router.get("/getCategorias_Instrucoes", (req, res) => {
        db.query("SELECT * FROM categorias_instrucoes", (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao buscar categorias", message: err.message });
            }
            res.json(results);
        });
    });



module.exports = router;