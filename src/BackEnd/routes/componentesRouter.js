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

router.get("/", (req, res) => {
    db.query("SELECT * FROM componentes", (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar componentes", message: err.message });
        }
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { numero_peca, nome, descricao, id_categoria_comp, data_criacao, data_atualizacao } = req.body;

    if (!numero_peca || !nome || !descricao || !id_categoria_comp || !data_criacao || !data_atualizacao) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const sql = `
      INSERT INTO componentes 
      (numero_peca, nome, descricao, id_categoria_comp, data_criacao, data_atualizacao) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [numero_peca, nome, descricao, id_categoria_comp, data_criacao, data_atualizacao], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({ message: "Componente adicionado com sucesso!", numero_peca });
    });
  });
  

router.put('/:numero_peca',(req, res) => {
    const { numero_peca } = req.params;
    const { nome, descricao, id_categoria_comp } = req.body;
         db.query(
            'UPDATE componentes SET nome = ? ,descricao = ?, id_categoria_comp = ? WHERE numero_peca = ?',
            [nome, descricao, id_categoria_comp, numero_peca]
        );
        res.status(200).json({ message: 'Componente atualizado com sucesso' });
});

router.post('/imagens', upload.array('imagens', 10), (req, res) => {
    const numero_peca = req.body.numero_peca;
    const imagens = req.files;
  
    if (!numero_peca || !imagens || imagens.length === 0) {
      return res.status(400).json({ error: "Número da peça e imagens são obrigatórios" });
    }
  
    const valores = imagens.map(img => [numero_peca, img.filename]);
    const sql = "INSERT INTO componentes_imagens (numero_peca, caminho) VALUES ?";
  
    db.query(sql, [valores], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
  
      res.status(201).json({ message: "Imagens carregadas com sucesso!" });
    });
  });


  router.get('/', (req, res) => {
    const sql = `
      SELECT c.*, 
        JSON_ARRAYAGG(ci.nome_arquivo) as imagens 
      FROM componentes c 
      LEFT JOIN componentes_imagens ci ON c.numero_peca = ci.numero_peca 
      GROUP BY c.numero_peca
    `;
  
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      

      const parsedResults = results.map(r => ({
        ...r,
        imagens: JSON.parse(r.imagens)
      }));
  
      res.json(parsedResults);
    });
  });


  router.get('/imagens/:numero_peca', (req, res) => {
    const { numero_peca } = req.params;

    const sql = "SELECT caminho FROM componentes_imagens WHERE numero_peca = ?";
    db.query(sql, [numero_peca], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar imagens' });
        }

        res.json(results);
    });
});

  
  



module.exports = router;
