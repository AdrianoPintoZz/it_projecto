import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { FaUserCircle } from "react-icons/fa";

const MainPageAdmin = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);

  const [ferramentas, setFerramentas] = useState([]);
  const [componentes, setComponentes] = useState([]);
  const [componentesImagens, setComponentesImagens] = useState({});
  const [selectedFerramenta, setSelectedFerramenta] = useState(null);
  const [selectedComponente, setSelectedComponente] = useState(null);

  const squareCardStyle = {
    aspectRatio: "1 / 1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    cursor: "pointer",
  };

  const addCardStyle = {
    ...squareCardStyle,
    justifyContent: "center",
    alignItems: "center",
  };

  const squareImageStyle = {
    aspectRatio: "1 / 1",
    width: "100%",
    backgroundColor: "#ccc",
    borderRadius: "10px 10px 0 0",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const squareImageImgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const infoStyle = {
    padding: "0.75rem 1rem",
    background: "white",
    borderTop: "1px solid #bbb",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  };

  useEffect(() => {
    fetch("http://localhost:4000/ferramentas")
      .then((res) => res.json())
      .then((data) => setFerramentas(data))
      .catch((err) => console.error("Erro ao buscar ferramentas:", err));

    fetch("http://localhost:4000/componentes")
      .then((res) => res.json())
      .then(async (data) => {
        setComponentes(data);

        const imagensMap = {};
        for (const componente of data) {
          try {
            const res = await fetch(
              `http://localhost:4000/componentes/imagens/${componente.numero_peca}`
            );
            if (res.ok) {
              const imagens = await res.json();
              if (imagens.length > 0) {
                imagensMap[componente.numero_peca] = imagens[0].caminho;
              }
            }
          } catch (e) {
            console.error(
              `Erro ao buscar imagens para componente ${componente.numero_peca}:`,
              e
            );
          }
        }
        setComponentesImagens(imagensMap);
      })
      .catch((err) => console.error("Erro ao buscar componentes:", err));
  }, []);

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
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#FFFFFF",
            cursor: "pointer",
          }}
          onClick={() => navigate("/MainPageAdmin")}
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
          <p onClick={() => navigate("/ViewInstrucoes")}>Consultar Instruções</p>
          <h2>Ferramentas</h2>
          <p onClick={() => navigate("/addFerramenta")}>Adicionar Ferramenta</p>
          <p onClick={() => navigate("/showFerramenta")}>Consultar Ferramentas</p>

          <h2>Componentes</h2>
          <p onClick={() => navigate("/addComponente")}>Adicionar Componente</p>
          <p onClick={() => navigate("/showComponentes")}>Consultar Componentes</p>

          <h2>EPI</h2>
          <p onClick={() => navigate("/FormEpi")}>Adicionar EPI</p>
          <p onClick={() => navigate("/showEpi")}>Consultar EPIs</p>

          <h2>Utilizadores</h2>
          <p onClick={() => navigate("/ListaUsers")}>Administrar Utilizadores</p>

          <h2>Categorias</h2>
          <p onClick={() => navigate("/addCategoria")}>Adicionar Categoria</p>
          <p onClick={() => navigate("/showCategorias")}>Consultar Categorias</p>

        </aside>

        <div className="form-section">
          <h1>Ferramentas</h1>
          <div className="card-grid">
            <div
              className="ferramenta-card"
              onClick={() => navigate("/addFerramenta")}
              style={addCardStyle}
            >
              <div
                style={{
                  fontSize: "3.5rem",
                  fontWeight: "bold",
                  marginBottom: "0.25rem",
                  color: "#000",
                  lineHeight: 1,
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
                }}
              >
                Adicionar Ferramenta
              </h3>
            </div>

            {/* Ferramentas */}
            {ferramentas.slice(0, 3).map((item) => (
              <div
                key={item.numero_peca}
                className="ferramenta-card"
                onClick={() => setSelectedFerramenta(item)}
                style={squareCardStyle}
              >
                <div className="ferramenta-img" style={squareImageStyle}>
                  {item.imagem ? (
                    <img
                      src={`http://localhost:4000/imagens/${item.imagem}`}
                      alt={item.nome}
                      style={squareImageImgStyle}
                    />
                  ) : (
                    <div className="img-placeholder">Imagem</div>
                  )}
                </div>
                <div className="ferramenta-info" style={infoStyle}>
                  <h3 style={{ marginBottom: 0 }}>{item.nome}</h3>
                  <button
                    className="edit-icon"
                    style={{ marginTop: 8 }}
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/editarFerramenta/${item.numero_peca}`);
                    }}
                  >
                    ✎
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h1 style={{ marginTop: "3rem" }}>Componentes</h1>
          <div className="card-grid">
            <div
              className="ferramenta-card"
              onClick={() => navigate("/addComponente")}
              style={addCardStyle}
            >
              <div
                style={{
                  fontSize: "3.5rem",
                  fontWeight: "bold",
                  marginBottom: "0.25rem",
                  color: "#000",
                  lineHeight: 1,
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
                }}
              >
                Adicionar Componente
              </h3>
            </div>

            {/* Componentes */}
            {componentes.slice(0, 3).map((item) => (
              <div
                key={item.numero_peca}
                className="ferramenta-card"
                onClick={() => setSelectedComponente(item)}
                style={squareCardStyle}
              >
                <div className="ferramenta-img" style={squareImageStyle}>
                  {componentesImagens[item.numero_peca] ? (
                    <img
                      src={`http://localhost:4000/imagens/${componentesImagens[item.numero_peca]}`}
                      alt={item.nome || item.numero_peca}
                      style={squareImageImgStyle}
                    />
                  ) : (
                    <div className="img-placeholder">Imagem</div>
                  )}
                </div>
                <div className="ferramenta-info" style={infoStyle}>
                  <h3 style={{ marginBottom: 0 }}>{item.nome || item.numero_peca}</h3>
                  <button
                    className="edit-icon"
                    style={{ marginTop: 8 }}
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/editarComponente/${item.numero_peca}`);
                    }}
                  >
                    ✎
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* POPUP FERRAMENTA */}
      {selectedFerramenta && (
        <div className="popup-overlay" onClick={() => setSelectedFerramenta(null)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedFerramenta.nome}</h2>
            <p><strong>Referência:</strong> {selectedFerramenta.numero_peca}</p>
            <p><strong>Descrição:</strong> {selectedFerramenta.descricao}</p>
            {selectedFerramenta.imagem && (
              <img
                src={`http://localhost:4000/imagens/${selectedFerramenta.imagem}`}
                alt={selectedFerramenta.nome}
                style={{ width: "100%", marginTop: "1rem", borderRadius: "10px" }}
              />
            )}
            <button
              style={{
                marginLeft: 16,
                background: "#eee",
                border: "1px solid #bbb",
                borderRadius: "8px",
                padding: "8px 18px",
                fontSize: "1.1rem",
                cursor: "pointer",
              }}
              onClick={() => setSelectedFerramenta(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {selectedComponente && (
        <div className="popup-overlay" onClick={() => setSelectedComponente(null)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedComponente.nome}</h2>
            <p><strong>Referência:</strong> {selectedComponente.numero_peca}</p>
            <p><strong>Descrição:</strong> {selectedComponente.descricao}</p>
            {componentesImagens[selectedComponente.numero_peca] && (
              <img
                src={`http://localhost:4000/imagens/${componentesImagens[selectedComponente.numero_peca]}`}
                alt={selectedComponente.nome}
                style={{ width: "100%", marginTop: "1rem", borderRadius: "10px" }}
              />
            )}
            <button
              style={{
                marginLeft: 16,
                background: "#eee",
                border: "1px solid #bbb",
                borderRadius: "8px",
                padding: "8px 18px",
                fontSize: "1.1rem",
                cursor: "pointer",
              }}
              onClick={() => setSelectedComponente(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPageAdmin;
