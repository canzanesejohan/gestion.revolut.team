import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AIAssistant } from "../ai/AIAssistant";
import { useSocket } from "../../hooks/useSocket";

export function MainLayout() {
  useSocket();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <main className="pt-16 lg:ml-[270px]">
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
      <AIAssistant />
    </div>
  );
}
