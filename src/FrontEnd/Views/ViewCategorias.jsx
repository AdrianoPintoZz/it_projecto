import React, { useEffect, useState } from 'react';
import { getFamilias, getCategorias, getCategoriasInstrucoes } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';
import { FaUserCircle } from "react-icons/fa";

const ViewCategorias = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);

  const [familias, setFamilias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaInstrucao, setCategoriaInstrucao] = useState([]);

  const [searchFamilia, setSearchFamilia] = useState("");
  const [searchCategoria, setSearchCategoria] = useState("");
  const [searchInstrucao, setSearchInstrucao] = useState("");

  const [showFamilias, setShowFamilias] = useState(true);
  const [showCategorias, setShowCategorias] = useState(true);
  const [showInstrucoes, setShowInstrucoes] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setFamilias(await getFamilias());
      setCategorias(await getCategorias());
      setCategoriaInstrucao(await getCategoriasInstrucoes());
    }
    fetchData();
  }, []);

  const filterData = (data, searchTerm, field = "nome") => {
    if (!searchTerm.trim()) return data;
    return data.filter((item) =>
      (item[field] || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderSearchBar = (value, onChangeHandler) => (
    <div className="search-container">
      <svg
        className="search-icon"
        xmlns="http://www.w3.org/2000/svg"
        height="20"
        viewBox="0 0 24 24"
        width="20"
        fill="#888"
      >
        <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-5.34C15.02 5.01 12.51 2.5 9.5 2.5S4 5.01 4 8s2.51 5.5 5.5 5.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
      </svg>
      <input
        className="search-input view-categorias-input"
        type="text"
        placeholder="Pesquisar por nome..."
        value={value}
        onChange={onChangeHandler}
      />
    </div>
  );

  const toggleSection = (section) => {
    if (section === 'familias') setShowFamilias(prev => !prev);
    if (section === 'categorias') setShowCategorias(prev => !prev);
    if (section === 'instrucoes') setShowInstrucoes(prev => !prev);
  };

  const EyeIcon = ({ isOpen }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
      style={{ cursor: "pointer", marginLeft: "10px", verticalAlign: "middle" }}
    >
      {isOpen ? (
        <path d="M12 4.5C7 4.5 2.73 8.11 1 12c1.73 3.89 6 7.5 11 7.5s9.27-3.61 11-7.5C21.27 8.11 17 4.5 12 4.5zm0 12c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5S14.49 16.5 12 16.5z" />
      ) : (
        <path d="M12 6c-3.87 0-7.19 2.69-8.48 6 1.29 3.31 4.61 6 8.48 6s7.19-2.69 8.48-6c-1.29-3.31-4.61-6-8.48-6zm0 10c-2.21 0-4-1.79-4-4 0-.73.21-1.41.56-2l5.44 5.44c-.59.35-1.27.56-2 .56zm4-4c0 .73-.21 1.41-.56 2l-5.44-5.44c.59-.35 1.27-.56 2-.56 2.21 0 4 1.79 4 4z" />
      )}
    </svg>
  );

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
          <p className="active">Consultar Categorias</p>
        </aside>

        <div className="form-section">
          <h1>
            Categorias dos Componentes
            <span onClick={() => toggleSection('familias')}>
              <EyeIcon isOpen={showFamilias} />
            </span>
          </h1>
          {showFamilias && (
            <div className="form-inner">
              {renderSearchBar(searchFamilia, (e) => setSearchFamilia(e.target.value))}
              <table className="styled-table">
                <thead><tr><th>Nome</th></tr></thead>
                <tbody>
                  {filterData(familias, searchFamilia).map((item) => (
                    <tr key={item.id}><td>{item.nome}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h1 style={{ marginTop: "3rem" }}>
            Categorias das Ferramentas
            <span onClick={() => toggleSection('categorias')}>
              <EyeIcon isOpen={showCategorias} />
            </span>
          </h1>
          {showCategorias && (
            <div className="form-inner">
              {renderSearchBar(searchCategoria, (e) => setSearchCategoria(e.target.value))}
              <table className="styled-table">
                <thead><tr><th>Nome</th></tr></thead>
                <tbody>
                  {filterData(categorias, searchCategoria).map((item) => (
                    <tr key={item.id}><td>{item.nome}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h1 style={{ marginTop: "3rem" }}>
            Categorias das Instruções
            <span onClick={() => toggleSection('instrucoes')}>
              <EyeIcon isOpen={showInstrucoes} />
            </span>
          </h1>
          {showInstrucoes && (
            <div className="form-inner">
              {renderSearchBar(searchInstrucao, (e) => setSearchInstrucao(e.target.value))}
              <table className="styled-table">
                <thead><tr><th>Nome</th></tr></thead>
                <tbody>
                  {filterData(categoriaInstrucao, searchInstrucao, "categoria").map((item) => (
                    <tr key={item.id}><td>{item.categoria}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCategorias;
