import React, { useEffect, useState } from "react";
import {
  addComponentes,
  getFamilias,
  uploadComponentImages,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { FaUserCircle } from "react-icons/fa";

const FormComponentes = () => {
  const navigate = useNavigate();
  const [familias, setFamilias] = useState([]);
  const [formData, setFormData] = useState({
    numero_peca: "",
    nome: "",
    descricao: "",
    id_categoria_comp: "", 
    data_criacao: "",
    data_atualizacao: "",
    imagens: [],
  });

  const [previewIndex, setPreviewIndex] = useState(0);
  const [filePreviews, setFilePreviews] = useState([]);
  const [username, setUsername] = useState("");
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);

  const now = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchFamilias = async () => {
      const data = await getFamilias();
      setFamilias(data);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.nome) {
        setUsername(storedUser.nome);
      }
    };
    fetchFamilias();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChange = (e) => {
    if (e.target.name === "imagens") {
      const files = Array.from(e.target.files);
      const newPreviews = files.map((file) => URL.createObjectURL(file));

      setFormData((prev) => ({
        ...prev,
        imagens: [...prev.imagens, ...files],
      }));

      setFilePreviews((prev) => [...prev, ...newPreviews]);
      setPreviewIndex(0);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const componenteData = {
      numero_peca: formData.numero_peca,
      nome: formData.nome,
      descricao: formData.descricao,
      id_categoria_comp: formData.id_categoria_comp,
      data_criacao: now,
      data_atualizacao: now,
    };

    try {
      await addComponentes(componenteData);

      if (formData.imagens.length > 0) {
        const imageData = new FormData();
        formData.imagens.forEach((img) => imageData.append("imagens", img));
        imageData.append("numero_peca", formData.numero_peca);
        await uploadComponentImages(imageData);
      }

      alert("Componente adicionado com sucesso!");
      setFormData({
        numero_peca: "",
        nome: "",
        descricao: "",
        id_categoria_comp: "",
        data_criacao: "",
        data_atualizacao: "",
        imagens: [],
      });
      setFilePreviews([]);
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Erro ao adicionar componente!");
    }
  };

  const showPrevImage = () => {
    setPreviewIndex(
      (prev) => (prev - 1 + filePreviews.length) % filePreviews.length
    );
  };

  const showNextImage = () => {
    setPreviewIndex((prev) => (prev + 1) % filePreviews.length);
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
          <p onClick={() => navigate("/ViewInstrucoes")}>Consultar Instruções</p>
          <h2>Ferramentas</h2>
          <p onClick={() => navigate("/addFerramenta")}>Adicionar Ferramenta</p>
          <p onClick={() => navigate("/showFerramenta")}>Consultar Ferramentas</p>

          <h2>Componentes</h2>
          <p className="active">Adicionar Componente</p>
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
          <h1>Adicionar Componente</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-inner">
              <div className="form-content-wrapper">
                <div className="form-left">
                  <label htmlFor="numero_peca">Referencia do Componente</label>
                  <input
                    type="text"
                    name="numero_peca"
                    placeholder="Número"
                    value={formData.numero_peca}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="nome">Nome do Componente</label>
                  <input
                    type="text"
                    name="nome"
                    placeholder="Nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="descricao">Descrição do Componente</label>
                  <textarea
                    name="descricao"
                    placeholder="Descrição"
                    value={formData.descricao}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="categoria">Categoria do Componente</label>
                  <select
                    name="id_categoria_comp" // <-- aqui
                    value={formData.id_categoria_comp} // <-- aqui
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    <option value="">Selecione uma categoria</option>
                    {familias.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-right">
                  <label className="label-title">Imagens Ilustrativas</label>
                  <label htmlFor="imagens" className="image-label">
                    Escolher Ficheiros <span className="plus-icon">+</span>
                  </label>
                  <input
                    id="imagens"
                    type="file"
                    name="imagens"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    hidden
                  />

                  <label className="label-title">Preview</label>
                  <div className="image-preview">
                    {filePreviews.length > 0 && (
                      <div
                        className="carousel"
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <button
                          type="button"
                          className="carousel-btn left"
                          onClick={showPrevImage}
                        >
                          ❮
                        </button>
                        <img src={filePreviews[previewIndex]} alt="Preview" />
                        <button
                          type="button"
                          className="carousel-btn right"
                          onClick={showNextImage}
                        >
                          ❯
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" className="submit-btn">
                  Continuar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormComponentes;
