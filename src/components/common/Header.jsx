import React, { useState } from "react";
import {
  Menu,
  Bell,
  User,
  Search,
  ChevronDown,
  X,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDocuments } from "../../context/DocumentContext";

const Header = ({ currentPage, setSidebarOpen }) => {
  const { user } = useAuth();
  const { notifications, removeNotification } = useDocuments();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getPageTitle = (page) => {
    const titles = {
      dashboard: "Dashboard",
      search: "Search Documents",
      upload: "Upload Documents",
      users: "User Management",
      reports: "Reports & Analytics",
      settings: "Settings",
    };
    return titles[page] || "Dashboard";
  };

  const getPageDescription = (page) => {
    const descriptions = {
      dashboard: "Overview of your digital archives",
      search: "Find and browse archived documents",
      upload: "Add new documents to the archive",
      users: "Manage system users and permissions",
      reports: "View usage statistics and analytics",
      settings: "Configure your preferences",
    };
    return descriptions[page] || "";
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatTime = (timeString) => {
    // Simple time formatting - in a real app, you'd use a proper date library
    return timeString;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full lg:w-[calc(100vw-16rem)] top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Menu & Page Title */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:text-kumbo-green-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Title & Breadcrumb */}
          <div>
            <h1 className="text-2xl font-heading font-bold text-kumbo-green-800">
              {getPageTitle(currentPage)}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {getPageDescription(currentPage)}
            </p>
          </div>
        </div>

        {/* Right Section - Search, Notifications, User Menu */}
        <div className="flex items-center space-x-4">
          {/* Quick Search */}
          <div className="hidden md:block relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Quick search..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400 transition-all duration-200 text-sm w-64"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-gray-600 hover:text-kumbo-green-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce-subtle">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-slide-up">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      Notifications
                    </h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No new notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {formatTime(notification.time)}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                removeNotification(notification.id)
                              }
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-4 border-t border-gray-100">
                    <button className="w-full text-sm text-kumbo-green-600 hover:text-kumbo-green-700 transition-colors">
                      Mark all as read
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <div className="w-8 h-8 bg-kumbo-green-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-slide-up">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-kumbo-green-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <span className="inline-block px-2 py-1 bg-kumbo-green-100 text-kumbo-green-700 text-xs rounded-full mt-1 capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>

                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Preferences</span>
                  </button>

                  <hr className="my-2 border-gray-100" />

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Handle logout - this would typically call the logout function
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {currentPage === "upload" && (
        <div className="px-6 py-3 bg-kumbo-green-50 border-t border-kumbo-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-kumbo-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-kumbo-green-700">
                Ready to upload documents
              </span>
            </div>
            <span className="text-xs text-kumbo-green-600">
              Max file size: 10MB per file
            </span>
          </div>
        </div>
      )}

      {currentPage === "users" && user?.role === "admin" && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              <strong>{user?.name}</strong> - Administrator Access
            </span>
            <span className="text-xs text-blue-600">
              Manage system users and permissions
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
