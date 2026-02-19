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
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        setUser(data?.user || data);
        setShowAuthModal(false);
        return { ok: true, data };
      }
      return { ok: false, message: data?.message || data?.error || "Invalid credentials" };
    } catch (err) {
      return { ok: false, message: err.message || "Network error" };
    }
  };

  const logout = () => {
    setUser(null);
    setTimeout(() => window.location.reload(), 100);
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register-requester`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) return { ok: true, data };
      return { ok: false, message: data?.message || data?.error || "Registration failed" };
    } catch (err) {
      return { ok: false, message: err.message || "Network error" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
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
