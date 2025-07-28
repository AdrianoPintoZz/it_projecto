import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    addFamilia,
    addCategoria,
    addCategoria_Instrucao
} from '../services/api';
import '../styles/styles.css';
import { FaUserCircle } from "react-icons/fa";

const FormCategorias = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [mostrarLogoutDropdown, setMostrarLogoutDropdown] = useState(false);

    const [categoraComp, setCategoriaComp] = useState('');
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('');

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleSubmitFamilia = async (e) => {
        e.preventDefault();
        if (!categoraComp.trim()) return alert("Preencha o nome da família!");
        const res = await addFamilia({ nome: categoraComp });
        if (res.error) alert("Erro ao adicionar família!");
        else {
            alert("Família adicionada!");
            setCategoriaComp('');
        }
    };

    const handleSubmitCategoria = async (e) => {
        e.preventDefault();
        if (!nome.trim()) return alert("Preencha o nome da categoria!");
        const res = await addCategoria({ nome });
        if (res.error) alert("Erro ao adicionar categoria!");
        else {
            alert("Categoria adicionada!");
            setNome('');
        }
    };

    const handleSubmitCategoriaInstrucao = async (e) => {
        e.preventDefault();
        if (!categoria.trim()) return alert("Preencha o nome da categoria!");
        const res = await addCategoria_Instrucao({ categoria });
        if (res.error) alert("Erro ao adicionar categoria!");
        else {
            alert("Categoria adicionada!");
            setCategoria('');
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
                    <p className="active">Adicionar Categoria</p>
                    <p onClick={() => navigate("/showCategorias")}>Consultar Categorias</p>

                </aside>

                <div className="form-section">
                    <h1>Adicionar Categorias</h1>

                    <form className="form-inner" onSubmit={handleSubmitFamilia}>
                        <div className="form-left">
                            <label>Categoria para Componentes</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Nome da Categoria"
                                value={categoraComp}
                                onChange={(e) => setCategoriaComp(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="submit-btn"
                                style={{
                                    width: "160px",
                                    marginTop: "8px",
                                    marginLeft: "0",
                                    marginBottom: "20px",
                                    fontSize: "0.95rem",
                                    padding: "10px 16px"
                                }}
                            >
                                Adicionar
                            </button>
                        </div>
                    </form>

                    <form className="form-inner" onSubmit={handleSubmitCategoria}>
                        <div className="form-left">
                            <label>Categoria para Ferramentas</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Nome da Categoria"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="submit-btn"
                                style={{
                                    width: "160px",
                                    marginTop: "8px",
                                    marginLeft: "0",
                                    marginBottom: "20px",
                                    fontSize: "0.95rem",
                                    padding: "10px 16px"
                                }}
                            >
                                Adicionar
                            </button>
                        </div>
                    </form>

                    <form className="form-inner" onSubmit={handleSubmitCategoriaInstrucao}>
                        <div className="form-left">
                            <label>Categoria para Instruções</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Nome da Categoria de Instrução"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="submit-btn"
                                style={{
                                    width: "160px",
                                    marginTop: "8px",
                                    marginLeft: "0",
                                    fontSize: "0.95rem",
                                    padding: "10px 16px"
                                }}
                            >
                                Adicionar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormCategorias;
