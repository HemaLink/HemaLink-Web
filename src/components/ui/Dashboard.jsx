import { Outlet } from "react-router";
import { useContext, useState, useEffect } from "react";
import Sidebar from "./shared/sideBar/Sidebar";
import BottomNavBar from "../shared/bottomNavBar/BottomNavBar";
import AuthModal from "../auth/AuthModal";
import AuthContext from "../../services/authContext/AuthContext";
import Topbar from "./shared/topBar/Topbar";

const Dashboard = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app">
      <AuthModal />
      {isAuthenticated && isMobile ? (
        <>
          <section className="app-content has-bottom-nav">
            <Outlet />
          </section>
          <BottomNavBar />
        </>
      ) : (
        <>
          <section>
            {isAuthenticated ? <Sidebar /> : <Topbar />}
          </section>
          <section className="app-content">
            <Outlet />
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
