import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { FaUserCircle } from "react-icons/fa";

function getStatusColor(status) {
  switch (status) {
    case "ativa":
      return "#43a047";
    case "em_processo":
      return "#fb8c00";
    case "desativada":
    case "desatualizada":
      return "#e53935";
    default:
      return "#bdbdbd"; 
  }
}


function renderStatusLabel(status) {
  if (status === "desativada") return "Desatualizada";
  if (status === "ativa") return "Ativa";
  if (status === "em_processo") return "Em Desenvolvimento";
  return status;
}

const MainPageCI = () => {
  const [instrucoes, setInstrucoes] = useState([]);
  const [selectedInstrucao, setSelectedInstrucao] = useState(null);
  const [categorias, setCategorias] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch(
          "http://localhost:4000/familia/getCategorias_Instrucoes"
        );
        const data = await res.json();
        const catObj = {};
        data.forEach((cat) => {
          catObj[cat.id] = cat.categoria;
        });
        setCategorias(catObj);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    }

    async function fetchInstrucoes() {
      try {
        const res = await fetch("http://localhost:4000/instrucoes");
        const all = await res.json();
        const minhas = all.filter((instrucao) => instrucao.user_id === user.id);

        const agrupadas = minhas.reduce((acc, instrucao) => {
          const chave = instrucao.titulo;
          if (!acc[chave]) acc[chave] = [];
          acc[chave].push(instrucao);
          return acc;
        }, {});

        const filtradas = Object.values(agrupadas).map((lista) => {
          const ativas = lista.filter((i) => i.status === "ativa");

          if (ativas.length > 0) {
            return ativas.reduce((maisRecente, atual) =>
              parseFloat(atual.versao) > parseFloat(maisRecente.versao)
                ? atual
                : maisRecente
            );
          }

          return lista.reduce((maisRecente, atual) =>
            parseFloat(atual.versao) > parseFloat(maisRecente.versao)
              ? atual
              : maisRecente
          );
        });

        setInstrucoes(filtradas);
      } catch (err) {
        console.error("Erro ao buscar instruções:", err);
      }
    }

    fetchCategorias();
    fetchInstrucoes();
  }, [user.id]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app-wrapper">
      <header
        className="top-header"
        style={{
          padding: "1rem 2rem",
          backgroundColor: "#6A1B9A",
          borderBottom: "2px solid #4A148C",
        }}
      >
        <div
          className="logo"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#FFFFFF",
            cursor: "pointer",
          }}
        >
          STEP BY STEP
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            position: "relative",
          }}
        >
          <div
            style={{
              backgroundColor: "#4A148C",
              color: "white",
              padding: "10px 25px",
              borderRadius: "20px",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            {user?.nome || "Utilizador"}
          </div>
          <div
            style={{
              cursor: "pointer",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.3s ease",
              fontSize: "35px",
              color: "#FFFFFF",
            }}
            onClick={() => setMostrarLogoutDropdown(!mostrarLogoutDropdown)}
          >
            <FaUserCircle />
          </div>
          {mostrarLogoutDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                backgroundColor: "white",
                border: "1px solid #9C27B0",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                zIndex: 1000,
                minWidth: "120px",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  color: "#4A148C",
                  cursor: "pointer",
                }}
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <h2>Instruções</h2>
          <p onClick={() => navigate("/FormAddIntrucao")}>
            Adicionar Instrução
          </p>
          <p onClick={() => navigate("/ViewInstrucoes")}>
            Consultar Instruções
          </p>
          <h2>Ferramentas</h2>
          <p onClick={() => navigate("/showFerramenta")}>
            Consultar Ferramentas
          </p>
          <h2>Componentes</h2>
          <p onClick={() => navigate("/showComponentes")}>
            Consultar Componentes
          </p>
          <h2>EPI</h2>
          <p onClick={() => navigate("/showEpi")}>Consultar EPIs</p>
        </aside>

        <div className="form-section">
          <h1>As suas instruções</h1>
          <div className="card-grid">
            <div
              className="ferramenta-card"
              onClick={() => navigate("/FormAddIntrucao")}
              style={{
                backgroundColor: "#f3f3f3",
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                minWidth: "240px",
                maxWidth: "320px",
                height: "350px",
              }}
            >
              <div
                style={{
                  fontSize: "3.5rem",
                  fontWeight: "bold",
                  color: "#000",
                  marginBottom: "0.5rem",
                }}
              >
                +
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                  color: "#000",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                Nova Instrução
              </h3>
            </div>

            {instrucoes.map((instrucao) => (
              <div
                key={`${instrucao.titulo}-${instrucao.versao}`}
                onClick={() => setSelectedInstrucao(instrucao)}
                className="ferramenta-card"
                style={{ backgroundColor: "#fff", maxWidth: "320px" }}
              >
                <div
                  className="ferramenta-img"
                  style={{ position: "relative" }}
                >
                  <span
                    title={renderStatusLabel(instrucao.status)}
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      zIndex: 2,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: getStatusColor(instrucao.status),
                      border: "3px solid #111",
                      boxShadow: "0 0 2px #888",
                    }}
                  />
                  {instrucao.imagem ? (
                    <img
                      src={`http://localhost:4000/imagens/${instrucao.imagem}`}
                      alt={instrucao.titulo}
                      style={{
                        width: "100%",
                        borderRadius: "12px 12px 0 0",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="img-placeholder"
                      style={{ width: "100%", height: "120px" }}
                    >
                      Imagem
                    </div>
                  )}
                </div>
                <div
                  className="ferramenta-info"
                  style={{ textAlign: "center" }}
                >
                  <h3 style={{ margin: 0, fontWeight: "bold" }}>
                    {instrucao.titulo}
                  </h3>
                  <p>{instrucao.descricao?.slice(0, 60)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedInstrucao && (
        <div
          className="popup-overlay"
          onClick={() => setSelectedInstrucao(null)}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedInstrucao.titulo}</h2>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              <p>
                <strong>Versão:</strong> {selectedInstrucao.versao}
              </p>
              <button
                style={{
                  padding: "8px",
                  marginTop: "15px",
                  marginBottom: "15px",
                  fontSize: "0.8rem",
                  backgroundColor: "#9C27B0",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigate(`/ViewVersoes/${selectedInstrucao.titulo}`)
                }
              >
                Ver Versões
              </button>
            </div>
            <p>
              <strong>Categoria:</strong>{" "}
              {categorias[selectedInstrucao.categoria_id] || "Desconhecida"}
            </p>
            <p>
              <strong>Descrição:</strong> {selectedInstrucao.descricao}
            </p>
            <p>
              <span
                title={renderStatusLabel(selectedInstrucao.status)}
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: getStatusColor(selectedInstrucao.status),
                  margin: "0 6px",
                  border: "2px solid #fff",
                  boxShadow: "0 0 2px #888",
                  verticalAlign: "middle",
                }}
              />
              {renderStatusLabel(selectedInstrucao.status)}
            </p>
            {selectedInstrucao.imagem && (
              <img
                src={`http://localhost:4000/imagens/${selectedInstrucao.imagem}`}
                alt="Imagem da instrução"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  marginTop: "1rem",
                }}
              />
            )}
            <button
              className="submit-btn"
              style={{ marginTop: "1rem" }}
              onClick={() =>
                navigate(
                  `/InstrucaoResources/${selectedInstrucao.video_id}/${selectedInstrucao.titulo}/${selectedInstrucao.versao}`,
                  { state: { instrucao: selectedInstrucao } }
                )
              }
            >
              Ver Instrução
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPageCI;
