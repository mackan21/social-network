import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logga ut
    </button>
  );
};

export default LogoutButton;
