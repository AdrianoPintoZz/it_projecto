import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const perguntas = [
  "Compreendi todos os passos da instrução?",
  "Sinto-me capaz de executar a instrução sozinho?",
  "Os recursos apresentados foram suficientes?",
  "O vídeo foi claro e objetivo?",
  "Tenho dúvidas sobre algum ponto da instrução?",
  "Se tivesse de repetir, conseguiria sem ajuda?",
  "O tempo do vídeo foi adequado?",
  "Os exemplos práticos foram úteis?",
  "A linguagem utilizada foi acessível?",
];

const opcoes = [
  "Nada",
  "Pouco",
  "Razoável",
  "Bastante",
  "Totalmente"
];

const FormularioAutoavaliacao = () => {
  const [respostas, setRespostas] = useState(Array(perguntas.length).fill(""));
  const [submetido, setSubmetido] = useState(false);

  const navigate = useNavigate();
  const { videoId, titulo, versao } = useParams();

  // Simulação de user para header (podes trocar pelo real)
  const user = JSON.parse(localStorage.getItem("user")) || { nome: "Utilizador" };
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);

  const handleResposta = (idx, valor) => {
    const novas = [...respostas];
    novas[idx] = valor;
    setRespostas(novas);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmetido(true);
    setTimeout(() => {
      window.alert("Obrigado pela sua opinião!");
      // Redireciona para a main page do user
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "user") {
        navigate("/MainPageUser");
      } else if (user?.role === "criador_instrucoes") {
        navigate("/MainPageCI");
      } else if (user?.role === "admin") {
        navigate("/MainPageAdmin");
      } else {
        navigate("/login");
      }
    }, 500); // 0.5s depois de submeter
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLogoClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "user") {
      navigate("/MainPageUser");
    } else if (user?.role === "criador_instrucoes") {
      navigate("/MainPageCI");
    } else if (user?.role === "admin") {
      navigate("/MainPageAdmin");
    } else {
      navigate("/login");
    }
  };

  return (
    <div style={{ background: "#faf7fd",overflowX: "hidden" }}>
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
                  <div style={{ position: "absolute", top: "100%", right: 0, backgroundColor: "white", border: "1px solid #9C27B0", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 1000, minWidth: "120px", marginTop: "8px" }}>
                    <div style={{ padding: "12px 16px", color: "#4A148C", cursor: "pointer" }} onClick={handleLogout}>
                      Logout
                    </div>
                  </div>
                )}
              </div>
            </header>
      <div style={{ display: "flex", marginLeft: "2%", marginTop: "1%" }}>
        <nav
          style={{
            borderRadius: "14px",
            padding: "18px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "18px",
            minWidth: "140px",
            marginRight: "18px",
            marginTop: "0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            height: "auto",
          }}
        >
          <button
            style={navBtnStyle}
            onClick={() =>
              navigate(
                `/InstrucaoResources/${videoId || "1"}/${titulo || "Titulo"}/${versao || "1"}`
              )
            }
          >
            Recursos
          </button>
          <button
            style={navBtnStyle}
            onClick={() =>
              navigate(
                `/ViewVideos/${videoId || "1"}`
              )
            }
          >
            Vídeo
          </button>
          <button
            style={{
              ...navBtnStyle,
              background: "#ede7f6",
              color: "#6A1B9A",
              fontWeight: "bold",
              border: "2px solid #6A1B9A",
              cursor: "not-allowed",
              opacity: 0.7,
            }}
            disabled
          >
            Avaliar
          </button>
        </nav>
        <div style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}>
          <div style={{
            maxWidth: "60%",
            width: "100%",
            background: "#fff",
            borderRadius: "14px",
            boxShadow: "0 2px 12px rgba(44,19,56,0.10)",
            padding: "32px 28px",
            overflow: "visible"
          }}>
            <h2 style={{
              textAlign: "center",
              color: "#6A1B9A",
              marginBottom: 30,
              fontWeight: 700
            }}>
              Autoavaliação da Instrução
            </h2>
            <form onSubmit={handleSubmit}>
              <table style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                marginBottom: 28,
                tableLayout: "fixed"
              }}>
                <thead>
                  <tr>
                    <th style={{
                      textAlign: "left",
                      paddingBottom: 14,
                      width: "44%"
                    }}></th>
                    {opcoes.map((op, i) => (
                      <th
                        key={i}
                        style={{
                          textAlign: "center",
                          fontWeight: 500,
                          color: "#6A1B9A",
                          paddingBottom: 14,
                          width: `${56 / opcoes.length}%`
                        }}
                      >
                        {op}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {perguntas.map((pergunta, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{
                        padding: "18px 10px",
                        fontWeight: 500,
                        background: idx % 2 === 0 ? "#faf7fd" : "#fff",
                        minWidth: 220,
                        maxWidth: 350,
                        wordBreak: "break-word"
                      }}>
                        {pergunta}
                      </td>
                      {opcoes.map((op, i) => (
                        <td key={i} style={{
                          textAlign: "center",
                          background: idx % 2 === 0 ? "#faf7fd" : "#fff",
                          padding: "0 0",
                          width: "11%",
                        }}>
                          <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 38,
                          }}>
                            <input
                              type="radio"
                              name={`pergunta${idx}`}
                              value={op}
                              checked={respostas[idx] === op}
                              onChange={() => handleResposta(idx, op)}
                              required={i === 0}
                              style={{
                                accentColor: "#6A1B9A",
                                width: 24,
                                height: 24,
                                margin: "0 12px",
                              }}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="submit"
                style={{
                  background: "#6A1B9A",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 34px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  display: "block",
                  margin: "0 auto"
                }}
              >
                Submeter autoavaliação
              </button>
              {submetido && (
                <div style={{ color: "#43a047", marginTop: 18, textAlign: "center" }}>
                  Obrigado pela sua autoavaliação!
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioAutoavaliacao;

const navBtnStyle = {
  background: "#fff",
  color: "#6A1B9A",
  border: "1px solid #b39ddb",
  borderRadius: "6px",
  padding: "10px 18px",
  fontWeight: "bold",
  fontSize: "15px",
  cursor: "pointer",
  width: "120px",
  marginBottom: "2px",
  transition: "background 0.2s, color 0.2s",
  boxSizing: "border-box",
  textAlign: "center", // <-- Corrige aqui
};

navBtnStyle["&:hover"] = {
  background: "#f3e5f5",
  color: "#4A148C",
};