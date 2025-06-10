// contexts/UserContext.js - User Context with useReducer
import { createContext, useContext, useReducer, useCallback } from "react";
import api, { apiHelpers } from "../utils/api";

// Create the user context
export const UserContext = createContext();

// User action types
export const USER_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",

  // Users list
  FETCH_USERS_START: "FETCH_USERS_START",
  FETCH_USERS_SUCCESS: "FETCH_USERS_SUCCESS",
  FETCH_USERS_FAILURE: "FETCH_USERS_FAILURE",

  // Single user
  FETCH_USER_START: "FETCH_USER_START",
  FETCH_USER_SUCCESS: "FETCH_USER_SUCCESS",
  FETCH_USER_FAILURE: "FETCH_USER_FAILURE",

  // Create user
  CREATE_USER_START: "CREATE_USER_START",
  CREATE_USER_SUCCESS: "CREATE_USER_SUCCESS",
  CREATE_USER_FAILURE: "CREATE_USER_FAILURE",

  // Update user
  UPDATE_USER_SUCCESS: "UPDATE_USER_SUCCESS",

  // Delete user
  DELETE_USER_SUCCESS: "DELETE_USER_SUCCESS",

  // Search
  SEARCH_USERS_SUCCESS: "SEARCH_USERS_SUCCESS",
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",

  // User stats
  FETCH_USER_STATS_SUCCESS: "FETCH_USER_STATS_SUCCESS",

  // Filters
  SET_FILTERS: "SET_FILTERS",
  CLEAR_FILTERS: "CLEAR_FILTERS",

  // Pagination
  SET_PAGINATION: "SET_PAGINATION",

  // Selected users (for bulk operations)
  SELECT_USER: "SELECT_USER",
  DESELECT_USER: "DESELECT_USER",
  SELECT_ALL_USERS: "SELECT_ALL_USERS",
  CLEAR_SELECTION: "CLEAR_SELECTION",
};

// Initial user state
const initialState = {
  // Users data
  users: [],
  currentUser: null,
  searchResults: [],
  userStats: {
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    staff: 0,
    researchers: 0,
    departmentDistribution: [],
    roleDistribution: [],
    recentUsers: [],
  },

  // UI state
  isLoading: false,
  error: null,
  searchQuery: "",

  // Filters and pagination
  filters: {
    role: "",
    department: "",
    status: "",
    search: "",
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },

  // Selection state
  selectedUsers: [],
};

// User reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case USER_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case USER_ACTIONS.FETCH_USERS_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case USER_ACTIONS.FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload.users,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null,
      };

    case USER_ACTIONS.FETCH_USERS_FAILURE:
      return {
        ...state,
        users: [],
        isLoading: false,
        error: action.payload,
      };

    case USER_ACTIONS.FETCH_USER_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false,
        error: null,
      };

    case USER_ACTIONS.CREATE_USER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case USER_ACTIONS.CREATE_USER_SUCCESS:
      return {
        ...state,
        users: [action.payload, ...state.users],
        isLoading: false,
        error: null,
      };

    case USER_ACTIONS.CREATE_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case USER_ACTIONS.UPDATE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
        currentUser:
          state.currentUser?._id === action.payload._id
            ? action.payload
            : state.currentUser,
      };

    case USER_ACTIONS.DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload),
        currentUser:
          state.currentUser?._id === action.payload ? null : state.currentUser,
        selectedUsers: state.selectedUsers.filter(
          (id) => id !== action.payload
        ),
      };

    case USER_ACTIONS.SEARCH_USERS_SUCCESS:
      return {
        ...state,
        searchResults: action.payload.users,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null,
      };

    case USER_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };

    case USER_ACTIONS.FETCH_USER_STATS_SUCCESS:
      return {
        ...state,
        userStats: action.payload,
      };

    case USER_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 },
      };

    case USER_ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        filters: initialState.filters,
        searchQuery: "",
        pagination: { ...state.pagination, page: 1 },
      };

    case USER_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case USER_ACTIONS.SELECT_USER:
      return {
        ...state,
        selectedUsers: [...state.selectedUsers, action.payload],
      };

    case USER_ACTIONS.DESELECT_USER:
      return {
        ...state,
        selectedUsers: state.selectedUsers.filter(
          (id) => id !== action.payload
        ),
      };

    case USER_ACTIONS.SELECT_ALL_USERS:
      return {
        ...state,
        selectedUsers: action.payload,
      };

    case USER_ACTIONS.CLEAR_SELECTION:
      return {
        ...state,
        selectedUsers: [],
      };

    default:
      return state;
  }
};

