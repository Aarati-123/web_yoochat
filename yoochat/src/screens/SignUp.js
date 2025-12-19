import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    // Profile image removed from signup UI; no file appended

    try {
      const response = await axios.post("http://localhost:3000/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message || "Sign Up successful!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
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
        <h2 className="authTitle">Create your account</h2>

        <form onSubmit={handleSignUp}>
          <div className="inputRow">
            <User size={18} className="inputIcon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

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
              autoComplete="new-password"
            />
            <span className="inputAction" onClick={() => setShowPassword((s) => !s)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <div className="inputRow">
            <Lock size={18} className="inputIcon" />
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            <span className="inputAction" onClick={() => setShowConfirm((s) => !s)}>
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          

          <button type="submit" className="primaryBtn">Sign Up</button>
        </form>

        <p className="linkRow">
          Already have an account? <span className="link" onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
 
