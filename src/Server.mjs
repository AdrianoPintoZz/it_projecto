import express from "express";
import cors from "cors";
import Ferramentas from "./BackEnd/routes/ferramentasRouter.js";
import Familia from "./BackEnd/routes/CategoriasRouter.js";
import Componentes from "./BackEnd/routes/componentesRouter.js";
import Videos from "./BackEnd/routes/videoRouter.js";
import Legendas from "./BackEnd/routes/leguendasRouter.js";
import Instrucoes from "./BackEnd/routes/InstrucaoTrabalhoRouter.js";
import InstrucoesComponentes from "./BackEnd/routes/IntrucoesComponentes.js"
import InstrucoesFerramentas from "./BackEnd/routes/InstrucoesFerramentas.js";
import Destaques from "./BackEnd/routes/destaquesRouter.js";
import Users from "./BackEnd/routes/userRouter.js"
import Comentarios from "./BackEnd/routes/comentariosRouter.js"
import Epi from "./BackEnd/routes/EPIRouter.js";
import InstrucoesEPI from "./BackEnd/routes/InstrucoesEPI.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

app.use(cors({
  origin: "http://localhost:3500",  
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"], 
}));
app.use(express.json());

const imagePath = path.resolve(__dirname, "imagens");
app.use("/imagens", express.static(imagePath));

app.use("/instrucoesFerramentas", InstrucoesFerramentas);
app.use("/instrucoesComponentes", InstrucoesComponentes);
app.use("/instrucoes", Instrucoes);
app.use("/ferramentas", Ferramentas);
app.use("/familia", Familia);
app.use("/componentes", Componentes);
app.use("/videos", Videos);
app.use("/legendas", Legendas);
app.use("/destaques", Destaques);
app.use("/users", Users);
app.use("/comentarios", Comentarios);
app.use("/epi", Epi);
app.use("/instrucoesEpi", InstrucoesEPI);

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
