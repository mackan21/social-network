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
        setError(data.error || "Inloggningen misslyckades");
      } else {
        setMessage("Inloggning lyckades!");
      }
    } catch (err) {
      setError("Något gick fel vid inloggning");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2 className="form-title">Logga in</h2>

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
        <label className="form-label">Lösenord</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <button type="submit" className="form-button">
        Logga in
      </button>
    </form>
  );
};

export default LoginForm;
