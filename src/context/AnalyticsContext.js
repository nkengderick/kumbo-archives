import { createContext, useContext, useReducer, useCallback } from "react";
import api from "../utils/api";

// Create the analytics context
export const AnalyticsContext = createContext();

// Analytics action types
export const ANALYTICS_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",

  // Dashboard analytics
  FETCH_DASHBOARD_START: "FETCH_DASHBOARD_START",
  FETCH_DASHBOARD_SUCCESS: "FETCH_DASHBOARD_SUCCESS",
  FETCH_DASHBOARD_FAILURE: "FETCH_DASHBOARD_FAILURE",

  // Detailed analytics
  FETCH_DETAILED_SUCCESS: "FETCH_DETAILED_SUCCESS",

  // User analytics
  FETCH_USER_ANALYTICS_SUCCESS: "FETCH_USER_ANALYTICS_SUCCESS",

  // System health
  FETCH_SYSTEM_HEALTH_SUCCESS: "FETCH_SYSTEM_HEALTH_SUCCESS",

  // Activity logs
  FETCH_ACTIVITY_SUCCESS: "FETCH_ACTIVITY_SUCCESS",
};

// Initial analytics state
const initialState = {
  // Loading and error states
  isLoading: false,
  error: null,

  // Dashboard data
  dashboardData: {
    totalDocuments: 0,
    monthlyUploads: 0,
    activeUsers: 0,
    storageUsed: "0 GB",
    totalStorage: "10 GB",
    storagePercentage: 0,
    popularCategories: [],
    monthlyActivity: [],
    activities: [],
  },

  // Detailed analytics
  detailedAnalytics: {
    documentTrends: [],
    topContributors: [],
    popularDocuments: [],
    departmentActivity: [],
    fileTypeDistribution: [],
  },

  // User analytics
  userAnalytics: {
    userTrends: [],
    usersByDepartment: [],
    activeUserStats: [],
  },

  // System health
  systemHealth: {
    database: {},
    storage: {},
    performance: {},
  },

  // Activity logs
  activityLogs: [],

  // Last updated timestamps
  lastUpdated: {
    dashboard: null,
    detailed: null,
    users: null,
    health: null,
    activity: null,
  },
};

// Analytics reducer
const analyticsReducer = (state, action) => {
  switch (action.type) {
    case ANALYTICS_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ANALYTICS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case ANALYTICS_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ANALYTICS_ACTIONS.FETCH_DASHBOARD_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case ANALYTICS_ACTIONS.FETCH_DASHBOARD_SUCCESS:
      return {
        ...state,
        dashboardData: action.payload,
        isLoading: false,
        error: null,
        lastUpdated: {
          ...state.lastUpdated,
          dashboard: new Date(),
        },
      };

    case ANALYTICS_ACTIONS.FETCH_DASHBOARD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case ANALYTICS_ACTIONS.FETCH_DETAILED_SUCCESS:
      return {
        ...state,
        detailedAnalytics: action.payload,
        lastUpdated: {
          ...state.lastUpdated,
          detailed: new Date(),
        },
      };

    case ANALYTICS_ACTIONS.FETCH_USER_ANALYTICS_SUCCESS:
      return {
        ...state,
        userAnalytics: action.payload,
        lastUpdated: {
          ...state.lastUpdated,
          users: new Date(),
        },
      };

    case ANALYTICS_ACTIONS.FETCH_SYSTEM_HEALTH_SUCCESS:
      return {
        ...state,
        systemHealth: action.payload,
        lastUpdated: {
          ...state.lastUpdated,
          health: new Date(),
        },
      };

    case ANALYTICS_ACTIONS.FETCH_ACTIVITY_SUCCESS:
      return {
        ...state,
        activityLogs: action.payload,
        lastUpdated: {
          ...state.lastUpdated,
          activity: new Date(),
        },
      };

    default:
      return state;
  }
};

