import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  showAuthModal: false,
  setShowAuthModal: () => {},
  modalView: "login",
  setModalView: () => {},
});

export default AuthContext;
