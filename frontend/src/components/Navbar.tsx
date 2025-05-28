import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHouse,
  faDoorOpen,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const userIcon = <FontAwesomeIcon icon={faUser} />;
const houseIcon = <FontAwesomeIcon icon={faHouse} />;
const doorIcon = <FontAwesomeIcon icon={faDoorOpen} />;
const searchIcon = <FontAwesomeIcon icon={faMagnifyingGlass} />;

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2 className="nav-logo" onClick={() => navigate("/feed")}>
        Yap
      </h2>
      <div className="nav-buttons">
        <button onClick={() => navigate("/feed")}>
          {houseIcon}
          <p className="nav-button-text">Home</p>
        </button>
        <button onClick={() => navigate("/explore")}>
          {searchIcon}
          <p className="nav-button-text nav-button-text-explore">Explore</p>
        </button>
        <button onClick={() => navigate("/profile")}>
          {userIcon}
          <p className="nav-button-text nav-button-text-profile">Profile</p>
        </button>
        <button onClick={handleLogout}>
          {doorIcon}
          <p className="nav-button-text">Log out</p>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
