import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addFerramenta, getCategorias } from "../services/api";
import "../styles/styles.css";
import { FaUserCircle } from "react-icons/fa";

const FormFerramenta = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numero_peca: "",
    nome: "",
    descricao: "",
    id_categoria_ferr: "",
    imagem: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState("Escolher Ficheiro");
  const [username, setUsername] = useState("");
  const [categoria, setCategorias] = useState([]);
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.nome) {
        setUsername(storedUser.nome);
      }
      const cats = await getCategorias();
      setCategorias(cats);
    }
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagem") {
      const file = files[0];
      setFormData({ ...formData, imagem: file });
      if (file) {
        setPreviewUrl(URL.createObjectURL(file));
        setFileName(file.name);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { numero_peca, nome, id_categoria_ferr, descricao, imagem } = formData;

    if (!nome.trim() || !id_categoria_ferr.trim() || !descricao.trim() || !imagem) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    const data = new FormData();
    data.append("numero_peca", numero_peca);
    data.append("nome", nome);
    data.append("id_categoria_ferr", id_categoria_ferr);
    data.append("descricao", descricao);
    data.append("imagem", imagem);

    try {
      const response = await addFerramenta(data);
      if (response.error) {
        alert("Erro ao adicionar ferramenta!");
      } else {
        alert("Ferramenta adicionada com sucesso!");
        setFormData({
          numero_peca: "",
          nome: "",
          id_categoria_ferr: "",
          descricao: "",
          imagem: null,
        });
        setPreviewUrl(null);
        setFileName("Escolher Ficheiro");
      }
    } catch (error) {
      console.error("Erro ao enviar ferramenta:", error);
      alert("Erro ao adicionar ferramenta!");
    }
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
              ":hover": {
                backgroundColor: "#E1BEE7",
              },
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
          <p className="active">Adicionar Ferramenta</p>
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
          <h1>Adicionar Ferramenta</h1>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-inner">
              <div className="form-content-wrapper">
                <div className="form-left">
                  <label htmlFor="numero_peca">Referencia da Ferramenta</label>
                  <input
                    type="text"
                    name="numero_peca"
                    id="numero_peca"
                    placeholder="Número"
                    value={formData.numero_peca}
                    onChange={handleChange}
                  />

                  <label htmlFor="nome">Nome da Ferramenta</label>
                  <input
                    type="text"
                    name="nome"
                    id="nome"
                    placeholder="Nome"
                    value={formData.nome}
                    onChange={handleChange}
                  />

                  <label htmlFor="descricao">Informações Adicionais</label>
                  <textarea
                    name="descricao"
                    id="descricao"
                    placeholder="Descrição"
                    value={formData.descricao}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="id_categoria_ferr">Categoria da Ferramenta</label>
                  <select
                    name="id_categoria_ferr"
                    id="id_categoria_ferr"
                    value={formData.id_categoria_ferr}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categoria.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-right">
                  <label className="label-title">Imagem Ilustrativa</label>
                  <label htmlFor="imagem" className="image-label">
                    {fileName} <span className="plus-icon">+</span>
                  </label>
                  <input
                    id="imagem"
                    type="file"
                    name="imagem"
                    accept="image/*"
                    onChange={handleChange}
                    hidden
                  />
                  <label className="label-title">Preview</label>
                  <div className="image-preview">
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Continuar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormFerramenta;
