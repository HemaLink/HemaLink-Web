import { useEffect, useState } from "react";
import { THEME } from "./ThemeContext.const";
import ThemeContext from "./ThemeContext";

const appTheme = localStorage.getItem("app-theme");

const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(appTheme ?? THEME.LIGHT);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
      localStorage.setItem("app-theme", newTheme);
      document.documentElement.setAttribute("data-bs-theme", newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, onChangeTheme: handleToggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
