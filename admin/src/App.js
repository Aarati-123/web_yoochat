import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserManagement from "./pages/UserManagement";
import BannedAccounts from "./pages/BannedAccounts";
import ReportedMessages from "./pages/ReportedMessages";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("LoggedIn") === "true");

  return (
    <Router>
      {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}

      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/Home" replace />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/UserManagement" element={<UserManagement />} />
            <Route path="/ReportedMessages" element={<ReportedMessages />} />
            <Route path="/BannedAccounts" element={<BannedAccounts />} />
            <Route path="*" element={<Navigate to="/Home" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;