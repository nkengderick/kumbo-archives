import React, { useState } from "react";
import { User, Shield, Archive, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // Updated import path
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Demo credentials from seed script
  const demoCredentials = [
    {
      name: "John Mbah",
      username: "john.mbah",
      password: "password123",
      role: "admin",
      department: "Administration",
      description: "Chief Administrator with full system access",
      color: "red",
    },
    {
      name: "Marie Fon",
      username: "marie.fon",
      password: "password123",
      role: "staff",
      department: "Finance",
      description: "Finance Officer - Document management",
      color: "blue",
    },
    {
      name: "Dr. Paul Nkeng",
      username: "paul.nkeng",
      password: "password123",
      role: "researcher",
      department: "External",
      description: "Research Scholar - Read-only access",
      color: "green",
    },
    {
      name: "Sarah Tanku",
      username: "sarah.tanku",
      password: "password123",
      role: "staff",
      department: "Cultural Affairs",
      description: "Cultural Heritage Officer",
      color: "purple",
    },
    {
      name: "Emmanuel Ngwa",
      username: "emmanuel.ngwa",
      password: "password123",
      role: "staff",
      department: "Public Works",
      description: "Infrastructure Development Officer",
      color: "orange",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      // Validate form
      if (!formData.username || !formData.password) {
        throw new Error("Please enter both username and password");
      }

      // Attempt login with real API
      const result = await login({
        username: formData.username.trim(),
        password: formData.password,
      });

      if (result.success) {
        // Get redirect path
        const from = location.state?.from || "/dashboard";
        navigate(from, { replace: true });
      }
      // Error handling is done by the auth context
    } catch (err) {
      console.error("Login error:", err);
      // Error is handled by auth context, but we can add additional client-side validation here
    }
  };

  const fillDemoCredentials = (credentials) => {
    setFormData({
      username: credentials.username,
      password: credentials.password,
    });
    clearError();
  };

  const getColorClasses = (color) => {
    const colors = {
      red: "bg-red-50 hover:bg-red-100 border-red-200 text-red-700",
      blue: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700",
      green: "bg-green-50 hover:bg-green-100 border-green-200 text-green-700",
      purple:
        "bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700",
      orange:
        "bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kumbo-green-50 to-kumbo-tan-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Main Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-105 animate-fade-in">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-kumbo-green-700 to-kumbo-green-600 rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 hover:rotate-12 animate-bounce-subtle">
              <Archive className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-kumbo-green-800 mb-2 text-shadow">
              Kumbo Council
            </h1>
            <p className="text-kumbo-tan-600 text-lg font-medium">
              Digital Archives System
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Preserving Heritage Through Digital Innovation
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 animate-slide-up">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-700 text-sm font-medium">Login Failed</p>
                <p className="text-red-600 text-xs mt-1">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600 transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* API Status Info */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-blue-700 text-xs font-medium">
                Connected to Kumbo Archives API
              </p>
            </div>
            <p className="text-blue-600 text-xs mt-1">
              Use demo credentials below or contact admin for access
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-kumbo-green-600 w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  className="input-field pl-12"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-kumbo-green-600 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="input-field pl-12 pr-12"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-kumbo-green-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.username || !formData.password}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Access Archives"
              )}
            </button>
          </form>

          {/* Demo Credentials Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-4 font-medium">
              🎯 Demo Credentials (Click to auto-fill):
            </p>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => fillDemoCredentials(cred)}
                  className={`w-full p-3 text-left border rounded-lg transition-all duration-200 hover:scale-105 ${getColorClasses(
                    cred.color
                  )}`}
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{cred.name}</p>
                        <span
                          className={`px-2 py-1 text-xs rounded-full bg-white/50 ${
                            cred.role === "admin"
                              ? "text-red-600"
                              : cred.role === "staff"
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}
                        >
                          {cred.role}
                        </span>
                      </div>
                      <p className="text-xs opacity-75 mt-1">
                        {cred.description}
                      </p>
                      <p className="text-xs opacity-60 mt-1">
                        {cred.department}
                      </p>
                    </div>
                    <div className="text-xs opacity-70 text-right">
                      <div>{cred.username}</div>
                      <div className="font-mono">password123</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Access Buttons */}
            <div className="mt-4 flex space-x-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials(demoCredentials[0])} // Admin
                className="flex-1 px-3 py-2 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors"
                disabled={isLoading}
              >
                Quick Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials(demoCredentials[1])} // Staff
                className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 transition-colors"
                disabled={isLoading}
              >
                Quick Staff
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials(demoCredentials[2])} // Researcher
                className="flex-1 px-3 py-2 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200 transition-colors"
                disabled={isLoading}
              >
                Quick Research
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              © 2024 Kumbo Council. Digital Archives System v1.0
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Powered by React & Node.js
            </p>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white/80 backdrop-blur-subtle rounded-xl p-4 text-center animate-fade-in">
          <p className="text-sm text-gray-600 mb-2">
            🏛️ Digitizing Kumbo's Rich Heritage
          </p>
          <p className="text-xs text-gray-500">
            Secure • Accessible • Future-Ready
          </p>
        </div>

        {/* Development Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-xs text-yellow-700 font-medium mb-2">
              🔧 Development Mode
            </p>
            <p className="text-xs text-yellow-600">
              API:{" "}
              {process.env.REACT_APP_API_URL ||
                "https://kumbo-archives-server.onrender.com/api/v1"}
            </p>
            <p className="text-xs text-yellow-600">
              All demo users have password:{" "}
              <code className="bg-yellow-100 px-1 rounded">password123</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
