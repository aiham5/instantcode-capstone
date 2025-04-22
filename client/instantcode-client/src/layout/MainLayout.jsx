import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Header />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
        <RightPanel />
      </div>
    </>
  );
}
