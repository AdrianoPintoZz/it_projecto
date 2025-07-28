import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { FaUserCircle } from "react-icons/fa";

function getStatusColor(status) {
  switch (status) {
    case "ativa":
      return "#43a047";
    case "desativada":
      return "#e53935";
    case "em_processo":
      return "#fb8c00";
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

const ListInstrucoesTrabalho = () => {
  const [instrucoes, setInstrucoes] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [mostrarFiltroCategorias, setMostrarFiltroCategorias] = useState(false);
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);
  const [selectedInstrucao, setSelectedInstrucao] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

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
        const todas = await res.json();

        const agrupadas = todas.reduce((acc, instrucao) => {
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
      } catch (error) {
        console.error("Erro ao buscar instruções:", error);
      }
    }

    fetchCategorias();
    fetchInstrucoes();
  }, []);

  const filteredInstrucoes = instrucoes.filter((instrucao) => {
    const termo = searchTerm.toLowerCase();
    const matchesSearch =
      instrucao.titulo.toLowerCase().includes(termo) ||
      instrucao.descricao?.toLowerCase().includes(termo);

    const matchesCategoria =
      categoriasSelecionadas.length === 0 ||
      categoriasSelecionadas.includes(instrucao.categoria_id);

    return matchesSearch && matchesCategoria;
  });

  const handleLogoClick = () => {
    if (!user || !user.role) {
      navigate("/login");
      return;
    }

    switch (user.role) {
      case "admin":
        navigate("/MainPageAdmin");
        break;
      case "user":
        navigate("/MainPageUser");
        break;
      default:
        navigate("/MainPageCI");
    }
  };

  return (
    <div className="app-wrapper">
      <header
        className="top-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          backgroundColor: "#6A1B9A",
          borderBottom: "2px solid #4A148C",
        }}
      >
        <div
          className="logo"
          onClick={handleLogoClick}
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
              letterSpacing: "0.5px",
            }}
          >
            {user?.nome || "Utilizador"}
          </div>

          <div
            style={{
              cursor: "pointer",
              padding: "12px",
              borderRadius: "50%",
              fontSize: "35px",
              lineHeight: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.3s ease",
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
          {user?.role === "criador_instrucoes" && (
            <p onClick={() => navigate("/FormAddIntrucao")}>
              Adicionar Instrução
            </p>
          )}
          <p className="active">Consultar Instruções</p>

          <h2>Ferramentas</h2>
          {user?.role === "admin" && (
            <p onClick={() => navigate("/addFerramenta")}>
              Adicionar Ferramenta
            </p>
          )}
          <p onClick={() => navigate("/showFerramenta")}>
            Consultar Ferramentas
          </p>

          <h2>Componentes</h2>
          {user?.role === "admin" && (
            <p onClick={() => navigate("/addComponente")}>
              Adicionar Componente
            </p>
          )}
          <p onClick={() => navigate("/showComponentes")}>
            Consultar Componentes
          </p>

          <h2>EPI</h2>
          {user?.role === "admin" && (
            <p onClick={() => navigate("/FormEpi")}>Adicionar EPI</p>
          )}
          <p onClick={() => navigate("/showEpi")}>Consultar EPIs</p>

          {user?.role === "admin" && (
            <>
              <h2>Utilizadores</h2>
              <p onClick={() => navigate("/ListaUsers")}>
                Administrar Utilizadores
              </p>

              <h2>Categorias</h2>
              <p onClick={() => navigate("/addCategoria")}>
                Adicionar Categoria
              </p>
              <p onClick={() => navigate("/showCategorias")}>
                Consultar Categorias
              </p>
            </>
          )}
        </aside>

        <div className="form-section">
          <h1 style={{ textAlign: "center" }}>
            Consultar Instruções de Trabalho
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input search-input"
              style={{
                width: "340px",
                height: "36px",
                borderRadius: "8px",
              }}
            />

            <div style={{ position: "relative" }}>
              <button
                className="input"
                onClick={() =>
                  setMostrarFiltroCategorias(!mostrarFiltroCategorias)
                }
                style={{
                  width: "180px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Filtrar Categorias</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18"
                  viewBox="0 0 24 24"
                  width="18"
                  fill="#555"
                >
                  <path d="M10 18h4v-2h-4v2zm-7-7v2h18v-2H3zm3-5v2h12V6H6z" />
                </svg>
              </button>

              {mostrarFiltroCategorias && (
                <div
                  className="popup-content"
                  style={{
                    position: "absolute",
                    marginTop: "0.5rem",
                    zIndex: 10,
                  }}
                >
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: "12px" }}>
                      <button
                        onClick={() => setCategoriasSelecionadas([])}
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          color: "gray",
                        }}
                      >
                        Eliminar Seleções
                      </button>
                    </li>
                    {Object.entries(categorias).map(([id, nome]) => (
                      <label
                        key={id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "4px 6px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={categoriasSelecionadas.includes(
                            parseInt(id)
                          )}
                          onChange={() => {
                            setCategoriasSelecionadas((prev) =>
                              prev.includes(parseInt(id))
                                ? prev.filter((cid) => cid !== parseInt(id))
                                : [...prev, parseInt(id)]
                            );
                          }}
                        />
                        <span>{nome}</span>
                      </label>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="card-grid">
            {filteredInstrucoes.map((instrucao) => (
              <div
                className="ferramenta-card"
                key={`${instrucao.titulo}-${instrucao.versao}`}
                onClick={() => setSelectedInstrucao(instrucao)}
                style={{ position: "relative" }}
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
                      display: "inline-block",
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
                    <div className="img-placeholder">Imagem</div>
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
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <p>
                <strong>Versão:</strong> {selectedInstrucao.versao}
              </p>
              <button
                style={{
                  padding: "4px 8px",
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
                  marginLeft: 6,
                  marginRight: 6,
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
              onClick={() =>
                navigate(
                  `/InstrucaoResources/${selectedInstrucao.video_id}/${selectedInstrucao.titulo}/${selectedInstrucao.versao}`,
                  {
                    state: { instrucao: selectedInstrucao },
                  }
                )
              }
              style={{ marginTop: "1rem" }}
            >
              Ver Instrução
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListInstrucoesTrabalho;