// User Provider Component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Fetch users
  const fetchUsers = useCallback(
    async (options = {}) => {
      console.log("🔍 Starting fetchUsers...");
      dispatch({ type: USER_ACTIONS.FETCH_USERS_START });

      try {
        const params = {
          page: state.pagination.page,
          limit: state.pagination.limit,
          ...state.filters,
          ...options,
        };

        // Remove empty filters
        Object.keys(params).forEach((key) => {
          if (
            params[key] === "" ||
            params[key] === null ||
            params[key] === undefined
          ) {
            delete params[key];
          }
        });

        console.log("📝 API params:", params);
        console.log("🌐 Making request to:", "/users");

        const response = await api.get("/users", { params });

        console.log("✅ API Response:", response.data);

        let users = [];
        let pagination = {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        };

        if (response.data) {
          if (response.data.data) {
            users = response.data.data;
            pagination = response.data.pagination || pagination;
          } else if (Array.isArray(response.data)) {
            users = response.data;
          }
        }

        console.log("👥 Processed users:", users.length);

        dispatch({
          type: USER_ACTIONS.FETCH_USERS_SUCCESS,
          payload: {
            users,
            pagination,
          },
        });

        return users;
      } catch (error) {
        console.error("❌ Failed to fetch users:", error);
        console.error("Error details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config,
        });

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch users";

        dispatch({
          type: USER_ACTIONS.FETCH_USERS_FAILURE,
          payload: errorMessage,
        });

        return [];
      }
    },
    [state.pagination.page, state.pagination.limit, state.filters]
  );

  // Fetch single user
  const fetchUser = useCallback(async (id) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

    try {
      const response = await api.get(`/users/${id}`);
      const user = response.data.data || response.data;

      dispatch({
        type: USER_ACTIONS.FETCH_USER_SUCCESS,
        payload: user,
      });

      return user;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user";

      dispatch({
        type: USER_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      throw error;
    }
  }, []);

  // Create user
  const createUser = useCallback(async (userData) => {
    dispatch({ type: USER_ACTIONS.CREATE_USER_START });

    try {
      const response = await api.post("/users", userData);
      const user = response.data.data || response.data;

      dispatch({
        type: USER_ACTIONS.CREATE_USER_SUCCESS,
        payload: user,
      });

      return user;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create user";

      dispatch({
        type: USER_ACTIONS.CREATE_USER_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  }, []);

  // Update user
  const updateUser = useCallback(async (id, updateData) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

    try {
      const response = await api.put(`/users/${id}`, updateData);
      const user = response.data.data || response.data;

      dispatch({
        type: USER_ACTIONS.UPDATE_USER_SUCCESS,
        payload: user,
      });

      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });

      return user;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update user";

      dispatch({
        type: USER_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      throw error;
    }
  }, []);

  // Delete user
  const deleteUser = useCallback(async (id) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

    try {
      await api.delete(`/users/${id}`);

      dispatch({
        type: USER_ACTIONS.DELETE_USER_SUCCESS,
        payload: id,
      });

      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });

      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete user";

      dispatch({
        type: USER_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      throw error;
    }
  }, []);

  // Search users
  const searchUsers = useCallback(
    async (query, options = {}) => {
      console.log("🔍 Starting searchUsers with query:", query);
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

      try {
        const params = {
          search: query,
          page: 1,
          limit: state.pagination.limit,
          ...state.filters,
          ...options,
        };

        console.log("📝 Search params:", params);

        const response = await api.get("/users", { params });
        console.log("✅ Search Response:", response.data);

        let users = [];
        let pagination = state.pagination;

        if (response.data?.data) {
          users = response.data.data;
          pagination = response.data.pagination || pagination;
        } else if (Array.isArray(response.data)) {
          users = response.data;
        }

        dispatch({
          type: USER_ACTIONS.SEARCH_USERS_SUCCESS,
          payload: {
            users,
            pagination,
          },
        });

        dispatch({
          type: USER_ACTIONS.SET_SEARCH_QUERY,
          payload: query,
        });

        return users;
      } catch (error) {
        console.error("❌ User search failed:", error);

        const errorMessage =
          error.response?.data?.message || error.message || "Search failed";

        dispatch({
          type: USER_ACTIONS.SET_ERROR,
          payload: errorMessage,
        });

        return [];
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.pagination.limit, state.filters]
  );

  // Fetch user statistics
  const fetchUserStats = useCallback(async () => {
    console.log("📊 Starting fetchUserStats...");
    try {
      const response = await api.get("/users/stats");
      console.log("✅ User Stats Response:", response.data);

      const stats = response.data.data || response.data;

      dispatch({
        type: USER_ACTIONS.FETCH_USER_STATS_SUCCESS,
        payload: stats,
      });

      return stats;
    } catch (error) {
      console.error("❌ Failed to fetch user stats:", error);

      // Return fallback stats if API fails
      const fallbackStats = {
        total: state.users.length,
        active: state.users.filter((u) => u.isActive).length,
        inactive: state.users.filter((u) => !u.isActive).length,
        admins: state.users.filter((u) => u.role === "admin").length,
        staff: state.users.filter((u) => u.role === "staff").length,
        researchers: state.users.filter((u) => u.role === "researcher").length,
        departmentDistribution: [],
        roleDistribution: [],
        recentUsers: [],
      };

      dispatch({
        type: USER_ACTIONS.FETCH_USER_STATS_SUCCESS,
        payload: fallbackStats,
      });

      return fallbackStats;
    }
  }, [state.users]);

  // Update user avatar
  const updateUserAvatar = useCallback(async (id, avatarFile) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await apiHelpers.uploadFile(
        `/users/${id}/avatar`,
        formData,
        () => {} // No progress tracking for avatar
      );

      const user = response.data.data || response.data;

      dispatch({
        type: USER_ACTIONS.UPDATE_USER_SUCCESS,
        payload: user,
      });

      return user;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update avatar";

      dispatch({
        type: USER_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      throw error;
    }
  }, []);

  // Change user password
  const changeUserPassword = useCallback(async (id, passwordData) => {
    try {
      await api.put(`/users/${id}/password`, passwordData);
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to change password";

      dispatch({
        type: USER_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      throw error;
    }
  }, []);

  // Get user activity
  const getUserActivity = useCallback(async (id) => {
    try {
      const response = await api.get(`/users/${id}/activity`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Failed to fetch user activity:", error);
      return null;
    }
  }, []);

  // Update user preferences
  const updateUserPreferences = useCallback(async (id, preferences) => {
    try {
      const response = await api.put(`/users/${id}/preferences`, {
        preferences,
      });

      const user = response.data.data || response.data;

      dispatch({
        type: USER_ACTIONS.UPDATE_USER_SUCCESS,
        payload: user,
      });

      return user;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update preferences";

      dispatch({
        type: USER_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      throw error;
    }
  }, []);

  // Bulk operations
  const bulkUpdateUsers = useCallback(async (userIds, updateData) => {
    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

    try {
      const promises = userIds.map((id) => api.put(`/users/${id}`, updateData));

      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        const user = response.data.data || response.data;
        dispatch({
          type: USER_ACTIONS.UPDATE_USER_SUCCESS,
          payload: user,
        });
      });

      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
      dispatch({ type: USER_ACTIONS.CLEAR_SELECTION });

      return true;
    } catch (error) {
      dispatch({
        type: USER_ACTIONS.SET_ERROR,
        payload: error.message,
      });
      throw error;
    }
  }, []);

  const bulkDeleteUsers = useCallback(async (userIds) => {
    if (userIds.length === 0) {
      throw new Error("No users selected for deletion");
    }

    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

    try {
      const promises = userIds.map((id) => api.delete(`/users/${id}`));
      await Promise.all(promises);

      userIds.forEach((id) => {
        dispatch({
          type: USER_ACTIONS.DELETE_USER_SUCCESS,
          payload: id,
        });
      });

      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
      dispatch({ type: USER_ACTIONS.CLEAR_SELECTION });

      return true;
    } catch (error) {
      dispatch({
        type: USER_ACTIONS.SET_ERROR,
        payload: error.message,
      });
      throw error;
    }
  }, []);

  // Filters and pagination
  const setFilters = useCallback((newFilters) => {
    dispatch({
      type: USER_ACTIONS.SET_FILTERS,
      payload: newFilters,
    });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: USER_ACTIONS.CLEAR_FILTERS });
  }, []);

  const setPagination = useCallback((paginationData) => {
    dispatch({
      type: USER_ACTIONS.SET_PAGINATION,
      payload: paginationData,
    });
  }, []);

  const goToPage = useCallback((page) => {
    dispatch({
      type: USER_ACTIONS.SET_PAGINATION,
      payload: { page },
    });
  }, []);

  // Selection methods
  const selectUser = useCallback(
    (id) => {
      if (!state.selectedUsers.includes(id)) {
        dispatch({
          type: USER_ACTIONS.SELECT_USER,
          payload: id,
        });
      }
    },
    [state.selectedUsers]
  );

  const deselectUser = useCallback((id) => {
    dispatch({
      type: USER_ACTIONS.DESELECT_USER,
      payload: id,
    });
  }, []);

  const selectAllUsers = useCallback(() => {
    const allIds = state.users.map((user) => user._id);
    dispatch({
      type: USER_ACTIONS.SELECT_ALL_USERS,
      payload: allIds,
    });
  }, [state.users]);

  const clearSelection = useCallback(() => {
    dispatch({ type: USER_ACTIONS.CLEAR_SELECTION });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: USER_ACTIONS.CLEAR_ERROR });
  }, []);

  // Clear current user
  const clearCurrentUser = useCallback(() => {
    dispatch({
      type: USER_ACTIONS.FETCH_USER_SUCCESS,
      payload: null,
    });
  }, []);

  // Helper functions
  const isSelected = useCallback(
    (id) => {
      return state.selectedUsers.includes(id);
    },
    [state.selectedUsers]
  );

  const hasSelection = state.selectedUsers.length > 0;
  const isAllSelected =
    state.users.length > 0 && state.selectedUsers.length === state.users.length;

  // Context value
  const value = {
    // State
    ...state,

    // Computed state
    hasSelection,
    isAllSelected,

    // User operations
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    fetchUserStats,

    // User profile operations
    updateUserAvatar,
    changeUserPassword,
    getUserActivity,
    updateUserPreferences,

    // Bulk operations
    bulkUpdateUsers,
    bulkDeleteUsers,

    // Filters and search
    setFilters,
    clearFilters,

    // Pagination
    setPagination,
    goToPage,

    // Selection
    selectUser,
    deselectUser,
    selectAllUsers,
    clearSelection,
    isSelected,

    // Utilities
    clearError,
    clearCurrentUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the user context
export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
