import React, { useEffect, useState } from "react";
import { getEpis } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { FaUserCircle } from "react-icons/fa";

const ShowEpi = () => {
  const [epis, setEpis] = useState([]);
  const [selectedEpi, setSelectedEpi] = useState(null);
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchData() {
      const data = await getEpis();
      setEpis(data);
    }
    fetchData();
  }, []);

  const closePopup = () => setSelectedEpi(null);

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

  const episFiltrados = epis.filter((item) =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.numero_peca.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <p onClick={() => navigate("/ViewInstrucoes")}>
            Consultar Instruções
          </p>
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
          <p className="active">Consultar EPIs</p>
          {user?.role === "admin" && <h2>Utilizadores</h2>}
          {user?.role === "admin" && (
            <p onClick={() => navigate("/ListaUsers")}>
              Administrar Utilizadores
            </p>
          )}
          {user?.role === "admin" && (
            <>
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
          <h1 style={{ textAlign: "center" }}>Consultar EPIs</h1>
          <div
            style={{
              display: "flex",
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
              style={{ width: "500px", height: "36px", borderRadius: "8px" }}
            />
          </div>

          <div className="card-grid">
            {episFiltrados.map((item) => (
              <div
                className="ferramenta-card"
                key={item.numero_peca}
                onClick={() => setSelectedEpi(item)}
              >
                <div className="ferramenta-img">
                  {item.imagem ? (
                    <img
                      src={`http://localhost:4000/imagens/${item.imagem}`}
                      alt={item.nome}
                    />
                  ) : (
                    <div className="img-placeholder">Imagem</div>
                  )}
                </div>
                <div
                  className="ferramenta-info"
                  style={{ textAlign: "center", position: "relative" }}
                >
                  <h3 style={{ margin: "0 auto" }}>{item.nome}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedEpi && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedEpi.nome}</h2>
            <strong>Referência:</strong> {selectedEpi.numero_peca}
            <p>
              <strong>Descrição:</strong> {selectedEpi.descricao}
            </p>
            {selectedEpi.imagem && (
              <img
                src={`http://localhost:4000/imagens/${selectedEpi.imagem}`}
                alt={selectedEpi.nome}
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  borderRadius: "10px",
                  maxHeight: "300px", maxWidth:"250px",
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowEpi;
