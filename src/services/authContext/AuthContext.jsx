import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  showAuthModal: false,
  setShowAuthModal: () => {},
  modalView: "login",
  setModalView: () => {},
});

export default AuthContext;
