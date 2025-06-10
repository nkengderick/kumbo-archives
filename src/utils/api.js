// utils/api.js - Enhanced axios configuration with user context
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://kumbo-archives-server.onrender.com/api/v1",
  timeout: 30000, // Increased timeout for file uploads
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to get user from localStorage
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

// Helper function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Request interceptor to add token and user info to headers
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = getAuthToken();
    const user = getCurrentUser();

    // Add authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add user context headers (optional, for debugging)
    if (user) {
      config.headers["X-User-ID"] = user.id || user._id;
      config.headers["X-User-Email"] = user.email;
      config.headers["X-User-Role"] = user.role;
    }

    // Ensure multipart/form-data content type for file uploads
    if (config.data instanceof FormData) {
      // Remove Content-Type header to let browser set it with boundary
      delete config.headers["Content-Type"];
    }

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        headers: {
          ...config.headers,
          Authorization: token ? "Bearer [TOKEN]" : undefined, // Hide token in logs
        },
        data: config.data instanceof FormData ? "[FormData]" : config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token expiration
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }

    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear invalid token and user
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Dispatch logout event for auth context
      window.dispatchEvent(new CustomEvent("auth:logout"));

      // Redirect to login (you can customize this)
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    // Handle validation errors (400)
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || "Validation failed";
      const validationErrors = error.response?.data?.errors || [];

      console.error("❌ Validation Error:", {
        message: errorMessage,
        errors: validationErrors,
        url: error.config?.url,
      });

      return Promise.reject({
        status: 400,
        message: errorMessage,
        errors: validationErrors,
        data: error.response?.data,
      });
    }

    // Handle other errors
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";

    console.error("❌ API Error:", {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url,
      data: error.response?.data,
    });

    // Return structured error
    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });
  }
);

// Helper functions for common API operations
export const apiHelpers = {
  // Generic GET request
  get: (url, config = {}) => api.get(url, config),

  // Generic POST request
  post: (url, data = {}, config = {}) => api.post(url, data, config),

  // Generic PUT request
  put: (url, data = {}, config = {}) => api.put(url, data, config),

  // Generic DELETE request
  delete: (url, config = {}) => api.delete(url, config),

  // Enhanced file upload with progress and proper headers
  uploadFile: (url, formData, onProgress = null) => {
    // Ensure user info is added to FormData if not already present
    const user = getCurrentUser();
    if (user && !formData.has("userId")) {
      formData.append("userId", user.id || user._id);
      formData.append("userEmail", user.email);
      formData.append("userRole", user.role);
    }

    return api.post(url, formData, {
      headers: {
        // Don't set Content-Type - let browser set it with boundary for multipart
      },
      timeout: 60000, // Extended timeout for large files
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },

  // Download file with proper auth headers
  downloadFile: (url, filename = null) => {
    return api
      .get(url, {
        responseType: "blob",
        timeout: 60000, // Extended timeout for large downloads
      })
      .then((response) => {
        // Create blob link to download
        const blob = new Blob([response.data]);
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);

        // Try to get filename from response headers
        const contentDisposition = response.headers["content-disposition"];
        let downloadFilename = filename;

        if (contentDisposition && !downloadFilename) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            downloadFilename = filenameMatch[1];
          }
        }

        link.download = downloadFilename || "download";
        link.click();
        window.URL.revokeObjectURL(link.href);

        return response;
      });
  },

  // Set auth token and user
  setAuth: (token, user) => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  // Set auth token only
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
    }
  },

  // Clear auth
  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common.Authorization;
  },

  // Get current user
  getCurrentUser: getCurrentUser,

  // Get auth token
  getAuthToken: getAuthToken,

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = getAuthToken();
    const user = getCurrentUser();
    return !!(token && user);
  },

  // Refresh token (if your backend supports it)
  refreshToken: async () => {
    try {
      const response = await api.post("/auth/refresh");
      const { token, user } = response.data;

      if (token) {
        apiHelpers.setAuth(token, user);
      }

      return response.data;
    } catch (error) {
      apiHelpers.clearAuth();
      throw error;
    }
  },
};

// Function to initialize API with stored auth
export const initializeAuth = () => {
  const token = getAuthToken();
  const user = getCurrentUser();

  if (token && user) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    if (process.env.NODE_ENV === "development") {
      console.log("🔐 Auth initialized for user:", {
        id: user.id || user._id,
        email: user.email,
        role: user.role,
      });
    }
  }
};

// Auto-initialize auth when module loads
initializeAuth();

export default api;
