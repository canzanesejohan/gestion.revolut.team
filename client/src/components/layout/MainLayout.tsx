import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useSocket } from "../../hooks/useSocket";

export function MainLayout() {
  useSocket();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className="ml-64 mt-16 p-6">
        <Outlet />
      </main>
    </div>
  );
}
