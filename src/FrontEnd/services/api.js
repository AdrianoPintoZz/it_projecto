import axios from "axios";

const API_URL = "http://localhost:4000";

export const registerUser = (dados) =>
  axios.post(`${API_URL}/users/register`, dados);

export const LoginUser = (dados) => axios.post(`${API_URL}/users/login`, dados);

export const getUserInfo = (token) =>
  axios.get(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const allUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar users:", error);
    return [];
  }
};

export const UpdateRole = async (email, role) => {
  try {
    const response = await axios.put(`${API_URL}/users/${email}/${role}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao dar update:", error);
    return [];
  }
};

export const getUserByInstrução = async (titulo, versao, email) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/${titulo}/${versao}/${email}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar users por instrução:", error);
    return null;
  }
};

export const getFerramentas = async () => {
  try {
    const response = await axios.get(`${API_URL}/ferramentas`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ferramentas:", error);
    return [];
  }
};

export const addFerramenta = async (novaFerramenta) => {
  try {
    console.log("📤 Enviando ferramenta:", novaFerramenta);
    const response = await axios.post(`${API_URL}/ferramentas`, novaFerramenta);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erro ao adicionar ferramenta:",
      error.response?.data || error.message
    );
    return { error: "Erro ao adicionar ferramenta" };
  }
};

export const updateFerramentas = async (numero_peca, dados) => {
  try {
    const response = await axios.put(
      `http://localhost:4000/ferramentas/${numero_peca}`,
      dados
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar ferramenta:", error);
    throw error;
  }
};

export const addFamilia = async (novaFamilia) => {
  try {
    console.log("📤 Enviando familia:", novaFamilia);
    const response = await axios.post(`${API_URL}/familia`, novaFamilia);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erro ao adicionar familia:",
      error.response?.data || error.message
    );
    return { error: "Erro ao adicionar familia" };
  }
};

export const getFamilias = async () => {
  try {
    const response = await axios.get(`${API_URL}/familia`);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar famílias:", error);
    return [];
  }
};

export const addCategoria = async (nome) => {
  try {
    console.log("📤 Enviando categoria:", nome);
    const response = await axios.post(`${API_URL}/familia/categoria`, nome);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erro ao adicionar categoria:",
      error.response?.data || error.message
    );
    return { error: "Erro ao adicionar categoria" };
  }
};

export const getCategorias = async () => {
  try {
    const response = await axios.get(`${API_URL}/familia/getCategorias`);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar categorias:", error);
    return [];
  }
};

export const addCategoria_Instrucao = async (categoria) => {
  try {
    console.log("📤 Enviando categoria de instrucao:", categoria);
    const response = await axios.post(
      `${API_URL}/familia/categoria_instrucao`,
      categoria
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erro ao adicionar categoria de instrucao:",
      error.response?.data || error.message
    );
    return { error: "Erro ao adicionar categoria de instrucao" };
  }
};

export const getCategoriasInstrucoes = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/familia/getCategorias_Instrucoes`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar categorias:", error);
    return [];
  }
};

export const getComponentes = async () => {
  try {
    const response = await axios.get(`${API_URL}/componentes`);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar componentes:", error);
    return [];
  }
};

export const addComponentes = async (novoCompoente) => {
  try {
    console.log("📤 Enviando componentes:", novoCompoente);
    const response = await axios.post(`${API_URL}/componentes`, novoCompoente);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erro ao adicionar componentes:",
      error.response?.data || error.message
    );
    return { error: "Erro ao adicionar componentes" };
  }
};

export const updateComponente = async (numero_peca, dados) => {
  try {
    const response = await axios.put(
      `http://localhost:4000/componentes/${numero_peca}`,
      dados
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar componente:", error);
    throw error;
  }
};

export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append("video", file);
  try {
    const response = await axios.post(
      "http://localhost:4000/videos/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Erro no upload:", error.response?.data || error.message);
    return { error: "Erro no upload do vídeo" };
  }
};

export const getVideos = async (videoId) => {
  try {
    const response = await axios.get(`${API_URL}/videos/id/${videoId}`);
    console.log("📄 Dados recebidos da API:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar vídeo:", error);
    return [];
  }
};

