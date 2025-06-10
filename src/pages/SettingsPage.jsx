import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  FileText,
  X,
  ChevronDown,
  Loader,
} from "lucide-react";
import { useDocuments } from "../context/DocumentContext";
import DocumentCard from "../components/documents/DocumentCard";
import DocumentList from "../components/documents/DocumentList";
import SearchFilters from "../components/documents/SearchFilters";

const SearchPage = () => {
  const {
    documents,
    searchResults,
    isLoading,
    // eslint-disable-next-line no-unused-vars
    searchQuery: contextSearchQuery,
    filters: contextFilters,
    pagination,
    categories,
    fetchDocuments,
    searchDocuments,
    fetchCategories,
    setFilters,
    clearFilters: contextClearFilters,
    goToPage,
  } = useDocuments();

  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("date-desc");
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Local filter states that sync with context
  const [localFilters, setLocalFilters] = useState({
    category: "",
    department: "",
    dateRange: "",
    fileType: "",
    author: "",
  });

  // Fetch initial data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      console.log("Starting to load initial data...");
      try {
        console.log("Fetching categories...");
        await fetchCategories();
        console.log("Categories fetched successfully");

        console.log("Fetching documents...");
        await fetchDocuments();
        console.log("Documents fetched successfully");
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    };

    // Only load if we don't already have documents
    if (documents.length === 0 && !isLoading) {
      loadInitialData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once

  // Sync local filters with context filters
  useEffect(() => {
    setLocalFilters({
      category: contextFilters.category || "",
      department: contextFilters.department || "",
      dateRange: "", // This needs to be mapped from contextFilters
      fileType: contextFilters.fileType || "",
      author: contextFilters.author || "",
    });
  }, [contextFilters]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchQuery.trim()) {
        setIsSearchMode(true);
        searchDocuments(localSearchQuery, {
          ...contextFilters,
          sortBy,
        });
      } else {
        setIsSearchMode(false);
        fetchDocuments({
          ...contextFilters,
          sortBy,
        });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    localSearchQuery,
    contextFilters,
    sortBy,
    searchDocuments,
    fetchDocuments,
  ]);

  // Apply local filters to context
  const applyFilters = useCallback(
    (newFilters) => {
      const contextFilterFormat = {
        category: newFilters.category === "All" ? "" : newFilters.category,
        department:
          newFilters.department === "All" ? "" : newFilters.department,
        fileType: newFilters.fileType === "All" ? "" : newFilters.fileType,
        author: newFilters.author === "All" ? "" : newFilters.author,
        // Map date range to actual dates
        dateFrom: getDateFromRange(newFilters.dateRange),
        dateTo: newFilters.dateRange === "All" ? "" : new Date().toISOString(),
      };

      setFilters(contextFilterFormat);
    },
    [setFilters]
  );

  // Helper function to convert date range to actual date
  const getDateFromRange = (dateRange) => {
    if (dateRange === "All") return "";

    const now = new Date();
    const date = new Date();

    switch (dateRange) {
      case "week":
        date.setDate(now.getDate() - 7);
        break;
      case "month":
        date.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        date.setMonth(now.getMonth() - 3);
        break;
      case "year":
        date.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return "";
    }

    return date.toISOString();
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setLocalFilters(newFilters);
    applyFilters(newFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters = {
      category: "All",
      department: "All",
      dateRange: "All",
      fileType: "All",
      author: "All",
    };
    setLocalFilters(clearedFilters);
    setLocalSearchQuery("");
    contextClearFilters();
    setIsSearchMode(false);
  };

  // Get the current documents to display
  const currentDocuments = isSearchMode ? searchResults : documents;

  // Sort documents locally (since context might not handle all sort options)
  const sortedDocuments = [...currentDocuments].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return (
          new Date(b.createdAt || b.uploadDate) -
          new Date(a.createdAt || a.uploadDate)
        );
      case "date-asc":
        return (
          new Date(a.createdAt || a.uploadDate) -
          new Date(b.createdAt || b.uploadDate)
        );
      case "name-asc":
        return (a.title || a.name).localeCompare(b.title || b.name);
      case "name-desc":
        return (b.title || b.name).localeCompare(a.title || a.name);
      case "size-desc":
        return (b.fileSize || 0) - (a.fileSize || 0);
      case "size-asc":
        return (a.fileSize || 0) - (b.fileSize || 0);
      case "views-desc":
        return (b.viewCount || 0) - (a.viewCount || 0);
      default:
        return 0;
    }
  });

  const activeFiltersCount = Object.values(localFilters).filter(
    (value) => value !== "All" && value !== ""
  ).length;

  // Generate category options from context categories
  const categoryOptions = [
    "All",
    ...(categories || []).map((cat) =>
      typeof cat === "string" ? cat : cat.name
    ),
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Search Header */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents, keywords, authors, or content..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-kumbo-green-500 focus:border-kumbo-green-500 transition-all duration-300 text-lg"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
            />
            {localSearchQuery && (
              <button
                onClick={() => setLocalSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              showFilters || activeFiltersCount > 0
                ? "bg-kumbo-green-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white text-kumbo-green-600 text-xs px-2 py-1 rounded-full font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categoryOptions.slice(0, 6).map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange({ ...localFilters, category })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                localFilters.category === category
                  ? "bg-kumbo-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <SearchFilters
          filters={localFilters}
          setFilters={handleFilterChange}
          onClear={clearAllFilters}
          categories={categoryOptions}
        />
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-kumbo-green-600" />
            <span className="font-semibold text-gray-800">
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </span>
              ) : (
                <>
                  {sortedDocuments.length.toLocaleString()} document
                  {sortedDocuments.length !== 1 ? "s" : ""} found
                </>
              )}
            </span>
          </div>

          {(localSearchQuery || activeFiltersCount > 0) && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400"
            >
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="size-desc">Size (Largest)</option>
              <option value="size-asc">Size (Smallest)</option>
              <option value="views-desc">Most Viewed</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-kumbo-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-kumbo-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="card p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader className="w-12 h-12 text-kumbo-green-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading documents...</p>
          </div>
        ) : sortedDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No documents found
            </h3>
            <p className="text-gray-600 mb-4">
              {localSearchQuery
                ? `No results for "${localSearchQuery}". Try adjusting your search terms or filters.`
                : "Try adjusting your filters to see more results."}
            </p>
            <button onClick={clearAllFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {sortedDocuments.map((document, index) => (
              <div
                key={document._id || document.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {viewMode === "grid" ? (
                  <DocumentCard document={document} showStats={true} />
                ) : (
                  <DocumentList document={document} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => goToPage(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>

          <button
            onClick={() => goToPage(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
