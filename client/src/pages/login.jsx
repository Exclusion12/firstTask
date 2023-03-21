import React, { useState } from "react";
import axios from "axios";
import "../style/Form.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleLoginFormSubmit(event) {
    event.preventDefault();

    axios
      .post("https://localhost:2443/users/login", { username, password })
      .then((response) => {
        console.log(response.data.token);
        localStorage.setItem("authToken", response.data.token);
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
          // Redirect the user to the dashboard
          window.location.href = "/dashboard";
        }
      })

      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="form-container">
      <h1>Login</h1>
      <form onSubmit={handleLoginFormSubmit}>
        <div>
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="form-input"
          />
        </div>
        <button type="submit" className="form-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
