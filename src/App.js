// App.js - Updated with Documents and Document Detail pages
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import {
  ProtectedRoute,
  PublicRoute,
  AdminRoute,
  StaffRoute,
  UnauthorizedPage,
} from "./components/ProtectedRoute";

// Import your page components
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DocumentsPage from "./pages/Docs";
import DocumentDetailPage from "./pages/Doc";
import UsersPage from "./pages/UsersPage";
import SearchPage from "./pages/SearchPage";
import ReportsPage from "./components/users/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import UploadPage from "./pages/UploadPage";
import ProfilePage from "./pages/Prof";

// Import Layout
import Layout from "./components/common/Layout";
import { AppProvider } from "./context/AppProvider";

// Loading Component
// eslint-disable-next-line no-unused-vars
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-kumbo-green-50 to-kumbo-tan-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-kumbo-green-200 border-t-kumbo-green-600 mx-auto mb-4"></div>
      <p className="text-kumbo-green-700 font-medium">
        Loading Kumbo Archives...
      </p>
    </div>
  </div>
);

// Main Layout Wrapper that includes the Layout component
const LayoutWrapper = ({ children }) => {
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes - redirect to dashboard if authenticated */}
            <Route
              path="/login"
              element={
                <PublicRoute redirectTo="/dashboard">
                  <LoginPage />
                </PublicRoute>
              }
            />

            {/* Protected Routes - wrapped in Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <DashboardPage />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />

            {/* Documents Routes */}
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <DocumentsPage />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />

            <Route
              path="/documents/:id"
              element={
                  <LayoutWrapper>
                    <DocumentDetailPage />
                  </LayoutWrapper>
              }
            />

            {/* Search Page */}
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <DocumentsPage />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />

            {/* Profile Page */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <ProfilePage />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />

            {/* Settings Page */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <SettingsPage />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />

            {/* Staff and Admin Routes */}
            <Route
              path="/upload"
              element={
                <StaffRoute>
                  <LayoutWrapper>
                    <UploadPage />
                  </LayoutWrapper>
                </StaffRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <StaffRoute>
                  <LayoutWrapper>
                    <ReportsPage />
                  </LayoutWrapper>
                </StaffRoute>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path="/users"
              element={
                <AdminRoute>
                  <LayoutWrapper>
                    <UsersPage />
                  </LayoutWrapper>
                </AdminRoute>
              }
            />

            {/* Error Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Default Route - redirect to dashboard if authenticated, otherwise login */}
            <Route
              path="/"
              element={
                <PublicRoute redirectTo="/dashboard">
                  <LoginPage />
                </PublicRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kumbo-green-50 to-kumbo-tan-50">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-kumbo-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-kumbo-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.515-.81-6.227-2.168C3.888 10.866 2 7.733 2 4h2c0 3.052 2.455 5.507 5.507 5.507h.986c3.052 0 5.507-2.455 5.507-5.507h2c0 3.733-1.888 6.866-3.773 8.832z"
                        />
                      </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-kumbo-green-700 mb-4">
                      404
                    </h1>
                    <p className="text-kumbo-green-600 mb-6">
                      The page you're looking for doesn't exist in the archives.
                    </p>
                    <button
                      onClick={() => (window.location.href = "/dashboard")}
                      className="bg-kumbo-green-600 text-white px-6 py-3 rounded-lg hover:bg-kumbo-green-700 transition-colors"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
