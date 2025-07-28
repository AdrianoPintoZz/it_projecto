import React, { useEffect, useState } from "react";
import {
  getComponentes,
  getFamilias,
  getImagensComponente,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { FaUserCircle } from "react-icons/fa";

const ViewComponentes = () => {
  const [componentes, setComponentes] = useState([]);
  const [familias, setFamilias] = useState({});
  const [imagensPrincipais, setImagensPrincipais] = useState({});
  const [selectedComponente, setSelectedComponente] = useState(null);
  const [componenteImagens, setComponenteImagens] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [mostrarFiltroCategorias, setMostrarFiltroCategorias] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const tamanhoPagina = 10;
  const navigate = useNavigate();
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function fetchData() {
      const [componentesData, familiasData] = await Promise.all([
        getComponentes(),
        getFamilias(),
      ]);

      const familiaNomeMap = {};
      familiasData.forEach((familia) => {
        familiaNomeMap[familia.id] = familia.nome;
      });

      const imagensData = {};
      for (const componente of componentesData) {
        try {
          const imagens = await getImagensComponente(componente.numero_peca);
          if (imagens.length > 0) {
            imagensData[componente.numero_peca] = imagens[0].caminho;
          }
        } catch (e) {
          console.error("Erro ao carregar imagens de", componente.numero_peca);
        }
      }
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.nome) {
        setUsername(storedUser.nome);
      }

      setImagensPrincipais(imagensData);
      setComponentes(componentesData);
      setFamilias(familiaNomeMap);
    }

    fetchData();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [searchTerm, categoriasSelecionadas]);

  const closePopup = () => {
    setSelectedComponente(null);
    setComponenteImagens([]);
    setPreviewIndex(0);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user"));

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

  const componentesFiltrados = componentes.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.nome.toLowerCase().includes(term) ||
      item.descricao?.toLowerCase().includes(term) ||
      item.numero_peca.toLowerCase().includes(term);

    const matchesCategoria =
      categoriasSelecionadas.length === 0 ||
      categoriasSelecionadas.includes(item.id_categoria_comp);

    return matchesSearch && matchesCategoria;
  });

  const totalPaginas = Math.ceil(componentesFiltrados.length / tamanhoPagina);
  const componentesPagina = componentesFiltrados.slice(
    (paginaAtual - 1) * tamanhoPagina,
    paginaAtual * tamanhoPagina
  );

  return (
    <div className="app-wrapper">
      <header className="top-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", backgroundColor: "#6A1B9A", borderBottom: "2px solid #4A148C" }}>
        <div className="logo" onClick={handleLogoClick} style={{ fontSize: "24px", fontWeight: "bold", color: "#FFFFFF", cursor: "pointer" }}>
          STEP BY STEP
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px", position: "relative" }}>
          <div style={{ backgroundColor: "#4A148C", color: "white", padding: "10px 25px", borderRadius: "20px", fontSize: "16px", fontWeight: "500", letterSpacing: "0.5px" }}>
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
            <div style={{ position: "absolute", top: "100%", right: 0, backgroundColor: "white", border: "1px solid #9C27B0", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 1000, minWidth: "120px", marginTop: "8px" }}>
              <div style={{ padding: "12px 16px", color: "#4A148C", cursor: "pointer" }} onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <h2>Instruções</h2>
          {user?.role === "criador_instrucoes" && <p onClick={() => navigate("/FormAddIntrucao")}>Adicionar Instrução</p>}
          <p onClick={() => navigate("/ViewInstrucoes")}>Consultar Instruções</p>
          <h2>Ferramentas</h2>
          {user?.role === "admin" && <p onClick={() => navigate("/addFerramenta")}>Adicionar Ferramenta</p>}
          <p onClick={() => navigate("/showFerramenta")}>Consultar Ferramentas</p>
          <h2>Componentes</h2>
          {user?.role === "admin" && <p onClick={() => navigate("/addComponente")}>Adicionar Componente</p>}
          <p className="active">Consultar Componentes</p>
          <h2>EPI</h2>
          {user?.role === "admin" && <p onClick={() => navigate("/FormEPI")}>Adicionar EPI</p>}
          <p onClick={() => navigate("/showEpi")}>Consultar EPIs</p>
          {user?.role === "admin" && (
            <>
              <h2>Utilizadores</h2>
              <p onClick={() => navigate("/ListaUsers")}>Administrar Utilizadores</p>
              <h2>Categorias</h2>
              <p onClick={() => navigate("/addCategoria")}>Adicionar Categoria</p>
              <p onClick={() => navigate("/showCategorias")}>Consultar Categorias</p>
            </>
          )}
        </aside>

        <div className="form-section">
          <h1 style={{ textAlign: "center" }}>Consultar Componentes</h1>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input search-input"
              style={{ width: "340px", height: "36px", borderRadius: "8px" }}
            />

            <div style={{ position: "relative" }}>
              <button
                className="input"
                onClick={() => setMostrarFiltroCategorias(!mostrarFiltroCategorias)}
                style={{ width: "180px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span>Filtrar Categorias</span>
                <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="#555">
                  <path d="M10 18h4v-2h-4v2zm-7-7v2h18v-2H3zm3-5v2h12V6H6z" />
                </svg>
              </button>

              {mostrarFiltroCategorias && (
                <div className="popup-content" style={{ position: "absolute", marginTop: "0.5rem", zIndex: 10 }}>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: "12px" }}>
                      <button onClick={() => setCategoriasSelecionadas([])} style={{ border: "none", background: "none", cursor: "pointer", color: "gray" }}>
                        Eliminar Seleções
                      </button>
                    </li>
                    {Object.entries(familias).map(([id, nome]) => (
                      <label key={id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 6px" }}>
                        <input
                          type="checkbox"
                          checked={categoriasSelecionadas.includes(parseInt(id))}
                          onChange={() =>
                            setCategoriasSelecionadas((prev) =>
                              prev.includes(parseInt(id))
                                ? prev.filter((cid) => cid !== parseInt(id))
                                : [...prev, parseInt(id)]
                            )
                          }
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
            {componentesPagina.map((item) => (
              <div
                className="ferramenta-card"
                key={item.numero_peca}
                onClick={async () => {
                  setSelectedComponente(item);
                  const imagens = await getImagensComponente(item.numero_peca);
                  setComponenteImagens(imagens);
                  setPreviewIndex(0);
                }}
              >
                <div className="ferramenta-img">
                  {imagensPrincipais[item.numero_peca] ? (
                    <img src={`http://localhost:4000/imagens/${imagensPrincipais[item.numero_peca]}`} alt={item.nome} />
                  ) : (
                    <div className="img-placeholder">Imagem</div>
                  )}
                </div>
                <div className="ferramenta-info" style={{ textAlign: "center", position: "relative" }}>
                  <h3 style={{ margin: "0 auto" }}>{item.nome}</h3>
                  {user?.role === "admin" && (
                    <button
                      className="edit-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/editarComponente/${item.numero_peca}`);
                      }}
                    >
                      ✎
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pagination" style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "2.5rem 0 1.5rem 0", gap: "18px" }}>
            <button
              onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaAtual === 1}
              style={{ background: paginaAtual === 1 ? "#e0e0e0" : "#6A1B9A", color: paginaAtual === 1 ? "#888" : "#fff", border: "none", borderRadius: "20px", padding: "8px 22px", fontWeight: "bold", fontSize: "1rem", cursor: paginaAtual === 1 ? "not-allowed" : "pointer", transition: "background 0.2s", boxShadow: "0 2px 8px rgba(106,27,154,0.08)" }}
            >
              ◀ Anterior
            </button>

            <span style={{ margin: "0 12px", fontWeight: "bold", fontSize: "1.08rem", color: "#4A148C", letterSpacing: "0.5px" }}>
              Página {paginaAtual} de {totalPaginas}
            </span>

            <button
              onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaAtual === totalPaginas}
              style={{ background: paginaAtual === totalPaginas ? "#e0e0e0" : "#6A1B9A", color: paginaAtual === totalPaginas ? "#888" : "#fff", border: "none", borderRadius: "20px", padding: "8px 22px", fontWeight: "bold", fontSize: "1rem", cursor: paginaAtual === totalPaginas ? "not-allowed" : "pointer", transition: "background 0.2s", boxShadow: "0 2px 8px rgba(106,27,154,0.08)" }}
            >
              Seguinte ▶
            </button>
          </div>
        </div>
      </div>

      {selectedComponente && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedComponente.nome}</h2>
            <p><strong>Referência:</strong> {selectedComponente.numero_peca}</p>
            <p><strong>Categoria:</strong> {familias[selectedComponente.id_categoria_comp] || "Desconhecida"}</p>
            <p><strong>Descrição:</strong> {selectedComponente.descricao}</p>
            {componenteImagens.length > 0 && (
              <div className="popup-carousel image-preview" style={{ marginTop: "0.5rem" }}>
                <div className="carousel" style={{ position: "relative" }}>
                  {componenteImagens.length > 1 && (
                    <button className="carousel-btn left" onClick={() => setPreviewIndex((previewIndex - 1 + componenteImagens.length) % componenteImagens.length)}>
                      ❮
                    </button>
                  )}
                  <img src={`http://localhost:4000/imagens/${componenteImagens[previewIndex].caminho}`} alt="Componente" 
                   style={{ width: "100%",maxHeight: "240px", maxWidth:"250px", marginTop: "1rem", borderRadius: "10px" }}
                   />
                  {componenteImagens.length > 1 && (
                    <button className="carousel-btn right" onClick={() => setPreviewIndex((previewIndex + 1) % componenteImagens.length)}>
                      ❯
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewComponentes;
