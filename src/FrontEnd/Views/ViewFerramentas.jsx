import React, { useEffect, useState } from "react";
import { getFerramentas, getCategorias } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { FaUserCircle } from "react-icons/fa";

const ViewFerramentas = () => {
  const [ferramentas, setFerramentas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [mostrarFiltroCategorias, setMostrarFiltroCategorias] = useState(false);
  const [selectedFerramenta, setSelectedFerramenta] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const tamanhoPagina = 10;
  const navigate = useNavigate();
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      const data = await getFerramentas();
      setFerramentas(data);

      const categorias = await getCategorias();
      setCategorias(categorias);

      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.nome) {
        setUsername(storedUser.nome);
      }
    }
    fetchData();
  }, []);

  const ferramentasFiltradas = ferramentas
    .filter((item) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        item.nome.toLowerCase().includes(term) ||
        item.descricao?.toLowerCase().includes(term) ||
        item.numero_peca.toLowerCase().includes(term);

      const matchesCategoria =
        categoriasSelecionadas.length === 0 ||
        categoriasSelecionadas.includes(item.id_categoria_ferr);

      return matchesSearch && matchesCategoria;
    });

  const totalPaginas = Math.ceil(ferramentasFiltradas.length / tamanhoPagina);
  const ferramentasPagina = ferramentasFiltradas.slice(
    (paginaAtual - 1) * tamanhoPagina,
    paginaAtual * tamanhoPagina
  );

  const closePopup = () => setSelectedFerramenta(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [username, setUsername] = useState("");

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

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
          {user?.role === "criador_instrucoes" && (
            <p onClick={() => navigate("/FormAddIntrucao")}>Adicionar Instrução</p>
          )}
          <p onClick={() => navigate("/ViewInstrucoes")}>Consultar Instruções</p>
          <h2>Ferramentas</h2>
          {user?.role === "admin" && (
            <p onClick={() => navigate("/addFerramenta")}>Adicionar Ferramenta</p>
          )}
          <p className="active" onClick={() => navigate("/showFerramenta")}>Consultar Ferramentas</p>
          <h2>Componentes</h2>
          {user?.role === "admin" && (
            <p onClick={() => navigate("/addComponente")}>Adicionar Componente</p>
          )}
          <p onClick={() => navigate("/showComponentes")}>Consultar Componentes</p>
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
          <h1 style={{ textAlign: "center" }}>Consultar Ferramentas</h1>

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
                    {categorias.map((cat) => (
                      <label key={cat.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 6px" }}>
                        <input
                          type="checkbox"
                          checked={categoriasSelecionadas.includes(cat.id)}
                          onChange={() => {
                            setCategoriasSelecionadas((prev) =>
                              prev.includes(cat.id)
                                ? prev.filter((cid) => cid !== cat.id)
                                : [...prev, cat.id]
                            );
                          }}
                        />
                        <span>{cat.nome}</span>
                      </label>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="card-grid">
            {ferramentasPagina.map((item) => (
              <div
                className="ferramenta-card"
                key={item.numero_peca}
                onClick={() => setSelectedFerramenta(item)}
              >
                <div className="ferramenta-img">
                  {item.imagem ? (
                    <img src={`http://localhost:4000/imagens/${item.imagem}`} alt={item.nome} />
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
                        navigate(`/editarFerramenta/${item.numero_peca}`);
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
                style={{
                  background: paginaAtual === 1 ? "#e0e0e0" : "#6A1B9A",
                  color: paginaAtual === 1 ? "#888" : "#fff",
                  border: "none",
                  borderRadius: "20px",
                  padding: "8px 22px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: paginaAtual === 1 ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                  boxShadow: "0 2px 8px rgba(106,27,154,0.08)"
                }}
              >
                ◀ Anterior
              </button>

              <span style={{ margin: "0 12px", fontWeight: "bold", fontSize: "1.08rem", color: "#4A148C", letterSpacing: "0.5px" }}>
                Página {paginaAtual} de {totalPaginas}
              </span>

              <button
                onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
                style={{
                  background: paginaAtual === totalPaginas ? "#e0e0e0" : "#6A1B9A",
                  color: paginaAtual === totalPaginas ? "#888" : "#fff",
                  border: "none",
                  borderRadius: "20px",
                  padding: "8px 22px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: paginaAtual === totalPaginas ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                  boxShadow: "0 2px 8px rgba(106,27,154,0.08)"
                }}
              >
                Seguinte ▶
              </button>
            </div>

        </div>
      </div>

      {selectedFerramenta && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedFerramenta.nome}</h2>
            <strong>Referência:</strong> {selectedFerramenta.numero_peca}
            <p><strong>Categoria:</strong> {categorias.find((cat) => cat.id === selectedFerramenta.id_categoria_ferr)?.nome || "Desconhecida"}</p>
            <p><strong>Descrição:</strong> {selectedFerramenta.descricao}</p>
            {selectedFerramenta.imagem && (
              <img
                src={`http://localhost:4000/imagens/${selectedFerramenta.imagem}`}
                alt={selectedFerramenta.nome}
                style={{ width: "100%",maxHeight: "240px", maxWidth:"250px", marginTop: "1rem", borderRadius: "10px" }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFerramentas;
