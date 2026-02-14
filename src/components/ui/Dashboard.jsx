import { Outlet } from "react-router";
import Sidebar from "./shared/sideBar/Sidebar";
import AuthModal from "../auth/AuthModal";

const Dashboard = () => {
  return (
    <div className="app">
      <AuthModal />
      <section>
        <Sidebar />
      </section>
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Dashboard;
