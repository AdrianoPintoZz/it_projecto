import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const isEmailValid = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isPasswordValid = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isEmailValid(email)) {
      setError("Introduza um email válido.");
      setSuccess(null);
      return;
    }
    if (!isPasswordValid(password)) {
      setError("A password deve conter pelo menos 8 caracteres, incluindo letras e números.");
      setSuccess(null);
      return;
    }

    try {
      await axios.post("http://localhost:4000/users/register", {
        email,
        name,
        password,
        role: "user",
      });
      setSuccess("Registo bem-sucedido! Agora podes iniciar sessão.");
      setError(null);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Erro ao registar. Tente outro email.");
      setSuccess(null);
    }
  };

  return (
    <div style={{ 
      backgroundColor: "#6A1B9A",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ 
        backgroundColor: "#F3E5F5",
        maxWidth: 400,
        width: "100%",
        padding: 40,
        borderRadius: 0,
        border: "2px solid #9C27B0",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: 30, 
          color: "#4A148C",
          fontSize: 24,
          letterSpacing: 1.2
        }}>
          REGISTAR
        </h2>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: 25 }}>
            <input
              type="text"
              placeholder="Nome de utilizador"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "95%",
                padding: 12,
                border: "1.5px solid #9C27B0",
                borderRadius: 0,
                backgroundColor: "white"
              }}
            />
          </div>

          <div style={{ marginBottom: 25 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "95%",
                padding: 12,
                border: "1.5px solid #9C27B0",
                borderRadius: 0,
                backgroundColor: "white"
              }}
            />
          </div>

          <div style={{ marginBottom: 25, position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "89%",
                padding: 12,
                border: "1.5px solid #9C27B0",
                borderRadius: 0,
                backgroundColor: "white",
                paddingRight: 35
              }}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: 15,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#4A148C"
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button 
            type="submit"
            style={{
              width: "100%",
              padding: 14,
              backgroundColor: "#9C27B0",
              color: "white",
              border: "1.5px solid #6A1B9A",
              borderRadius: 0,
              cursor: "pointer",
              fontWeight: "bold",
              marginBottom: 20
            }}
          >
            REGISTAR
          </button>

          <div style={{ textAlign: "center" }}>
            <button 
              type="button" 
              onClick={() => navigate("/login")}
              style={{
                color: "#4A148C",
                textDecoration: "none",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Já tem conta? Login
            </button>
          </div>

          {success && <p style={{ color: "#2E7D32", textAlign: "center", marginTop: 20 }}>{success}</p>}
          {error && <p style={{ color: "#C62828", textAlign: "center", marginTop: 20 }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}