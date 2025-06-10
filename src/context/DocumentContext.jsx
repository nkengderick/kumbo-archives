// contexts/DocumentContext.js - Document Context with useReducer (FIXED)
import { createContext, useContext, useReducer, useCallback } from "react";
import api, { apiHelpers } from "../utils/api";

// Create the document context
export const DocumentContext = createContext();

// Document action types
export const DOCUMENT_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",

  // Documents list
  FETCH_DOCUMENTS_START: "FETCH_DOCUMENTS_START",
  FETCH_DOCUMENTS_SUCCESS: "FETCH_DOCUMENTS_SUCCESS",
  FETCH_DOCUMENTS_FAILURE: "FETCH_DOCUMENTS_FAILURE",

  // Single document
  FETCH_DOCUMENT_START: "FETCH_DOCUMENT_START",
  FETCH_DOCUMENT_SUCCESS: "FETCH_DOCUMENT_SUCCESS",
  FETCH_DOCUMENT_FAILURE: "FETCH_DOCUMENT_FAILURE",

  // Upload document
  UPLOAD_DOCUMENT_START: "UPLOAD_DOCUMENT_START",
  UPLOAD_DOCUMENT_SUCCESS: "UPLOAD_DOCUMENT_SUCCESS",
  UPLOAD_DOCUMENT_FAILURE: "UPLOAD_DOCUMENT_FAILURE",
  SET_UPLOAD_PROGRESS: "SET_UPLOAD_PROGRESS",

  // Update document
  UPDATE_DOCUMENT_SUCCESS: "UPDATE_DOCUMENT_SUCCESS",

  // Delete document
  DELETE_DOCUMENT_SUCCESS: "DELETE_DOCUMENT_SUCCESS",

  // Search
  SEARCH_DOCUMENTS_SUCCESS: "SEARCH_DOCUMENTS_SUCCESS",
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",

  // Categories
  FETCH_CATEGORIES_SUCCESS: "FETCH_CATEGORIES_SUCCESS",

  // Filters
  SET_FILTERS: "SET_FILTERS",
  CLEAR_FILTERS: "CLEAR_FILTERS",

  // Pagination
  SET_PAGINATION: "SET_PAGINATION",

  // Selected documents (for bulk operations)
  SELECT_DOCUMENT: "SELECT_DOCUMENT",
  DESELECT_DOCUMENT: "DESELECT_DOCUMENT",
  SELECT_ALL_DOCUMENTS: "SELECT_ALL_DOCUMENTS",
  CLEAR_SELECTION: "CLEAR_SELECTION",
};

// Initial document state
const initialState = {
  // Documents data
  documents: [],
  currentDocument: null,
  searchResults: [],
  categories: [],

  // UI state
  isLoading: false,
  error: null,
  searchQuery: "",

  // Upload state
  isUploading: false,
  uploadProgress: 0,

  // Filters and pagination
  filters: {
    category: "",
    department: "",
    fileType: "",
    dateFrom: "",
    dateTo: "",
    author: "",
    isPublic: null,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },

  // Selection state
  selectedDocuments: [],
};

