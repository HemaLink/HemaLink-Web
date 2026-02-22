import { useContext } from "react";
import ThemeContext from "../../../../services/themeContext/ThemeContext";
import AuthContext from "../../../../services/authContext/AuthContext";

const Topbar = () => {
  const { theme, onChangeTheme } = useContext(ThemeContext);
  const { setShowAuthModal } = useContext(AuthContext);

  const handleToggleTheme = () => onChangeTheme();

  return (
    <div className="topbar">
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={handleToggleTheme}
      >
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => setShowAuthModal(true)}
      >
        Login
      </button>
    </div>
  );
};

export default Topbar;
