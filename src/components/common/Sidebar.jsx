import React from "react";
import {
  Home,
  Search,
  Upload,
  Users,
  BarChart3,
  Settings,
  Archive,
  X,
  User,
  LogOut,
  Shield,
  FileText,
  Clock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({
  currentPage,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { user, logout } = useAuth();

  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      {
        id: "dashboard",
        icon: Home,
        label: "Dashboard",
        description: "Overview and stats",
      },
      {
        id: "search",
        icon: Search,
        label: "Search Documents",
        description: "Find and browse files",
      },
    ];

    // Add upload for staff and admin
    if (user?.role === "staff" || user?.role === "admin") {
      baseItems.push({
        id: "upload",
        icon: Upload,
        label: "Upload Documents",
        description: "Add new files",
      });
    }

    baseItems.push({
      id: "reports",
      icon: BarChart3,
      label: "Reports & Analytics",
      description: "Usage statistics",
    });

    // Add admin-only items
    if (user?.role === "admin") {
      baseItems.push({
        id: "users",
        icon: Users,
        label: "User Management",
        description: "Manage system users",
      });
    }

    baseItems.push({
      id: "settings",
      icon: Settings,
      label: "Settings",
      description: "Preferences and config",
    });

    return baseItems;
  };

  const menuItems = getMenuItems();

  const handleMenuClick = (itemId) => {
    setCurrentPage(itemId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-400" />;
      case "staff":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "researcher":
        return <User className="w-4 h-4 text-green-400" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 border-red-200";
      case "staff":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "researcher":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-kumbo-green-800 to-kumbo-green-900 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 shadow-2xl`}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between p-6 border-b border-kumbo-green-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-kumbo-gold-500 rounded-xl flex items-center justify-center shadow-lg">
            <Archive className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-white font-heading font-bold text-lg">
              Kumbo
            </span>
            <p className="text-kumbo-green-200 text-xs">Archives</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-white hover:text-kumbo-gold-400 transition-colors p-1 rounded-lg hover:bg-kumbo-green-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 px-4 flex-1">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`sidebar-item group ${
                currentPage === item.id ? "sidebar-item-active" : ""
              }`}
              title={item.description}
            >
              <div className="flex items-center space-x-3 w-full">
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <span className="font-medium block">{item.label}</span>
                  <span className="text-xs opacity-75 group-hover:opacity-100 transition-opacity">
                    {item.description}
                  </span>
                </div>
              </div>

              {/* Active indicator */}
              {currentPage === item.id && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
              )}
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 px-4">
          <div className="bg-kumbo-green-700/50 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-white font-medium text-sm mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-2 text-xs">
              <div className="text-kumbo-green-200">
                <span className="text-white">23</span> documents this month
              </div>
              <div className="text-kumbo-green-200">
                <span className="text-white">156</span> total downloads
              </div>
              <div className="text-kumbo-green-200">
                <span className="text-white">2.4GB</span> storage used
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-kumbo-green-700">
        <div className="bg-kumbo-green-700/50 rounded-xl p-4 backdrop-blur-sm">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-kumbo-gold-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {user?.name || "User Name"}
              </p>
              <div className="flex items-center space-x-2">
                {getRoleIcon(user?.role)}
                <span className="text-kumbo-green-200 text-xs capitalize">
                  {user?.role || "Role"}
                </span>
              </div>
            </div>
          </div>

          {/* Role Badge */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                user?.role
              )}`}
            >
              {getRoleIcon(user?.role)}
              <span className="ml-1 capitalize">{user?.role} Access</span>
            </span>
          </div>

          {/* User Actions */}
          <div className="space-y-2">
            <button
              onClick={() => handleMenuClick("settings")}
              className="w-full flex items-center space-x-2 text-kumbo-green-200 hover:text-white text-sm py-2 px-3 rounded-lg hover:bg-kumbo-green-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Account Settings</span>
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-all duration-200 font-medium text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-4 text-center">
          <p className="text-kumbo-green-300 text-xs">Archives System v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