// Document reducer
const documentReducer = (state, action) => {
  switch (action.type) {
    case DOCUMENT_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case DOCUMENT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case DOCUMENT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case DOCUMENT_ACTIONS.FETCH_DOCUMENTS_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case DOCUMENT_ACTIONS.FETCH_DOCUMENTS_SUCCESS:
      return {
        ...state,
        documents: action.payload.documents,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null,
      };

    case DOCUMENT_ACTIONS.FETCH_DOCUMENTS_FAILURE:
      return {
        ...state,
        documents: [],
        isLoading: false,
        error: action.payload,
      };

    case DOCUMENT_ACTIONS.FETCH_DOCUMENT_SUCCESS:
      return {
        ...state,
        currentDocument: action.payload,
        isLoading: false,
        error: null,
      };

    case DOCUMENT_ACTIONS.UPLOAD_DOCUMENT_START:
      return {
        ...state,
        isUploading: true,
        uploadProgress: 0,
        error: null,
      };

    case DOCUMENT_ACTIONS.UPLOAD_DOCUMENT_SUCCESS:
      return {
        ...state,
        documents: [action.payload, ...state.documents],
        isUploading: false,
        uploadProgress: 100,
        error: null,
      };

    case DOCUMENT_ACTIONS.UPLOAD_DOCUMENT_FAILURE:
      return {
        ...state,
        isUploading: false,
        uploadProgress: 0,
        error: action.payload,
      };

    case DOCUMENT_ACTIONS.SET_UPLOAD_PROGRESS:
      return {
        ...state,
        uploadProgress: action.payload,
      };

    case DOCUMENT_ACTIONS.UPDATE_DOCUMENT_SUCCESS:
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc._id === action.payload._id ? action.payload : doc
        ),
        currentDocument:
          state.currentDocument?._id === action.payload._id
            ? action.payload
            : state.currentDocument,
      };

    case DOCUMENT_ACTIONS.DELETE_DOCUMENT_SUCCESS:
      return {
        ...state,
        documents: state.documents.filter((doc) => doc._id !== action.payload),
        currentDocument:
          state.currentDocument?._id === action.payload
            ? null
            : state.currentDocument,
        selectedDocuments: state.selectedDocuments.filter(
          (id) => id !== action.payload
        ),
      };

    case DOCUMENT_ACTIONS.SEARCH_DOCUMENTS_SUCCESS:
      return {
        ...state,
        searchResults: action.payload.documents,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null,
      };

    case DOCUMENT_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };

    case DOCUMENT_ACTIONS.FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
      };

    case DOCUMENT_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 }, // Reset to first page
      };

    case DOCUMENT_ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        filters: initialState.filters,
        searchQuery: "",
        pagination: { ...state.pagination, page: 1 },
      };

    case DOCUMENT_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case DOCUMENT_ACTIONS.SELECT_DOCUMENT:
      return {
        ...state,
        selectedDocuments: [...state.selectedDocuments, action.payload],
      };

    case DOCUMENT_ACTIONS.DESELECT_DOCUMENT:
      return {
        ...state,
        selectedDocuments: state.selectedDocuments.filter(
          (id) => id !== action.payload
        ),
      };

    case DOCUMENT_ACTIONS.SELECT_ALL_DOCUMENTS:
      return {
        ...state,
        selectedDocuments: action.payload,
      };

    case DOCUMENT_ACTIONS.CLEAR_SELECTION:
      return {
        ...state,
        selectedDocuments: [],
      };

    default:
      return state;
  }
};

