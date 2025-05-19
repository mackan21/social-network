import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div>
      <h1>Registrera dig</h1>
      <RegisterForm />
      <p>
        Har du redan ett konto? <Link to="/">Logga in här</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
