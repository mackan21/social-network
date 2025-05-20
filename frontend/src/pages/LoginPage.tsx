import "./LoginPage.css";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div>
      <h1 className="logo">Yap</h1>
      <LoginForm />
      <p className="link-text">
        New to Yap?{" "}
        <Link to="/register" className="link">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
