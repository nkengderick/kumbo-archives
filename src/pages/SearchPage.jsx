import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  FileText,
  X,
  ChevronDown,
} from "lucide-react";
import { useDocuments } from "../context/DocumentContext";
import { documentCategories } from "../data/mockData";
import DocumentCard from "../components/documents/DocumentCard";
import DocumentList from "../components/documents/DocumentList";
import SearchFilters from "../components/documents/SearchFilters";

const SearchPage = () => {
  const { documents } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState(documents);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("date-desc");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    category: "All",
    department: "All",
    dateRange: "All",
    fileType: "All",
    author: "All",
  });

  // Search and filter logic
  useEffect(() => {
    let filtered = documents;

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.description.toLowerCase().includes(query) ||
          doc.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(query)
          ) ||
          doc.author.toLowerCase().includes(query) ||
          doc.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category !== "All") {
      filtered = filtered.filter((doc) => doc.category === filters.category);
    }

    // Department filter
    if (filters.department !== "All") {
      filtered = filtered.filter(
        (doc) => doc.department === filters.department
      );
    }

    // Date range filter
    if (filters.dateRange !== "All") {
      const now = new Date();
      const filterDate = new Date();

      switch (filters.dateRange) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          // eslint-disable-next-line no-const-assign
          filterDate = null;
      }

      if (filterDate) {
        filtered = filtered.filter((doc) => new Date(doc.date) >= filterDate);
      }
    }

    // File type filter
    if (filters.fileType !== "All") {
      filtered = filtered.filter((doc) => doc.type === filters.fileType);
    }

    // Author filter
    if (filters.author !== "All") {
      filtered = filtered.filter((doc) => doc.author === filters.author);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date) - new Date(a.date);
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "size-desc":
          return parseFloat(b.size) - parseFloat(a.size);
        case "size-asc":
          return parseFloat(a.size) - parseFloat(b.size);
        case "views-desc":
          return (b.viewCount || 0) - (a.viewCount || 0);
        default:
          return 0;
      }
    });

    setFilteredDocuments(filtered);
  }, [documents, searchQuery, filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      category: "All",
      department: "All",
      dateRange: "All",
      fileType: "All",
      author: "All",
    });
    setSearchQuery("");
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== "All"
  ).length;

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
          {documentCategories.slice(0, 6).map((category) => (
            <button
              key={category}
              onClick={() => setFilters({ ...filters, category })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filters.category === category
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
          filters={filters}
          setFilters={setFilters}
          onClear={clearFilters}
        />
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-kumbo-green-600" />
            <span className="font-semibold text-gray-800">
              {filteredDocuments.length.toLocaleString()} document
              {filteredDocuments.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {(searchQuery || activeFiltersCount > 0) && (
            <button
              onClick={clearFilters}
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
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No documents found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `No results for "${searchQuery}". Try adjusting your search terms or filters.`
                : "Try adjusting your filters to see more results."}
            </p>
            <button onClick={clearFilters} className="btn-primary">
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
            {filteredDocuments.map((document, index) => (
              <div
                key={document.id}
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

      {/* Load More Button (for pagination simulation) */}
      {filteredDocuments.length > 0 && filteredDocuments.length >= 20 && (
        <div className="text-center">
          <button className="btn-secondary">Load More Documents</button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
