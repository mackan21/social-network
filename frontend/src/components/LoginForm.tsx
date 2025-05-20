import React, { useState } from "react";
import "./LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        setMessage("Login successful!");
      }
    } catch (err) {
      setError("Something went wrong while logging in.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2 className="form-title">Sign in to Yap</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <button type="submit" className="form-button">
        Sign in
      </button>
    </form>
  );
};

export default LoginForm;
