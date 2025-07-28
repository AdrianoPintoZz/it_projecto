import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFerramentasAssociados,
  getComponentesAssociados,
  getEpisAssociados,
  getImagensComponente,
} from "../services/api";
import { FaUserCircle } from "react-icons/fa";

const InstrucaoResources = () => {
  const { titulo, versao, videoId } = useParams();
  const [ferramentas, setFerramentas] = useState([]);
  const [componentes, setComponentes] = useState([]);
  const [epis, setEpis] = useState([]);
  const [imagensSelecionadas, setImagensSelecionadas] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [componenteSelecionado, setComponenteSelecionado] = useState(null);
  const [imagensPrincipais, setImagensPrincipais] = useState({}); 
  const [modalFerramentaAberto, setModalFerramentaAberto] = useState(false);
  const [ferramentaSelecionada, setFerramentaSelecionada] = useState(null);
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!titulo || !versao) return;
    getFerramentasAssociados(titulo, versao).then(setFerramentas);
    getComponentesAssociados(titulo, versao).then(async (comps) => {
      setComponentes(comps);

      const imagensObj = {};
      for (const comp of comps) {
        try {
          const imagens = await getImagensComponente(comp.numero_peca);
          if (imagens.length > 0) {
            imagensObj[comp.numero_peca] = imagens[0].caminho;
          }
        } catch (e) {
        }
      }
      setImagensPrincipais(imagensObj);
    });
    getEpisAssociados(titulo, versao).then(setEpis);
  }, [titulo, versao]);

  const abrirModalComponente = async (componente) => {
    try {
      const imagens = await getImagensComponente(componente.numero_peca);
      setImagensSelecionadas(imagens.map((i) => i.caminho));
      setComponenteSelecionado(componente);
      setModalAberto(true);
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
    }
  };

  const fecharModal = () => {
    setModalAberto(false);
    setImagensSelecionadas([]);
    setComponenteSelecionado(null);
  };

  return (
    <div>
      <header className="top-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", backgroundColor: "#6A1B9A", borderBottom: "2px solid #4A148C" }}>
              <div className="logo" onClick={handleLogoClick}  style={{ fontSize: "24px", fontWeight: "bold", color: "#FFFFFF", cursor: "pointer" }}>
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
      <div style={{ display: "flex", marginLeft: "2%", marginTop: "1" }}>
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
            style={{
              ...navBtnStyle,
              background: "#ede7f6",
              textAlign: "center",
              color: "#6A1B9A",
              fontWeight: "bold",
              border: "2px solid #6A1B9A",
              cursor: "not-allowed",
              opacity: 0.7,
              marginTop: "12%",
            }}
            disabled
          >
            Recursos
          </button>
          <button
            style={{...navBtnStyle,textAlign: "center",}}
            onClick={() =>
              navigate(`/ViewVideos/${videoId}`)
            }
          >
            Vídeo
          </button>
          {user?.role !== "criador_instrucoes" && (
            <button
              style={navBtnStyle}
              onClick={() =>
                navigate(`/Formulario/${videoId}/${titulo}/${versao}`)
              }
            >
              Avaliar
            </button>
          )}
        </nav>
        <div style={{ flex: 1 }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                gap: 32,
                alignItems: "flex-start",
                justifyContent: "center",
                marginBottom: 36,
              }}
            >
              <div style={{ flex: 1 }}>
                <h2>Ferramentas utilizadas nesta instrução</h2>
                <div
                  style={{
                    maxHeight: ferramentas.length >= 7 ? 240 : "none",
                    overflowY: ferramentas.length >= 7 ? "auto" : "visible",
                    paddingRight: ferramentas.length >= 7 ? 6 : 0,
                    transition: "max-height 0.2s",
                  }}
                >
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {ferramentas.length === 0 && <li>Nenhuma ferramenta associada.</li>}
                    {ferramentas.map((ferr) => (
                      <li
                        key={ferr.numero_peca}
                        style={{
                          marginBottom: 12,
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #bbb",
                          borderRadius: "10px",
                          background: "#fff",
                          padding: "8px 0",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                          cursor: ferr.imagem ? "pointer" : "default",
                        }}
                        onClick={() => {
                          setFerramentaSelecionada(ferr);
                          setModalFerramentaAberto(true);
                        }}
                      >
                        {ferr.imagem ? (
                          <img
                            src={`http://localhost:4000/imagens/${ferr.imagem}`}
                            alt={ferr.nome}
                            style={{ width: 40, height: 28, objectFit: "contain", marginRight: 12, marginLeft: 8 }}
                          />
                        ) : (
                          <span style={{ width: 40, height: 28, marginRight: 12, marginLeft: 8, display: "inline-block" }} />
                        )}
                        <div>
                          <div style={{ fontWeight: "bold" }}>
                            {ferr.nome} <span style={{ color: "#555" }}>({ferr.numero_peca})</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h2>Componentes utilizados nesta instrução</h2>
                <div
                  style={{
                    maxHeight: componentes.length >= 7 ? 240 : "none",
                    overflowY: componentes.length >= 7 ? "auto" : "visible",
                    paddingRight: componentes.length >= 7 ? 6 : 0,
                    transition: "max-height 0.2s",
                  }}
                >
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {componentes.length === 0 && <li>Nenhum componente associado.</li>}
                    {componentes.map((comp) => (
                      <li
                        key={comp.numero_peca}
                        style={{
                          marginBottom: 12,
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #bbb",
                          borderRadius: "10px",
                          background: "#fff",
                          padding: "8px 0",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                          cursor: imagensPrincipais[comp.numero_peca] ? "pointer" : "default",
                        }}
                        onClick={() => imagensPrincipais[comp.numero_peca] && abrirModalComponente(comp)}
                      >
                        {imagensPrincipais[comp.numero_peca] ? (
                          <img
                            src={`http://localhost:4000/imagens/${imagensPrincipais[comp.numero_peca]}`}
                            alt={comp.nome}
                            style={{ width: 40, height: 28, objectFit: "contain", marginRight: 12, marginLeft: 8 }}
                          />
                        ) : (
                          <span style={{ width: 40, height: 28, marginRight: 12, marginLeft: 8, display: "inline-block" }} />
                        )}
                        <div>
                          <div style={{ fontWeight: "bold" }}>
                            {comp.nome} <span style={{ color: "#555" }}>({comp.numero_peca})</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <h2 style={{ marginTop: 32, color: "#b71c1c" }}>Aviso</h2>
            <div style={{ background: "#fff3cd", padding: 16, borderRadius: 8, marginBottom: 16 }}>
              <strong>
                Antes do realizamento desta instrução deverá ter os seguintes equipamentos de segurança:
              </strong>
              <div
                style={{
                  maxHeight: epis.length > 6 ? 200 : "auto",
                  overflowY: epis.length > 6 ? "auto" : "visible",
                  paddingRight: epis.length > 6 ? 6 : 0,
                }}
              >
                <ul style={{ marginTop: 12, paddingRight: 6 }}>
                  {epis.length === 0 && <li>Nenhum EPI associado.</li>}
                  {epis.map((epi) => (
                    <li key={epi.numero_peca} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                      {epi.imagem && (
                        <img
                          src={`http://localhost:4000/imagens/${epi.imagem}`}
                          alt={epi.nome}
                          style={{ width: 40, height: 28, objectFit: "contain", marginRight: 8 }}
                        />
                      )}
                      {epi.nome} ({epi.numero_peca})
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {modalAberto && componenteSelecionado && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  background: "rgba(0,0,0,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                }}
                onClick={fecharModal}
              >
                <div
                  style={{
                    background: "#fff",
                    padding: 24,
                    borderRadius: 12,
                    width: 500, 
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    textAlign: "center",
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <h2 style={{ marginBottom: 16 }}>Informação do Componente</h2>
                  <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 8 }}>
                    {componenteSelecionado.nome}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Referência:</strong> {componenteSelecionado.numero_peca}
                  </div>
                  {componenteSelecionado.descricao && (
                    <div style={{ marginBottom: 16 }}>
                      <strong>Descrição:</strong> {componenteSelecionado.descricao}
                    </div>
                  )}
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                    {imagensSelecionadas.map((img, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "center", width: "40%" }}>
                        <img
                          src={`http://localhost:4000/imagens/${img}`}
                          alt={`Imagem ${i + 1}`}
                          style={{
                            width: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            borderRadius: 8,
                            marginBottom: 12,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <button onClick={fecharModal} 
                  style={{
                      backgroundColor: "#6A1B9A",
                      color: "#fff",
                      border: "none",
                      padding: "8px 20px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      boxShadow: "0 2px 6px rgba(106,27,154,0.15)",
                      transition: "background 0.2s ease",
                      marginLeft: "2%",
                    }}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

            {modalFerramentaAberto && ferramentaSelecionada && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  background: "rgba(0,0,0,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                }}
                onClick={() => setModalFerramentaAberto(false)}
              >
                <div
                  style={{
                    background: "#fff",
                    padding: 24,
                    borderRadius: 12,
                    width: 500,
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    textAlign: "center",
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <h2 style={{ marginBottom: 16 }}>Informação da Ferramenta</h2>
                  <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 8 }}>
                    {ferramentaSelecionada.nome}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Referência:</strong> {ferramentaSelecionada.referencia || ferramentaSelecionada.numero_peca}
                  </div>
                  {ferramentaSelecionada.descricao && (
                    <div style={{ marginBottom: 16 }}>
                      <strong>Descrição:</strong> {ferramentaSelecionada.descricao}
                    </div>
                  )}
                  {ferramentaSelecionada.imagem && (
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                      <img
                        src={`http://localhost:4000/imagens/${ferramentaSelecionada.imagem}`}
                        alt={ferramentaSelecionada.nome}
                        style={{
                          width: "60%",
                          maxHeight: "60%",
                          objectFit: "contain",
                          borderRadius: 8,
                        }}
                      />
                    </div>
                  )}
                  <button onClick={() => setModalFerramentaAberto(false)} 
                  style={{
                      backgroundColor: "#6A1B9A",
                      color: "#fff",
                      border: "none",
                      padding: "8px 20px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      boxShadow: "0 2px 6px rgba(106,27,154,0.15)",
                      transition: "background 0.2s ease",
                    }}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
              <button
                style={{
                  background: "#6A1B9A",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 38px",
                  fontWeight: "bold",
                  fontSize: "1.18rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(106,27,154,0.08)",
                  transition: "background 0.2s",
                  display: "block",
                  marginBottom: "5px",
                }}
                onClick={() => navigate(`/ViewVideos/${videoId}`)}
              >
                Ver Instrução de trabalho
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrucaoResources;

const navBtnStyle = {
  background: "#fff",
  color: "#6A1B9A",
  border: "1px solid #b39ddb",
  borderRadius: "6px",
  padding: "10px 18px 10px 18px",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "15px",
  cursor: "pointer",
  width: "120px",
  marginBottom: "2px",
  transition: "background 0.2s, color 0.2s",
  boxSizing: "border-box",
};