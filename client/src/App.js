import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import DashboardPage from "./pages/dashboard";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (username) => {
    setLoggedIn(true);
    setUsername(username);
  };

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route exact path="/dashboard" element={<DashboardPage />} />
        <Route exact path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
