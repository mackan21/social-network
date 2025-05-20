import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div>
      <h1 className="logo">Yap</h1>
      <RegisterForm />
      <p className="link-text">
        Already have an account?{" "}
        <Link className="link" to="/">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
