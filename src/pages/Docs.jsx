import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  FileText,
  X,
  ChevronDown,
  Loader,
  Plus,
  Upload,
  FolderOpen,
  RefreshCw,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { useDocuments } from "../context/DocumentContext";
import DocumentCard from "../components/documents/DocumentCard";
import DocumentList from "../components/documents/DocumentList";
import SearchFilters from "../components/documents/SearchFilters";

const DocumentsPage = () => {
  const {
    documents,
    isLoading,
    error,
    filters: contextFilters,
    pagination,
    categories,
    selectedDocuments,
    hasSelection,
    isAllSelected,
    fetchDocuments,
    fetchCategories,
    setFilters,
    clearFilters: contextClearFilters,
    goToPage,
    selectDocument,
    deselectDocument,
    selectAllDocuments,
    clearSelection,
    isSelected,
    bulkDeleteDocuments,
  } = useDocuments();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("date-desc");
  const [showFilters, setShowFilters] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Local filter states
  const [localFilters, setLocalFilters] = useState({
    category: "",
    department: "",
    dateRange: "",
    fileType: "",
    author: "",
    status: "",
  });

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchCategories();
        await fetchDocuments();
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    };

    if (documents.length === 0 && !isLoading) {
      loadInitialData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync local filters with context filters
  useEffect(() => {
    setLocalFilters({
      category: contextFilters.category || "",
      department: contextFilters.department || "",
      dateRange: "",
      fileType: contextFilters.fileType || "",
      author: contextFilters.author || "",
      status: contextFilters.status || "",
    });
  }, [contextFilters]);

  // Apply search and filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filterParams = {
        ...contextFilters,
        ...(searchQuery && { search: searchQuery }),
        sortBy,
      };

      fetchDocuments(filterParams);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, contextFilters, sortBy, fetchDocuments]);

  // Apply local filters to context
  const applyFilters = useCallback(
    (newFilters) => {
      const contextFilterFormat = {
        category: newFilters.category === "All" ? "" : newFilters.category,
        department:
          newFilters.department === "All" ? "" : newFilters.department,
        fileType: newFilters.fileType === "All" ? "" : newFilters.fileType,
        author: newFilters.author === "All" ? "" : newFilters.author,
        status: newFilters.status === "All" ? "" : newFilters.status,
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
      status: "All",
    };
    setLocalFilters(clearedFilters);
    setSearchQuery("");
    contextClearFilters();
  };

  // Sort documents locally
  const sortedDocuments = [...documents].sort((a, b) => {
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

  // Handle document actions
  const handleDocumentView = (document) => {
    // Navigate to document detail page
    window.location.href = `/documents/${document._id}`;
  };

  const handleDocumentDownload = async (document) => {
    try {
      // Implement download logic
      console.log("Downloading document:", document.title);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDocumentStar = async (document) => {
    try {
      // Implement star toggle logic
      console.log("Toggling star for document:", document.title);
    } catch (error) {
      console.error("Star toggle failed:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedDocuments.length} documents?`
      )
    ) {
      try {
        await bulkDeleteDocuments();
        setShowBulkActions(false);
      } catch (error) {
        console.error("Bulk delete failed:", error);
      }
    }
  };

  const handleRefresh = () => {
    fetchDocuments();
  };

  const activeFiltersCount = Object.values(localFilters).filter(
    (value) => value !== "All" && value !== ""
  ).length;

  // Generate category options
  const categoryOptions = [
    "All",
    ...(categories || [])
      .map((cat) => {
        if (typeof cat === "string") {
          return cat;
        } else if (cat && typeof cat === "object" && cat.name) {
          return cat.name;
        }
        return String(cat);
      })
      .filter(Boolean),
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Documents</h1>
          <p className="text-gray-600 mt-1">
            Manage and browse archived documents
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 bg-kumbo-green-600 text-white rounded-lg hover:bg-kumbo-green-700 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 bg-kumbo-green-600 text-white rounded-lg hover:bg-kumbo-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Document</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents, keywords, authors, or content..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-kumbo-green-500 focus:border-kumbo-green-500 transition-all duration-300 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
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

      {/* Bulk Actions Bar */}
      {hasSelection && (
        <div className="bg-kumbo-green-50 border border-kumbo-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-kumbo-green-700 font-medium">
                {selectedDocuments.length} document
                {selectedDocuments.length !== 1 ? "s" : ""} selected
              </span>
              <button
                onClick={clearSelection}
                className="text-kumbo-green-600 hover:text-kumbo-green-800 text-sm underline"
              >
                Clear selection
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected</span>
              </button>

              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
                <span>More Actions</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {/* Select All Checkbox */}
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={() =>
                isAllSelected ? clearSelection() : selectAllDocuments()
              }
              className="w-4 h-4 text-kumbo-green-600 border-gray-300 rounded focus:ring-kumbo-green-500"
            />

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

          {(searchQuery || activeFiltersCount > 0) && (
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

      {/* Documents Grid/List */}
      <div className="card p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader className="w-12 h-12 text-kumbo-green-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading documents...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Error Loading Documents
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={handleRefresh} className="btn-primary">
              Try Again
            </button>
          </div>
        ) : sortedDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No documents found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || activeFiltersCount > 0
                ? "Try adjusting your search terms or filters."
                : "Upload your first document to get started."}
            </p>
            {!(searchQuery || activeFiltersCount > 0) && (
              <button className="btn-primary">Upload Document</button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {sortedDocuments.map((document, index) => {
              // Normalize document data
              const normalizedDocument = {
                ...document,
                _id: document._id || document.id,
                title: document.title || document.name || "Untitled Document",
                author:
                  typeof document.author === "object"
                    ? document.author.name ||
                      document.author.username ||
                      "Unknown Author"
                    : document.author || "Unknown Author",
                date:
                  document.createdAt ||
                  document.uploadDate ||
                  document.date ||
                  new Date().toISOString(),
                size:
                  document.fileSizeFormatted || document.size || "Unknown size",
                type: document.fileType || document.type || "PDF",
                category: document.category || "Uncategorized",
                description: document.description || "",
                keywords: Array.isArray(document.keywords)
                  ? document.keywords
                  : [],
                viewCount: document.viewCount || 0,
                downloadCount: document.downloadCount || 0,
                isStarred: document.isStarred || false,
                isSelected: isSelected(document._id || document.id),
              };

              return (
                <div
                  key={normalizedDocument._id}
                  className="animate-slide-up relative"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Selection Checkbox (for grid view) */}
                  {viewMode === "grid" && (
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={normalizedDocument.isSelected}
                        onChange={() =>
                          normalizedDocument.isSelected
                            ? deselectDocument(normalizedDocument._id)
                            : selectDocument(normalizedDocument._id)
                        }
                        className="w-4 h-4 text-kumbo-green-600 border-gray-300 rounded focus:ring-kumbo-green-500"
                      />
                    </div>
                  )}

                  {viewMode === "grid" ? (
                    <DocumentCard
                      document={normalizedDocument}
                      showStats={true}
                      onView={handleDocumentView}
                      onDownload={handleDocumentDownload}
                      onStar={handleDocumentStar}
                    />
                  ) : (
                    <DocumentList
                      document={normalizedDocument}
                      onView={handleDocumentView}
                      onDownload={handleDocumentDownload}
                      onStar={handleDocumentStar}
                      showSelection={true}
                      isSelected={normalizedDocument.isSelected}
                      onSelect={() =>
                        normalizedDocument.isSelected
                          ? deselectDocument(normalizedDocument._id)
                          : selectDocument(normalizedDocument._id)
                      }
                    />
                  )}
                </div>
              );
            })}
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

          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    pagination.page === page
                      ? "bg-kumbo-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <span className="text-gray-600 text-sm">
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

export default DocumentsPage;
