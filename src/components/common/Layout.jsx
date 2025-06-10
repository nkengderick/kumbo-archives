import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Get current page from URL path
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "dashboard";
    if (path.startsWith("/search")) return "search";
    if (path.startsWith("/upload")) return "upload";
    if (path.startsWith("/users")) return "users";
    if (path.startsWith("/reports")) return "reports";
    if (path.startsWith("/settings")) return "settings";
    if (path.startsWith("/profile")) return "profile";
    return "dashboard";
  };

  const currentPage = getCurrentPage();

  return (
    <div className="min-h-screen max-w-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="lg:ml-64 h-screen overflow-y-hidden">
        {/* Header */}
        <Header currentPage={currentPage} setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="animate-fade-in mt-24 h-[85vh] overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
