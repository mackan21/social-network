import "./LoginPage.css";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div>
      <h1>Logo</h1>
      <LoginForm />
      <p className="link-text">
        Har du inget konto?{" "}
        <Link to="/register" className="link">
          Registrera dig här
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
