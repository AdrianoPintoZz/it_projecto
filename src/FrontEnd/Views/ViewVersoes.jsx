import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { FaUserCircle } from "react-icons/fa";

const ViewVersoes = () => {
  const { titulo } = useParams();
  const [versoes, setVersoes] = useState([]);
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchVersoes() {
      try {
        const res = await fetch(`http://localhost:4000/instrucoes/versoes/${encodeURIComponent(titulo)}`);
        const data = await res.json();
        setVersoes(Array.isArray(data) ? data : []);  
      } catch (err) {
        console.error("Erro ao buscar versões:", err);
        setVersoes([]); 
      }
    }
    fetchVersoes();
  }, [titulo]);

  const handleLogoClick = () => {
    if (!user || !user.role) return navigate("/login");
    switch (user.role) {
      case "admin": return navigate("/MainPageAdmin");
      case "user": return navigate("/MainPageUser");
      default: return navigate("/MainPageCI");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNovaVersaoClick = () => {
    const ultimaVersao = versoes.length > 0 ? Math.max(...versoes.map(v => v.versao)) : 0;
    navigate(`/NovaVersao/${encodeURIComponent(titulo)}/${ultimaVersao + 1}`);
  };

  function getStatusColor(status) {
  switch (status) {
    case "ativa":
      return "#43a047";
    case "em_processo":
      return "#fb8c00";
    case "desativada":
      return "#e53935";
    default:
      return "#bbb";
  }
}


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
        <div className="form-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ textAlign: "center", margin: 0 }}>Versões de {titulo}</h1>
            {user?.role === "criador_instrucoes" && (
              <button
                onClick={handleNovaVersaoClick}
                style={{
                  marginLeft: "auto",
                  background: "#6A1B9A",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "10px 28px",
                  fontWeight: "bold",
                  fontSize: "1.08rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(106,27,154,0.08)",
                  transition: "background 0.2s",
                  marginTop: "0.5rem"
                }}
                onMouseOver={e => e.target.style.background = "#8e24aa"}
                onMouseOut={e => e.target.style.background = "#6A1B9A"}
              >
                + Nova Versão
              </button>
            )}
          </div>
          <div className="card-grid">
            {versoes.map((item) => (
              <div
                key={item.versao}
                className="ferramenta-card"
                onClick={() =>
                  navigate(`/InstrucaoResources/${item.video_id}/${item.titulo}/${item.versao}`, {
                    state: { instrucao: item },
                    
                  })
                }
              >
                <div className="ferramenta-img" style={{ position: "relative" }}>
                <span
                  title={item.status}
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 2,
                    display: "inline-block",
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: getStatusColor(item.status),
                    border: "3px solid #111",
                    boxShadow: "0 0 2px #888",
                  }}
                />
                {item.imagem ? (
                  <img
                    src={`http://localhost:4000/imagens/${item.imagem}`}
                    alt={`Versão ${item.versao}`}
                    style={{ width: "100%", borderRadius: "12px 12px 0 0", objectFit: "cover" }}
                  />
                ) : (
                  <div className="img-placeholder">Imagem</div>
                )}
              </div>

                <div className="ferramenta-info" style={{ textAlign: "center" }}>
                  <h3>Versão {item.versao}</h3>
                  <p style={{ fontSize: "0.85rem", color: "#666" }}>
                    Atualizado em: {new Date(item.updated_on).toLocaleDateString("pt-PT")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewVersoes;
