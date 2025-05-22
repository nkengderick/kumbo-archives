import React, { useState } from "react";
import { User, Shield, Archive, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "staff",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Demo credentials for testing
  const demoCredentials = {
    admin: { username: "admin", password: "admin123" },
    staff: { username: "staff", password: "staff123" },
    researcher: { username: "researcher", password: "researcher123" },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Validate credentials
      const { username, password, role } = formData;

      if (!username || !password) {
        throw new Error("Please enter both username and password");
      }

      // Check demo credentials or allow any non-empty credentials for demo
      const isValidCredential =
        (demoCredentials[role] &&
          username === demoCredentials[role].username &&
          password === demoCredentials[role].password) ||
        (username.length > 0 && password.length > 0);

      if (!isValidCredential) {
        throw new Error("Invalid username or password");
      }

      // Create user object
      const userData = {
        id: 1,
        name:
          username === "admin"
            ? "John Mbah"
            : username === "staff"
            ? "Marie Fon"
            : username === "researcher"
            ? "Dr. Paul Nkeng"
            : username.charAt(0).toUpperCase() + username.slice(1),
        username,
        role,
        email: `${username}@kumbo.gov.cm`,
        department:
          role === "admin"
            ? "Administration"
            : role === "staff"
            ? "Finance"
            : "External",
        avatar: "/api/placeholder/40/40",
      };

      // Successful login
      login(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    setFormData({
      username: demoCredentials[role].username,
      password: demoCredentials[role].password,
      role,
    });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kumbo-green-50 to-kumbo-tan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
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
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

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

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                className="input-field"
                value={formData.role}
                onChange={handleInputChange}
                disabled={isLoading}
              >
                <option value="admin">Administrator</option>
                <option value="staff">Council Staff</option>
                <option value="researcher">Researcher</option>
              </select>
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
            <p className="text-center text-sm text-gray-600 mb-4">
              Demo Credentials (Click to auto-fill):
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials("admin")}
                className="w-full p-3 text-left bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-200 hover:scale-105"
                disabled={isLoading}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-700">Administrator</p>
                    <p className="text-xs text-red-600">Full system access</p>
                  </div>
                  <div className="text-xs text-red-500">admin / admin123</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCredentials("staff")}
                className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 hover:scale-105"
                disabled={isLoading}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-700">Council Staff</p>
                    <p className="text-xs text-blue-600">Document management</p>
                  </div>
                  <div className="text-xs text-blue-500">staff / staff123</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCredentials("researcher")}
                className="w-full p-3 text-left bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-all duration-200 hover:scale-105"
                disabled={isLoading}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-700">Researcher</p>
                    <p className="text-xs text-green-600">Read-only access</p>
                  </div>
                  <div className="text-xs text-green-500">
                    researcher / researcher123
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              © 2024 Kumbo Council. Digital Archives System v1.0
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
      </div>
    </div>
  );
};

export default LoginPage;
