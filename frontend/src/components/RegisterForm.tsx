import { useState } from "react";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setMessage(
        res.ok ? "Registreringen lyckades!" : data.error || "Något gick fel"
      );
      if (res.ok) {
        setFormData({ username: "", email: "", password: "" });
      }
    } catch (err) {
      console.error("Fel:", err);
      setMessage("Kunde inte kontakta servern");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2 className="form-title">Registrera dig</h2>
      <div className="form-group">
        <label className="form-label">Användarnamn</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Lösenord</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <button className="form-button" type="submit">
        Registrera
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default RegisterForm;
