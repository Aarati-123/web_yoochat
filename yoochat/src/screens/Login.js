import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in email and password");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      const data = response.data;

      if (data.token) {
        // ✅ Save token and user info in localStorage for Home.js
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userId", data.userId.toString());
        localStorage.setItem("profileImage", data.profileImage || "");

        alert("Login successful!");
        navigate("/home");
      } else {
        alert("Token missing in response. Please try again.");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="authPage">
      <div className="authGlow" />
      <div className="authCard">
        <div className="brandRow">
          <h1 className="brandYo">यो</h1>
          <h1 className="brandChat">Chat</h1>
        </div>
        <h2 className="authTitle">Login to your account</h2>

        <div className="inputRow">
          <Mail size={18} className="inputIcon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="inputRow">
          <Lock size={18} className="inputIcon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <span className="inputAction" onClick={() => setShowPassword((s) => !s)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <button className="primaryBtn" onClick={handleLogin}>Login</button>
        <p className="linkRow">
          Don’t have an account? <span className="link" onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}
 
