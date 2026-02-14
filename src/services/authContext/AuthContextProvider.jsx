import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const STORAGE_KEY = "hemalink-auth";

const AuthContextProvider = ({ children }) => {
  const stored = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
  const [user, setUser] = useState(stored ? JSON.parse(stored) : null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalView, setModalView] = useState("login");

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (usernameOrEmail, password) => {
    const isAdminLogin =
      (usernameOrEmail === "admin" || usernameOrEmail === "admin@hemalink.com") &&
      password === "admin";
    if (isAdminLogin) {
      const adminUser = { id: 1, name: "admin", role: "Admin", email: "admin@hemalink.com" };
      setUser(adminUser);
      setShowAuthModal(false);
      setTimeout(() => window.location.reload(), 100);
      return { ok: true };
    }
    return { ok: false, message: "Invalid credentials" };
  };

  const logout = () => {
    setUser(null);
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        showAuthModal,
        setShowAuthModal,
        modalView,
        setModalView,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
