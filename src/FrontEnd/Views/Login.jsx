import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/users/login", {
        email,
        password,
      });
      const { user, token } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      setSuccess("Login successful!");
      setError(null);

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
    } catch (err) {
      setError(err.response?.data?.message || "Credenciais inválidas");
      setSuccess(null);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#6A1B9A",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#F3E5F5",
          maxWidth: 400,
          width: "100%",
          padding: 40,
          borderRadius: 0,
          border: "2px solid #9C27B0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 30,
            color: "#4A148C",
            fontSize: 24,
            letterSpacing: 1.2,
          }}
        >
          LOGIN
        </h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {success && (
          <p style={{ color: "green", textAlign: "center" }}>{success}</p>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div style={{ marginBottom: 25 }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "95%",
                padding: "10px",
                border: "1.5px solid #9C27B0",
                borderRadius: "4px",
                backgroundColor: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: 25, position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "89%",
                padding: "10px",
                border: "1.5px solid #9C27B0",
                borderRadius: "4px",
                backgroundColor: "white",
                paddingRight: 35,
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
                color: "#4A148C",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#9C27B0",
              color: "white",
              border: "1.5px solid #6A1B9A",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            LOGIN
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "20px 0",
              color: "#4A148C",
            }}
          >
            <div
              style={{ flex: 1, height: "1px", backgroundColor: "#9C27B0" }}
            ></div>
            <span style={{ padding: "0 15px" }}>or</span>
            <div
              style={{ flex: 1, height: "1px", backgroundColor: "#9C27B0" }}
            ></div>
          </div>

          <div style={{ textAlign: "center" }}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/")}
              style={{
                color: "#4A148C",
                textDecoration: "none",
                fontWeight: "bold",
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
