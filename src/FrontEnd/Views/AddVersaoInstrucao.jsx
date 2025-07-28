import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addInstrucao,
  uploadVideo,
  getCategoriasInstrucoes,
  getInstrucaoByTituloVersao,
} from "../services/api";
import "../styles/styles.css";
import { FaUserCircle } from "react-icons/fa";

const AddVersaoInstrucao = () => {
  const navigate = useNavigate();
  const { titulo, versao } = useParams();
  const novaVersao = parseInt(versao);

  const [formData, setFormData] = useState({
    titulo: titulo || "",
    descricao: "",
    imagem: null,
    versao: novaVersao,
  });

  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.nome || "Utilizador";

  useEffect(() => {
    async function fetchCategoriasAndCategoriaAnterior() {
      const categoriasDB = await getCategoriasInstrucoes();
      setCategorias(categoriasDB);

      if (novaVersao > 1) {
        const instrucaoAnterior = await getInstrucaoByTituloVersao(
          titulo,
          novaVersao - 1
        );
        if (instrucaoAnterior && instrucaoAnterior.categoria_id) {
          setCategoriaId(instrucaoAnterior.categoria_id.toString());
        }
      }
    }
    fetchCategoriasAndCategoriaAnterior();
  }, [titulo, novaVersao]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const videoResponse = await uploadVideo(videoFile);
      if (videoResponse.error) {
        alert("Erro no upload do vídeo!");
        return;
      }

      const data = new FormData();
      data.append("titulo", formData.titulo);
      data.append("descricao", formData.descricao);
      data.append("versao", formData.versao);
      data.append("imagem", formData.imagem);
      data.append("video_id", videoResponse.id);
      data.append("categoria_id", categoriaId);

      const response = await addInstrucao(data);
      if (response.error) {
        alert("Erro ao adicionar nova versão!");
      } else {
        alert("Nova versão adicionada com sucesso!");
        navigate("/MainPageCI");
      }
    } catch (error) {
      console.error("Erro ao adicionar nova versão:", error);
      alert("Erro ao adicionar nova versão!");
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
          <h1>Nova Versão de "{titulo}"</h1>
          <form onSubmit={handleSubmit}>
            <div
              className="form-inner"
              style={{ display: "flex", gap: "40px" }}
            >
              <div className="form-left" style={{ flex: 1, minWidth: "100px" }}>
                <label htmlFor="titulo">Título:</label>
                <input
                  type="text"
                  id="titulo"
                  value={formData.titulo}
                  readOnly
                  style={{ backgroundColor: "#e9e9e9", cursor: "not-allowed" }}
                />

                <label htmlFor="descricao">Descrição:</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="versao">Versão:</label>
                <input
                  type="number"
                  id="versao"
                  value={formData.versao}
                  readOnly
                  style={{ backgroundColor: "#e9e9e9", cursor: "not-allowed" }}
                />

                <label htmlFor="categoria">Categoria:</label>
                <select
                  id="categoria"
                  value={categoriaId}
                  disabled
                  style={{
                    width: "70%",
                    backgroundColor: "#eee",
                    color: "#333",
                    cursor: "not-allowed",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px",
                    marginBottom: "18px",
                  }}
                >
                  <option value="">-- Selecione uma Categoria --</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoria}
                    </option>
                  ))}
                </select>

                <label htmlFor="imagem">Imagem:</label>
                <input
                  type="file"
                  id="imagem"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />

                <label htmlFor="video">Vídeo:</label>
                <input
                  type="file"
                  id="video"
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
                        background: "#222",
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
                    alignItems: "stretch",
                    marginTop: "0",
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
                    Adicionar Nova Versão
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

export default AddVersaoInstrucao;

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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
