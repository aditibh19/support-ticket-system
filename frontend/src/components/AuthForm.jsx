import React, { useState } from "react";
import axios from "axios";
import "../styles/LoginForm.css";

function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:8000/api/accounts";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isLogin && password !== password2) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "login/" : "register/";
      const payload = { email, password };

      const res = await axios.post(`${API_URL}/${endpoint}`, payload);

      // Save token
      localStorage.setItem("authToken", res.data.token);

      onLogin(true);
    } catch (err) {
      alert(isLogin ? "Invalid credentials" : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>🎫 TicketSys {isLogin ? "Login" : "Register"}</h2>

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

        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? isLogin
              ? "Logging in..."
              : "Registering..."
            : isLogin
            ? "Login"
            : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "10px" }}>
        {isLogin
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
          }}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}

export default AuthForm;