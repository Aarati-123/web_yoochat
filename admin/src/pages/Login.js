import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../assets/logo.png";

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const envUsername = process.env.REACT_APP_ADMIN_USERNAME;
    const envPassword = process.env.REACT_APP_ADMIN_PASSWORD;

    if (username === envUsername && password === envPassword) {
      localStorage.setItem("LoggedIn", "true");
      setIsLoggedIn(true);
      navigate("/home");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <img src={logo} alt="Logo" className="login-logo" />
        <div className="admin-text">Admin</div>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
