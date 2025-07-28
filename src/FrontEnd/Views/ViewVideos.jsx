import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getVideos,
  getLegendasByVideo,
  getInstrucaoByVideoId,
  getFerramentasAssociados,
  getDestaques,
  getComponentesAssociados,
  getImagensComponente,
  adicionarComentario,
  buscarComentarios,
  updateInstrucao,
  getEpisAssociados,
} from "../services/api";
import "../styles/styles.css";
import { FaUserCircle } from "react-icons/fa";

const ViewVideos = () => {
  const [video, setVideo] = useState(null);
  const [legendas, setLegendas] = useState([]);
  const [ferramentas, setFerramentas] = useState([]);
  const [instrucao, setInstrucao] = useState(null);
  const [componentes, setComponentes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [imagensSelecionadas, setImagensSelecionadas] = useState([]);
  const [imagensPrincipais, setImagensPrincipais] = useState({});
  const [destaques, setDestaques] = useState([]);
  const [ativos, setAtivos] = useState([]);
  const [username, setUsername] = useState("");
  const [estrelas, setEstrelas] = useState(0);
  const [comentarioTexto, setComentarioTexto] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const navigate = useNavigate();
  const { videoId } = useParams();
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);
  const [editandoInstrucao, setEditandoInstrucao] = useState(false);
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novoStatus, setNovoStatus] = useState("");
  const [componenteSelecionado, setComponenteSelecionado] = useState(null);
  const [ferramentaSelecionada, setFerramentaSelecionada] = useState(null);
  const [epis, setEpis] = useState([]);
  const videoRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));


  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s]
      .map((v) => v.toString().padStart(2, "0"))
      .join(":");
  };

  const inserirTempoNoComentario = () => {
    if (videoRef.current) {
      const tempo = formatTime(videoRef.current.currentTime);
      setComentarioTexto((prev) => prev + ` [${tempo}]`);
    }
  };

  function renderStatusLabel(status) {
    if (status === "desativada") return "Desatualizada";
    if (status === "ativa") return "Ativa";
    if (status === "em_processo") return "Em Processo";
    return status;
  }

  const fetchData = useCallback(async () => {
    try {
      const [videoData, legendasData, instrucaoData] = await Promise.all([
        getVideos(videoId),
        getLegendasByVideo(videoId),
        getInstrucaoByVideoId(videoId),
      ]);
      setVideo({ ...videoData, currentTime: 0 });
      setLegendas(legendasData);
      setInstrucao(instrucaoData);

      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.nome) setUsername(user.nome);

      const [destaquesData, ferramentasData, componentesData, episData] =
        await Promise.all([
          getDestaques(instrucaoData.titulo, instrucaoData.versao),
          getFerramentasAssociados(instrucaoData.titulo, instrucaoData.versao),
          getComponentesAssociados(instrucaoData.titulo, instrucaoData.versao),
          getEpisAssociados(instrucaoData.titulo, instrucaoData.versao),
        ]);
      setDestaques(destaquesData);
      setFerramentas(ferramentasData);
      setComponentes(componentesData);
      setEpis(episData);

      const imagensData = {};
      for (const comp of componentesData) {
        const imagens = await getImagensComponente(comp.numero_peca);
        imagensData[comp.numero_peca] = imagens[0]?.caminho || "";
      }
      setImagensPrincipais(imagensData);

      const comentariosAtualizados = await buscarComentarios(
        instrucaoData.titulo,
        instrucaoData.versao
      );
      setComentarios(comentariosAtualizados);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }, [videoId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);



  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleTimeUpdate = (event) => {
    const currentTime = Math.floor(event.target.currentTime);
    setVideo((prev) => ({ ...prev, currentTime }));

    const ativosTmp = [];
    const destaquesPorPeca = {};

    destaques.forEach((d) => {
      const key = `${d.tipo}-${d.numero_peca}`;
      if (!destaquesPorPeca[key]) destaquesPorPeca[key] = [];
      destaquesPorPeca[key].push(d);
    });

    Object.entries(destaquesPorPeca).forEach(([key, eventos]) => {
      const eventosOrdenados = eventos
        .filter((e) => e.start_time <= currentTime)
        .sort((a, b) => b.start_time - a.start_time);

      if (eventosOrdenados.length > 0 && eventosOrdenados[0].status === 1) {
        ativosTmp.push(key);
      }
    });

    setAtivos(ativosTmp);
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

  const abrirModalFerramenta = (ferramenta) => {
    setFerramentaSelecionada(ferramenta);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setImagensSelecionadas([]);
    setComponenteSelecionado(null);
    setFerramentaSelecionada(null);
  };

  const handleSubmitComentario = useCallback(async () => {
    if (!instrucao || estrelas === 0 || !comentarioTexto.trim()) {
      alert("Preencha todos os campos antes de submeter.");
      return;
    }

    try {
      await adicionarComentario({
        titulo: instrucao.titulo,
        versao: instrucao.versao,
        email: JSON.parse(localStorage.getItem("user")).email,
        username,
        estrelas,
        comentario: comentarioTexto,
      });
      alert("Comentário enviado com sucesso!");
      setEstrelas(0);
      setComentarioTexto("");
      await fetchData();
    } catch (error) {
      console.error("Erro ao submeter comentário:", error);
      alert("Erro ao submeter comentário.");
    }
  }, [instrucao, estrelas, comentarioTexto]);

  const mediaEstrelas =
    comentarios.length > 0
      ? comentarios.reduce((acc, c) => acc + (c.estrelas || 0), 0) /
      comentarios.length
      : 0;

  if (!video) return <p>Carregando vídeo...</p>;

  const ferramentasOrdenadas = [
    ...ferramentas.filter((f) =>
      ativos.includes(`ferramenta-${f.numero_peca}`)
    ),
    ...ferramentas.filter(
      (f) => !ativos.includes(`ferramenta-${f.numero_peca}`)
    ),
  ];

  const componentesOrdenados = [
    ...componentes.filter((c) =>
      ativos.includes(`componente-${c.numero_peca}`)
    ),
    ...componentes.filter(
      (c) => !ativos.includes(`componente-${c.numero_peca}`)
    ),
  ];


  const handleSalvarInstrucao = async () => {
    try {
      await updateInstrucao(instrucao.titulo, instrucao.versao, novaDescricao, novoStatus);
      setInstrucao((prev) => ({
        ...prev,
        descricao: novaDescricao,
        status: novoStatus,
      }));
      setEditandoInstrucao(false);
    } catch (error) {
      console.error("Erro ao salvar instrução:", error);
      alert("Erro ao salvar instrução.");
    }
  };



  return (
    <div style={{ overflow: "hidden", height: "100vh" }}>
      <header className="top-header" onClick={handleLogoClick} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", backgroundColor: "#6A1B9A", borderBottom: "2px solid #4A148C" }}>
              <div className="logo" style={{ fontSize: "24px", fontWeight: "bold", color: "#FFFFFF", cursor: "pointer" }}>
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
                `/InstrucaoResources/${instrucao.video_id}/${instrucao.titulo}/${instrucao.versao}`
              )
            }
          >
            Recursos
          </button>
          <button
            style={{
              ...navBtnStyle,
              background: "#ede7f6",
              color: "#6A1B9A",
              textAlign: "center",
              fontWeight: "bold",
              border: "2px solid #6A1B9A",
              cursor: "not-allowed",
              opacity: 0.7,
            }}
            disabled
          >
            Vídeo
          </button>
          {user?.role !== "criador_instrucoes" && (
            <button
              style={navBtnStyle}
              onClick={() =>
                navigate(
                  `/Formulario/${instrucao.video_id}/${instrucao.titulo}/${instrucao.versao}`
                )
              }
            >
              Avaliar
            </button>
          )}
        </nav>

        <div style={{ display: "flex", gap: "14px" }}>
          <div
            style={{
              border: "2px solid #aaa",
              borderRadius: "14px",
              padding: "12px 0 0 0",
              width: "130px",
              height: "calc(100vh - 120px)",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxSizing: "border-box",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "10px",
                fontSize: "1.1rem",
              }}
            >
              Ferramentas
            </h2>
            <div
              style={{
                width: "100%",
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                boxSizing: "border-box",
              }}
            >
              {ferramentasOrdenadas.map((ferr) => (
                <div
                  key={ferr.numero_peca}
                  style={{
                    border: ativos.includes(`ferramenta-${ferr.numero_peca}`)
                      ? "2px solid red"
                      : "1px solid #bbb",
                    borderRadius: "10px",
                    background: "#fff",
                    width: "100%",
                    minHeight: "50px",
                    marginBottom: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    padding: "4px 0",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    transition: "border 0.5s",
                  }}
                  onClick={() => abrirModalFerramenta(ferr)}
                >
                  <img
                    src={`http://localhost:4000/imagens/${ferr.imagem}`}
                    alt={ferr.numero_peca}
                    style={{
                      width: "32px",
                      height: "22px",
                      objectFit: "contain",
                      margin: "4px 0 2px 0",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "11px",
                      textAlign: "center",
                      marginBottom: "2px",
                    }}
                  >
                    {ferr.nome}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              border: "2px solid #aaa",
              borderRadius: "14px",
              padding: "12px 0 0 0",
              width: "130px",
              height: "calc(100vh - 120px)",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxSizing: "border-box",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "10px",
                fontSize: "1.1rem",
              }}
            >
              Componentes
            </h2>
            <div
              style={{
                width: "100%",
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                boxSizing: "border-box",
              }}
            >
              {componentesOrdenados.map((comp) => (
                <div
                  key={comp.numero_peca}
                  style={{
                    border: ativos.includes(`componente-${comp.numero_peca}`)
                      ? "2px solid red"
                      : "1px solid #bbb", // mais fino
                    borderRadius: "10px",
                    background: "#fff",
                    width: "100%",
                    minHeight: "50px",
                    marginBottom: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    padding: "4px 0",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    transition: "border 0.5s",
                  }}
                  onClick={() => abrirModalComponente(comp)}
                >
                  {imagensPrincipais[comp.numero_peca] ? (
                    <img
                      src={`http://localhost:4000/imagens/${imagensPrincipais[comp.numero_peca]
                        }`}
                      alt={comp.numero_peca}
                      style={{
                        width: "32px",
                        height: "22px",
                        objectFit: "contain",
                        margin: "4px 0 2px 0",
                      }}
                    />
                  ) : (
                    <span style={{ margin: "4px 0 2px 0", fontSize: "11px" }}>
                      Sem imagem
                    </span>
                  )}
                  <div
                    style={{
                      fontSize: "11px",
                      textAlign: "center",
                      marginBottom: "2px",
                    }}
                  >
                    {comp.nome}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={styles.videoContainer}>
          {instrucao && (
            <div
              style={{
                textAlign: "center",
                marginBottom: "5px",
                color: "#6A1B9A",
                fontWeight: "bold",
                fontSize: "1.3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <span style={{ display: "inline-block" }}>
                {instrucao.titulo} &nbsp;|&nbsp; Versão:{instrucao.versao}
              </span>
              {storedUser?.role === "criador_instrucoes" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/AddSubtitles/${instrucao.video_id}`);
                  }}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "#fff",
                    border: "2px solid #6A1B9A",
                    color: "#6A1B9A",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px rgba(106,27,154,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "background 0.2s, color 0.2s, border 0.2s",
                  }}
                  title="Editar Legendas"
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#6A1B9A";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#6A1B9A";
                  }}
                >
                  ✎
                </button>
              )}
            </div>
          )}

          <video
            ref={videoRef}
            style={styles.video}
            controls
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            onTimeUpdate={handleTimeUpdate}
          >
            <source
              src={`http://localhost:4000/videos/file/${video.caminho}`}
              type="video/mp4"
            />
            Seu navegador não suporta vídeos.
          </video>
          <div style={styles.subtitle}>
            {video &&
              legendas.length > 0 &&
              (() => {
                const currentTime = Math.floor(video.currentTime || 0);
                const sorted = [...legendas].sort(
                  (a, b) => a.start_time - b.start_time
                );
                for (let i = 0; i < sorted.length; i++) {
                  const atual = sorted[i];
                  const proxima = sorted[i + 1];
                  if (
                    atual.start_time <= currentTime &&
                    (!proxima || currentTime < proxima.start_time)
                  ) {
                    return <p>{atual.content}</p>;
                  }
                }
                return null;
              })()}
          </div>
          {instrucao && (
            <div
              style={{
                background: "#E1BEE7",
                color: "#4A148C",
                borderRadius: "8px",
                padding: "16px",
                margin: "18px auto 0 auto",
                width: "92%",
                marginRight: "5%",
                boxShadow: "0 2px 8px rgba(106,27,154,0.08)",
                fontSize: "1rem",
                textAlign: "left",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <strong>Descrição:</strong> {instrucao.descricao}
                {storedUser?.role === "criador_instrucoes" && (
                  <button
                    onClick={() => {
                      setEditandoInstrucao(true);
                      setNovaDescricao(instrucao.descricao);
                      setNovoStatus(instrucao.status);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "5px",
                    }}
                  >
                    ✏️
                  </button>
                )}
                {editandoInstrucao && (
                  <div style={styles.editModal}>
                    <div style={styles.modalContent}>
                      <h2 style={{ marginBottom: "16px", color: "#4A148C" }}>
                        Editar Instrução
                      </h2>
                      <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>Nova Descrição:</label>
                        <textarea
                          value={novaDescricao}
                          onChange={(e) => setNovaDescricao(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            resize: "vertical",
                            fontSize: "14px",
                          }}
                          rows={5}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          onClick={() => setEditandoInstrucao(false)}
                          style={{ ...styles.button, ...styles.cancelButton }}
                        >
                          Cancelar
                        </button>
                        <button
                          style={{ ...styles.button, ...styles.saveButton }}
                          onClick={handleSalvarInstrucao}
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <strong>Review:</strong>{" "}
                {[1, 2, 3, 4, 5].map((num) => (
                  <span
                    key={num}
                    style={{
                      color: mediaEstrelas >= num ? "#ffc107" : "#e4e5e9",
                      fontSize: "20px",
                    }}
                  >
                    ★
                  </span>
                ))}
                <span
                  style={{
                    marginLeft: "8px",
                    color: "#4A148C",
                    fontWeight: 600,
                  }}
                >
                  {comentarios.length > 0
                    ? mediaEstrelas.toFixed(1)
                    : "Sem avaliações"}
                </span>
              </div>
            </div>
          )}
          {instrucao && storedUser?.role !== "criador_instrucoes" && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <button
                style={{
                  background: "#6A1B9A",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 38px",
                  fontWeight: "bold",
                  fontSize: "1.18rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(106,27,154,0.08)",
                  transition: "background 0.2s",
                }}
                onClick={() =>
                  navigate(
                    `/Formulario/${instrucao.video_id}/${instrucao.titulo}/${instrucao.versao}`
                  )
                }
              >
                Autoavaliação da Instrução
              </button>
            </div>
          )}
        </div>
        <div style={{ marginLeft: "1%" }}>
          <div style={{ marginLeft: "2%" }}></div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              minWidth: "410px",
              gap: 18,
              marginTop: "5%",
              marginBottom: 18,
            }}
          >
            {instrucao && storedUser?.role === "criador_instrucoes" && (
              <>
                {[
                  { value: "ativa", color: "#43a047", label: "Ativa" },
                  {
                    value: "em_processo",
                    color: "#fb8c00",
                    label: "Em Desenvolvimento",
                  },
                  {
                    value: "desativada",
                    color: "#e53935",
                    label: "Desatualizada",
                  },
                ].map((opt) => (
                  <span
                    key={opt.value}
                    title={opt.label}
                    onClick={async () => {
                      setNovoStatus(opt.value);
                      try {
                        await updateInstrucao(
                          instrucao.titulo,
                          instrucao.versao,
                          instrucao.descricao,
                          opt.value
                        );
                        setInstrucao({ ...instrucao, status: opt.value });
                      } catch (e) {
                        alert("Erro ao atualizar status!");
                      }
                    }}
                    style={{
                      display: "inline-block",
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: opt.color,
                      border:
                        instrucao.status === opt.value
                          ? "3px solid #111"
                          : "2px solid #bbb",
                      boxShadow: "0 0 2px #888",
                      cursor: "pointer",
                      transition: "border 0.2s",
                    }}
                  />
                ))}
              </>
            )}
            <h2 style={{ color: "purple", margin: 0 }}>Reviews da Instrução</h2>
          </div>
          {(storedUser?.role !== "criador_instrucoes" && (
            <div>
              <div>
                <strong>Rating:</strong>{" "}
                {[1, 2, 3, 4, 5].map((num) => (
                  <span
                    key={num}
                    style={{
                      cursor: "pointer",
                      color: estrelas >= num ? "#ffc107" : "#e4e5e9",
                      fontSize: "20px",
                    }}
                    onClick={() => setEstrelas(num)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div style={{ marginTop: "10px" }}>
                <strong>Comentário</strong>
                <br />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <textarea
                    value={comentarioTexto}
                    onChange={(e) => setComentarioTexto(e.target.value)}
                    rows={4}
                    style={{
                      width: "70%",
                      maxWidth: "100%",
                      minHeight: "80px",
                      background: "#ddd",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      resize: "none",
                      padding: "8px",
                      overflow: "hidden",
                    }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  />
                  <button
                    type="button"
                    title="Inserir tempo atual do vídeo"
                    onClick={inserirTempoNoComentario}
                    style={{
                      height: "38px",
                      width: "38px",
                      borderRadius: "50%",
                      border: "1px solid #6A1B9A",
                      background: "#ede7f6",
                      color: "#6A1B9A",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ⏱️
                  </button>
                </div>
              </div>
              <button
                onClick={handleSubmitComentario}
                style={{
                  background: "#6A1B9A",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 24px",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  marginTop: "15px",
                  boxShadow: "0 2px 6px rgba(106,27,154,0.12)",
                  transition: "background 0.2s",
                  marginBottom: "20px",
                }}
              >
                Submeter
              </button>
            </div>
          )
          )}
          <h3 style={{ marginTop: 0 }}>Comentários</h3>
          <div
            style={{
              maxHeight: storedUser?.role !== "criador_instrucoes" ? "250px" : "unset",
              overflowY: storedUser?.role !== "criador_instrucoes" ? "auto" : "unset",
              maxHeight: "60%",
              paddingRight: "10px",
              marginBottom: "20px",
              overflowX: "hidden",
            }}

          >
            {comentarios.length === 0 ? (
              <p>Nenhum comentário ainda.</p>
            ) : (
              comentarios.map((coment, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    border: "2px solid #222",
                    borderRadius: "8px",
                    padding: "20px",
                    marginRight: "5%",
                    marginBottom: "18px",
                    backgroundColor: "#fff",
                    fontSize: "1rem",
                    maxWidth: "75%",
                    width: "100%",
                    flexWrap: "wrap",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div
                    style={{
                      minWidth: "110px",
                      maxWidth: "110px",
                      marginRight: "16px",
                      borderRight: "2px solid #222",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "15px", marginBottom: "6px" }}>
                      {coment.username}
                    </div>
                    <div>
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          style={{
                            color: i < coment.estrelas ? "#ffc107" : "#e4e5e9",
                            fontSize: "16px",
                            marginRight: "1px",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {coment.comentario}
                  </div>
                </div>
              ))
            )}
          </div>
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
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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
            <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
              <button
                onClick={fecharModal}
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
        </div>
      )}

      {modalAberto && ferramentaSelecionada && (
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
            <h2 style={{ marginBottom: 16 }}>Informação da Ferramenta</h2>
            <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 8 }}>
              {ferramentaSelecionada.nome}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Referência:</strong>{" "}
              {ferramentaSelecionada.referencia || ferramentaSelecionada.numero_peca}
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
            <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
              <button
                onClick={fecharModal}
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
        </div>
      )}

    </div>
  );
}

export default ViewVideos;

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 1.2rem",
    backgroundColor: "#6A1B9A",
    borderBottom: "2px solid #4A148C",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#FFFFFF",
    cursor: "pointer",
  },
  userInfo: {
    backgroundColor: "#4A148C",
    color: "white",
    padding: "10px 25px",
    borderRadius: "20px",
    fontSize: "16px",
    fontWeight: "500",
    letterSpacing: "0.5px",
  },
  userIcon: {
    cursor: "pointer",
    padding: "12px",
    borderRadius: "50%",
    fontSize: "24px",
    lineHeight: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s ease",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: "0",
    backgroundColor: "white",
    border: "1px solid #9C27B0",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: "1000",
    minWidth: "120px",
    marginTop: "8px",
  },
  dropdownItem: {
    padding: "12px 16px",
    color: "#4A148C",
    cursor: "pointer",
  },
  videoContainer: {
    width: "85%",
    marginLeft: "2%",
    height: "55%",
    maxHeight: "65%",
    maxWidth: "65%",
    aspectRatio: "16/9",
  },
  video: {
    width: "97%",
    height: "97%",
    borderRadius: "5px",
    objectFit: "cover",
  },
  subtitle: {
    width: "95%",
    textAlign: "center",
    color: "white",
    fontSize: "20px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: "5px",
    borderRadius: "5px",
    height: "70px",
    marginTop: "2px",
  },
  instrucaoDetails: {
    padding: "15px",
    border: "1px solid #9C27B0",
    borderRadius: "8px",
    backgroundColor: "#F3E5F5",
  },
  editModal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modalContent: {
    background: "#fff",
    padding: "28px 32px",
    borderRadius: "12px",
    width: "480px",
    maxWidth: "90%",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    textAlign: "left",
  },

  button: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#6A1B9A",
    color: "white",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    color: "white",
  },
  itemCard: {
    border: "1.5px solid #bbb",
    padding: "4px",
    borderRadius: "8px",
    textAlign: "center",
    width: "100px",
    height: "110px",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    transition: "box-shadow 0.2s, border 0.2s",
    marginBottom: "8px",
    cursor: "pointer",
  },
  img: {
    width: "60px",
    height: "40px",
    objectFit: "contain",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

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
};

