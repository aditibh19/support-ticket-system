import React, { useState } from "react";
import axios from "axios";
import "../styles/LoginForm.css"; // you can use same styling

function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL; // Docker-aware backend URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/accounts/register/`, {
        email,
        password,
      });

      alert("Registration successful! You can now log in.");
      onRegister(); // maybe switch to login form
    } catch (err) {
      alert("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>🎫 TicketSys Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;