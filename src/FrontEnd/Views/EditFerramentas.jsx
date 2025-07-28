import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFerramentas, updateFerramentas, getCategorias } from '../services/api';
import '../styles/styles.css';
import { FaUserCircle } from "react-icons/fa";

const EditFerramentas = () => {
  const navigate = useNavigate();
  const { numero_peca } = useParams();
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    numero_peca: '',
    nome: '',
    categoria_id: '',
    descricao: ''
  });
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const ferramentas = await getFerramentas();
      const categoriaData = await getCategorias();
      setCategorias(categoriaData);

      const ferramenta = ferramentas.find(f => f.numero_peca === numero_peca);
      if (ferramenta) {
        setFormData({
          numero_peca: ferramenta.numero_peca,
          nome: ferramenta.nome,
          categoria_id: ferramenta.id_categoria_ferr || '',
          descricao: ferramenta.descricao
        });
      } else {
        alert('Ferramenta não encontrada');
        navigate('/showFerramenta');
      }
    };

    fetchData();
  }, [numero_peca, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateFerramentas(numero_peca, formData);
      alert("Ferramenta atualizada com sucesso!");
      navigate('/showFerramenta');
    } catch (error) {
      console.error("Erro ao atualizar ferramenta:", error);
      alert("Erro ao atualizar ferramenta!");
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
                  ":hover": {
                    backgroundColor: "#F3E5F5",
                    borderRadius: "8px",
                  },
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
          <h1>Editar Ferramenta</h1>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-inner">
              <div className="form-content-wrapper">
                <div className="form-left">
                  <label htmlFor="numero_peca">Referencia da Ferramenta</label>
                  <input type="text" name="numero_peca" value={formData.numero_peca} disabled />

                  <label htmlFor="nome">Nome da Ferramenta</label>
                  <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />

                  <label htmlFor="categoria_id">Categoria da Ferramenta</label>
                  <select
                    name="categoria_id"
                    id="categoria_id"
                    value={formData.categoria_id}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="descricao">Informações Adicionais</label>
                  <textarea name="descricao" value={formData.descricao} onChange={handleChange} required />

                  <button type="submit" className="submit-btn">Salvar</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFerramentas;
