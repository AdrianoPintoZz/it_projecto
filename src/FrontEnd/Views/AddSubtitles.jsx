import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import {
  uploadLegendas,
  getLegendasByVideo,
  updateLegenda,
  deleteLegenda,
  getComponentesAssociados,
  getFerramentasAssociados,
  addDestaque,
  getInstrucaoByVideoId,
  getImagensComponente,
  getDestaquesComp,
  getDestaquesFerr,
  getSingleLegenda,
  deleteDestaque,
  getComponentesNaoAssociados,
  getFerramentasNaoAssociados,
  addInstrucaoFerramentas,
  addInstrucaoComponentes,
  getFamilias,
  getCategorias,
} from "../services/api.js";
import {
  getEpisAssociados,
  getEpisNaoAssociados,
  addInstrucaoEpis,
  deleteInstrucaoEpi,
} from "../services/api.js";
import "../styles/styles.css";

const AddSubtitles = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [subtitles, setSubtitles] = useState([]);
  const [instrucao, setInstrucao] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [newSubtitle, setNewSubtitle] = useState({
    startTime: "",
    content: "",
  });
  const [editingSubtitle, setEditingSubtitle] = useState(null);
  const [componentes, setComponentes] = useState([]);
  const [ferramentas, setFerramentas] = useState([]);
  const [imagensPrincipais, setImagensPrincipais] = useState({});
  const [componentesSelecionados, setComponentesSelecionados] = useState([]);
  const [ferramentasSelecionadas, setFerramentasSelecionadas] = useState([]);
  const [destaquesComponentes, setDestaquesComponentes] = useState([]);
  const [destaquesFerramentas, setDestaquesFerramentas] = useState([]);
  const [legendaAtual, setLegendaAtual] = useState(null);
  const [linhaTemporal, setLinhaTemporal] = useState([]);
  const [modalCompAberto, setModalCompAberto] = useState(false);
  const [modalFerrAberto, setModalFerrAberto] = useState(false);
  const [componentesNaoAssociados, setComponentesNaoAssociados] = useState([]);
  const [ferramentasNaoAssociadas, setFerramentasNaoAssociadas] = useState([]);
  const [selecionadosComp, setSelecionadosComp] = useState([]);
  const [selecionadosFerr, setSelecionadosFerr] = useState([]);
  const [confirmarApagar, setConfirmarApagar] = useState(null);
  const [searchCompTerm, setSearchCompTerm] = useState("");
  const [ordenarCompPor, setOrdenarCompPor] = useState("nome");
  const [searchFerrTerm, setSearchFerrTerm] = useState("");
  const [ordenarFerrPor, setOrdenarFerrPor] = useState("nome");
  const [familias, setFamilias] = useState([]);
  const [categoriaCompSelecionada, setCategoriaCompSelecionada] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaFerrSelecionada, setCategoriaFerrSelecionada] = useState("");
  const [epis, setEpis] = useState([]);
  const [episNaoAssociados, setEpisNaoAssociados] = useState([]);
  const [episSelecionados, setEpisSelecionados] = useState([]);
  const [modalEpiAberto, setModalEpiAberto] = useState(false);

  const playerRef = useRef(null);
  const navigate = useNavigate();

  const fetchAll = async () => {
    try {
      const videoRes = await axios.get(
        `http://localhost:4000/videos/id/${videoId}`
      );
      setVideo(videoRes.data);

      const subs = await getLegendasByVideo(videoId);
      setSubtitles(
        subs.map((s) => ({ ...s, start_time: Number(s.start_time) }))
      );

      const instrucaoData = await getInstrucaoByVideoId(videoId);
      setInstrucao(instrucaoData);

      const comps = await getComponentesAssociados(
        instrucaoData.titulo,
        instrucaoData.versao
      );
      const ferr = await getFerramentasAssociados(
        instrucaoData.titulo,
        instrucaoData.versao
      );
      const destaquesComp = await getDestaquesComp(
        instrucaoData.titulo,
        instrucaoData.versao
      );
      const destaquesFerr = await getDestaquesFerr(
        instrucaoData.titulo,
        instrucaoData.versao
      );

      const episAssoc = await getEpisAssociados(
        instrucaoData.titulo,
        instrucaoData.versao
      );
      setEpis(episAssoc);

      const imagensMap = {};
      for (const comp of comps) {
        const imagens = await getImagensComponente(comp.numero_peca);
        if (imagens.length > 0)
          imagensMap[comp.numero_peca] = imagens[0].caminho;
      }

      setImagensPrincipais((prev) => ({ ...prev, ...imagensMap }));
      setComponentes(comps);
      setFerramentas(ferr);
      setDestaquesComponentes(destaquesComp);
      setDestaquesFerramentas(destaquesFerr);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  };



  useEffect(() => {
    const interval = setInterval(() => {
      fetchAll();
    }, 5000);

    return () => clearInterval(interval);
  }, [videoId]);

  useEffect(() => {
    if (modalCompAberto && instrucao) {
      getComponentesNaoAssociados(instrucao.titulo, instrucao.versao)
        .then(async (naoAssociados) => {
          setComponentesNaoAssociados(naoAssociados);
          const novoMap = { ...imagensPrincipais };
          for (const comp of naoAssociados) {
            if (!novoMap[comp.numero_peca]) {
              const imagem = await getImagemComponente(comp.numero_peca);
              if (imagem) novoMap[comp.numero_peca] = imagem;
            }
          }
          setImagensPrincipais(novoMap);
        })
        .catch(console.error);
    }
  }, [modalCompAberto, instrucao]);

  useEffect(() => {
  const carregarImagensVisiveis = async () => {
    const visiveis = componentesNaoAssociados.filter(
      (comp) =>
        (categoriaCompSelecionada === "" ||
          String(comp.id_categoria_comp) === String(categoriaCompSelecionada)) &&
        (comp.nome?.toLowerCase().includes(searchCompTerm.toLowerCase()) ||
          comp.numero_peca?.toLowerCase().includes(searchCompTerm.toLowerCase()))
    );

    const novoMap = { ...imagensPrincipais };

    for (const comp of visiveis) {
      if (!novoMap[comp.numero_peca]) {
        const imagem = await getImagemComponente(comp.numero_peca);
        if (imagem) {
          novoMap[comp.numero_peca] = imagem;
        }
      }
    }

    setImagensPrincipais(novoMap);
  };

  if (modalCompAberto) {
    carregarImagensVisiveis();
  }
}, [categoriaCompSelecionada, searchCompTerm, componentesNaoAssociados, modalCompAberto]);


  useEffect(() => {
    if (modalFerrAberto && instrucao) {
      getFerramentasNaoAssociados(instrucao.titulo, instrucao.versao)
        .then(setFerramentasNaoAssociadas)
        .catch(console.error);
    }
  }, [modalFerrAberto, instrucao]);

  useEffect(() => {
    if (modalEpiAberto && instrucao) {
      getEpisNaoAssociados(instrucao.titulo, instrucao.versao)
        .then(setEpisNaoAssociados)
        .catch(console.error);
    }
  }, [modalEpiAberto, instrucao]);

  useEffect(() => {
    fetchAll();
  }, [videoId]);

  useEffect(() => {
    construirLinhaTemporal();
  }, [subtitles, destaquesComponentes, destaquesFerramentas]);

  const handleProgress = async (state) => {
    const instrucaoData = await getInstrucaoByVideoId(videoId);
    setInstrucao(instrucaoData);

    const tempoAtual = Math.floor(state.playedSeconds);
    setCurrentTime(tempoAtual);

    try {
      const legenda = await getSingleLegenda(videoId, tempoAtual);
      setLegendaAtual(legenda);
    } catch (err) {
      console.error("Erro ao buscar legenda atual:", err);
      setLegendaAtual(null);
    }

    await atualizarDestaquesGlobais();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubtitle({ ...newSubtitle, [name]: value });
  };

  const addSubtitle = async () => {
    const start_time = newSubtitle.startTime || Math.floor(currentTime);
    try {
      await uploadLegendas({
        video_id: videoId,
        start_time,
        content: newSubtitle.content.trim(),
      });
      const updated = await getLegendasByVideo(videoId);
      setSubtitles(
        updated.map((s) => ({ ...s, start_time: Number(s.start_time) }))
      );
      setNewSubtitle({ content: "" });
      alert("Legenda adicionada!");
    } catch (err) {
      console.error("Erro ao adicionar legenda:", err);
    }
  };

  const editSubtitle = (subtitle) => {
    setEditingSubtitle({
      video_id: subtitle.video_id,
      start_time: subtitle.start_time,
    });
    setNewSubtitle({
      content: subtitle.content,
      startTime: subtitle.start_time,
    });
  };

  const updateSubtitle = async () => {
    try {
      await updateLegenda(
        Number(editingSubtitle.video_id),
        Number(editingSubtitle.start_time),
        newSubtitle.content.trim()
      );
      const updated = await getLegendasByVideo(videoId);
      setSubtitles(
        updated.map((s) => ({ ...s, start_time: Number(s.start_time) }))
      );

      handleProgress({ playedSeconds: currentTime });

      setEditingSubtitle(null);
      setNewSubtitle({ content: "", startTime: "" });
      alert("Legenda atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar legenda:", err);
    }
  };

  async function getImagemComponente(numeroPeca) {
  const res = await fetch(`http://localhost:4000/componentes/imagens/${numeroPeca}`);
  const data = await res.json();
  return data?.[0]?.caminho ?? null;
}

  const atualizarDestaquesGlobais = async () => {
    if (!instrucao) return;

    try {
      const destaquesComp = await getDestaquesComp(
        instrucao.titulo,
        instrucao.versao
      );
      setDestaquesComponentes(destaquesComp);

      const destaquesFerr = await getDestaquesFerr(
        instrucao.titulo,
        instrucao.versao
      );
      setDestaquesFerramentas(destaquesFerr);
    } catch (err) {
      console.error("Erro ao atualizar destaques globais:", err);
    }
  };

  const ConfirmModal = ({ onConfirm, onCancel, mensagem }) => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          minWidth: "300px",
          textAlign: "center",
        }}
      >
        <p>{mensagem}</p>
        <button
          style={{
            marginRight: "15px",
            background: "#ff6961",
            color: "#fff",
            borderRadius: "5px",
            padding: "8px 16px",
            border: "none",
          }}
          onClick={onConfirm}
        >
          Sim, apagar
        </button>
        <button
          style={{
            background: "#ccc",
            borderRadius: "5px",
            padding: "8px 16px",
            border: "none",
          }}
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </div>
  );

  const apagarLegenda = (videoId, startTime) => {
    setConfirmarApagar({
      tipo: "legenda",
      dados: { videoId, startTime },
    });
  };

  const apagarDestaque = (titulo, versao, numero_peca, start_time) => {
    setConfirmarApagar({
      tipo: "destaque",
      dados: { titulo, versao, numero_peca, start_time },
    });
  };

  const handleConfirmarApagar = async () => {
    if (!confirmarApagar) return;
    if (confirmarApagar.tipo === "legenda") {
      const { videoId, startTime } = confirmarApagar.dados;
      try {
        await deleteLegenda(Number(videoId), Number(startTime));
        const updated = await getLegendasByVideo(videoId);
        setSubtitles(
          updated.map((s) => ({ ...s, start_time: Number(s.start_time) }))
        );
        handleProgress({ playedSeconds: currentTime });
        await atualizarDestaquesGlobais();
        alert("Legenda apagada!");
      } catch (err) {
        console.error("Erro ao apagar legenda:", err);
      }
    } else if (confirmarApagar.tipo === "destaque") {
      const { titulo, versao, numero_peca, start_time } = confirmarApagar.dados;
      try {
        await deleteDestaque(titulo, versao, numero_peca, start_time);
        handleProgress({ playedSeconds: currentTime });
        alert("Destaque apagado!");
      } catch (err) {
        console.error("Erro ao apagar destaque:", err);
      }
    }
    setConfirmarApagar(null);
  };

  const construirLinhaTemporal = () => {
    const eventos = [];

    subtitles.forEach((leg) => {
      eventos.push({
        tipo: "Legenda",
        tempo: leg.start_time,
        conteudo: leg.content,
      });
    });

    destaquesComponentes.forEach((comp) => {
      eventos.push({
        tipo: "Componente",
        tempo: comp.start_time,
        conteudo: comp.numero_peca,
        status: comp.status === 1 ? "Ativo" : "Inativo",
      });
    });

    destaquesFerramentas.forEach((ferr) => {
      eventos.push({
        tipo: "Ferramenta",
        tempo: ferr.start_time,
        conteudo: ferr.numero_peca,
        status: ferr.status === 1 ? "Ativo" : "Inativo",
      });
    });

    const ordenado = eventos.sort((a, b) => a.tempo - b.tempo);
    setLinhaTemporal(ordenado);
  };

  function getAtivosNoTempo(destaques, currentTime) {
    const porPeca = {};
    destaques.forEach((d) => {
      const key = d.numero_peca;
      if (!porPeca[key]) porPeca[key] = [];
      porPeca[key].push(d);
    });

    const ativos = [];
    Object.entries(porPeca).forEach(([numero_peca, eventos]) => {
      const eventosAteAgora = eventos
        .filter((e) => e.start_time <= currentTime)
        .sort((a, b) => b.start_time - a.start_time);
      if (eventosAteAgora.length && eventosAteAgora[0].status === 1) {
        ativos.push(numero_peca);
      }
    });
    return ativos;
  }

  const ferramentasAtivas = useMemo(
    () => getAtivosNoTempo(destaquesFerramentas, currentTime),
    [destaquesFerramentas, currentTime]
  );

  const componentesAtivas = useMemo(
    () => getAtivosNoTempo(destaquesComponentes, currentTime),
    [destaquesComponentes, currentTime]
  );

  const associarComponentes = async () => {
    if (!instrucao || selecionadosComp.length === 0) return;
    const response = await addInstrucaoComponentes({
      titulo: instrucao.titulo,
      versao: instrucao.versao,
      componentes: selecionadosComp,
    });
    alert("Componentes associados!");
    setModalCompAberto(false);
    fetchAll();
  };

  const associarFerramentas = async () => {
    if (!instrucao || selecionadosFerr.length === 0) return;
    const response = await addInstrucaoFerramentas({
      titulo: instrucao.titulo,
      versao: instrucao.versao,
      ferramentas: selecionadosFerr,
    });
    alert("Ferramentas associadas!");
    setModalFerrAberto(false);
    fetchAll();
  };

  const associarEpis = async () => {
    if (!instrucao || episSelecionados.length === 0) return;
    await addInstrucaoEpis({
      titulo: instrucao.titulo,
      versao: instrucao.versao,
      epis: episSelecionados,
    });
    alert("EPI(s) associada(s)!");
    setModalEpiAberto(false);
    setEpisSelecionados([]);
    fetchAll();
  };

  const removerEpiInstrucao = async (numero_peca) => {
    if (!instrucao) return;
    try {
      await deleteInstrucaoEpi(numero_peca, instrucao.titulo, instrucao.versao);
      await fetchAll();
      alert("EPI removida da instrução!");
    } catch (err) {
      alert("Erro ao remover EPI!");
      console.error(err);
    }
  };

  const removerComponenteInstrucao = async (numero_peca) => {
    if (!instrucao) return;
    try {
      await axios.delete(
        `http://localhost:4000/instrucoesComponentes/${numero_peca}/${encodeURIComponent(
          instrucao.titulo
        )}/${instrucao.versao}`
      );
      await fetchAll();
      alert("Componente removido da instrução!");
    } catch (err) {
      alert("Erro ao remover componente!");
      console.error(err);
    }
  };

  const removerFerramentaInstrucao = async (numero_peca) => {
    if (!instrucao) return;
    try {
      await axios.delete(
        `http://localhost:4000/instrucoesFerramentas/${numero_peca}/${encodeURIComponent(
          instrucao.titulo
        )}/${instrucao.versao}`
      );
      await fetchAll();
      alert("Ferramenta removida da instrução!");
    } catch (err) {
      alert("Erro ao remover ferramenta!");
      console.error(err);
    }
  };

  const ItemCard = ({
    item,
    ativo,
    selecionado,
    imagem,
    onChange,
    type = "componente",
  }) => (
    <label
      style={{
        border: ativo
          ? "2px solid red"
          : selecionado
          ? "2px solid #90ee90"
          : "1.5px solid #bbb",
        transition: "border 0.5s, box-shadow 0.5s",
        padding: "4px",
        borderRadius: "8px",
        textAlign: "center",
        width: "100px",
        height: "110px",
        backgroundColor: "#fff",
        boxShadow: ativo
          ? "0 0 0 2px red"
          : selecionado
          ? "0 0 0 3px #90ee90"
          : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        transition: "box-shadow 0.2s, border 0.2s",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <input
          type="checkbox"
          value={item.numero_peca}
          checked={ativo || selecionado}
          onChange={onChange}
          style={{ marginBottom: "2px" }}
        />
        {type === "ferramenta" && (
          <button
            type="button"
            title="Remover ferramenta da instrução"
            onClick={(e) => {
              e.preventDefault();
              removerFerramentaInstrucao(item.numero_peca);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#c00",
              fontSize: "16px",
              marginLeft: "4px",
            }}
          >
            🗑️
          </button>
        )}
        {type === "componente" && (
          <button
            type="button"
            title="Remover componente da instrução"
            onClick={(e) => {
              e.preventDefault();
              removerComponenteInstrucao(item.numero_peca);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#c00",
              fontSize: "16px",
              marginLeft: "4px",
            }}
          >
            🗑️
          </button>
        )}
      </div>
      {imagem ? (
        <img
          src={`http://localhost:4000/imagens/${imagem}`}
          alt={item.numero_peca}
          style={{
            width: "60px",
            height: "40px",
            objectFit: "contain",
            borderRadius: "4px",
          }}
        />
      ) : (
        <span style={{ fontSize: "10px" }}>Sem imagem</span>
      )}
      <p style={{ marginTop: "4px", fontSize: "12px" }}>{item.numero_peca}</p>
    </label>
  );

  const ItemCardEpi = ({ item }) => (
    <div
      style={{
        border: "1.5px solid #bbb",
        padding: "4px",
        borderRadius: "8px",
        textAlign: "center",
        width: "100px",
        height: "110px",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        marginBottom: "6px",
      }}
    >
      <div
        style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
      >
        <button
          type="button"
          title="Remover EPI da instrução"
          onClick={() => removerEpiInstrucao(item.numero_peca)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#c00",
            fontSize: "16px",
            marginLeft: "4px",
          }}
        >
          🗑️
        </button>
      </div>
      {item.imagem ? (
        <img
          src={`http://localhost:4000/imagens/${item.imagem}`}
          alt={item.numero_peca}
          style={{
            width: "60px",
            height: "40px",
            objectFit: "contain",
            borderRadius: "4px",
          }}
        />
      ) : (
        <span style={{ fontSize: "10px" }}>Sem imagem</span>
      )}
      <p style={{ marginTop: "4px", fontSize: "12px" }}>{item.nome}</p>
    </div>
  );

  const sortedSubtitles = useMemo(
    () => [...subtitles].sort((a, b) => a.start_time - b.start_time),
    [subtitles]
  );

  const currentSubtitle = useMemo(() => {
    for (let i = 0; i < sortedSubtitles.length; i++) {
      const atual = sortedSubtitles[i];
      const proxima = sortedSubtitles[i + 1];
      if (
        atual.start_time <= currentTime &&
        (!proxima || currentTime < proxima.start_time)
      ) {
        return atual.content;
      }
    }
    return null;
  }, [sortedSubtitles, currentTime]);

  useEffect(() => {
    async function fetchFamiliasCategorias() {
      try {
        const familiasData = await getFamilias();
        setFamilias(familiasData);
        const categoriasData = await getCategorias();
        setCategorias(categoriasData);
      } catch (err) {
        console.error("Erro ao buscar famílias/categorias:", err);
      }
    }
    fetchFamiliasCategorias();
  }, []);

  function formatarTempo(segundos) {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = Math.floor(segundos % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const alterarTempo = (delta) => {
    if (!playerRef.current) return;
    let novoTempo = Math.max(0, currentTime + delta);
    playerRef.current.seekTo(novoTempo, "seconds");
    setCurrentTime(novoTempo);
  };

  const toggleDestaqueComponente = async (checked, numero_peca) => {
    if (!instrucao) return;
    try {
      await addDestaque({
        titulo: instrucao.titulo,
        versao: instrucao.versao,
        numero_peca,
        start_time: currentTime,
        status: checked,
        tipo: "componente",
      });
      await atualizarDestaquesGlobais();
      await handleProgress({ playedSeconds: currentTime });
    } catch (err) {
      console.error("Erro ao atualizar destaque do componente:", err);
    }
  };

  const toggleDestaqueFerramenta = async (checked, numero_peca) => {
    if (!instrucao) return;
    try {
      await addDestaque({
        titulo: instrucao.titulo,
        versao: instrucao.versao,
        numero_peca,
        start_time: currentTime,
        status: checked,
        tipo: "ferramenta",
      });
      await atualizarDestaquesGlobais();
      await handleProgress({ playedSeconds: currentTime });
    } catch (err) {
      console.error("Erro ao atualizar destaque da ferramenta:", err);
    }
  };

  const irParaTempo = (tempo) => {
    if (playerRef.current) {
      playerRef.current.seekTo(tempo, "seconds");
      setCurrentTime(tempo);
    }
  };

  // Ordenar componentes: ativos primeiro
  const componentesOrdenados = [
    ...componentes.filter((c) => componentesAtivas.includes(c.numero_peca)),
    ...componentes.filter((c) => !componentesAtivas.includes(c.numero_peca)),
  ];

  // Ordenar ferramentas: ativos primeiro
  const ferramentasOrdenadas = [
    ...ferramentas.filter((f) => ferramentasAtivas.includes(f.numero_peca)),
    ...ferramentas.filter((f) => !ferramentasAtivas.includes(f.numero_peca)),
  ];

  return (
    <div>
      {confirmarApagar && (
        <ConfirmModal
          onConfirm={handleConfirmarApagar}
          onCancel={() => setConfirmarApagar(null)}
          mensagem={
            confirmarApagar.tipo === "legenda"
              ? "Tem a certeza que deseja apagar esta legenda?"
              : "Tem a certeza que deseja apagar este destaque?"
          }
        />
      )}

      <h2
        style={{ textAlign: "center", marginBottom: "5px", color: "#6A1B9A" }}
      >
        Editar Instrução
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.9fr 1.8fr 1.2fr",
          alignItems: "start",
          gap: "1px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "170px",
                height: "480px",
                border: "2px solid #888",
                borderRadius: "12px",
                background: "#fff",
                padding: "18px 0 18px 0",
                margin: "0 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxSizing: "border-box",
                justifyContent: "flex-start",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginBottom: "10px",
                }}
              >
                Ferramenta
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  alignItems: "center",
                  height: "400px",
                  width: "100%",
                  overflowY: "auto",
                  overflowX: "hidden",
                  justifyContent: "flex-start",
                }}
              >
                {ferramentasOrdenadas.map((ferr) => (
                  <ItemCard
                    key={ferr.numero_peca}
                    item={ferr}
                    ativo={ferramentasAtivas.includes(ferr.numero_peca)}
                    selecionado={ferramentasSelecionadas.includes(
                      ferr.numero_peca
                    )}
                    imagem={ferr.imagem}
                    onChange={async (e) => {
                      const id = ferr.numero_peca;
                      setFerramentasSelecionadas((prev) =>
                        e.target.checked
                          ? [...prev, id]
                          : prev.filter((item) => item !== id)
                      );
                      await toggleDestaqueFerramenta(e.target.checked, id);
                    }}
                    type="ferramenta"
                  />
                ))}
              </div>
              <button
                onClick={() => setModalFerrAberto(true)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: "#f0f0f0",
                  fontSize: "18px",
                  fontWeight: "bold",
                  lineHeight: "0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "8px",
                }}
                title="Adicionar Ferramenta"
              >
                +
              </button>
            </div>

            <div
              style={{
                width: "170px",
                height: "480px",
                border: "2px solid #888",
                borderRadius: "12px",
                background: "#fff",
                padding: "18px 0 18px 0",
                margin: "0 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxSizing: "border-box",
                justifyContent: "flex-start",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  marginBottom: "10px",
                }}
              >
                Componente
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  alignItems: "center",
                  height: "400px",
                  width: "100%",
                  overflowY: "auto",
                  overflowX: "hidden",
                  justifyContent: "flex-start",
                }}
              >
                {componentesOrdenados.map((comp) => (
                  <ItemCard
                    key={comp.numero_peca}
                    item={comp}
                    ativo={componentesAtivas.includes(comp.numero_peca)}
                    selecionado={componentesSelecionados.includes(
                      comp.numero_peca
                    )}
                    imagem={imagensPrincipais[comp.numero_peca]}
                    onChange={async (e) => {
                      const id = comp.numero_peca;
                      setComponentesSelecionados((prev) =>
                        e.target.checked
                          ? [...prev, id]
                          : prev.filter((item) => item !== id)
                      );
                      await toggleDestaqueComponente(e.target.checked, id);
                    }}
                    type="componente"
                  />
                ))}
              </div>
              <button
                onClick={() => setModalCompAberto(true)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: "#f0f0f0",
                  fontSize: "18px",
                  fontWeight: "bold",
                  lineHeight: "0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "8px",
                }}
                title="Adicionar Componente"
              >
                +
              </button>
            </div>
          </div>

          {modalCompAberto && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "30px",
                  borderRadius: "14px",
                  maxHeight: "90vh",
                  minWidth: "900px",
                  minHeight: "500px",
                  overflowY: "auto",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3>Selecionar Componentes para associar</h3>
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginBottom: "18px",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Pesquisar componente..."
                    value={searchCompTerm}
                    onChange={(e) => setSearchCompTerm(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <select
                    value={categoriaCompSelecionada}
                    onChange={(e) =>
                      setCategoriaCompSelecionada(e.target.value)
                    }
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      minWidth: "180px",
                    }}
                  >
                    <option value="">Todas as Categorias</option>
                    {familias.map((fam) => (
                      <option key={fam.id} value={fam.id}>
                        {fam.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  {componentesNaoAssociados
                    .filter(
                      (comp) =>
                        (categoriaCompSelecionada === "" ||
                          String(comp.id_categoria_comp) ===
                            String(categoriaCompSelecionada)) &&
                        (comp.nome
                          ?.toLowerCase()
                          .includes(searchCompTerm.toLowerCase()) ||
                          comp.numero_peca
                            ?.toLowerCase()
                            .includes(searchCompTerm.toLowerCase()))
                    )
                    .sort((a, b) =>
                      ordenarCompPor === "nome"
                        ? a.nome.localeCompare(b.nome)
                        : a.numero_peca.localeCompare(b.numero_peca)
                    )
                    .map((comp) => (
                      <label
                        key={comp.numero_peca}
                        style={{
                          border: selecionadosComp.includes(comp.numero_peca)
                            ? "2px solid green"
                            : "1px solid #ccc",
                          padding: "10px",
                          borderRadius: "8px",
                          width: "140px",
                          height: "140px",
                          textAlign: "center",
                          backgroundColor: "#fefefe",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selecionadosComp.includes(comp.numero_peca)}
                          onChange={(e) => {
                            const id = comp.numero_peca;
                            setSelecionadosComp((prev) =>
                              e.target.checked
                                ? [...prev, id]
                                : prev.filter((i) => i !== id)
                            );
                          }}
                        />
                        {imagensPrincipais[comp.numero_peca] ? (
                            <img
                              src={`http://localhost:4000/imagens/${imagensPrincipais[comp.numero_peca]}`}
                              alt={comp.numero_peca}
                              style={{
                                width: "80px",
                                height: "60px",
                                objectFit: "contain",
                                margin: "6px 0",
                              }}
                            />
                          ) : (
                            <div style={{ height: "60px", margin: "6px 0" }}>Sem imagem</div>
                          )}
                        <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                          {comp.nome}
                        </div>
                        <div style={{ fontSize: "11px", color: "#888" }}>
                          {comp.numero_peca}
                        </div>
                      </label>
                    ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "auto", gap: "10px" }}>
                  <button
                    onClick={() => setModalCompAberto(false)}
                    style={{
                      border: "2px solid #6A1B9A",
                      backgroundColor: "#fff",
                      color: "#6A1B9A",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={associarComponentes}
                    style={{
                      backgroundColor: "#6A1B9A",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(106, 27, 154, 0.3)"
                    }}
                  >
                    Associar Componentes
                  </button>
                </div>
              </div>
            </div>
          )}

          {modalFerrAberto && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "30px",
                  borderRadius: "14px",
                  maxHeight: "90vh",
                  minWidth: "700px",
                  minHeight: "500px",
                  overflowY: "auto",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3>Selecionar Ferramentas para associar</h3>
                <div style={{ display: "flex", gap: "16px", marginBottom: "18px", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="Pesquisar ferramenta..."
                    value={searchFerrTerm}
                    onChange={(e) => setSearchFerrTerm(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <select
                    value={categoriaFerrSelecionada}
                    onChange={(e) => setCategoriaFerrSelecionada(e.target.value)}
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      minWidth: "180px",
                    }}
                  >
                    <option value="">Todas as Categorias</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  {ferramentasNaoAssociadas
                    .filter(
                      (ferr) =>
                        (categoriaFerrSelecionada === "" ||
                        String(ferr.id_categoria_ferr) === String(categoriaFerrSelecionada)) &&
                        (
                          ferr.nome?.toLowerCase().includes(searchFerrTerm.toLowerCase()) ||
                          ferr.numero_peca?.toLowerCase().includes(searchFerrTerm.toLowerCase())
                        )
                    )
                    .sort((a, b) =>
                      ordenarFerrPor === "nome"
                        ? a.nome.localeCompare(b.nome)
                        : a.numero_peca.localeCompare(b.numero_peca)
                    )
                    .map((ferr) => (
                      <label
                        key={ferr.numero_peca}
                        style={{
                          border: selecionadosFerr.includes(ferr.numero_peca)
                            ? "2px solid green"
                            : "1px solid #ccc",
                          padding: "10px",
                          borderRadius: "8px",
                          width: "140px",
                          height: "140px",
                          textAlign: "center",
                          backgroundColor: "#fefefe",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selecionadosFerr.includes(ferr.numero_peca)}
                          onChange={(e) => {
                            const id = ferr.numero_peca;
                            setSelecionadosFerr((prev) =>
                              e.target.checked
                                ? [...prev, id]
                                : prev.filter((i) => i !== id)
                            );
                          }}
                        />
                        {ferr.imagem ? (
                          <img
                            src={`http://localhost:4000/imagens/${ferr.imagem}`}
                            alt={ferr.numero_peca}
                            style={{
                              width: "80px",
                              height: "60px",
                              objectFit: "contain",
                              margin: "6px 0",
                            }}
                          />
                        ) : (
                          <div style={{ height: "60px", margin: "6px 0" }}>
                            Sem imagem
                          </div>
                        )}
                        <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                          {ferr.nome}
                        </div>
                        <div style={{ fontSize: "11px", color: "#888" }}>
                          {ferr.numero_peca}
                        </div>
                      </label>
                    ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "auto", gap: "10px" }}>
                  <button
                    onClick={() => setModalFerrAberto(false)}
                    style={{
                      border: "2px solid #6A1B9A",
                      backgroundColor: "#fff",
                      color: "#6A1B9A",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={associarFerramentas}
                    style={{
                      backgroundColor: "#6A1B9A",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(106, 27, 154, 0.3)"
                    }}
                  >
                    Associar Ferramenta
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              width: "90%",
              maxHeight: "120%",
              border: "2px solid #888",
              borderRadius: "12px",
              background: "#fff",
              padding: "10px 10px",
              margin: "5px",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              marginLeft: "5%",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                marginBottom: "8px",
              }}
            >
              EPI
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "2px",
                  alignItems: "center",
                  width: "100%",
                  height: "115px",
                  overflowX: "auto",
                  overflowY: "hidden",
                  background: "#fff",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              >
                {epis.map((epi) => (
                  <div
                    key={epi.numero_peca}
                    style={{
                      border: "1.5px solid #bbb",
                      padding: "4px",
                      borderRadius: "8px",
                      textAlign: "center",
                      width: "100px",
                      height: "100px",
                      backgroundColor: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative",
                      marginBottom: "6px",
                      flex: "0 0 auto",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        title="Remover EPI da instrução"
                        onClick={() => removerEpiInstrucao(epi.numero_peca)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#c00",
                          fontSize: "16px",
                          marginLeft: "4px",
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                    {epi.imagem ? (
                      <img
                        src={`http://localhost:4000/imagens/${epi.imagem}`}
                        alt={epi.numero_peca}
                        style={{
                          width: "60px",
                          height: "40px",
                          objectFit: "contain",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "10px" }}>Sem imagem</span>
                    )}
                    <p style={{ marginTop: "4px", fontSize: "12px" }}>
                      {epi.nome}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setModalEpiAberto(true)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: "#f0f0f0",
                  fontSize: "18px",
                  fontWeight: "bold",
                  lineHeight: "0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "16px",
                }}
                title="Adicionar EPI"
              >
                +
              </button>
            </div>
          </div>
          {modalEpiAberto && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "30px",
                  borderRadius: "14px",
                  maxHeight: "90vh",
                  minWidth: "500px",
                  minHeight: "400px",
                  overflowY: "auto",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3>Selecionar EPIs para associar</h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px",
                    marginBottom: "18px",
                  }}
                >
                  {episNaoAssociados.length === 0 && (
                    <span style={{ color: "#888" }}>
                      Nenhum EPI disponível para associar.
                    </span>
                  )}
                  {episNaoAssociados.map((epi) => (
                    <label
                      key={epi.numero_peca}
                      style={{
                        border: episSelecionados.includes(epi.numero_peca)
                          ? "2px solid green"
                          : "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "8px",
                        width: "120px",
                        height: "120px",
                        textAlign: "center",
                        backgroundColor: "#fefefe",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={episSelecionados.includes(epi.numero_peca)}
                        onChange={(e) => {
                          const id = epi.numero_peca;
                          setEpisSelecionados((prev) =>
                            e.target.checked
                              ? [...prev, id]
                              : prev.filter((i) => i !== id)
                          );
                        }}
                      />
                      {epi.imagem ? (
                        <img
                          src={`http://localhost:4000/imagens/${epi.imagem}`}
                          alt={epi.numero_peca}
                          style={{
                            width: "60px",
                            height: "40px",
                            objectFit: "contain",
                            margin: "6px 0",
                          }}
                        />
                      ) : (
                        <div style={{ height: "40px", margin: "6px 0" }}>
                          Sem imagem
                        </div>
                      )}
                      <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                        {epi.nome}
                      </div>
                      <div style={{ fontSize: "11px", color: "#888" }}>
                        {epi.numero_peca}
                      </div>
                    </label>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "auto",
                    paddingBottom: "20px", 
                  }}
                >
                  <button
                    onClick={() => setModalEpiAberto(false)}
                    style={{
                      border: "2px solid #6A1B9A",
                      backgroundColor: "#fff",
                      color: "#6A1B9A",
                      padding: "10px 22px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={associarEpis}
                    style={{
                      backgroundColor: "#6A1B9A",
                      color: "#fff",
                      padding: "10px 22px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(106, 27, 154, 0.3)"
                    }}
                  >
                    Associar EPI
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
        <div
          style={{
            width: "90%",
            marginLeft: "4%",
            height: "49%",
            maxheight: "65%",
            maxWidth: "90%",
            aspectRatio: "16/9",
          }}
        >
          {video ? (
            <>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ReactPlayer
                  ref={playerRef}
                  url={`http://localhost:4000/videos/file/${video.caminho}`}
                  controls
                  width="100%"
                  height="100%"
                  onProgress={handleProgress}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                <strong style={{ fontSize: "1rem" }}>Tempo Atual:</strong>
                <div style={{ fontSize: "1.1rem" }}>
                  {formatarTempo(currentTime)}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() => alterarTempo(1)}
                    style={{
                      border: "none",
                      background: "none",
                      fontSize: "16px",
                      cursor: "pointer",
                      color: "#6A1B9A",
                      padding: 0,
                    }}
                    title="Avançar 1 segundo"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => alterarTempo(-1)}
                    style={{
                      border: "none",
                      background: "none",
                      fontSize: "16px",
                      cursor: "pointer",
                      color: "#6A1B9A",
                      padding: 0,
                    }}
                    title="Recuar 1 segundo"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p>Carregando vídeo...</p>
          )}

          <div
            className="subtitle-editor"
            style={{ marginTop: "20px", width: "100%" }}
          >
            <input
              type="text"
              name="content"
              placeholder="Digite a legenda..."
              value={newSubtitle.content}
              onChange={handleInputChange}
              style={{ width: "45%", marginRight: "10px" }}
            />
            {editingSubtitle ? (
              <>
                <button onClick={updateSubtitle}>Guardar Alterações</button>
                <button
                  onClick={() => {
                    setEditingSubtitle(null);
                    setNewSubtitle({ content: "", startTime: "" });
                  }}
                  style={{ marginLeft: "10px", backgroundColor: "#ccc" }}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button onClick={addSubtitle}>Adicionar Legenda</button>
            )}
          </div>

          <div
            style={{
              width: "75%",
              marginLeft: "12%",
              textAlign: "center",
              color: "white",
              fontSize: "20px",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "5px",
              borderRadius: "5px",
              minHeight: "40px",
              marginTop: "10px",
            }}
          >
            {currentSubtitle && <p>{currentSubtitle}</p>}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <button
              onClick={() => navigate(`/ViewVideos/${videoId}`)}
              style={{
                background: "#6A1B9A",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "14px 38px",
                fontWeight: "bold",
                fontSize: "1.18rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(106,27,154,0.08)",
                transition: "background 0.2s",
              }}
            >
              Voltar ao Vídeo
            </button>
          </div>
        </div>
        <div
          style={{
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
            padding: "5px",
            fontSize: "13px",
            display: "flex",
            flexDirection: "column",
            gap: "0px",
            position: "relative",
          }}
        >
          <div
            style={{
              border: "2.5px solid #111",
              borderRadius: "12px",
              background: "#fff",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 2,
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
                padding: "16px 0 10px 0",
                borderBottom: "2px solid #eee",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                letterSpacing: "0.5px",
              }}
            >
              Linha Temporal
            </div>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "18px 12px",
              }}
            >
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {linhaTemporal.map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      marginBottom: "10px",
                      background: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(80,0,120,0.08)",
                      borderLeft:
                        item.tipo === "Legenda"
                          ? "5px solid #6A1B9A"
                          : item.tipo === "Componente"
                          ? "5px solid #1976d2"
                          : "5px solid #43a047",
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 16px",
                      transition: "background 0.2s",
                      cursor: "pointer",
                      gap: "12px",
                    }}
                    onClick={() => irParaTempo(item.tempo)}
                  >
                    <span style={{ fontWeight: "bold", minWidth: 60 }}>
                      {formatarTempo(item.tempo)}
                    </span>
                    <div style={{ flex: 1 }}>
                      {item.tipo === "Legenda" ? (
                        <span style={{ color: "#6A1B9A" }}>
                          {item.conteudo.length > 60
                            ? item.conteudo.slice(0, 60) + "..."
                            : item.conteudo}
                        </span>
                      ) : (
                        <span>
                          <strong>{item.tipo}:</strong> {item.conteudo} |{" "}
                          <strong>Status:</strong>{" "}
                          <span
                            style={{
                              color:
                                item.status === "Ativo" ? "#d32f2f" : "#888",
                            }}
                          >
                            {item.status === "Ativo"
                              ? "🔴 Ativo"
                              : "⚪ Inativo"}
                          </span>
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {item.tipo === "Legenda" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              irParaTempo(item.tempo);
                              editSubtitle({
                                video_id: videoId,
                                start_time: item.tempo,
                                content: item.conteudo,
                              });
                            }}
                            style={{
                              background: "#eee",
                              border: "none",
                              borderRadius: "4px",
                              padding: "4px 10px",
                              cursor: "pointer",
                              color: "#6A1B9A",
                              fontWeight: "bold",
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              apagarLegenda(videoId, item.tempo);
                            }}
                            style={{
                              background: "#ff6961",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              padding: "4px 10px",
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                      {(item.tipo === "Componente" ||
                        item.tipo === "Ferramenta") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            apagarDestaque(
                              instrucao.titulo,
                              instrucao.versao,
                              item.conteudo,
                              item.tempo
                            );
                          }}
                          style={{
                            background: "#ff6961",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          Apagar
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubtitles;