export const uploadLegendas = async ({ video_id, start_time, content }) => {
  try {
    console.log("📤 Enviando legenda:", { video_id, start_time, content });
    const response = await axios.post(`http://localhost:4000/legendas`, {
      video_id,
      start_time,
      content,
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erro ao adicionar legenda:",
      error.response?.data || error.message
    );
    return { error: "Erro ao adicionar legenda" };
  }
};

export const getLegendasByVideo = async (videoId) => {
  try {
    const response = await axios.get(
      `http://localhost:4000/legendas/video/${videoId}`
    );
    console.log("📄 Legendas carregadas:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar legendas:", error);
    return [];
  }
};

export const addInstrucao = async (novaInstrucao) => {
  try {
    console.log("📥 Enviando instrução:", novaInstrucao);
    const response = await axios.post(`${API_URL}/instrucoes`, novaInstrucao);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erro ao adicionar a instrução:",
      error.response?.data || error.message
    );
    return { error: "Erro ao adicionar a instrução" };
  }
};

export const getInstrucoes = async () => {
  try {
    const response = await axios.get(`${API_URL}/instrucoes`);
    console.log("📌 Dados recebidos da API:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar instrucoes:", error);
    return [];
  }
};

export const updateInstrucao = async (titulo,versao,descricao,status) => {
  try {
    const response = await axios.put(
      `${API_URL}/instrucoes/atualizar/${titulo}/${versao}`,
      {descricao,status}
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar Instrução:", error);
    throw error;
  }
};

export const getInstrucaoByTituloVersao = async (titulo, versao) => {
  try {
    const response = await axios.get(
      `${API_URL}/instrucoes/${titulo}/${versao}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar instruções por título/versão:", error);
    return null;
  }
};

export const getInstrucaoByVideoId = async (videoId) => {
  try {
    const response = await axios.get(`${API_URL}/instrucoes/${videoId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar instrução por vídeo:", error);
    return null;
  }
};

export const addInstrucaoComponentes = async (InstrucoesComponente) => {
  try {
    const response = await axios.post(
      `${API_URL}/InstrucoesComponentes/adicionar`,
      InstrucoesComponente
    );
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao associar componentes:", error);
    return { error: true };
  }
};

export const getComponentesNaoAssociados = async (titulo, versao) => {
  try {
    const response = await axios.get(
      `${API_URL}/instrucoesComponentes/ComponentesNotIn/${titulo}/${versao}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar componentes não associados:", error);
    return [];
  }
};

export const getComponentesAssociados = async (titulo, versao) => {
  try {
    const response = await axios.get(
      `${API_URL}/instrucoesComponentes/ComponentesIn/${titulo}/${versao}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar componentes não associados:", error);
    return [];
  }
};

export const addInstrucaoFerramentas = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/instrucoesFerramentas/adicionar`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar ferramentas à instrução:", error);
    return { error: true };
  }
};

export const getFerramentasNaoAssociados = async (titulo, versao) => {
  try {
    const response = await axios.get(
      `${API_URL}/instrucoesFerramentas/FerramentasNotIn/${titulo}/${versao}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar ferramentas não associados:", error);
    return [];
  }
};

export const getFerramentasAssociados = async (titulo, versao) => {
  try {
    const response = await axios.get(
      `${API_URL}/instrucoesFerramentas/FerramentasIn/${titulo}/${versao}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar ferramentas não associados:", error);
    return [];
  }
};

export const updateLegenda = async (videoId, startTime, content) => {
  try {
    const response = await axios.put(
      `${API_URL}/legendas/${videoId}/${startTime}`,
      { content }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar legenda:", error);
    throw error;
  }
};

export const deleteLegenda = async (videoId, startTime) => {
  try {
    const response = await axios.delete(
      `${API_URL}/legendas/${videoId}/${startTime}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao apagar legenda:", error);
    throw error;
  }
};

export const getSingleLegenda = async (videoId, startTime) => {
  try {
    const response = await axios.get(
      `${API_URL}/legendas/legenda/${videoId}/${startTime}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar legenda:", error);
    throw error;
  }
};

export const uploadComponentImages = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/componentes/imagens`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar imagens:", error);
    throw error;
  }
};

export const getImagensComponente = async (numero_peca) => {
  const response = await axios.get(
    `${API_URL}/componentes/imagens/${numero_peca}`
  );
  return response.data;
};

export const addDestaque = async (destaque) => {
  try {
    const response = await axios.post(
      `${API_URL}/destaques/adicionar`,
      destaque
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar destaque:", error);
    throw error;
  }
};

export const getDestaques = async (titulo, versao) => {
  const response = await axios.get(`${API_URL}/destaques/${titulo}/${versao}`);
  return response.data;
};

export const getDestaquesComp = async (titulo, versao) => {
  const response = await axios.get(
    `${API_URL}/destaques/componente/${titulo}/${versao}`
  );
  return response.data;
};

export const getDestaquesFerr = async (titulo, versao) => {
  const response = await axios.get(
    `${API_URL}/destaques/ferramenta/${titulo}/${versao}`
  );
  return response.data;
};

export const getSingleDestaqueFerr = async (titulo, versao, start_time) => {
  const response = await axios.get(
    `http://localhost:4000/destaques/SingleDestaque/ferramenta/${titulo}/${versao}/${start_time}`
  );
  return response.data;
};

export const getSingleDestaqueComp = async (titulo, versao, start_time) => {
  const response = await axios.get(
    `http://localhost:4000/destaques/SingleDestaque/componente/${titulo}/${versao}/${start_time}`
  );
  return response.data;
};

export const getComponenteByNumeroPeca = async (numero_peca) => {
  try {
    const response = await axios.get(`http://localhost:4000/componentes`);
    const componentes = response.data;
    const componente = componentes.find((c) => c.numero_peca === numero_peca);
    if (!componente) throw new Error("Componente não encontrado");
    return componente;
  } catch (error) {
    console.error("Erro ao buscar componente:", error);
    throw error;
  }
};

export const deleteDestaque = async (
  titulo,
  versao,
  numero_peca,
  start_time
) => {
  try {
    const response = await axios.delete(
      `${API_URL}/destaques/DeleteDestaque/${encodeURIComponent(
        titulo
      )}/${versao}/${numero_peca}/${start_time}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao apagar destaque:", error);
    throw error;
  }
};

export const adicionarComentario = async (comentario) =>
  await axios.post(`${API_URL}/comentarios`, comentario);

export const buscarComentarios = async (titulo, versao) => {
  try {
    const response = await axios.get(
      `${API_URL}/comentarios/${encodeURIComponent(titulo)}/${versao}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao apagar destaque:", error);
    throw error;
  }
};


export const getEpis = async () => {
  try {
    const response = await axios.get(`${API_URL}/epi`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar EPIs:", error);
    return [];
  }
};

export const addEpi = async (novoEpi) => {
  try {
    console.log("📤 Enviando EPI:", novoEpi);
    const response = await axios.post(`${API_URL}/epi`, novoEpi);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao adicionar EPI:", error.response?.data || error.message);
    return { error: "Erro ao adicionar EPI" };
  }
};

export const updateEpi = async (numero_peca, dados) => {
  try {
    const response = await axios.put(`${API_URL}/epi/${numero_peca}`, dados);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar EPI:", error);
    throw error;
  }
};


export const addInstrucaoEpis = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/instrucoesEpi/adicionar`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao associar EPIs à instrução:", error);
    return { error: true };
  }
};

export const getEpisNaoAssociados = async (titulo, versao) => {
  try {
    const response = await axios.get(
      `${API_URL}/instrucoesEpi/EpiNotIn/${encodeURIComponent(titulo)}/${versao}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar EPIs não associados:", error);
    return [];
  }
};

export const getEpisAssociados = async (titulo, versao) => {
  try {
    const response = await axios.get(
      `${API_URL}/instrucoesEpi/EpiIn/${encodeURIComponent(titulo)}/${versao}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar EPIs associados:", error);
    return [];
  }
};

export const deleteInstrucaoEpi = async (numero_peca, titulo, versao) => {
  try {
    const response = await axios.delete(
      `${API_URL}/instrucoesEpi/${numero_peca}/${encodeURIComponent(titulo)}/${versao}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao eliminar relação EPI-instrução:", error);
    throw error;
  }
};
