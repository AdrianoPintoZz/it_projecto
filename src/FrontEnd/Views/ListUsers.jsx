import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allUsers, UpdateRole } from "../services/api";
import "../styles/styles.css";
import { FaUserCircle } from "react-icons/fa";

const ListaUtilizadores = () => {
  const [utilizadores, setUtilizadores] = useState([]);
  const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const users = await allUsers();
      setUtilizadores(users);
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleRoleChange = async (email, role) => {
    const user = utilizadores.find((u) => u.email === email);
    let novaRole = role;
    if (user.role === role) {
      novaRole = "user";
    }
    await UpdateRole(email, novaRole);
    const updatedUsers = await allUsers();
    setUtilizadores(updatedUsers);
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
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#FFFFFF",
            cursor: "pointer",
          }}
          onClick={() => navigate("/MainPageAdmin")}
        >
          STEP BY STEP
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px", position: "relative" }}>
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
                style={{ padding: "12px 16px", color: "#4A148C", cursor: "pointer" }}
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
          <p className="active">Administrar Utilizadores</p>

          <h2>Categorias</h2>
          <p onClick={() => navigate("/addCategoria")}>Adicionar Categoria</p>
          <p onClick={() => navigate("/showCategorias")}>Consultar Categorias</p>

        </aside>

        <div className="form-section">
          <h1>Lista de Utilizadores</h1>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Pesquisar por nome"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input search-input"
                style={{ width: "300px", paddingLeft: "36px", borderRadius: "8px" }}
              />
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="input"
              style={{ width: "220px", height: "36px", borderRadius: "8px" }}
            >
              <option value="">Todos os Papeis</option>
              <option value="admin">Administrador</option>
              <option value="criador_instrucoes">Criador de Instruções</option>
              <option value="user">Utilizador</option>
            </select>
          </div>

          {utilizadores.length === 0 ? (
            <p>Nenhum utilizador encontrado.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#f0f0f0", padding: "12px", textAlign: "left" }}>Nome</th>
                  <th style={{ backgroundColor: "#f0f0f0", padding: "12px", textAlign: "left" }}>Email</th>
                  <th style={{ backgroundColor: "#f0f0f0", padding: "12px" }}>Administrador</th>
                  <th style={{ backgroundColor: "#f0f0f0", padding: "12px" }}>Criador</th>
                  <th style={{ backgroundColor: "#f0f0f0", padding: "12px" }}>Utilizador</th>
                  <th style={{ backgroundColor: "#f0f0f0", padding: "12px", textAlign: "left" }}>Role Atual</th>
                </tr>
              </thead>
              <tbody>
                {utilizadores
                  .filter((u) =>
                    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (selectedRole === "" || u.role === selectedRole)
                  )
                  .map((u) => (
                    <tr key={u.email}>
                      <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{u.nome}</td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{u.email}</td>
                      <td style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                        <input
                          type="checkbox"
                          checked={u.role === "admin"}
                          onChange={() => handleRoleChange(u.email, "admin")}
                        />
                      </td>
                      <td style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                        <input
                          type="checkbox"
                          checked={u.role === "criador_instrucoes"}
                          onChange={() => handleRoleChange(u.email, "criador_instrucoes")}
                        />
                      </td>
                      <td style={{ textAlign: "center", borderBottom: "1px solid #ddd" }}>
                        <input
                          type="checkbox"
                          checked={u.role === "user"}
                          onChange={() => handleRoleChange(u.email, "user")}
                        />
                      </td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{u.role}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaUtilizadores;
