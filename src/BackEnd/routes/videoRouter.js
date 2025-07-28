const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../models/db");
const router = express.Router();


const uploadDir = path.join(__dirname, "../../uploads");


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage }); 


router.post("/upload", upload.single("video"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }

    const { filename } = req.file;

    const sql = "INSERT INTO videos (caminho) VALUES (?)";
    db.query(sql, [filename], (err, result) => {
        if (err) {
            console.error("❌ ERRO ap Guardar Video:", err.sqlMessage || err);
            return res.status(500).json({ message: "Erro ao salvar no banco" });
        }

        res.json({
            message: "Upload e salvamento bem-sucedidos!",
            id: result.insertId,
            filename
        });
    });
});


router.get("/", (req, res) => {
    db.query("SELECT * FROM videos", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});




router.get("/id/:id", (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM videos WHERE id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Vídeo não encontrado" });
        }

        res.json(results[0]);
    });
});

router.get("/file/:filename", (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ message: "Vídeo não encontrado" });
    }
});


module.exports = router;