// Document Provider Component
export const DocumentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState);

  // Fetch documents - FIXED VERSION
  const fetchDocuments = useCallback(
    async (options = {}) => {
      console.log("🔍 Starting fetchDocuments...");
      dispatch({ type: DOCUMENT_ACTIONS.FETCH_DOCUMENTS_START });

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
        console.log("🌐 Making request to:", "/documents");

        const response = await api.get("/documents", { params });

        console.log("✅ API Response:", response.data);

        // Handle different response structures
        let documents = [];
        let pagination = {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        };

        if (response.data) {
          // If response.data.data exists, use it (standard format)
          if (response.data.data) {
            documents = response.data.data;
            pagination = response.data.pagination || pagination;
          }
          // If response.data is an array, use it directly
          else if (Array.isArray(response.data)) {
            documents = response.data;
          }
          // If response itself is an array
          else if (Array.isArray(response)) {
            documents = response;
          }
        }

        console.log("📚 Processed documents:", documents.length);

        dispatch({
          type: DOCUMENT_ACTIONS.FETCH_DOCUMENTS_SUCCESS,
          payload: {
            documents,
            pagination,
          },
        });

        return documents;
      } catch (error) {
        console.error("❌ Failed to fetch documents:", error);
        console.error("Error details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config,
        });

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch documents";

        dispatch({
          type: DOCUMENT_ACTIONS.FETCH_DOCUMENTS_FAILURE,
          payload: errorMessage,
        });

        // Don't throw the error, just return empty array
        return [];
      }
    },
    [state.pagination.page, state.pagination.limit, state.filters]
  ); // Fixed dependencies

  // Fetch categories - FIXED VERSION
  const fetchCategories = useCallback(async () => {
    console.log("📂 Starting fetchCategories...");
    try {
      const response = await api.get("/categories");
      console.log("✅ Categories Response:", response.data);

      let categories = [];
      if (response.data?.data) {
        categories = response.data.data;
      } else if (Array.isArray(response.data)) {
        categories = response.data;
      }

      dispatch({
        type: DOCUMENT_ACTIONS.FETCH_CATEGORIES_SUCCESS,
        payload: categories,
      });

      return categories;
    } catch (error) {
      console.error("❌ Failed to fetch categories:", error);

      // Return fallback categories if API fails
      const fallbackCategories = [
        "Administrative",
        "Financial",
        "Legal",
        "Cultural",
        "Infrastructure",
        "Education",
        "Healthcare",
        "Heritage",
        "Planning",
        "Environmental",
        "Social",
        "Economic",
      ];

      dispatch({
        type: DOCUMENT_ACTIONS.FETCH_CATEGORIES_SUCCESS,
        payload: fallbackCategories,
      });

      return fallbackCategories;
    }
  }, []);

  // Search documents - FIXED VERSION
  const searchDocuments = useCallback(
    async (query, options = {}) => {
      console.log("🔍 Starting searchDocuments with query:", query);
      dispatch({ type: DOCUMENT_ACTIONS.SET_LOADING, payload: true });

      try {
        const params = {
          q: query,
          page: 1,
          limit: state.pagination.limit,
          ...state.filters,
          ...options,
        };

        console.log("📝 Search params:", params);

        const response = await api.get("/documents/search", { params });
        console.log("✅ Search Response:", response.data);

        let documents = [];
        let pagination = state.pagination;

        if (response.data?.data) {
          documents = response.data.data;
          pagination = response.data.pagination || pagination;
        } else if (Array.isArray(response.data)) {
          documents = response.data;
        }

        dispatch({
          type: DOCUMENT_ACTIONS.SEARCH_DOCUMENTS_SUCCESS,
          payload: {
            documents,
            pagination,
          },
        });

        dispatch({
          type: DOCUMENT_ACTIONS.SET_SEARCH_QUERY,
          payload: query,
        });

        return documents;
      } catch (error) {
        console.error("❌ Search failed:", error);

        const errorMessage =
          error.response?.data?.message || error.message || "Search failed";

        dispatch({
          type: DOCUMENT_ACTIONS.SET_ERROR,
          payload: errorMessage,
        });

        return [];
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.pagination.limit, state.filters]
  );

  // Set filters
  const setFilters = useCallback((newFilters) => {
    dispatch({
      type: DOCUMENT_ACTIONS.SET_FILTERS,
      payload: newFilters,
    });
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    dispatch({ type: DOCUMENT_ACTIONS.CLEAR_FILTERS });
  }, []);

  // Set pagination
  const setPagination = useCallback((paginationData) => {
    dispatch({
      type: DOCUMENT_ACTIONS.SET_PAGINATION,
      payload: paginationData,
    });
  }, []);

  // Go to page
  const goToPage = useCallback((page) => {
    dispatch({
      type: DOCUMENT_ACTIONS.SET_PAGINATION,
      payload: { page },
    });
  }, []);

  // Document selection methods
  const selectDocument = useCallback(
    (id) => {
      if (!state.selectedDocuments.includes(id)) {
        dispatch({
          type: DOCUMENT_ACTIONS.SELECT_DOCUMENT,
          payload: id,
        });
      }
    },
    [state.selectedDocuments]
  );

  const deselectDocument = useCallback((id) => {
    dispatch({
      type: DOCUMENT_ACTIONS.DESELECT_DOCUMENT,
      payload: id,
    });
  }, []);

  const selectAllDocuments = useCallback(() => {
    const allIds = state.documents.map((doc) => doc._id);
    dispatch({
      type: DOCUMENT_ACTIONS.SELECT_ALL_DOCUMENTS,
      payload: allIds,
    });
  }, [state.documents]);

  const clearSelection = useCallback(() => {
    dispatch({ type: DOCUMENT_ACTIONS.CLEAR_SELECTION });
  }, []);

  // Bulk delete documents
  const bulkDeleteDocuments = useCallback(
    async (documentIds = null) => {
      const idsToDelete = documentIds || state.selectedDocuments;

      if (idsToDelete.length === 0) {
        throw new Error("No documents selected for deletion");
      }

      dispatch({ type: DOCUMENT_ACTIONS.SET_LOADING, payload: true });

      try {
        await api.delete("/documents/bulk", {
          data: { documentIds: idsToDelete },
        });

        // Remove deleted documents from state
        idsToDelete.forEach((id) => {
          dispatch({
            type: DOCUMENT_ACTIONS.DELETE_DOCUMENT_SUCCESS,
            payload: id,
          });
        });

        dispatch({ type: DOCUMENT_ACTIONS.SET_LOADING, payload: false });
        dispatch({ type: DOCUMENT_ACTIONS.CLEAR_SELECTION });

        return true;
      } catch (error) {
        dispatch({
          type: DOCUMENT_ACTIONS.SET_ERROR,
          payload: error.message,
        });
        throw error;
      }
    },
    [state.selectedDocuments]
  );

  // Add comment to document
  const addComment = useCallback(
    async (documentId, content) => {
      try {
        const response = await api.post(`/documents/${documentId}/comments`, {
          content,
        });

        // Update current document if it's the same one
        if (state.currentDocument?._id === documentId) {
          const updatedDocument = {
            ...state.currentDocument,
            comments: [...state.currentDocument.comments, response.data.data],
          };

          dispatch({
            type: DOCUMENT_ACTIONS.UPDATE_DOCUMENT_SUCCESS,
            payload: updatedDocument,
          });
        }

        return response.data.data;
      } catch (error) {
        dispatch({
          type: DOCUMENT_ACTIONS.SET_ERROR,
          payload: error.message,
        });
        throw error;
      }
    },
    [state.currentDocument]
  );

  // Get popular documents
  const getPopularDocuments = useCallback(async (limit = 10) => {
    try {
      const response = await api.get("/documents/popular", {
        params: { limit },
      });

      return response.data.data || response.data || [];
    } catch (error) {
      console.error("Failed to fetch popular documents:", error);
      return [];
    }
  }, []);

  // Get recent documents
  const getRecentDocuments = useCallback(async (limit = 10) => {
    try {
      const response = await api.get("/documents/recent", {
        params: { limit },
      });

      return response.data.data || response.data || [];
    } catch (error) {
      console.error("Failed to fetch recent documents:", error);
      return [];
    }
  }, []);

  // Fetch single document
  const fetchDocument = useCallback(async (id) => {
    dispatch({ type: DOCUMENT_ACTIONS.SET_LOADING, payload: true });

    try {
      const response = await api.get(`/documents/${id}`);

      const document = response.data.data || response.data;

      dispatch({
        type: DOCUMENT_ACTIONS.FETCH_DOCUMENT_SUCCESS,
        payload: document,
      });

      return document;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch document";

      dispatch({
        type: DOCUMENT_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      throw error;
    }
  }, []);

  // Upload document
  const uploadDocument = useCallback(async (formData) => {
    dispatch({ type: DOCUMENT_ACTIONS.UPLOAD_DOCUMENT_START });

    try {
      const response = await apiHelpers.uploadFile(
        "/documents",
        formData,
        (progress) => {
          dispatch({
            type: DOCUMENT_ACTIONS.SET_UPLOAD_PROGRESS,
            payload: progress,
          });
        }
      );

      const document = response.data.data || response.data;

      dispatch({
        type: DOCUMENT_ACTIONS.UPLOAD_DOCUMENT_SUCCESS,
        payload: document,
      });

      return document;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Upload failed";

      dispatch({
        type: DOCUMENT_ACTIONS.UPLOAD_DOCUMENT_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  }, []);

  // Update document
  const updateDocument = useCallback(async (id, updateData) => {
    dispatch({ type: DOCUMENT_ACTIONS.SET_LOADING, payload: true });

    try {
      const response = await api.put(`/documents/${id}`, updateData);

      const document = response.data.data || response.data;

      dispatch({
        type: DOCUMENT_ACTIONS.UPDATE_DOCUMENT_SUCCESS,
        payload: document,
      });

      dispatch({ type: DOCUMENT_ACTIONS.SET_LOADING, payload: false });

      return document;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Update failed";

      dispatch({
        type: DOCUMENT_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      throw error;
    }
  }, []);

  // Delete document
  const deleteDocument = useCallback(async (id) => {
    dispatch({ type: DOCUMENT_ACTIONS.SET_LOADING, payload: true });

    try {
      await api.delete(`/documents/${id}`);

      dispatch({
        type: DOCUMENT_ACTIONS.DELETE_DOCUMENT_SUCCESS,
        payload: id,
      });

      dispatch({ type: DOCUMENT_ACTIONS.SET_LOADING, payload: false });

      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Delete failed";

      dispatch({
        type: DOCUMENT_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      throw error;
    }
  }, []);

  // Download document
  const downloadDocument = useCallback(async (id, filename) => {
    try {
      await apiHelpers.downloadFile(`/documents/${id}/download`, filename);
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Download failed";

      dispatch({
        type: DOCUMENT_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      throw error;
    }
  }, []);

  // Star/Unstar document
  const toggleStar = useCallback(
    async (id) => {
      try {
        const response = await api.post(`/documents/${id}/star`);

        // Update the document in the list
        dispatch({
          type: DOCUMENT_ACTIONS.UPDATE_DOCUMENT_SUCCESS,
          payload: {
            ...state.currentDocument,
            isStarred: response.data.isStarred,
          },
        });

        return response.data.isStarred;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Toggle star failed";

        dispatch({
          type: DOCUMENT_ACTIONS.SET_ERROR,
          payload: errorMessage,
        });
        throw error;
      }
    },
    [state.currentDocument]
  );

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: DOCUMENT_ACTIONS.CLEAR_ERROR });
  }, []);

  // Clear current document
  const clearCurrentDocument = useCallback(() => {
    dispatch({
      type: DOCUMENT_ACTIONS.FETCH_DOCUMENT_SUCCESS,
      payload: null,
    });
  }, []);

  // Helper functions
  const isSelected = useCallback(
    (id) => {
      return state.selectedDocuments.includes(id);
    },
    [state.selectedDocuments]
  );

  const hasSelection = state.selectedDocuments.length > 0;
  const isAllSelected =
    state.documents.length > 0 &&
    state.selectedDocuments.length === state.documents.length;

  // Context value
  const value = {
    // State
    ...state,

    // Computed state
    hasSelection,
    isAllSelected,

    // Document operations
    fetchDocuments,
    fetchDocument,
    searchDocuments,
    uploadDocument,
    updateDocument,
    deleteDocument,
    downloadDocument,
    toggleStar,
    addComment,

    // Categories
    fetchCategories,

    // Filters and search
    setFilters,
    clearFilters,

    // Pagination
    setPagination,
    goToPage,

    // Selection
    selectDocument,
    deselectDocument,
    selectAllDocuments,
    clearSelection,
    isSelected,

    // Bulk operations
    bulkDeleteDocuments,

    // Popular and recent
    getPopularDocuments,
    getRecentDocuments,

    // Utilities
    clearError,
    clearCurrentDocument,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

// Custom hook to use the document context
export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
};
