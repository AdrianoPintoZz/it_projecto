import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  addInstrucao,
  uploadVideo,
  getCategoriasInstrucoes,
} from "../services/api";
import "../styles/styles.css";
import { FaUserCircle } from "react-icons/fa";

const FormAddInstrucao = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    versao: "",
    imagem: null,
  });
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [username, setUsername] = useState("");
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

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

  useEffect(() => {
    async function fetchData() {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.nome) setUsername(storedUser.nome);
      const categoriasDB = await getCategoriasInstrucoes();
      setCategorias(categoriasDB);
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    setVideoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imagem: file });
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      alert("Por favor, preencha o título da instrução!");
      return;
    }
    if (!formData.imagem) {
      alert("Por favor, selecione uma imagem!");
      return;
    }
    if (!videoFile) {
      alert("Por favor, selecione um vídeo!");
      return;
    }

    try {
      const videoResponse = await uploadVideo(videoFile);
      if (videoResponse.error) {
        alert("Erro no upload do vídeo!");
        return;
      }
      const videoId = videoResponse.id || videoResponse.video_id;

      const data = new FormData();
      data.append("titulo", formData.titulo);
      data.append("descricao", formData.descricao);
      data.append("versao", 1);
      data.append("video_id", videoId);
      data.append("imagem", formData.imagem);
      data.append("categoria_id", categoriaId);

      const response = await addInstrucao(data);

      if (response.error) {
        alert("Erro ao adicionar instrução!");
      } else {
        alert("Instrução adicionada com sucesso!");
        setFormData({
          titulo: "",
          descricao: "",
          versao: "",
          video_id: "",
          imagem: null,
        });
        setVideoFile(null);
        setVideoPreview(null);
        navigate("/MainPageCI");
      }
    } catch (error) {
      console.error("Erro ao adicionar instrução:", error);
      alert("Erro ao adicionar instrução!");
    }
  };

  return (
    <div className="app-wrapper">
      <header className="top-header" style={{
        height: "60px",
        backgroundColor: "#6A1B9A",
        borderBottom: "2px solid #4A148C",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
      }}>
        <div className="logo" onClick={() => navigate("/MainPageAdmin")} style={{
          fontSize: "24px", fontWeight: "bold", color: "#FFFFFF", cursor: "pointer"
        }}>
          STEP BY STEP
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px", position: "relative" }}>
          <div style={{
            backgroundColor: "#4A148C", color: "white", padding: "10px 25px",
            borderRadius: "20px", fontSize: "16px", fontWeight: "500"
          }}>
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
            <div style={{
              position: "absolute", top: "100%", right: 0,
              backgroundColor: "white", border: "1px solid #9C27B0",
              borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              zIndex: 1000, minWidth: "120px", marginTop: "8px",
            }}>
              <div style={{ padding: "12px 16px", color: "#4A148C", cursor: "pointer" }}
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  navigate("/login");
                }}>
                Logout
              </div>
            </div>
          )}
        </div>
      </header>
      <div className="main-container">
        <div className="form-section">
          <h1>Adicionar Nova Instrução</h1>
          <form onSubmit={handleSubmit}>
            <div
              className="form-inner"
              style={{ display: "flex", gap: "40px" }}
            >
              <div className="form-left" style={{ flex: 1, minWidth: "100px" }}>
                <label htmlFor="titulo">Título da Instrução</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="descricao">Descrição da Instrução</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                />

                <label>Categoria da Instrução</label>
                <select
                  className="input"
                  style={{ width: "70%", minHeight: "38px", marginBottom: "18px" }}
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoria}
                    </option>
                  ))}
                </select>

                <label htmlFor="imagem">Imagem da Instrução</label>
                <input
                  type="file"
                  id="imagem"
                  name="imagem"
                  accept="image/jpeg, image/jpg, image/png"
                  onChange={handleImageChange}
                  required
                />

                <label htmlFor="videoUpload">Escolher vídeo</label>
                <input
                  type="file"
                  id="videoUpload"
                  accept="video/*"
                  onChange={handleVideoChange}
                  required
                />
              </div>

              <div
                className="form-right"
                style={{
                  flex: 1,
                  minWidth: "220px",
                  maxWidth: "800px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "24px",
                    width: "100%",
                    justifyContent: "center",
                    marginBottom: "28px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <label
                      className="label-title"
                      style={{ alignSelf: "center", marginBottom: 8 }}
                    >
                      Preview do Vídeo
                    </label>
                    <div
                      className="video-preview"
                      style={{
                        width: "480px",
                        height: "330px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#222",
                        borderRadius: "10px",
                      }}
                    >
                      {videoPreview ? (
                        <video
                          src={videoPreview}
                          controls
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "10px",
                            objectFit: "cover",
                            background: "#222",
                          }}
                        />
                      ) : (
                        <div style={{ color: "#888", fontSize: "13px" }}>
                          Nenhum vídeo selecionado
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <label
                      className="label-title"
                      style={{ alignSelf: "center", marginBottom: 8 }}
                    >
                      Preview da Imagem
                    </label>
                    <div
                      className="image-preview"
                      style={{
                        width: "390px",
                        height: "320px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#222"
                      }}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            borderRadius: "10px",
                            objectFit: "cover",
                            background: "#eee",
                          }}
                        />
                      ) : (
                        <div style={{ color: "#888", fontSize: "13px" }}>
                          Nenhuma imagem selecionada
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    gap: "32px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    type="submit"
                    className="submit-btn"
                    style={{
                      flex: 1,
                      maxWidth: "220px",
                      fontSize: "1.3rem",
                      padding: "18px 0",
                      height: "60px",
                      boxSizing: "border-box",
                    }}
                  >
                    Adicionar Instrução
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    style={{
                      flex: 1,
                      maxWidth: "220px",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      height: "60px",
                      boxSizing: "border-box",
                      background: "#fff",
                      color: "#6A1B9A",
                      border: "2px solid #6A1B9A",
                      borderRadius: "12px",
                      cursor: "pointer",
                      marginTop: "30px",
                    }}
                    onClick={() => navigate("/MainPageCI")}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormAddInstrucao;

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
};
