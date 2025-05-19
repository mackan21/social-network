import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div>
      <h1>Logo</h1>
      <RegisterForm />
      <p className="link-text">
        Har du redan ett konto?{" "}
        <Link className="link" to="/">
          Logga in här
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