// Analytics Provider Component
export const AnalyticsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(analyticsReducer, initialState);

  // Fetch dashboard analytics
  const fetchDashboardAnalytics = useCallback(
    async (forceRefresh = false) => {
      // Check if we need to refresh (cache for 5 minutes)
      const lastUpdate = state.lastUpdated.dashboard;
      const now = new Date();
      const fiveMinutes = 5 * 60 * 1000;

      if (!forceRefresh && lastUpdate && now - lastUpdate < fiveMinutes) {
        return state.dashboardData;
      }

      dispatch({ type: ANALYTICS_ACTIONS.FETCH_DASHBOARD_START });

      try {
        const response = await api.get("/analytics/dashboard");

        dispatch({
          type: ANALYTICS_ACTIONS.FETCH_DASHBOARD_SUCCESS,
          payload: response.data.data,
        });

        return response.data.data;
      } catch (error) {
        const errorMessage =
          error.message || "Failed to fetch dashboard analytics";

        dispatch({
          type: ANALYTICS_ACTIONS.FETCH_DASHBOARD_FAILURE,
          payload: errorMessage,
        });

        // Return fallback data on error
        return state.dashboardData;
      }
    },
    [state.lastUpdated.dashboard, state.dashboardData]
  );

  // Fetch detailed analytics
  const fetchDetailedAnalytics = useCallback(
    async (timeRange = "30d") => {
      try {
        const response = await api.get("/analytics/detailed", {
          params: { range: timeRange },
        });

        dispatch({
          type: ANALYTICS_ACTIONS.FETCH_DETAILED_SUCCESS,
          payload: response.data.data,
        });

        return response.data.data;
      } catch (error) {
        console.error("Failed to fetch detailed analytics:", error);
        return state.detailedAnalytics;
      }
    },
    [state.detailedAnalytics]
  );

  // Fetch user analytics
  const fetchUserAnalytics = useCallback(async () => {
    try {
      const response = await api.get("/analytics/users");

      dispatch({
        type: ANALYTICS_ACTIONS.FETCH_USER_ANALYTICS_SUCCESS,
        payload: response.data.data,
      });

      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch user analytics:", error);
      return state.userAnalytics;
    }
  }, [state.userAnalytics]);

  // Fetch system health
  const fetchSystemHealth = useCallback(async () => {
    try {
      const response = await api.get("/analytics/health");

      dispatch({
        type: ANALYTICS_ACTIONS.FETCH_SYSTEM_HEALTH_SUCCESS,
        payload: response.data.data,
      });

      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch system health:", error);
      return state.systemHealth;
    }
  }, [state.systemHealth]);

  // Fetch activity logs
  const fetchActivityLogs = useCallback(
    async (page = 1, limit = 20) => {
      try {
        const response = await api.get("/analytics/activity", {
          params: { page, limit },
        });

        dispatch({
          type: ANALYTICS_ACTIONS.FETCH_ACTIVITY_SUCCESS,
          payload: response.data.data,
        });

        return response.data.data;
      } catch (error) {
        console.error("Failed to fetch activity logs:", error);
        return state.activityLogs;
      }
    },
    [state.activityLogs]
  );

  // Get cached dashboard data
  const getCachedDashboardData = useCallback(() => {
    return state.dashboardData;
  }, [state.dashboardData]);

  // Check if data is stale
  const isDashboardStale = useCallback(() => {
    const lastUpdate = state.lastUpdated.dashboard;
    if (!lastUpdate) return true;

    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000;
    return now - lastUpdate > fiveMinutes;
  }, [state.lastUpdated.dashboard]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: ANALYTICS_ACTIONS.CLEAR_ERROR });
  }, []);

  // Refresh all analytics data
  const refreshAllData = useCallback(async () => {
    dispatch({ type: ANALYTICS_ACTIONS.SET_LOADING, payload: true });

    try {
      await Promise.all([
        fetchDashboardAnalytics(true),
        fetchDetailedAnalytics(),
        fetchUserAnalytics(),
        fetchSystemHealth(),
        fetchActivityLogs(),
      ]);
    } catch (error) {
      console.error("Failed to refresh analytics data:", error);
    } finally {
      dispatch({ type: ANALYTICS_ACTIONS.SET_LOADING, payload: false });
    }
  }, [
    fetchDashboardAnalytics,
    fetchDetailedAnalytics,
    fetchUserAnalytics,
    fetchSystemHealth,
    fetchActivityLogs,
  ]);

  // Format time ago helper
  const formatTimeAgo = useCallback((date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffDays === 1) {
      return "1 day ago";
    } else {
      return `${diffDays} days ago`;
    }
  }, []);

  // Context value
  const value = {
    // State
    ...state,

    // Data fetching
    fetchDashboardAnalytics,
    fetchDetailedAnalytics,
    fetchUserAnalytics,
    fetchSystemHealth,
    fetchActivityLogs,

    // Utilities
    getCachedDashboardData,
    isDashboardStale,
    clearError,
    refreshAllData,
    formatTimeAgo,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Custom hook to use the analytics context
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};
