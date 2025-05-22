import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Layout from "./components/common/Layout";
import { AuthContext } from "./context/AuthContext";
import { DocumentContext } from "./context/DocumentContext";
import { mockDocuments, mockUsers } from "./data/mockdata";

function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Application state
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [documents, setDocuments] = useState(mockDocuments);
  const [users, setUsers] = useState(mockUsers);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New document uploaded: Budget Report 2024",
      time: "2 hours ago",
      type: "info",
    },
    {
      id: 2,
      message: "Heritage documentation updated",
      time: "1 day ago",
      type: "success",
    },
  ]);

  // Check for existing authentication on app load
  useEffect(() => {
    const savedUser = localStorage.getItem("kumbo_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("kumbo_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Authentication functions
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("kumbo_user", JSON.stringify(userData));
    setCurrentPage("dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("kumbo_user");
    setCurrentPage("dashboard");
  };

  // Document management functions
  const addDocument = (newDocument) => {
    const document = {
      ...newDocument,
      id: documents.length + 1,
      date: new Date().toISOString().split("T")[0],
      size: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(
        Math.random() * 9
      )}MB`,
      author: user.name,
    };
    setDocuments([document, ...documents]);

    // Add notification
    const notification = {
      id: notifications.length + 1,
      message: `New document uploaded: ${document.title}`,
      time: "Just now",
      type: "success",
    };
    setNotifications([notification, ...notifications]);
  };

  const updateDocument = (documentId, updates) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === documentId ? { ...doc, ...updates } : doc
      )
    );
  };

  const deleteDocument = (documentId) => {
    setDocuments(documents.filter((doc) => doc.id !== documentId));
  };

  // User management functions (Admin only)
  const addUser = (newUser) => {
    const userWithId = {
      ...newUser,
      id: users.length + 1,
      lastLogin: "Never",
      status: "Active",
    };
    setUsers([...users, userWithId]);
  };

  const updateUser = (userId, updates) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, ...updates } : u)));
  };

  const deleteUser = (userId) => {
    setUsers(users.filter((u) => u.id !== userId));
  };

  // Notification functions
  const addNotification = (message, type = "info") => {
    const notification = {
      id: notifications.length + 1,
      message,
      time: "Just now",
      type,
    };
    setNotifications([notification, ...notifications]);
  };

  const removeNotification = (notificationId) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  // Page rendering
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      default:
        return <DashboardPage />;
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kumbo-green-50 to-kumbo-tan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-kumbo-green-200 border-t-kumbo-green-600 mx-auto mb-4"></div>
          <p className="text-kumbo-green-700 font-medium">
            Loading Kumbo Archives...
          </p>
        </div>
      </div>
    );
  }

  // Main app render
  return (
    <div className="App">
      <AuthContext.Provider
        value={{
          user,
          login,
          logout,
          isAuthenticated: !!user,
        }}
      >
        <DocumentContext.Provider
          value={{
            documents,
            addDocument,
            updateDocument,
            deleteDocument,
            users,
            addUser,
            updateUser,
            deleteUser,
            notifications,
            addNotification,
            removeNotification,
          }}
        >
          {!user ? (
            <LoginPage />
          ) : (
            <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
              {renderPage()}
            </Layout>
          )}
        </DocumentContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
