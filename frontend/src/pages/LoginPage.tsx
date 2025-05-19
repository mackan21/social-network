// src/pages/LoginPage.tsx
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div>
      <h1>Logga in</h1>
      <LoginForm />
      <p>
        Har du inget konto? <Link to="/register">Registrera dig här</Link>
      </p>
    </div>
  );
};

export default LoginPage;
